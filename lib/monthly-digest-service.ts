import { supabase } from "./supabase"
import { trackEvent } from "./analytics"

export interface MonthlyDigestData {
  month: string
  year: number
  totalActiveStudents: number
  engagementMetrics: {
    averageSessionsPerStudent: number
    averageSessionDuration: number
    mostPopularFeatures: string[]
    peakUsageHours: string[]
  }
  progressMetrics: {
    emotionalIntelligence: {
      averageScore: number
      improvementRate: number
      studentsImproving: number
    }
    selfEfficacy: {
      averageScore: number
      improvementRate: number
      studentsImproving: number
    }
    careerReadiness: {
      averageScore: number
      improvementRate: number
      studentsImproving: number
    }
  }
  milestones: {
    assessmentsCompleted: number
    goalsSet: number
    goalsAchieved: number
    resourcesAccessed: number
    coachingSessionsCompleted: number
  }
  insights: {
    topChallenges: string[]
    successStories: string[]
    recommendedFocus: string[]
    parentTips: string[]
  }
  trends: {
    engagementTrend: "increasing" | "stable" | "decreasing"
    progressTrend: "improving" | "stable" | "declining"
    participationTrend: "growing" | "stable" | "shrinking"
  }
}

/**
 * Generate monthly digest for parents
 */
export async function generateMonthlyDigest(month: number, year: number): Promise<MonthlyDigestData | null> {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    // Get engagement metrics
    const engagementMetrics = await getEngagementMetrics(startDate, endDate)

    // Get progress metrics
    const progressMetrics = await getProgressMetrics(startDate, endDate)

    // Get milestone data
    const milestones = await getMilestoneData(startDate, endDate)

    // Generate insights
    const insights = await generateInsights(progressMetrics, engagementMetrics)

    // Calculate trends
    const trends = await calculateTrends(month, year)

    const digest: MonthlyDigestData = {
      month: startDate.toLocaleString("default", { month: "long" }),
      year,
      totalActiveStudents: engagementMetrics.totalActiveStudents,
      engagementMetrics: {
        averageSessionsPerStudent: engagementMetrics.averageSessionsPerStudent,
        averageSessionDuration: engagementMetrics.averageSessionDuration,
        mostPopularFeatures: engagementMetrics.mostPopularFeatures,
        peakUsageHours: engagementMetrics.peakUsageHours,
      },
      progressMetrics,
      milestones,
      insights,
      trends,
    }

    // Store digest in database
    await storeMonthlyDigest(digest)

    // Track analytics
    trackEvent("monthly_digest_generated", {
      month: digest.month,
      year: digest.year,
      total_students: digest.totalActiveStudents,
    })

    return digest
  } catch (error) {
    console.error("Error generating monthly digest:", error)
    return null
  }
}

/**
 * Get engagement metrics for the month
 */
