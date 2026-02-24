import type { OpenAI } from "openai"
import { NextResponse } from "next/server"
import { UPSIDE_AI_SYSTEM_PROMPT, getOpenAIInstance } from "@/lib/openai-service"
import { getApiKey } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[v0] SimpleAIChat API - Received message:", message.substring(0, 100))

    // Add API key validation before the OpenAI call:
    try {
      const apiKey = getApiKey()
      console.log("[v0] SimpleAIChat API - API_KEY is configured")
    } catch (error) {
      console.error("[v0] SimpleAIChat API - API_KEY validation failed:", error)
      return NextResponse.json({ error: "API configuration error. Please contact support." }, { status: 503 })
    }

    // Get OpenAI instance from our service
    let openai: OpenAI
    try {
      openai = getOpenAIInstance()
      console.log("[v0] SimpleAIChat API - OpenAI client initialized")
    } catch (error) {
      console.error("[v0] SimpleAIChat API - Error initializing OpenAI:", error)
      return NextResponse.json({ error: "AI service unavailable. Please try again later." }, { status: 503 })
    }

    // Prepare messages for the API call
    const messages = [
      {
        role: "system",
        content: UPSIDE_AI_SYSTEM_PROMPT,
      },
      { role: "user", content: message },
    ]

    // Call the OpenAI API with error handling
    try {
      console.log("[v0] SimpleAIChat API - Calling OpenAI...")
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      })

      // Extract and return the response
      const reply = completion.choices[0].message.content

      console.log("[v0] SimpleAIChat API - Response generated, length:", reply?.length || 0)
      return NextResponse.json({ reply })
    } catch (openaiError) {
      console.error("[v0] SimpleAIChat API - OpenAI error:", openaiError)
      return NextResponse.json(
        {
          error: "Error communicating with AI service",
          details: openaiError instanceof Error ? openaiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] SimpleAIChat API - General error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
