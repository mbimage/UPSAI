import { NextResponse } from "next/server"
import { getUserFeedback } from "@/lib/feedback-service"
import { batchLearnFromFeedback } from "@/lib/ai-learning-service"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // In a real app, you would check admin permissions here

    // Get all feedback that needs improvement
    const allFeedback = await getUserFeedback("all")

    // Filter for feedback that needs improvement
    const feedbackToImprove = allFeedback.filter(
      (feedback) => feedback.feedbackType === "not_helpful" || feedback.feedbackType === "partially_helpful",
    )

    // Process the feedback in batches
    const improvedCount = await batchLearnFromFeedback(feedbackToImprove)

    return NextResponse.json({
      success: true,
      processedCount: feedbackToImprove.length,
      improvedCount,
    })
  } catch (error) {
    console.error("Error in batch learn API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process batch learning",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
