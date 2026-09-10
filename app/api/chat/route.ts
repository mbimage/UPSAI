import { type NextRequest, NextResponse } from "next/server"
import { openaiService, UPSIDE_AI_SYSTEM_PROMPT, extractAIErrorInfo } from "@/lib/openai-service"
import { sanitizeInput, getSecurityHeaders } from "@/lib/security-service"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { 
  assemblePromptForChat, 
  checkAndRunSummarizer,
  MEMORY_CONFIG 
} from "@/lib/chat-memory-service"
import { queueInteractionExtraction } from "@/lib/interaction-history-service"

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

    let aiResponse: { message: string; sessionSummary: string; conversationTitle?: string } | undefined
    let attempt = 0
    let lastError: unknown
    const maxAttempts = 2

    while (attempt < maxAttempts) {
      try {
        console.log("[v0] Chat API: Sending to model, attempt:", attempt + 1)
        // Use the assembled prompt with full memory context
        const historyResponse = await openaiService.generateChatResponseWithHistory(assembledPrompt.messages)
        console.log("[v0] Chat API: Received response, length:", historyResponse?.message?.length)

        if (!historyResponse?.message?.trim()) {
          throw new Error("Empty response received from AI")
        }

        aiResponse = {
          message: historyResponse.message,
          sessionSummary: `Conversation about: ${sanitizedMessage.substring(0, 50)}...`,
          conversationTitle: generatedTitle,
        }
        break
      } catch (error) {
        lastError = error
        attempt++
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    }

    // The model failed to produce a real answer. Do NOT fabricate an assistant
    // reply. Log diagnostics for debugging (never the API key) and return a real
    // error status so the client can keep the user's question visible and offer
    // Try again / Edit question instead of a fake "technical moment" answer.
    if (!aiResponse?.message) {
      // Safe, non-sensitive diagnostics only (error type, HTTP status, request id).
      console.error("[v0] Chat API: AI request failed after retries", extractAIErrorInfo(lastError))

      // Note: the user message was already persisted above, but no assistant
      // message is saved, so the conversation history stays clean.
      return NextResponse.json(
        {
          error: "ai_unavailable",
          message: "UpSide couldn't answer that just yet. Your question is still here.",
          conversationId: activeConversationId,
        },
        { status: 502, headers: getSecurityHeaders() },
      )
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

      // HISTORY + MEMORY: Extract a timestamped insight (and any durable memory)
      // from this exchange. Runs in the background so it never blocks the reply.
      queueInteractionExtraction({
        conversationId: activeConversationId,
        userId,
        userMessage: sanitizedMessage,
        upsideResponse: aiResponse.message,
      })
    }

    return NextResponse.json(
      {
        message: aiResponse.message,
        conversationId: activeConversationId,
        conversationTitle: aiResponse.conversationTitle,
        sessionSummary: aiResponse.sessionSummary,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    // Unexpected server error. Log diagnostics and return a real error status.
    // Never fabricate an assistant reply, and never leak internals to the user.
    console.error("[v0] Chat API critical error", extractAIErrorInfo(error))

    return NextResponse.json(
      {
        error: "server_error",
        message: "UpSide couldn't answer that just yet. Your question is still here.",
      },
      { status: 500, headers: getSecurityHeaders() }
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
