import type {
  GrowthOpportunity,
  PersonalizedRecommendation,
  UserEngagement,
  UserReflection,
  UserSkill,
} from "@/types/growth"
import {
  getUserSkills as getSkills,
  getUserReflections as getReflections,
  getUserEngagements as getEngagements,
  getGrowthOpportunities as getOpportunities,
} from "@/lib/database-service"

// Get user skills from database
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  try {
    const skills = await getSkills(userId)

    if (skills.length === 0) {
      // Return mock data if no skills found
      return [
        { id: "1", userId, skillCategory: "self-efficacy", level: 75, lastUpdated: new Date().toISOString() },
        { id: "2", userId, skillCategory: "emotional-intelligence", level: 60, lastUpdated: new Date().toISOString() },
        { id: "3", userId, skillCategory: "situational-awareness", level: 82, lastUpdated: new Date().toISOString() },
        { id: "4", userId, skillCategory: "career-readiness", level: 45, lastUpdated: new Date().toISOString() },
        { id: "5", userId, skillCategory: "leadership", level: 68, lastUpdated: new Date().toISOString() },
        { id: "6", userId, skillCategory: "teamwork", level: 72, lastUpdated: new Date().toISOString() },
        { id: "7", userId, skillCategory: "performance", level: 80, lastUpdated: new Date().toISOString() },
      ]
    }

    return skills
  } catch (error) {
    console.error("Error getting user skills:", error)
    return []
  }
}

// Get user reflections from database
export async function getUserReflections(userId: string): Promise<UserReflection[]> {
  try {
    const reflections = await getReflections(userId)

    if (reflections.length === 0) {
      // Return mock data if no reflections found
      return [
        {
          id: "1",
          userId,
          content: "I feel confident speaking up in team meetings",
          type: "strength",
          skillCategory: "self-efficacy",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          userId,
          content: "I struggle with giving constructive feedback to teammates",
          type: "challenge",
          skillCategory: "leadership",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          userId,
          content: "I want to improve my ability to stay calm under pressure during games",
          type: "goal",
          skillCategory: "performance",
          createdAt: new Date().toISOString(),
        },
      ]
    }

    return reflections
  } catch (error) {
    console.error("Error getting user reflections:", error)
    return []
  }
}

// Get user engagements from database
export async function getUserEngagements(userId: string): Promise<UserEngagement[]> {
  try {
    const engagements = await getEngagements(userId)

    if (engagements.length === 0) {
      // Return mock data if no engagements found
      return [
        {
          id: "1",
          userId,
          activityType: "assessment",
          activityId: "leadership-style",
          status: "completed",
          skillCategories: ["leadership", "teamwork"],
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          startedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          userId,
          activityType: "conversation",
          activityId: "game-pressure",
          status: "in-progress",
          skillCategories: ["performance", "emotional-intelligence"],
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          userId,
          activityType: "challenge",
          activityId: "team-communication",
          status: "not-started",
          skillCategories: ["teamwork", "leadership"],
          startedAt: new Date().toISOString(),
        },
      ]
    }

    return engagements
  } catch (error) {
    console.error("Error getting user engagements:", error)
    return []
  }
}

// Get pre-defined growth opportunities from database
export async function getGrowthOpportunities(): Promise<GrowthOpportunity[]> {
  try {
    const opportunities = await getOpportunities()

    if (opportunities.length === 0) {
      // Return mock data if no opportunities found
      return [
        {
          id: "1",
          title: "Game Day Confidence Boost",
          description: "Quick 15-min conversation to get you mentally prepared for competition",
          skillCategory: "self-efficacy",
          type: "action-step",
          difficulty: "beginner",
          estimatedTime: "15 min",
          isRecommended: true,
          isPopular: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Leadership Skill Building",
          description: "Develop your team leadership abilities through guided practice",
          skillCategory: "leadership",
          type: "micro-challenge",
          difficulty: "intermediate",
          estimatedTime: "30 min",
          isRecommended: false,
          isPopular: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Emotional Regulation Techniques",
          description: "Learn and practice techniques to manage emotions during high-pressure situations",
          skillCategory: "emotional-intelligence",
          type: "action-step",
          difficulty: "intermediate",
          estimatedTime: "20 min",
          isRecommended: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Career Path Exploration",
          description: "Explore potential career paths that align with your strengths and interests",
          skillCategory: "career-readiness",
          type: "micro-challenge",
          difficulty: "beginner",
          estimatedTime: "25 min",
          isRecommended: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "Reading the Room",
          description: "Practice identifying social cues and group dynamics in team settings",
          skillCategory: "situational-awareness",
          type: "micro-challenge",
          difficulty: "advanced",
          estimatedTime: "40 min",
          isRecommended: false,
          isNew: true,
          createdAt: new Date().toISOString(),
        },
      ]
    }

    return opportunities
  } catch (error) {
    console.error("Error getting growth opportunities:", error)
    return []
  }
}

// Generate personalized recommendations based on user data
export async function generatePersonalizedRecommendations(userId: string): Promise<PersonalizedRecommendation[]> {
  const [skills, reflections, engagements, opportunities] = await Promise.all([
    getUserSkills(userId),
    getUserReflections(userId),
    getUserEngagements(userId),
    getGrowthOpportunities(),
  ])

  // Simple recommendation algorithm (in a real app, this would be more sophisticated)
  const recommendations: PersonalizedRecommendation[] = []

  // Find skill categories that need improvement
  const lowSkills = skills.filter((skill) => skill.level < 70).map((skill) => skill.skillCategory)

  // Find skill categories from user goals
  const goalSkills = reflections
    .filter((reflection) => reflection.type === "goal")
    .map((reflection) => reflection.skillCategory)

  // Find skill categories from user challenges
  const challengeSkills = reflections
    .filter((reflection) => reflection.type === "challenge")
    .map((reflection) => reflection.skillCategory)

  // Combine priority skill categories
  const prioritySkills = [...new Set([...lowSkills, ...goalSkills, ...challengeSkills])]

  // Filter opportunities based on priority skills
  const relevantOpportunities = opportunities.filter((opportunity) =>
    prioritySkills.includes(opportunity.skillCategory),
  )

  // Generate recommendations with match scores
  relevantOpportunities.forEach((opportunity) => {
    let matchScore = 0
    const reasons = []

    // Increase score if it's for a low skill
    if (lowSkills.includes(opportunity.skillCategory)) {
      matchScore += 30
      reasons.push("Addresses a skill area you're working to improve")
    }

    // Increase score if it's related to a goal
    if (goalSkills.includes(opportunity.skillCategory)) {
      matchScore += 40
      reasons.push("Aligns with your personal growth goals")
    }

    // Increase score if it's related to a challenge
    if (challengeSkills.includes(opportunity.skillCategory)) {
      matchScore += 30
      reasons.push("Helps with challenges you've identified")
    }

    // Adjust score based on difficulty
    const skill = skills.find((s) => s.skillCategory === opportunity.skillCategory)
    if (skill) {
      if (
        (skill.level < 50 && opportunity.difficulty === "beginner") ||
        (skill.level >= 50 && skill.level < 80 && opportunity.difficulty === "intermediate") ||
        (skill.level >= 80 && opportunity.difficulty === "advanced")
      ) {
        matchScore += 20
        reasons.push("Difficulty level is appropriate for your current skill level")
      }
    }

    // Only include recommendations with a decent match score
    if (matchScore >= 50) {
      recommendations.push({
        opportunity,
        matchScore,
        reasonForRecommendation: reasons.join(". "),
      })
    }
  })

  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore)
}
