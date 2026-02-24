import { NextResponse } from "next/server"
import { submitFeedback } from "@/lib/feedback-service"
import { generateImprovedResponse } from "@/lib/ai-learning-service"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messageId, conversationId, userId, aiResponse, feedbackType, feedbackText, tags, originalPrompt } = body

    if (!messageId || !conversationId || !userId || !aiResponse) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Submit the feedback
    const feedback = await submitFeedback({
      userId,
      messageId,
      conversationId,
      aiResponse,
      feedbackType,
      feedbackText,
      tags: tags || [],
    })

    // If the feedback is negative, generate an improved response
    let improvedResponse = null
    if (feedback && (feedbackType === "not_helpful" || feedbackType === "partially_helpful") && originalPrompt) {
      improvedResponse = await generateImprovedResponse(feedback, originalPrompt)
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedback?.id,
      improvedResponse,
    })
  } catch (error) {
    console.error("Error in feedback API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
