export type SkillCategory =
  | "self-efficacy"
  | "emotional-intelligence"
  | "situational-awareness"
  | "career-readiness"
  | "leadership"
  | "teamwork"
  | "performance"

export type EngagementType = "completed" | "in-progress" | "not-started"

export type ReflectionType = "strength" | "challenge" | "goal"

export interface UserReflection {
  id: string
  userId: string
  content: string
  type: ReflectionType
  skillCategory: SkillCategory
  createdAt: Date
}

export interface UserSkill {
  skillCategory: SkillCategory
  level: number // 0-100
  lastUpdated: Date
}

export interface UserEngagement {
  id: string
  userId: string
  activityType: string // "assessment", "conversation", "challenge", etc.
  activityId: string
  status: EngagementType
  skillCategories: SkillCategory[]
  completedAt?: Date
  startedAt: Date
}

export interface GrowthOpportunity {
  id: string
  title: string
  description: string
  skillCategory: SkillCategory
  type: "action-step" | "micro-challenge" | "ai-suggestion"
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  isRecommended: boolean
  isPopular?: boolean
  isNew?: boolean
  aiGenerated?: boolean
  createdAt: Date
}

export interface PersonalizedRecommendation {
  opportunity: GrowthOpportunity
  matchScore: number // 0-100, how well it matches the user
  reasonForRecommendation: string
}
