import OpenAI from "openai"
import { env } from "@/lib/env"
import {
  type FeedbackEntry,
  type ResponseImprovement,
  getImprovedResponsesForTags,
  storeImprovedResponse,
  updateImprovementMetrics,
} from "./feedback-service"
import { analyzeMessageContent } from "./personalized-ai-service"

// Create a singleton instance of the OpenAI client
let openaiInstance: OpenAI | null = null

export function getOpenAIInstance(): OpenAI {
  if (!openaiInstance) {
    const apiKey = env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OpenAI API key is not configured")
      throw new Error("OpenAI API key is not configured")
    }

    openaiInstance = new OpenAI({
      apiKey: apiKey,
      timeout: 30000, // 30 second timeout
    })
  }

  return openaiInstance
}

// Generate an improved response based on feedback
export async function generateImprovedResponse(
  feedback: FeedbackEntry,
  originalPrompt: string,
): Promise<string | null> {
  try {
    const openai = getOpenAIInstance()

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that improves responses based on user feedback. 
          You will be given an original prompt, the AI's response, and user feedback.
          Your task is to generate an improved version of the response that addresses the feedback.
          Focus on making the response more helpful, accurate, and tailored to the user's needs.`,
        },
        {
          role: "user",
          content: `Original prompt: "${originalPrompt}"
          
          AI response: "${feedback.aiResponse}"
          
          User feedback type: ${feedback.feedbackType}
          User feedback: ${feedback.feedbackText || "No specific feedback text provided"}
          
          Please generate an improved version of the AI response that addresses the feedback.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const improvedResponse = response.choices[0].message.content

    if (improvedResponse) {
      // Store the improved response
      await storeImprovedResponse({
        originalResponseId: feedback.messageId,
        improvedResponse,
        improvementReason: `Based on ${feedback.feedbackType} feedback: ${feedback.feedbackText || "No specific text"}`,
        appliedTags: feedback.tags,
      })
    }

    return improvedResponse
  } catch (error) {
    console.error("Error generating improved response:", error)
    return null
  }
}

// Check if there are improved responses for the current context
export async function checkForImprovedResponses(
  userMessage: string,
  userId: string,
): Promise<ResponseImprovement | null> {
  try {
    // Extract topics from the message
    const topics = await analyzeMessageContent(userMessage)

    if (topics.length === 0) {
      return null
    }

    // Get improved responses that match these topics
    const improvements = await getImprovedResponsesForTags(topics)

    if (improvements.length === 0) {
      return null
    }

    // Sort by success rate and return the best one
    improvements.sort((a, b) => b.successRate - a.successRate)
    return improvements[0]
  } catch (error) {
    console.error("Error checking for improved responses:", error)
    return null
  }
}

// Apply an improvement and track its usage
export async function applyImprovement(improvement: ResponseImprovement, wasSuccessful: boolean): Promise<void> {
  try {
    await updateImprovementMetrics(improvement.id!, wasSuccessful)
  } catch (error) {
    console.error("Error applying improvement:", error)
  }
}

// Learn from a batch of feedback
export async function batchLearnFromFeedback(feedbackEntries: FeedbackEntry[]): Promise<number> {
  let improvedCount = 0

  for (const feedback of feedbackEntries) {
    if (feedback.feedbackType === "not_helpful" || feedback.feedbackType === "partially_helpful") {
      try {
        // We would need the original prompt here, which we don't have in this example
        // In a real implementation, you would store the original prompt with the feedback
        const improvedResponse = await generateImprovedResponse(feedback, "Unknown original prompt")

        if (improvedResponse) {
          improvedCount++
        }
      } catch (error) {
        console.error(`Error learning from feedback ${feedback.id}:`, error)
      }
    }
  }

  return improvedCount
}

// Analyze feedback patterns to identify areas for improvement
export async function analyzeFeedbackPatterns(feedbackEntries: FeedbackEntry[]): Promise<any> {
  try {
    const openai = getOpenAIInstance()

    // Prepare feedback data for analysis
    const feedbackData = feedbackEntries.map((entry) => ({
      type: entry.feedbackType,
      text: entry.feedbackText || "No text provided",
      tags: entry.tags,
    }))

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes feedback patterns to identify areas for improvement.
          You will be given a collection of feedback entries, each with a type, text, and tags.
          Your task is to identify common patterns, areas for improvement, and specific recommendations.`,
        },
        {
          role: "user",
          content: `Please analyze the following feedback entries and identify patterns and areas for improvement:
          
          ${JSON.stringify(feedbackData, null, 2)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return {
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error analyzing feedback patterns:", error)
    return {
      analysis: "Error analyzing feedback patterns",
      timestamp: new Date().toISOString(),
    }
  }
}
