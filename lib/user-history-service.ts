// In-memory storage for user interactions (replace with database in production)
const userInteractions: Record<string, any[]> = {}
const userPreferences: Record<string, any[]> = {}
const userTopicsMemory: Map<string, any[]> = new Map()
const userMemory: Map<string, UserMemory> = new Map()

export interface UserInteraction {
  userId: string
  type: string
  content: string
  metadata?: any
  tags?: string[]
  timestamp?: string
}

export interface UserPreference {
  userId: string
  key: string
  value: any
  timestamp?: string
}

export interface UserTopic {
  id?: string
  userId: string
  topic: string
  interactionCount: number
  lastInteracted: string
  sentiment: "positive" | "neutral" | "negative"
}

export interface UserMemory {
  userId: string
  personalInfo: {
    name?: string
    sport?: string
    grade?: string
    school?: string
    goals?: string[]
    challenges?: string[]
    strengths?: string[]
  }
  conversationHistory: {
    commonTopics: string[]
    recentQuestions: string[]
    emotionalState: string[]
    progressNotes: string[]
  }
  preferences: {
    communicationStyle: string
    responseLength: string
    focusAreas: string[]
  }
  insights: {
    growthAreas: string[]
    successPatterns: string[]
    triggerTopics: string[]
  }
  lastUpdated: string
}

export interface PersonalizationContext {
  interactions: any[]
  preferences: any[]
  totalInteractions: number
  recentInteractions: any[]
  memory: UserMemory | null
}

// Initialize or get user memory
export function getUserMemory(userId: string): UserMemory {
  if (!userMemory.has(userId)) {
    const newMemory: UserMemory = {
      userId,
      personalInfo: {},
      conversationHistory: {
        commonTopics: [],
        recentQuestions: [],
        emotionalState: [],
        progressNotes: [],
      },
      preferences: {
        communicationStyle: "balanced",
        responseLength: "medium",
        focusAreas: [],
      },
      insights: {
        growthAreas: [],
        successPatterns: [],
        triggerTopics: [],
      },
      lastUpdated: new Date().toISOString(),
    }
    userMemory.set(userId, newMemory)
  }
  return userMemory.get(userId)!
}

// Update user memory with new information
export function updateUserMemory(userId: string, updates: Partial<UserMemory>): UserMemory {
  const currentMemory = getUserMemory(userId)
  const updatedMemory = {
    ...currentMemory,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }
  userMemory.set(userId, updatedMemory)
  return updatedMemory
}

// Extract insights from user message
export function extractInsightsFromMessage(message: string): {
  topics: string[]
  emotions: string[]
  challenges: string[]
  goals: string[]
} {
  const lowerMessage = message.toLowerCase()

  // Extract topics
  const topicKeywords = {
    sports: ["game", "practice", "team", "coach", "season", "tournament", "competition"],
    academics: ["test", "exam", "grade", "homework", "study", "class", "teacher", "school"],
    social: ["friends", "teammates", "drama", "conflict", "relationship", "peer"],
    mental: ["stress", "anxiety", "pressure", "confidence", "motivation", "focus"],
    goals: ["want to", "goal", "improve", "better", "achieve", "succeed"],
  }

  const topics: string[] = []
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      topics.push(topic)
    }
  })

  // Extract emotions
  const emotionKeywords = {
    frustrated: ["frustrated", "annoyed", "angry", "mad"],
    anxious: ["nervous", "worried", "anxious", "scared", "afraid"],
    sad: ["sad", "down", "depressed", "upset", "disappointed"],
    confident: ["confident", "ready", "excited", "motivated"],
    overwhelmed: ["overwhelmed", "stressed", "too much", "can't handle"],
  }

  const emotions: string[] = []
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      emotions.push(emotion)
    }
  })

  // Extract challenges
  const challengeKeywords = ["lost", "failed", "struggling", "difficult", "hard", "problem", "issue", "trouble"]
  const challenges = challengeKeywords.filter((keyword) => lowerMessage.includes(keyword))

  // Extract goals
  const goalKeywords = ["want to", "need to", "goal", "improve", "get better", "succeed"]
  const goals = goalKeywords.filter((keyword) => lowerMessage.includes(keyword))

  return { topics, emotions, challenges, goals }
}

