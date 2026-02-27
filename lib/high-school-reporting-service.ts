import { supabase } from "./supabase"

export interface HighSchool {
  id: string
  name: string
  district: string
  city: string
  state: string
  principalEmail: string
  coachEmails: string[]
  createdAt: string
}

export interface StudentMetrics {
  id: string
  name: string
  grade: number
  sport: string
  selfEfficacyScore: number
  emotionalIntelligenceScore: number
  goalsCompleted: number
  totalGoals: number
  lastActive: string
  engagementLevel: number
  improvementAreas: string[]
}

export interface SchoolSummary {
  totalStudents: number
  activeStudents: number
  averageEngagement: number
  averageSelfEfficacy: number
  averageEmotionalIntelligence: number
  goalCompletionRate: number
  topPerformers: StudentMetrics[]
  needsAttention: StudentMetrics[]
}

export interface SchoolInsights {
  trends: string[]
  recommendations: string[]
  alerts: string[]
}

export interface ResourceUsage {
  mostUsed: Array<{
    name: string
    usage: number
    category: string
  }>
  recommended: Array<{
    name: string
    reason: string
    category: string
  }>
}

export interface HighSchoolReport {
  school: HighSchool
  summary: SchoolSummary
  insights: SchoolInsights
  resources: ResourceUsage
  reportDate: string
}

export class HighSchoolReportingService {
  async getAllHighSchools(): Promise<HighSchool[]> {
    try {
      const { data: schools, error } = await supabase.from("high_schools").select("*").order("name")

      if (error) {
        console.error("Error fetching high schools:", error)
        return []
      }

      return schools || []
    } catch (error) {
      console.error("Error in getAllHighSchools:", error)
      return []
    }
  }

