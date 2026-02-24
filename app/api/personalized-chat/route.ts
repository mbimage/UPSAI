import { NextResponse } from "next/server"
import { generatePersonalizedChatResponseWithHistory } from "@/lib/personalized-ai-service"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { sanitizeInput, logSecurityEvent } from "@/lib/security-service"
import { checkForImprovedResponses, applyImprovement } from "@/lib/ai-learning-service"
import { getUserProfile } from "@/lib/database-service"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const personalizedChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1, "At least one message required"),
  conversationId: z.string().uuid().optional(),
  sessionHistory: z.array(z.any()).optional(),
  connectionStrength: z.enum(["building", "established", "strong"]).optional(),
  personalizationLevel: z.enum(["low", "medium", "high"]).optional(),
})

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    const isGuest = !user

    console.log(`[v0] Personalized chat request from ${isGuest ? "guest" : `user ${user.id}`}`)

    const body = await req.json()

    // Sanitize and validate input
    const sanitizedMessages = (body.messages || []).map((msg: any) => ({
      role: msg.role,
      content: sanitizeInput(msg.content || ""),
    }))

    const validatedData = personalizedChatSchema.parse({
      messages: sanitizedMessages,
      conversationId: body.conversationId || uuidv4(),
      sessionHistory: body.sessionHistory || [],
      connectionStrength: body.connectionStrength || "building",
      personalizationLevel: body.personalizationLevel || "low",
    })

    let response = null
    let usedImprovement = false
    const messageId = uuidv4()
    let attempt = 0
    const maxAttempts = 2

    try {
      // Get the last user message
      const lastUserMessage = [...validatedData.messages].reverse().find((m) => m.role === "user")?.content || ""

      let improvement = null
      if (!isGuest) {
        improvement = await checkForImprovedResponses(lastUserMessage, user.id)
      }

      const userProfile = !isGuest ? await getUserProfile(user.id) : null

      while (attempt < maxAttempts) {
        try {
          if (improvement && !isGuest && Math.random() < 0.7) {
            // 70% chance to use the improvement
            response = improvement.improvedResponse
            usedImprovement = true
          } else {
            response = await generatePersonalizedChatResponseWithHistory(validatedData.messages, userProfile || {}, {
              sessionHistory: validatedData.sessionHistory,
              connectionStrength: validatedData.connectionStrength,
              personalizationLevel: validatedData.personalizationLevel,
              conversationId: validatedData.conversationId,
            })
          }

          if (response && response.trim().length > 0) {
            break // Success, exit retry loop
          }

          throw new Error("Empty response received")
        } catch (aiError) {
          attempt++
          console.error(`[v0] AI service error (attempt ${attempt}/${maxAttempts}):`, aiError)

          if (attempt >= maxAttempts) {
            response =
              "I'm here as your AI teammate! While I'm experiencing a brief technical moment, I'm ready to help you with building confidence, time management, goal setting, or planning your future. What's on your mind today?"
          } else {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }
      }

      // If we used an improvement, track its usage
      if (usedImprovement && improvement && !isGuest) {
        await applyImprovement(improvement, true)
      }

      // Log successful interaction
      logSecurityEvent({
        type: "personalized_chat_interaction",
        severity: "low",
        details: `${isGuest ? "Guest" : `User ${user.id}`} used personalized chat`,
      })

      console.log(`[v0] Generated response for ${isGuest ? "guest" : `user ${user.id}`}`)

      if (!response || response.trim().length === 0) {
        response =
          "I'm your supportive AI coach, ready to help you succeed! Let's talk about developing your strengths, managing challenges, or planning your path forward. What would you like to explore?"
      }

      // Return the response with enhanced metadata
      return NextResponse.json({
        reply: response,
        messageId,
        conversationId: validatedData.conversationId,
        usedImprovement,
        improvementId: usedImprovement && improvement ? improvement.id : null,
        personalizationLevel: validatedData.personalizationLevel,
        connectionStrength: validatedData.connectionStrength,
        contextualRelevance: validatedData.sessionHistory.length > 0 ? "high" : "medium",
        isGuest,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error("[v0] AI service error:", aiError)

      // Log AI service errors
      logSecurityEvent({
        type: "ai_service_error",
        severity: "medium",
        details: `AI service error for ${isGuest ? "guest" : `user ${user.id}`}: ${aiError instanceof Error ? aiError.message : "Unknown error"}`,
      })

      let fallbackMessage =
        "I'm your AI teammate, and I'm here for you! I may be having a brief technical moment, but I'm ready to support your growth. Ask me about confidence, time management, goal setting, college planning, or developing leadership skills."
      const statusCode = 200 // Always return 200 with fallback content

      if (aiError instanceof Error) {
        if (aiError.message.includes("API key")) {
          fallbackMessage =
            "I'm experiencing a configuration moment, but I'm still here to support you! Try asking about building confidence, balancing school and sports, or planning your future."
        } else if (aiError.message.includes("rate limit")) {
          fallbackMessage =
            "I've been helping lots of people today! While I take a quick breath, remember that you're on an amazing journey. Try your question again in a moment, or tell me what's most important to you right now."
        } else if (aiError.message.includes("timeout")) {
          fallbackMessage =
            "I'm taking a bit longer than usual to think! Try asking your question again, and I'll be ready to help you with confidence, goals, or planning your path forward."
        }
      }

      return NextResponse.json(
        {
          reply: fallbackMessage,
          messageId,
          conversationId: validatedData.conversationId,
          fallback: true,
          error: "temporary_issue",
          isGuest,
          timestamp: new Date().toISOString(),
        },
        { status: statusCode },
      )
    }
  } catch (error) {
    console.error("[v0] Error in personalized chat API route:", error)

    // Log API errors
    logSecurityEvent({
      type: "api_error",
      severity: "medium",
      details: `Personalized chat API error: ${error instanceof Error ? error.message : "Unknown error"}`,
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
          reply: "I need a bit more information to help you. Could you try rephrasing your question?",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        reply:
          "I'm your AI teammate, here to support your journey! Even when technology has a hiccup, I'm ready to help you build confidence, manage challenges, and reach your goals. What's on your mind?",
        fallback: true,
        error: "processing_error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
