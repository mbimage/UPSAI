import { NextResponse } from "next/server"
import OpenAI from "openai"
import { env } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Check if OpenAI API key exists
    if (!env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please check your environment variables." },
        { status: 500 },
      )
    }

    try {
      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      })

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a tag extraction system. Extract 3-5 relevant tags from the given text.
            Focus on topics related to college athletics, academics, campus life, self-efficacy, emotional intelligence, 
            and career readiness. Return ONLY an array of lowercase tags without any explanation.
            Example output: ["confidence", "team-dynamics", "leadership", "career-prep"]`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      })

      const tagsContent = response.choices[0].message.content || "[]"

      // Parse the tags from the response
      let tags: string[] = []
      try {
        // Try to parse as JSON first
        tags = JSON.parse(tagsContent)
      } catch (e) {
        // If that fails, try to extract tags using regex
        const tagMatches = tagsContent.match(/"([^"]+)"/g)
        if (tagMatches) {
          tags = tagMatches.map((tag) => tag.replace(/"/g, ""))
        } else {
          // Last resort: split by commas and clean up
          tags = tagsContent
            .replace(/[[\]"']/g, "")
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        }
      }

      return NextResponse.json({ tags })
    } catch (aiError) {
      console.error("AI service error:", aiError)
      return NextResponse.json({ error: "Failed to extract tags", tags: [] }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in extract tags API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
        tags: [],
      },
      { status: 500 },
    )
  }
}