// Process user message and update memory
export function processUserMessage(userId: string, message: string, userProfile?: any): UserMemory {
  const currentMemory = getUserMemory(userId)
  const insights = extractInsightsFromMessage(message)

  // Update personal info from profile
  if (userProfile) {
    currentMemory.personalInfo = {
      ...currentMemory.personalInfo,
      name: userProfile.name || currentMemory.personalInfo.name,
      sport: userProfile.sport || currentMemory.personalInfo.sport,
      grade: userProfile.grade || currentMemory.personalInfo.grade,
      school: userProfile.school || currentMemory.personalInfo.school,
      goals: userProfile.goals || currentMemory.personalInfo.goals,
    }
  }

  // Update conversation history
  currentMemory.conversationHistory.recentQuestions.unshift(message)
  if (currentMemory.conversationHistory.recentQuestions.length > 10) {
    currentMemory.conversationHistory.recentQuestions = currentMemory.conversationHistory.recentQuestions.slice(0, 10)
  }

  // Update topics
  insights.topics.forEach((topic) => {
    if (!currentMemory.conversationHistory.commonTopics.includes(topic)) {
      currentMemory.conversationHistory.commonTopics.push(topic)
    }
  })

  // Update emotional state
  if (insights.emotions.length > 0) {
    currentMemory.conversationHistory.emotionalState.unshift(...insights.emotions)
    if (currentMemory.conversationHistory.emotionalState.length > 20) {
      currentMemory.conversationHistory.emotionalState = currentMemory.conversationHistory.emotionalState.slice(0, 20)
    }
  }

  // Update insights
  if (insights.challenges.length > 0) {
    currentMemory.insights.growthAreas.push(...insights.challenges)
  }

  return updateUserMemory(userId, currentMemory)
}

// Generate memory-based context for AI
export function generateMemoryContext(userId: string): string {
  const memory = getUserMemory(userId)

  let context = "User Memory Context:\n"

  // Personal info
  if (memory.personalInfo.name) {
    context += `- Name: ${memory.personalInfo.name}\n`
  }
  if (memory.personalInfo.sport) {
    context += `- Sport: ${memory.personalInfo.sport}\n`
  }
  if (memory.personalInfo.grade) {
    context += `- Grade: ${memory.personalInfo.grade}\n`
  }

  // Recent conversation patterns
  if (memory.conversationHistory.commonTopics.length > 0) {
    context += `- Common discussion topics: ${memory.conversationHistory.commonTopics.join(", ")}\n`
  }

  if (memory.conversationHistory.recentQuestions.length > 0) {
    context += `- Recent questions (last 3): ${memory.conversationHistory.recentQuestions.slice(0, 3).join("; ")}\n`
  }

  // Emotional patterns
  if (memory.conversationHistory.emotionalState.length > 0) {
    const recentEmotions = memory.conversationHistory.emotionalState.slice(0, 5)
    context += `- Recent emotional state: ${recentEmotions.join(", ")}\n`
  }

  // Growth areas
  if (memory.insights.growthAreas.length > 0) {
    const uniqueGrowthAreas = [...new Set(memory.insights.growthAreas)]
    context += `- Areas they're working on: ${uniqueGrowthAreas.slice(0, 3).join(", ")}\n`
  }

  // Communication preferences
  context += `- Preferred communication style: ${memory.preferences.communicationStyle}\n`

  return context
}

