import { supabase } from "./supabase"
import { trackEvent } from "./analytics"

/**
 * Types of outcomes we want to track
 */
export type OutcomeCategory =
  | "self_efficacy"
  | "emotional_intelligence"
  | "social_awareness"
  | "career_readiness"
  | "leadership"
  | "resilience"
  | "goal_achievement"

/**
 * Outcome measurement data structure
 */
export interface OutcomeMeasurement {
  userId: string
  category: OutcomeCategory
  score: number
  previousScore?: number
  source: "assessment" | "self_report" | "ai_analysis" | "coach_input"
  metadata?: Record<string, any>
  timestamp: string
}

/**
 * Goal progress tracking
 */
export interface GoalProgress {
  userId: string
  goalId: string
  title: string
  category: OutcomeCategory
  progress: number
  previousProgress?: number
  status: "not_started" | "in_progress" | "completed" | "abandoned"
  metadata?: Record<string, any>
  timestamp: string
}

/**
 * Resource engagement metrics
 */
export interface ResourceEngagement {
  userId: string
  resourceId: string
  resourceType: string
  category: OutcomeCategory
  completionPercentage: number
  timeSpentMinutes: number
  metadata?: Record<string, any>
  timestamp: string
}

/**
 * Track a new outcome measurement
 */
export async function trackOutcomeMeasurement(
  measurement: Omit<OutcomeMeasurement, "timestamp">,
): Promise<OutcomeMeasurement | null> {
  try {
    // Get previous score if available
    const previousScore = await getLatestOutcomeScore(measurement.userId, measurement.category)

    const newMeasurement = {
      ...measurement,
      previousScore,
      timestamp: new Date().toISOString(),
    }

    // Store in database
    const { data, error } = await supabase.from("outcome_measurements").insert([newMeasurement]).select()

    if (error) throw error

    // Also track in general analytics
    trackEvent("outcome_measured", {
      category: measurement.category,
      score: measurement.score,
      previous_score: previousScore,
      change: previousScore !== undefined ? measurement.score - previousScore : null,
      source: measurement.source,
    })

    return data?.[0] as OutcomeMeasurement
  } catch (error) {
    console.error("Error tracking outcome measurement:", error)
    return null
  }
}

/**
 * Track goal progress
 */
export async function trackGoalProgress(
  progress: Omit<GoalProgress, "timestamp" | "previousProgress">,
): Promise<GoalProgress | null> {
  try {
    // Get previous progress if available
    const previousProgress = await getLatestGoalProgress(progress.userId, progress.goalId)

    const newProgress = {
      ...progress,
      previousProgress,
      timestamp: new Date().toISOString(),
    }

    // Store in database
    const { data, error } = await supabase.from("goal_progress").insert([newProgress]).select()

    if (error) throw error

    // Also track in general analytics
    trackEvent("goal_progress_updated", {
      category: progress.category,
      progress: progress.progress,
      previous_progress: previousProgress,
      change: previousProgress !== undefined ? progress.progress - previousProgress : null,
      status: progress.status,
    })

    return data?.[0] as GoalProgress
  } catch (error) {
    console.error("Error tracking goal progress:", error)
    return null
  }
}

/**
 * Track resource engagement
 */
export async function trackResourceEngagement(
  engagement: Omit<ResourceEngagement, "timestamp">,
): Promise<ResourceEngagement | null> {
  try {
    const newEngagement = {
      ...engagement,
      timestamp: new Date().toISOString(),
    }

    // Store in database
    const { data, error } = await supabase.from("resource_engagements").insert([newEngagement]).select()

    if (error) throw error

    // Also track in general analytics
    trackEvent("resource_engaged", {
      resource_id: engagement.resourceId,
      resource_type: engagement.resourceType,
      category: engagement.category,
      completion_percentage: engagement.completionPercentage,
      time_spent_minutes: engagement.timeSpentMinutes,
    })

    return data?.[0] as ResourceEngagement
  } catch (error) {
    console.error("Error tracking resource engagement:", error)
    return null
  }
}

/**
 * Get the latest outcome score for a user in a specific category
 */
async function getLatestOutcomeScore(userId: string, category: OutcomeCategory): Promise<number | undefined> {
  try {
    const { data, error } = await supabase
      .from("outcome_measurements")
      .select("score")
      .eq("userId", userId)
      .eq("category", category)
      .order("timestamp", { ascending: false })
      .limit(1)

    if (error) throw error

    return data?.[0]?.score
  } catch (error) {
    console.error("Error getting latest outcome score:", error)
    return undefined
  }
}

/**
 * Get the latest goal progress for a user's specific goal
 */
async function getLatestGoalProgress(userId: string, goalId: string): Promise<number | undefined> {
  try {
    const { data, error } = await supabase
      .from("goal_progress")
      .select("progress")
      .eq("userId", userId)
      .eq("goalId", goalId)
      .order("timestamp", { ascending: false })
      .limit(1)

    if (error) throw error

    return data?.[0]?.progress
  } catch (error) {
    console.error("Error getting latest goal progress:", error)
    return undefined
  }
}

/**
 * Get outcome history for a user in a specific category
 */
