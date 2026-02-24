import OpenAI from "openai"
import { OPENAI_API_KEY } from "@/lib/env"

// Create a simple function to get the OpenAI client
export function getOpenAI() {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing")
  }

  return new OpenAI({
    apiKey: OPENAI_API_KEY,
  })
}

// Simple function to generate a chat response
export async function generateSimpleResponse(userMessage: string) {
  try {
    const openai = getOpenAI()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for athletes. Keep responses brief and practical.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw error
  }
}