  async getSchoolStudentMetrics(schoolId: string): Promise<StudentMetrics[]> {
    try {
      // Get students for this school with their latest metrics
      const { data: students, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          grade,
          sport,
          high_school_id,
          created_at,
          last_active,
          assessment_results (
            assessment_type,
            score,
            completed_at
          ),
          user_goals (
            id,
            title,
            completed,
            created_at
          ),
          chat_sessions (
            id,
            created_at,
            message_count
          )
        `)
        .eq("high_school_id", schoolId)
        .not("full_name", "is", null)

      if (error) {
        console.error("Error fetching student metrics:", error)
        return []
      }

      return (students || []).map((student) => {
        // Calculate latest assessment scores
        const assessments = student.assessment_results || []
        const selfEfficacyAssessments = assessments.filter((a) => a.assessment_type === "self_efficacy")
        const eiAssessments = assessments.filter((a) => a.assessment_type === "emotional_intelligence")

        const latestSelfEfficacy =
          selfEfficacyAssessments.length > 0
            ? selfEfficacyAssessments.sort(
                (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
              )[0].score
            : 0

        const latestEI =
          eiAssessments.length > 0
            ? eiAssessments.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
                .score
            : 0

        // Calculate goals
        const goals = student.user_goals || []
        const completedGoals = goals.filter((g) => g.completed).length
        const totalGoals = goals.length

        // Calculate engagement (based on recent activity)
        const recentSessions = (student.chat_sessions || []).filter(
          (session) => new Date(session.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        )
        const engagementLevel = Math.min(100, recentSessions.length * 20)

        // Determine improvement areas
        const improvementAreas: string[] = []
        if (latestSelfEfficacy < 3) improvementAreas.push("Self-Efficacy")
        if (latestEI < 3) improvementAreas.push("Emotional Intelligence")
        if (totalGoals > 0 && completedGoals / totalGoals < 0.5) improvementAreas.push("Goal Completion")
        if (engagementLevel < 30) improvementAreas.push("Platform Engagement")

        return {
          id: student.id,
          name: student.full_name || "Unknown Student",
          grade: student.grade || 9,
          sport: student.sport || "General",
          selfEfficacyScore: Math.round(latestSelfEfficacy * 10) / 10,
          emotionalIntelligenceScore: Math.round(latestEI * 10) / 10,
          goalsCompleted: completedGoals,
          totalGoals: totalGoals,
          lastActive: student.last_active || student.created_at,
          engagementLevel,
          improvementAreas,
        }
      })
    } catch (error) {
      console.error("Error in getSchoolStudentMetrics:", error)
      return []
    }
  }

  async generateSchoolSummary(students: StudentMetrics[]): Promise<SchoolSummary> {
    const totalStudents = students.length
    const activeStudents = students.filter(
      (s) => new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length

    const averageEngagement =
      totalStudents > 0 ? students.reduce((sum, s) => sum + s.engagementLevel, 0) / totalStudents : 0

    const studentsWithSelfEfficacy = students.filter((s) => s.selfEfficacyScore > 0)
    const averageSelfEfficacy =
      studentsWithSelfEfficacy.length > 0
        ? Math.round(
            (studentsWithSelfEfficacy.reduce((sum, s) => sum + s.selfEfficacyScore, 0) /
              studentsWithSelfEfficacy.length) *
              10,
          ) / 10
        : 0

    const studentsWithEI = students.filter((s) => s.emotionalIntelligenceScore > 0)
    const averageEmotionalIntelligence =
      studentsWithEI.length > 0
        ? Math.round(
            (studentsWithEI.reduce((sum, s) => sum + s.emotionalIntelligenceScore, 0) / studentsWithEI.length) * 10,
          ) / 10
        : 0

    const studentsWithGoals = students.filter((s) => s.totalGoals > 0)
    const goalCompletionRate =
      studentsWithGoals.length > 0
        ? (studentsWithGoals.reduce((sum, s) => sum + s.goalsCompleted / s.totalGoals, 0) / studentsWithGoals.length) *
          100
        : 0

    // Top performers (high scores and engagement)
    const topPerformers = students
      .filter((s) => s.selfEfficacyScore >= 4 && s.emotionalIntelligenceScore >= 4 && s.engagementLevel >= 60)
      .sort(
        (a, b) =>
          b.selfEfficacyScore +
          b.emotionalIntelligenceScore +
          b.engagementLevel -
          (a.selfEfficacyScore + a.emotionalIntelligenceScore + a.engagementLevel),
      )
      .slice(0, 5)

    // Students needing attention
    const needsAttention = students
      .filter((s) => s.improvementAreas.length >= 2 || s.engagementLevel < 20)
      .sort((a, b) => b.improvementAreas.length - a.improvementAreas.length)
      .slice(0, 5)

    return {
      totalStudents,
      activeStudents,
      averageEngagement,
      averageSelfEfficacy,
      averageEmotionalIntelligence,
      goalCompletionRate,
      topPerformers,
      needsAttention,
    }
  }

  async generateSchoolInsights(
    school: HighSchool,
    summary: SchoolSummary,
    students: StudentMetrics[],
  ): Promise<SchoolInsights> {
    const trends: string[] = []
    const recommendations: string[] = []
    const alerts: string[] = []

    // Analyze trends
    if (summary.averageEngagement > 70) {
      trends.push("High student engagement - students are actively using the platform")
    } else if (summary.averageEngagement < 30) {
      trends.push("Low engagement detected - students may need additional motivation")
    }

    if (summary.averageSelfEfficacy > 4) {
      trends.push("Strong self-efficacy scores across students")
    } else if (summary.averageSelfEfficacy < 3) {
      trends.push("Self-efficacy scores below optimal range")
    }

    if (summary.goalCompletionRate > 80) {
      trends.push("Excellent goal completion rates")
    } else if (summary.goalCompletionRate < 40) {
      trends.push("Goal completion rates need improvement")
    }

    // Generate recommendations
    if (summary.averageEngagement < 50) {
      recommendations.push("Consider implementing engagement challenges or rewards")
      recommendations.push("Schedule group sessions or peer mentoring activities")
    }

    if (summary.averageSelfEfficacy < 3.5) {
      recommendations.push("Focus on self-efficacy building exercises and success stories")
      recommendations.push("Implement confidence-building workshops")
    }

    if (summary.needsAttention.length > summary.totalStudents * 0.3) {
      recommendations.push("Consider additional support resources for struggling students")
      recommendations.push("Implement early intervention strategies")
    }

    if (summary.goalCompletionRate < 60) {
      recommendations.push("Provide goal-setting workshops and accountability partners")
      recommendations.push("Break down large goals into smaller, achievable milestones")
    }

    // Generate alerts
    if (summary.activeStudents < summary.totalStudents * 0.4) {
      alerts.push(`Low activity: Only ${summary.activeStudents} of ${summary.totalStudents} students active this week`)
    }

    if (summary.needsAttention.length > 5) {
      alerts.push(`${summary.needsAttention.length} students need immediate attention and support`)
    }

    const lowEngagementStudents = students.filter((s) => s.engagementLevel < 10).length
    if (lowEngagementStudents > 0) {
      alerts.push(`${lowEngagementStudents} students have very low engagement (less than 10%)`)
    }

    return {
      trends,
      recommendations,
      alerts,
    }
  }

  async getResourceUsage(schoolId: string): Promise<ResourceUsage> {
    try {
      // Get resource usage data for this school
      const { data: resourceViews, error } = await supabase
        .from("resource_views")
        .select(`
          resource_id,
          user_id,
          created_at,
          resources (
            title,
            category
          )
        `)
        .eq("school_id", schoolId)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.error("Error fetching resource usage:", error)
      }

      // Process most used resources
      const resourceUsageMap = new Map<string, { name: string; usage: number; category: string }>()

      if (resourceViews) {
        resourceViews.forEach((view) => {
          if (view.resources) {
            const key = view.resource_id
            const existing = resourceUsageMap.get(key)
            if (existing) {
              existing.usage++
            } else {
              resourceUsageMap.set(key, {
                name: view.resources.title,
                usage: 1,
                category: view.resources.category,
              })
            }
          }
        })
      }

      const mostUsed = Array.from(resourceUsageMap.values())
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5)

      // Generate recommendations based on school needs
      const recommended = [
        {
          name: "Self-Efficacy Building Guide",
          reason: "Helps students build confidence and belief in their abilities",
          category: "Personal Development",
        },
        {
          name: "Goal Setting Workshop",
          reason: "Improves goal completion rates and planning skills",
          category: "Goal Setting",
        },
        {
          name: "Emotional Intelligence Training",
          reason: "Develops emotional awareness and regulation skills",
          category: "Emotional Intelligence",
        },
        {
          name: "Time Management for Student Athletes",
          reason: "Balances academic and athletic commitments",
          category: "Time Management",
        },
        {
          name: "Stress Management Techniques",
          reason: "Helps manage pressure and maintain mental health",
          category: "Mental Health",
        },
      ]

      return {
        mostUsed:
          mostUsed.length > 0
            ? mostUsed
            : [
                { name: "Getting Started Guide", usage: 0, category: "Onboarding" },
                { name: "Self-Assessment Tools", usage: 0, category: "Assessment" },
              ],
        recommended: recommended.slice(0, 3),
      }
    } catch (error) {
      console.error("Error in getResourceUsage:", error)
      return {
        mostUsed: [{ name: "Getting Started Guide", usage: 0, category: "Onboarding" }],
        recommended: [
          {
            name: "Self-Efficacy Building Guide",
            reason: "Essential for building student confidence",
            category: "Personal Development",
          },
        ],
      }
    }
  }

  async generateSchoolReport(school: HighSchool): Promise<HighSchoolReport> {
    try {
      const students = await this.getSchoolStudentMetrics(school.id)
      const summary = await this.generateSchoolSummary(students)
      const insights = await this.generateSchoolInsights(school, summary, students)
      const resources = await this.getResourceUsage(school.id)

      return {
        school,
        summary,
        insights,
        resources,
        reportDate: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`Error generating report for ${school.name}:`, error)
      throw error
    }
  }

  async generateAllSchoolReports(): Promise<HighSchoolReport[]> {
    try {
      const schools = await this.getAllHighSchools()
      const reports: HighSchoolReport[] = []

      for (const school of schools) {
        try {
          const report = await this.generateSchoolReport(school)
          reports.push(report)
        } catch (error) {
          console.error(`Failed to generate report for ${school.name}:`, error)
          // Continue with other schools even if one fails
        }
      }

      return reports
    } catch (error) {
      console.error("Error generating all school reports:", error)
      return []
    }
  }
}
