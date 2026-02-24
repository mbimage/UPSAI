import { NextResponse } from "next/server"
import { getUserFeedback } from "@/lib/feedback-service"
import { analyzeFeedbackPatterns } from "@/lib/ai-learning-service"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // In a real app, you would check admin permissions here

    // Get all feedback
    const allFeedback = await getUserFeedback("all")

    // Analyze the feedback patterns
    const analysis = await analyzeFeedbackPatterns(allFeedback)

    // In a real app, you would store this analysis in the database

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Error in analyze feedback API route:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze feedback patterns",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
