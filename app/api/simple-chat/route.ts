import { OpenAI } from "openai"
import { NextResponse } from "next/server"
import { env } from "@/lib/env"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

// Define the request handler for POST requests
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message, conversationHistory = [] } = await req.json()

    // Prepare messages for the API call
    const messages = [
      {
        role: "system",
        content: `You are UpSide AI, a supportive AI teammate for college athletes across Texas.
  
Your mission is to help athletes develop:
- Self-efficacy and confidence
- Emotional intelligence
- Situational awareness ("reading the room")
- Career readiness and future planning

Be conversational, empathetic, and encouraging. Provide practical advice tailored to college athletes.
Focus on helping them navigate academics, relationships, opportunities, careers, and life on campus.`,
      },
      ...conversationHistory,
      { role: "user", content: message },
    ]

    // Check for concerning content (reusing our existing safety feature)
    const concerningKeywords = [
      "suicide",
      "kill myself",
      "end my life",
      "don't want to live",
      "want to die",
      "harm myself",
      "hurt myself",
      "self-harm",
      // Additional keywords omitted for brevity
    ]

    const hasConcerningContent = concerningKeywords.some((keyword) => message.toLowerCase().includes(keyword))

    // Add safety instructions if concerning content is detected
    if (hasConcerningContent) {
      messages[0].content += `
      
IMPORTANT: The user has mentioned something that may indicate they're experiencing thoughts of self-harm or suicide. 

Your response MUST:
1. Express concern in a non-judgmental way
2. Emphasize that they deserve support from qualified professionals
3. Explicitly tell them that you're an AI and not a healthcare professional
4. Strongly encourage them to reach out to emergency services, a crisis hotline, or a trusted adult immediately
5. Mention that the interface will now show them specific resources they can contact`
    }

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    })

    // Extract and return the response
    const reply = completion.choices[0].message.content

    return NextResponse.json({
      reply,
      hasConcerningContent,
    })
  } catch (error) {
    // Handle errors
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Chat error", details: error.message }, { status: 500 })
  }
}
