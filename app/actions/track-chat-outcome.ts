"use server"

import { type OutcomeCategory, trackOutcomeMeasurement } from "@/lib/outcome-analytics"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeChatOutcome(
  userId: string,
  conversation: { role: string; content: string }[],
  category: OutcomeCategory,
) {
  try {
    // Use AI to analyze the conversation and estimate a score for the given category
    const prompt = `
      Analyze this conversation between a user and an AI assistant focused on personal development.
      Based on the conversation, estimate the user's current level in ${category.replace(/_/g, " ")} on a scale of 0-100.
      
      Conversation:
      ${conversation.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n")}
      
      Provide your analysis in JSON format with these fields:
      {
        "score": number between 0-100,
        "reasoning": brief explanation of your score,
        "evidence": specific examples from the conversation,
        "suggestions": 1-2 suggestions for improvement
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the AI response
    const analysisMatch = text.match(/\{[\s\S]*\}/)
    if (!analysisMatch) {
      throw new Error("Failed to parse AI analysis")
    }

    const analysis = JSON.parse(analysisMatch[0])

    // Track the outcome measurement
    const result = await trackOutcomeMeasurement({
      userId,
      category,
      score: analysis.score,
      source: "ai_analysis",
      metadata: {
        reasoning: analysis.reasoning,
        evidence: analysis.evidence,
        suggestions: analysis.suggestions,
        messageCount: conversation.length,
      },
    })

    return { success: true, result, analysis }
  } catch (error) {
    console.error("Error analyzing chat outcome:", error)
    return { success: false, error: "Failed to analyze chat outcome" }
  }
}
