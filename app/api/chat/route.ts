import { type NextRequest, NextResponse } from "next/server"
import { openaiService, UPSIDE_AI_SYSTEM_PROMPT } from "@/lib/openai-service"
import { sanitizeInput, getSecurityHeaders } from "@/lib/security-service"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { 
  assemblePromptForChat, 
  checkAndRunSummarizer,
  MEMORY_CONFIG 
} from "@/lib/chat-memory-service"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Chat API: Starting request processing")
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only use authenticated user ID - no guest ID spoofing allowed
    // Guest users get ephemeral sessions that are not persisted
    const userId = user?.id
    const isGuest = !userId
    console.log("[v0] Chat API: User ID:", userId, "isGuest:", isGuest)
    
    // Parse request body
    const body = await request.json()
    const { message, conversationId, hasTitle = false, isFirstMessage = false } = body
    console.log("[v0] Chat API: Received message:", message?.substring(0, 50), "conversationId:", conversationId)

    // Validate and sanitize input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const sanitizedMessage = sanitizeInput(message)
    if (!sanitizedMessage || sanitizedMessage.length < 1) {
      return NextResponse.json(
        { error: "Invalid message content" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    let activeConversationId = conversationId

    // SECURITY: If conversationId provided, MUST verify ownership before any access
    if (activeConversationId) {
      // Guest users cannot access stored conversations
      if (isGuest) {
        return NextResponse.json(
          { error: "Authentication required to access conversation history" },
          { status: 401, headers: getSecurityHeaders() }
        )
      }
      
      // Validate UUID format to prevent injection
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(activeConversationId)) {
        return NextResponse.json(
          { error: "Invalid conversation ID format" },
          { status: 400, headers: getSecurityHeaders() }
        )
      }
      
      // CRITICAL: Verify user owns this conversation
      const { data: session, error: sessionError } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("id", activeConversationId)
        .eq("userId", userId)
        .single()

      if (sessionError || !session) {
        // Don't reveal if conversation exists - return generic error
        return NextResponse.json(
          { error: "Conversation not found or access denied" },
          { status: 404, headers: getSecurityHeaders() }
        )
      }
    }

    // Only create persistent conversations for authenticated users
    // Guest users get responses but no stored history
    if (!activeConversationId && userId && !isGuest) {
      console.log("[v0] Chat API: Creating new conversation for user:", userId)
      const title = sanitizedMessage.length > 50 
        ? sanitizedMessage.substring(0, 47) + "..." 
        : sanitizedMessage
      
      const { data: newSession, error: createError } = await supabase
        .from("chat_sessions")
        .insert({
          userId,
          title,
          messageCount: 0,
          summary: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Chat API: Error creating session:", createError)
      }

      if (newSession) {
        activeConversationId = newSession.id
        console.log("[v0] Chat API: Created new conversation:", activeConversationId)
      }
    }

    // Save user message to database (only for authenticated users with valid sessions)
    if (activeConversationId && userId && !isGuest) {
      await supabase.from("chat_messages").insert({
        sessionId: activeConversationId,
        role: "user",
        content: sanitizedMessage,
        createdAt: new Date().toISOString(),
      })
    }

    // Generate a short, descriptive title once, on the first message of a new conversation
    let generatedTitle: string | undefined
    if (isFirstMessage && !hasTitle) {
      generatedTitle = await openaiService.generateConversationTitle(sanitizedMessage)
    }

    // MEMORY LAYER: Assemble prompt with system prompt + thread summary + recent messages + current message
    console.log("[v0] Chat API: Assembling prompt with memory layer for conversation:", activeConversationId)
    const assembledPrompt = await assemblePromptForChat(
      activeConversationId,
      userId || null,
      sanitizedMessage,
      UPSIDE_AI_SYSTEM_PROMPT
    )
    console.log("[v0] Chat API: Assembled prompt - messages:", assembledPrompt.messages.length, "tokens:", assembledPrompt.tokenEstimate, "hasSummary:", assembledPrompt.hasSummary)

    let aiResponse
    let attempt = 0
    const maxAttempts = 2

    while (attempt < maxAttempts) {
      try {
        console.log("[v0] Chat API: Sending to OpenAI, attempt:", attempt + 1)
        // Use the assembled prompt with full memory context
        const historyResponse = await openaiService.generateChatResponseWithHistory(assembledPrompt.messages)
        console.log("[v0] Chat API: Received response from OpenAI, length:", historyResponse?.message?.length)
        aiResponse = {
          message: historyResponse.message,
          sessionSummary: `Conversation about: ${sanitizedMessage.substring(0, 50)}...`,
          conversationTitle: generatedTitle,
        }

        if (aiResponse?.message?.trim().length > 0) {
          break
        }
        throw new Error("Empty response received from AI")
      } catch (error) {
        attempt++
        if (attempt >= maxAttempts) {
          aiResponse = {
            message: "I'm here to support you! I'm having a brief technical moment, but I'm ready to help with your questions about balancing school, sports, building confidence, or planning your future. What's on your mind?",
            sessionSummary: `User asked: ${sanitizedMessage.substring(0, 50)}...`,
            fallback: true,
          }
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    if (!aiResponse?.message) {
      aiResponse = {
        message: "I'm your AI teammate, ready to help you succeed! Let's talk about building confidence, managing stress, setting goals, or planning your future. What would you like to explore?",
        sessionSummary: `User asked: ${sanitizedMessage.substring(0, 50)}...`,
        fallback: true,
      }
    }

    // Save assistant message to database (only for authenticated users with valid sessions)
    let currentMessageCount = 0
    if (activeConversationId && userId && !isGuest) {
      await supabase.from("chat_messages").insert({
        sessionId: activeConversationId,
        role: "assistant",
        content: aiResponse.message,
        createdAt: new Date().toISOString(),
        metadata: { sessionSummary: aiResponse.sessionSummary },
      })

      // Update conversation metadata - include userId check for extra security
      const { count } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("sessionId", activeConversationId)

      currentMessageCount = count || 0

      await supabase
        .from("chat_sessions")
        .update({
          messageCount: currentMessageCount,
          lastMessage: aiResponse.message.substring(0, 100),
          updatedAt: new Date().toISOString(),
          ...(aiResponse.conversationTitle && !hasTitle 
            ? { title: aiResponse.conversationTitle } 
            : {}),
        })
        .eq("id", activeConversationId)
        .eq("userId", userId) // SECURITY: Double-check ownership on update

      // MEMORY LAYER: Check if we should run the summarizer (every N messages)
      // This runs asynchronously in the background to avoid blocking the response
      checkAndRunSummarizer(activeConversationId, userId, currentMessageCount)
    }

    return NextResponse.json(
      {
        message: aiResponse.message,
        conversationId: activeConversationId,
        conversationTitle: aiResponse.conversationTitle,
        sessionSummary: aiResponse.sessionSummary,
        timestamp: new Date().toISOString(),
        fallback: aiResponse.fallback || false,
      },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("[v0] Chat API critical error:", error)

    return NextResponse.json(
      {
        message: "I'm still here for you! Even when tech has a hiccup, I want to support your journey. Try asking me about building confidence, managing your schedule, college planning, or developing leadership skills.",
        timestamp: new Date().toISOString(),
        fallback: true,
        error: "temporary_issue",
      },
      { status: 200, headers: getSecurityHeaders() }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