async function getEngagementMetrics(startDate: Date, endDate: Date) {
  try {
    // Get active students count
    const { data: activeStudents } = await supabase
      .from("user_engagements")
      .select("userId")
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())

    const uniqueStudents = new Set(activeStudents?.map((s) => s.userId) || [])
    const totalActiveStudents = uniqueStudents.size

    // Get session data
    const { data: sessions } = await supabase
      .from("user_engagements")
      .select("*")
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())

    // Calculate averages
    const totalSessions = sessions?.length || 0
    const averageSessionsPerStudent = totalActiveStudents > 0 ? totalSessions / totalActiveStudents : 0

    const totalDuration = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0

    // Get popular features
    const featureUsage =
      sessions?.reduce(
        (acc, session) => {
          const feature = session.feature || "unknown"
          acc[feature] = (acc[feature] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    const mostPopularFeatures = Object.entries(featureUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature)

    // Calculate peak usage hours
    const hourUsage =
      sessions?.reduce(
        (acc, session) => {
          const hour = new Date(session.timestamp).getHours()
          acc[hour] = (acc[hour] || 0) + 1
          return acc
        },
        {} as Record<number, number>,
      ) || {}

    const peakUsageHours = Object.entries(hourUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => {
        const h = Number.parseInt(hour)
        const period = h >= 12 ? "PM" : "AM"
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
        return `${displayHour}:00 ${period}`
      })

    return {
      totalActiveStudents,
      averageSessionsPerStudent: Math.round(averageSessionsPerStudent * 10) / 10,
      averageSessionDuration: Math.round(averageSessionDuration),
      mostPopularFeatures,
      peakUsageHours,
    }
  } catch (error) {
    console.error("Error getting engagement metrics:", error)
    return {
      totalActiveStudents: 0,
      averageSessionsPerStudent: 0,
      averageSessionDuration: 0,
      mostPopularFeatures: [],
      peakUsageHours: [],
    }
  }
}

/**
 * Get progress metrics for the month
 */
async function getProgressMetrics(startDate: Date, endDate: Date) {
  try {
    const categories = ["emotional_intelligence", "self_efficacy", "career_readiness"]
    const progressMetrics: any = {}

    for (const category of categories) {
      // Get assessments for this category
      const { data: assessments } = await supabase
        .from("outcome_measurements")
        .select("*")
        .eq("category", category)
        .gte("timestamp", startDate.toISOString())
        .lte("timestamp", endDate.toISOString())

      if (!assessments || assessments.length === 0) {
        progressMetrics[category] = {
          averageScore: 0,
          improvementRate: 0,
          studentsImproving: 0,
        }
        continue
      }

      // Calculate average score
      const averageScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length

      // Calculate improvement rate
      const improvingStudents = assessments.filter((a) => a.previousScore !== undefined && a.score > a.previousScore)
      const improvementRate = assessments.length > 0 ? (improvingStudents.length / assessments.length) * 100 : 0

      progressMetrics[category] = {
        averageScore: Math.round(averageScore * 10) / 10,
        improvementRate: Math.round(improvementRate * 10) / 10,
        studentsImproving: improvingStudents.length,
      }
    }

    return {
      emotionalIntelligence: progressMetrics.emotional_intelligence,
      selfEfficacy: progressMetrics.self_efficacy,
      careerReadiness: progressMetrics.career_readiness,
    }
  } catch (error) {
    console.error("Error getting progress metrics:", error)
    return {
      emotionalIntelligence: { averageScore: 0, improvementRate: 0, studentsImproving: 0 },
      selfEfficacy: { averageScore: 0, improvementRate: 0, studentsImproving: 0 },
      careerReadiness: { averageScore: 0, improvementRate: 0, studentsImproving: 0 },
    }
  }
}

/**
 * Get milestone data for the month
 */
async function getMilestoneData(startDate: Date, endDate: Date) {
  try {
    // Get assessments completed
    const { data: assessments } = await supabase
      .from("assessments")
      .select("id")
      .gte("completedAt", startDate.toISOString())
      .lte("completedAt", endDate.toISOString())

    // Get goals set and achieved
    const { data: goalsSet } = await supabase
      .from("goal_progress")
      .select("id")
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())
      .eq("status", "in_progress")

    const { data: goalsAchieved } = await supabase
      .from("goal_progress")
      .select("id")
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())
      .eq("status", "completed")

    // Get resources accessed
    const { data: resourcesAccessed } = await supabase
      .from("resource_engagements")
      .select("id")
      .gte("timestamp", startDate.toISOString())
      .lte("timestamp", endDate.toISOString())

    // Get coaching sessions
    const { data: coachingSessions } = await supabase
      .from("chat_messages")
      .select("id")
      .gte("createdAt", startDate.toISOString())
      .lte("createdAt", endDate.toISOString())
      .eq("role", "assistant")

    return {
      assessmentsCompleted: assessments?.length || 0,
      goalsSet: goalsSet?.length || 0,
      goalsAchieved: goalsAchieved?.length || 0,
      resourcesAccessed: resourcesAccessed?.length || 0,
      coachingSessionsCompleted: coachingSessions?.length || 0,
    }
  } catch (error) {
    console.error("Error getting milestone data:", error)
    return {
      assessmentsCompleted: 0,
      goalsSet: 0,
      goalsAchieved: 0,
      resourcesAccessed: 0,
      coachingSessionsCompleted: 0,
    }
  }
}

/**
 * Generate insights based on data
 */
