"use server"

import { type OutcomeCategory, trackResourceEngagement } from "@/lib/outcome-analytics"

export async function trackResourceUsage(
  userId: string,
  resourceId: string,
  resourceType: string,
  category: OutcomeCategory,
  completionPercentage: number,
  timeSpentMinutes: number,
  metadata: Record<string, any> = {},
) {
  try {
    // Track the resource engagement
    const result = await trackResourceEngagement({
      userId,
      resourceId,
      resourceType,
      category,
      completionPercentage,
      timeSpentMinutes,
      metadata,
    })

    return { success: true, result }
  } catch (error) {
    console.error("Error tracking resource usage:", error)
    return { success: false, error: "Failed to track resource usage" }
  }
}