// Track user interactions
export async function trackUserInteraction(interaction: UserInteraction): Promise<void> {
  try {
    const { userId, type, content, metadata = {}, tags = [] } = interaction

    if (!userInteractions[userId]) {
      userInteractions[userId] = []
    }

    userInteractions[userId].push({
      type,
      content,
      metadata,
      tags,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 100 interactions per user
    if (userInteractions[userId].length > 100) {
      userInteractions[userId] = userInteractions[userId].slice(-100)
    }

    // Process message for memory if it's a chat interaction
    if (type === "chat" && content) {
      processUserMessage(userId, content, metadata.userProfile)
    }
  } catch (error) {
    console.error("Error tracking user interaction:", error)
  }
}

// Store or update a user preference
export async function setUserPreference(userId: string, key: string, value: any): Promise<void> {
  try {
    if (!userPreferences[userId]) {
      userPreferences[userId] = []
    }

    // Remove existing preference with same key
    userPreferences[userId] = userPreferences[userId].filter((pref: any) => pref.key !== key)

    // Add new preference
    userPreferences[userId].push({
      userId,
      key,
      value,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error setting user preference:", error)
  }
}

// Update topic frequency and sentiment
export async function updateUserTopic(
  userId: string,
  topic: string,
  sentiment: "positive" | "neutral" | "negative" = "neutral",
): Promise<UserTopic | null> {
  const userTopics = userTopicsMemory.get(userId) || []
  const existingTopicIndex = userTopics.findIndex((t: any) => t.topic === topic)

  if (existingTopicIndex >= 0) {
    userTopics[existingTopicIndex] = {
      ...userTopics[existingTopicIndex],
      interactionCount: userTopics[existingTopicIndex].interactionCount + 1,
      lastInteracted: new Date().toISOString(),
      sentiment,
    }
  } else {
    userTopics.push({
      id: `${userId}-${topic}`,
      userId,
      topic,
      interactionCount: 1,
      lastInteracted: new Date().toISOString(),
      sentiment,
    })
  }

  userTopicsMemory.set(userId, userTopics)
  return userTopics[existingTopicIndex] || userTopics[userTopics.length - 1]
}

// Build personalization context
export async function buildPersonalizationContext(userId: string): Promise<PersonalizationContext> {
  try {
    const interactions = userInteractions[userId] || []
    const preferences = userPreferences[userId] || []
    const topics = await getFrequentUserTopics(userId)
    const memory = getUserMemory(userId)

    return {
      interactions,
      preferences,
      totalInteractions: interactions.length,
      recentInteractions: interactions.slice(-10),
      memory,
    }
  } catch (error) {
    console.error("Error building personalization context:", error)
    return {
      interactions: [],
      preferences: [],
      totalInteractions: 0,
      recentInteractions: [],
      memory: null,
    }
  }
}

// Extract personalization insights
export function extractPersonalizationInsights(context: PersonalizationContext): any {
  try {
    const { interactions = [], preferences = [], memory } = context

    // Extract topics from interactions
    const allTags = interactions.flatMap((i: any) => i.tags || [])
    const topicCounts = allTags.reduce((acc: any, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})

    const topInterests = Object.entries(topicCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([topic]) => topic)

    // Extract communication patterns
    const chatInteractions = interactions.filter((i: any) => i.type === "chat")
    const avgMessageLength =
      chatInteractions.length > 0
        ? chatInteractions.reduce((sum: number, i: any) => sum + (i.content?.length || 0), 0) / chatInteractions.length
        : 0

    let communicationStyle = "balanced"
    if (avgMessageLength < 50) communicationStyle = "direct"
    else if (avgMessageLength > 200) communicationStyle = "analytical"

    // Extract recent topics
    const recentTags = interactions
      .slice(-20)
      .flatMap((i: any) => i.tags || [])
      .filter((tag: string, index: number, arr: string[]) => arr.indexOf(tag) === index)
      .slice(0, 10)

    return {
      topInterests,
      communicationStyle,
      recentTopics: recentTags,
      totalInteractions: interactions.length,
      preferences: preferences.reduce((acc: any, pref: any) => {
        acc[pref.key] = pref.value
        return acc
      }, {}),
      memory: memory
        ? {
            commonTopics: memory.conversationHistory.commonTopics,
            recentEmotions: memory.conversationHistory.emotionalState.slice(0, 3),
            growthAreas: memory.insights.growthAreas.slice(0, 3),
            personalInfo: memory.personalInfo,
          }
        : null,
    }
  } catch (error) {
    console.error("Error extracting personalization insights:", error)
    return {
      topInterests: [],
      communicationStyle: "balanced",
      recentTopics: [],
      totalInteractions: 0,
      preferences: {},
      memory: null,
    }
  }
}

// Get user preferences
export async function getUserPreferences(userId: string): Promise<UserPreference[]> {
  try {
    return userPreferences[userId] || []
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return []
  }
}

// Get frequent user topics
export async function getFrequentUserTopics(
  userId: string,
  limit = 10,
): Promise<Array<{ topic: string; count: number }>> {
  try {
    const interactions = userInteractions[userId] || []
    const allTags = interactions.flatMap((i: any) => i.tags || [])

    const topicCounts = allTags.reduce((acc: any, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, count: count as number }))
  } catch (error) {
    console.error("Error getting frequent user topics:", error)
    return []
  }
}
