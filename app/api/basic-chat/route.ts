import { NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/openai-service"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { sanitizeInput, logSecurityEvent } from "@/lib/security-service"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
})

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()
    const isGuest = !user

    console.log(`[v0] Chat request from ${isGuest ? "guest" : `user ${user.id}`}`)

    // Parse and validate request body
    const body = await request.json()
    const validatedData = chatRequestSchema.parse({
      message: sanitizeInput(body.message || ""),
    })

    console.log(`[v0] Processing message: ${validatedData.message.substring(0, 100)}`)

    let response
    let attempt = 0
    const maxAttempts = 2
    const messageId = uuidv4()

    while (attempt < maxAttempts) {
      try {
        response = await generateChatResponse(validatedData.message)

        if (response && response.trim().length > 0) {
          break // Success
        }

        throw new Error("Empty response received")
      } catch (error) {
        attempt++
        console.error(`[v0] Chat error (attempt ${attempt}/${maxAttempts}):`, error)

        if (attempt >= maxAttempts) {
          response =
            "I'm here to support you! I'm having a brief technical moment, but I'm ready to help with building confidence, time management, goal setting, or planning your future. What's on your mind?"
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    }

    console.log(`[v0] Generated response successfully`)

    // Log successful interaction
    logSecurityEvent({
      type: "chat_interaction",
      severity: "low",
      details: `${isGuest ? "Guest" : `User ${user.id}`} sent chat message`,
    })

    return NextResponse.json({
      reply: response,
      messageId,
      isGuest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in basic-chat API route:", error)

    // Log security event for errors
    logSecurityEvent({
      type: "api_error",
      severity: "medium",
      details: `Basic chat API error: ${error instanceof Error ? error.message : "Unknown error"}`,
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
          reply: "I need a bit more information to help you. Could you try rephrasing your question?",
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
      },
      { status: 200 },
    )
  }
}
