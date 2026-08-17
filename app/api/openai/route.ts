import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Add system message if not present
    const messagesWithSystem = [...messages]
    if (!messagesWithSystem.some((msg) => msg.role === "system")) {
      messagesWithSystem.unshift({
        role: "system",
        content: `You are UpSide AI, a supportive AI teammate for college athletes across Texas.
  
Your mission is to help athletes develop:
- Self-efficacy and confidence
- Emotional intelligence
- Situational awareness ("reading the room")
- Career readiness and future planning

Be conversational, empathetic, and encouraging. Provide practical advice tailored to college athletes.
Focus on helping them navigate academics, relationships, opportunities, careers, and life on campus.`,
      })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messagesWithSystem,
      }),
    })

    const data = await response.json()

    // Return the complete OpenAI response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