async function generateInsights(progressMetrics: any, engagementMetrics: any) {
  const insights = {
    topChallenges: [] as string[],
    successStories: [] as string[],
    recommendedFocus: [] as string[],
    parentTips: [] as string[],
  }

  // Identify challenges based on low scores
  if (progressMetrics.emotionalIntelligence.averageScore < 60) {
    insights.topChallenges.push("Students are working on emotional regulation and self-awareness")
    insights.recommendedFocus.push("Emotional Intelligence development")
  }

  if (progressMetrics.selfEfficacy.averageScore < 60) {
    insights.topChallenges.push("Building confidence and belief in personal abilities")
    insights.recommendedFocus.push("Self-efficacy building activities")
  }

  if (progressMetrics.careerReadiness.averageScore < 60) {
    insights.topChallenges.push("Preparing for future career and academic opportunities")
    insights.recommendedFocus.push("Career exploration and planning")
  }

  // Generate success stories
  if (progressMetrics.emotionalIntelligence.improvementRate > 70) {
    insights.successStories.push("Students are showing strong improvement in emotional intelligence")
  }

  if (progressMetrics.selfEfficacy.improvementRate > 70) {
    insights.successStories.push("Self-confidence levels are increasing across the student body")
  }

  if (engagementMetrics.averageSessionsPerStudent > 5) {
    insights.successStories.push("High engagement levels indicate students are finding value in the platform")
  }

  // Parent tips
  insights.parentTips = [
    "Encourage regular check-ins about school and athletic experiences",
    "Celebrate small wins and progress, not just major achievements",
    "Ask open-ended questions about challenges and how they're handling them",
    "Support goal-setting conversations at home",
    "Model emotional regulation and problem-solving strategies",
  ]

  return insights
}

/**
 * Calculate trends by comparing with previous month
 */
async function calculateTrends(month: number, year: number) {
  try {
    // Get previous month data
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year

    const currentStartDate = new Date(year, month - 1, 1)
    const currentEndDate = new Date(year, month, 0)
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1)
    const prevEndDate = new Date(prevYear, prevMonth, 0)

    // Get current and previous engagement
    const currentEngagement = await getEngagementMetrics(currentStartDate, currentEndDate)
    const prevEngagement = await getEngagementMetrics(prevStartDate, prevEndDate)

    // Calculate trends
    const engagementTrend =
      currentEngagement.totalActiveStudents > prevEngagement.totalActiveStudents
        ? "increasing"
        : currentEngagement.totalActiveStudents === prevEngagement.totalActiveStudents
          ? "stable"
          : "decreasing"

    const progressTrend = "improving" // Simplified for now
    const participationTrend = "growing" // Simplified for now

    return {
      engagementTrend,
      progressTrend,
      participationTrend,
    }
  } catch (error) {
    console.error("Error calculating trends:", error)
    return {
      engagementTrend: "stable" as const,
      progressTrend: "stable" as const,
      participationTrend: "stable" as const,
    }
  }
}

/**
 * Store monthly digest in database
 */
async function storeMonthlyDigest(digest: MonthlyDigestData) {
  try {
    const { error } = await supabase.from("monthly_digests").upsert([
      {
        month: digest.month,
        year: digest.year,
        data: digest,
        createdAt: new Date().toISOString(),
      },
    ])

    if (error) throw error
  } catch (error) {
    console.error("Error storing monthly digest:", error)
  }
}

/**
 * Get stored monthly digest
 */
export async function getMonthlyDigest(month: number, year: number): Promise<MonthlyDigestData | null> {
  try {
    const monthName = new Date(year, month - 1, 1).toLocaleString("default", { month: "long" })

    const { data, error } = await supabase
      .from("monthly_digests")
      .select("data")
      .eq("month", monthName)
      .eq("year", year)
      .single()

    if (error) throw error

    return data?.data as MonthlyDigestData
  } catch (error) {
    console.error("Error getting monthly digest:", error)
    return null
  }
}

/**
 * Get all available monthly digests
 */
export async function getAvailableDigests(): Promise<{ month: string; year: number }[]> {
  try {
    const { data, error } = await supabase
      .from("monthly_digests")
      .select("month, year")
      .order("year", { ascending: false })
      .order("month", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting available digests:", error)
    return []
  }
}
