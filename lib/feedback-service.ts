interface FeedbackData {
  id: string
  userId: string
  messageId: string
  rating: number
  tags: string[]
  comment?: string
  timestamp: Date
}

interface ImprovedResponse {
  originalResponse: string
  improvedResponse: string
  tags: string[]
  improvementReason: string
  timestamp: Date
}

interface FeedbackStats {
  totalFeedback: number
  averageRating: number
  commonTags: string[]
  improvementTrends: { tag: string; count: number }[]
}

class FeedbackService {
  private replaceHeartSymbols(message: string): string {
    return message
      .replace(/❤️/g, "⭐") // Positive feedback
      .replace(/💖/g, "✨") // Excellent responses
      .replace(/💗/g, "💪") // Motivational content
      .replace(/💘/g, "🎯") // Goal-oriented feedback
  }

  processFeedback(feedback: string): string {
    const processedFeedback = this.replaceHeartSymbols(feedback)
    return processedFeedback
  }

  generateResponse(response: string): string {
    const processedResponse = this.replaceHeartSymbols(response)
    return processedResponse
  }
}

// Mock data storage (in production, this would be a database)
const mockFeedbackData: FeedbackData[] = []
const mockImprovedResponses: ImprovedResponse[] = []

export async function submitFeedback(
  userId: string,
  messageId: string,
  rating: number,
  tags: string[],
  comment?: string,
): Promise<void> {
  const feedback: FeedbackData = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    messageId,
    rating,
    tags,
    comment,
    timestamp: new Date(),
  }

  mockFeedbackData.push(feedback)
}

export async function getUserFeedback(userId: string): Promise<FeedbackData[]> {
  return mockFeedbackData.filter((feedback) => feedback.userId === userId)
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
  const totalFeedback = mockFeedbackData.length
  const averageRating = totalFeedback > 0 ? mockFeedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0

  const tagCounts: { [key: string]: number } = {}
  mockFeedbackData.forEach((feedback) => {
    feedback.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const commonTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const improvementTrends = commonTags.map((tag) => ({ tag, count: tagCounts[tag] }))

  return {
    totalFeedback,
    averageRating,
    commonTags,
    improvementTrends,
  }
}

export async function getCommonNegativeFeedbackTags(): Promise<string[]> {
  const negativeFeedback = mockFeedbackData.filter((f) => f.rating <= 2)
  const tagCounts: { [key: string]: number } = {}

  negativeFeedback.forEach((feedback) => {
    feedback.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
}

export async function storeImprovedResponse(
  originalResponse: string,
  improvedResponse: string,
  tags: string[],
  improvementReason: string,
): Promise<void> {
  const improved: ImprovedResponse = {
    originalResponse,
    improvedResponse,
    tags,
    improvementReason,
    timestamp: new Date(),
  }

  mockImprovedResponses.push(improved)
}

export async function getImprovedResponsesForTags(tags: string[]): Promise<ImprovedResponse[]> {
  return mockImprovedResponses.filter((response) => response.tags.some((tag) => tags.includes(tag)))
}

export async function updateImprovementMetrics(tags: string[]): Promise<void> {
  // In a real implementation, this would update metrics in the database
  console.log("Updating improvement metrics for tags:", tags)
}

export async function getMostImprovedTopics(): Promise<{ topic: string; improvementCount: number }[]> {
  const topicCounts: { [key: string]: number } = {}

  mockImprovedResponses.forEach((response) => {
    response.tags.forEach((tag) => {
      topicCounts[tag] = (topicCounts[tag] || 0) + 1
    })
  })

  return Object.entries(topicCounts)
    .map(([topic, improvementCount]) => ({ topic, improvementCount }))
    .sort((a, b) => b.improvementCount - a.improvementCount)
}

export default FeedbackService
