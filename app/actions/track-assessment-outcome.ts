"use server"

import { type OutcomeCategory, trackOutcomeMeasurement } from "@/lib/outcome-analytics"

export async function trackAssessmentOutcome(
  userId: string,
  assessmentId: string,
  category: OutcomeCategory,
  score: number,
  metadata: Record<string, any> = {},
) {
  try {
    // Track the outcome measurement
    const result = await trackOutcomeMeasurement({
      userId,
      category,
      score,
      source: "assessment",
      metadata: {
        assessmentId,
        ...metadata,
      },
    })

    return { success: true, result }
  } catch (error) {
    console.error("Error tracking assessment outcome:", error)
    return { success: false, error: "Failed to track assessment outcome" }
  }
}