export async function getOutcomeHistory(
  userId: string,
  category: OutcomeCategory,
  limit = 10,
): Promise<OutcomeMeasurement[]> {
  try {
    const { data, error } = await supabase
      .from("outcome_measurements")
      .select("*")
      .eq("userId", userId)
      .eq("category", category)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error

    return data as OutcomeMeasurement[]
  } catch (error) {
    console.error("Error getting outcome history:", error)
    return []
  }
}

/**
 * Get all outcome categories with latest scores for a user
 */
export async function getUserOutcomeSummary(userId: string): Promise<Record<OutcomeCategory, number | null>> {
  try {
    // Define all categories we want to track
    const categories: OutcomeCategory[] = [
      "self_efficacy",
      "emotional_intelligence",
      "social_awareness",
      "career_readiness",
      "leadership",
      "resilience",
      "goal_achievement",
    ]

    // Initialize results object
    const results: Partial<Record<OutcomeCategory, number | null>> = {}

    // Get latest score for each category
    for (const category of categories) {
      results[category] = (await getLatestOutcomeScore(userId, category)) || null
    }

    return results as Record<OutcomeCategory, number | null>
  } catch (error) {
    console.error("Error getting user outcome summary:", error)
    return {
      self_efficacy: null,
      emotional_intelligence: null,
      social_awareness: null,
      career_readiness: null,
      leadership: null,
      resilience: null,
      goal_achievement: null,
    }
  }
}

/**
 * Calculate growth metrics for a user
 */
export async function calculateUserGrowthMetrics(userId: string): Promise<{
  overallGrowth: number | null
  categoryGrowth: Record<OutcomeCategory, number | null>
  improvementAreas: OutcomeCategory[]
  strengthAreas: OutcomeCategory[]
}> {
  try {
    // Define all categories
    const categories: OutcomeCategory[] = [
      "self_efficacy",
      "emotional_intelligence",
      "social_awareness",
      "career_readiness",
      "leadership",
      "resilience",
      "goal_achievement",
    ]

    const categoryGrowth: Partial<Record<OutcomeCategory, number | null>> = {}
    let totalGrowth = 0
    let categoriesWithGrowth = 0

    // Calculate growth for each category
    for (const category of categories) {
      const measurements = await getOutcomeHistory(userId, category, 10)

      if (measurements.length >= 2) {
        // Calculate growth between oldest and newest measurement
        const oldest = measurements[measurements.length - 1]
        const newest = measurements[0]

        const growth = newest.score - oldest.score
        categoryGrowth[category] = growth

        totalGrowth += growth
        categoriesWithGrowth++
      } else {
        categoryGrowth[category] = null
      }
    }

    // Calculate overall growth
    const overallGrowth = categoriesWithGrowth > 0 ? totalGrowth / categoriesWithGrowth : null

    // Identify improvement areas and strength areas
    const improvementAreas: OutcomeCategory[] = []
    const strengthAreas: OutcomeCategory[] = []

    for (const category of categories) {
      const growth = categoryGrowth[category]
      const latestScore = await getLatestOutcomeScore(userId, category)

      if (growth !== null && growth < 0) {
        improvementAreas.push(category)
      } else if (latestScore !== undefined && latestScore > 75) {
        strengthAreas.push(category)
      }
    }

    return {
      overallGrowth,
      categoryGrowth: categoryGrowth as Record<OutcomeCategory, number | null>,
      improvementAreas,
      strengthAreas,
    }
  } catch (error) {
    console.error("Error calculating user growth metrics:", error)
    return {
      overallGrowth: null,
      categoryGrowth: {
        self_efficacy: null,
        emotional_intelligence: null,
        social_awareness: null,
        career_readiness: null,
        leadership: null,
        resilience: null,
        goal_achievement: null,
      },
      improvementAreas: [],
      strengthAreas: [],
    }
  }
}

/**
 * Get aggregate statistics across all users
 */
export async function getAggregateOutcomeStats(): Promise<{
  averageScores: Record<OutcomeCategory, number | null>
  averageGrowth: Record<OutcomeCategory, number | null>
  userCount: number
  assessmentCount: number
}> {
  try {
    // This would typically be a more complex database query
    // For now, we'll return mock data
    return {
      averageScores: {
        self_efficacy: 72,
        emotional_intelligence: 68,
        social_awareness: 65,
        career_readiness: 58,
        leadership: 63,
        resilience: 70,
        goal_achievement: 61,
      },
      averageGrowth: {
        self_efficacy: 8.2,
        emotional_intelligence: 7.5,
        social_awareness: 6.3,
        career_readiness: 9.1,
        leadership: 5.8,
        resilience: 7.2,
        goal_achievement: 8.5,
      },
      userCount: 127,
      assessmentCount: 342,
    }
  } catch (error) {
    console.error("Error getting aggregate outcome stats:", error)
    return {
      averageScores: {
        self_efficacy: null,
        emotional_intelligence: null,
        social_awareness: null,
        career_readiness: null,
        leadership: null,
        resilience: null,
        goal_achievement: null,
      },
      averageGrowth: {
        self_efficacy: null,
        emotional_intelligence: null,
        social_awareness: null,
        career_readiness: null,
        leadership: null,
        resilience: null,
        goal_achievement: null,
      },
      userCount: 0,
      assessmentCount: 0,
    }
  }
}
