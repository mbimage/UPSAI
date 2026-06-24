// AI Service - Uses the Vercel AI Gateway via the AI SDK
// The gateway provides zero-config access to OpenAI models (no personal billing key required)

import { generateText } from "ai"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface ChatResponse {
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Model served through the Vercel AI Gateway
const CHAT_MODEL = "openai/gpt-4o"

// System prompt for UpSide AI
export const UPSIDE_AI_SYSTEM_PROMPT = `You are UpSide AI, a supportive coach for student-athletes and young professionals.

IDENTITY + PERSPECTIVE: 
You're someone who's been through high-level sports and school pressure and came out the other side. You speak with credibility, calm confidence, and understanding because you've lived it.

YOUR JOB: Recognize where the user is in life, then give empathetic, concrete steps.

TONE: Direct, warm, encouraging. No jargon. No moralizing. Keep bullets tight.

FRAMEWORKS YOU USE:

1. MASLOW'S HIERARCHY OF NEEDS
Always assess where the user is on the hierarchy and meet them there:
• Basic Needs: Are they eating, sleeping, physically safe?
• Safety/Security: Do they have stability in school, sports, relationships?
• Belonging: Do they feel connected to teammates, family, community?
• Self-Esteem: Are they building confidence through achievement?
• Self-Actualization: Are they reaching toward their full potential?

Start where they are. Don't jump to self-actualization if basic needs aren't met.

2. E+R=O FRAMEWORK (Event + Response = Outcome)
Help them see:
• Event: What happened (often outside their control)
• Response: How they choose to react (100% in their control)
• Outcome: The result of their choices

Focus on the Response - that's their power.

HOW TO RESPOND:
1. Show you get their situation (1-2 sentences) - speak from experience
2. Identify where they are on Maslow's hierarchy
3. Apply E+R=O - acknowledge the Event, focus on their Response options
4. Give 2-3 specific actions they can take now
5. Ask what feels doable

WHAT YOU DO:
• Balancing school, sports, and life
• Setting and hitting goals
• Managing time and stress
• Building confidence and social skills
• Planning for college and careers
• Developing leadership

KEEP IT REAL (BE HUMAN):
• Talk like a real person who's been there, not a textbook or a bot
• Use warm, everyday language - contractions, short sentences, the way a caring mentor actually talks
• Show genuine empathy first; name the feeling before jumping to solutions
• Focus on what they CAN do (Response), not what they should
• Break big things into small steps
• Celebrate wins, no matter how small
• Meet them where they are on the hierarchy
• Share wisdom from experience, not theory
• Never pretend to be a human or a licensed professional - you're a supportive teammate, and you're honest about that

GUIDE THEM TO REAL PEOPLE:
You are a starting point, not a replacement for human connection. For anything that matters, gently point them toward a real, trusted person in their life. Naturally suggest people like:
• A coach, teacher, or school counselor
• A parent, guardian, or trusted family member
• A mentor, pastor, or another caring adult
When something is heavy - big decisions, ongoing struggles, things they're scared to say out loud - encourage them, warmly and specifically, to talk it through with one of these people. Frame it as strength, not weakness: real teammates lean on their team.

SAFETY:
If a user expresses thoughts of self-harm, suicide, abuse, or being in danger, slow down and respond with calm, genuine care. Make clear you're glad they told you, that they're not alone, and that talking to a real person who can help is the most important next step right now. Encourage them to reach out to a trusted adult immediately and to contact the 988 Suicide & Crisis Lifeline (call or text 988 in the US) or text HOME to 741741 (Crisis Text Line). If they're in immediate danger, tell them to call 911. Stay supportive - never dismissive - and keep steering them toward real human help.

EXAMPLE:
User: "I'm failing math and coach is mad at me"
You: "I've been there - getting pressure from all sides feels like you're drowning. 

Event: Failing grade + coach pressure (not in your control right now)
Response: What you do next (totally in your control)

Right now you need some stability (safety/security level). Here's what worked for me:
• Talk to your teacher tomorrow - ask what you can do to bring your grade up
• Tell coach you're working on it - coaches respect effort, trust me
• Set aside 20 minutes after practice to catch up

Your response determines your outcome. Which of these feels most doable this week?"`

// Fallback responses used only when the AI Gateway is unreachable
const fallbackResponses = {
  greeting: [
    "Hey there! I'm here to support you on your journey as a student-athlete. What's on your mind today?",
    "Welcome! I'm your AI teammate, ready to help you tackle whatever challenges you're facing. How can I support you?",
    "Hi! I'm here to help you develop the life skills that will make you successful both on and off the field. What would you like to work on?",
  ],
  motivation: [
    "Remember, every champion was once a beginner who refused to give up. Your journey is unique, and every step forward matters.",
    "Your potential is limitless. Focus on progress, not perfection, and celebrate every small victory along the way.",
    "Challenges are opportunities in disguise. Each obstacle you overcome makes you stronger and more resilient.",
  ],
  goals: [
    "Great goals start with clear vision. What does success look like for you, and what's one step you can take today?",
    "Break your big dreams into smaller, actionable steps. Progress happens one day at a time.",
    "Your goals are valid and achievable. Let's create a plan that works with your schedule and resources.",
  ],
  stress: [
    "It's normal to feel overwhelmed sometimes. Let's break things down into manageable pieces and tackle them one at a time.",
    "Remember to breathe and focus on what you can control. You don't have to handle everything at once.",
    "Stress often means you care deeply about something. Let's channel that energy into positive action.",
  ],
  general: [
    "I'm here to help you succeed both on and off the field. What's the biggest challenge you're facing right now?",
    "Every student-athlete faces unique challenges. What would be most helpful for you to work on today?",
    "Your success matters, and I'm here to support you. What's one area where you'd like to grow?",
  ],
}

// Split a messages array into a system prompt + conversation turns for the AI SDK
function splitMessages(
  messages: ChatMessage[],
  defaultSystem: string,
): { system: string; turns: ChatMessage[] } {
  const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content)
  const turns = messages.filter((m) => m.role !== "system")
  const system = systemParts.length > 0 ? systemParts.join("\n\n") : defaultSystem
  return { system, turns }
}

// Test gateway connection by making a tiny generation
export async function testOpenAIConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await generateText({
      model: CHAT_MODEL,
      prompt: "ping",
      maxOutputTokens: 5,
    })
    return { connected: true }
  } catch (error) {
    return { connected: false, error: `Connection error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

// Generate a single-turn chat response
export async function generateChatResponse(
  message: string,
  systemPrompt: string = UPSIDE_AI_SYSTEM_PROMPT,
): Promise<ChatResponse> {
  const { text, usage } = await generateText({
    model: CHAT_MODEL,
    system: systemPrompt,
    messages: [{ role: "user", content: message }],
    temperature: 0.7,
    maxOutputTokens: 800,
  })

  return {
    message: text || "I'm here to help you succeed. What's on your mind?",
    usage: usage
      ? {
          prompt_tokens: usage.inputTokens ?? 0,
          completion_tokens: usage.outputTokens ?? 0,
          total_tokens: usage.totalTokens ?? 0,
        }
      : undefined,
  }
}

// Generate a chat response with full conversation history.
// Throws on genuine API errors so callers can distinguish real failures from real answers.
export async function generateChatResponseWithHistory(
  messages: ChatMessage[],
  systemPrompt?: string,
): Promise<ChatResponse> {
  const { system, turns } = splitMessages(messages, systemPrompt || UPSIDE_AI_SYSTEM_PROMPT)

  const { text, usage } = await generateText({
    model: CHAT_MODEL,
    system,
    messages: turns,
    temperature: 0.7,
    maxOutputTokens: 1000,
  })

  return {
    message: text || "I'm here to support you. What would you like to talk about?",
    usage: usage
      ? {
          prompt_tokens: usage.inputTokens ?? 0,
          completion_tokens: usage.outputTokens ?? 0,
          total_tokens: usage.totalTokens ?? 0,
        }
      : undefined,
  }
}

// Generate a fallback response (used only when the gateway is unreachable)
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  let category = "general"

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    category = "greeting"
  } else if (lowerMessage.includes("goal") || lowerMessage.includes("plan") || lowerMessage.includes("achieve")) {
    category = "goals"
  } else if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("pressure") ||
    lowerMessage.includes("overwhelm")
  ) {
    category = "stress"
  } else if (
    lowerMessage.includes("motivat") ||
    lowerMessage.includes("inspire") ||
    lowerMessage.includes("encourage")
  ) {
    category = "motivation"
  }

  const responses = fallbackResponses[category as keyof typeof fallbackResponses]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Compatibility helper
export function getOpenAIInstance(): { apiKey: string | null; connected: boolean } {
  return {
    apiKey: "gateway",
    connected: true,
  }
}

interface ChatResponseWithPersistence extends ChatResponse {
  conversationTitle?: string
  sessionSummary: string
}

export async function generateChatResponseWithPersistence(
  message: string,
  hasTitle: boolean,
  isFirstMessage: boolean,
): Promise<ChatResponseWithPersistence> {
  const persistencePrompt = `${UPSIDE_AI_SYSTEM_PROMPT}

PERSISTENCE CONTRACT:
- ${!hasTitle && isFirstMessage ? "Generate a short conversation_title (3-6 words) from this first message." : "DO NOT generate a conversation_title (already set)."}
- On every turn, return a compact session_summary (one sentence about the conversation focus).
- Also return the normal reply (the user-facing guidance).

IMPORTANT: Return your response in valid JSON format only, with these exact keys:
{
  "reply": "your supportive response to the user",
  ${!hasTitle && isFirstMessage ? '"conversationTitle": "short descriptive title",' : ""}
  "sessionSummary": "one sentence summary of conversation focus"
}

Return ONLY the JSON object, no other text.`

  const { text, usage } = await generateText({
    model: CHAT_MODEL,
    system: persistencePrompt,
    messages: [{ role: "user", content: message }],
    temperature: 0.7,
    maxOutputTokens: 1000,
  })

  const normalizedUsage = usage
    ? {
        prompt_tokens: usage.inputTokens ?? 0,
        completion_tokens: usage.outputTokens ?? 0,
        total_tokens: usage.totalTokens ?? 0,
      }
    : undefined

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? jsonMatch[0] : text
    const parsed = JSON.parse(jsonString)

    return {
      message: parsed.reply || "I'm here to support you. What would you like to talk about?",
      conversationTitle: parsed.conversationTitle,
      sessionSummary: parsed.sessionSummary || "General conversation",
      usage: normalizedUsage,
    }
  } catch {
    return {
      message: text || "I'm here to support you. What would you like to talk about?",
      sessionSummary: `User asked: ${message.substring(0, 50)}...`,
      usage: normalizedUsage,
    }
  }
}

// AI service instance
export const openaiService = {
  generateChatResponse,
  generateChatResponseWithHistory,
  generateChatResponseWithPersistence,
  testConnection: testOpenAIConnection,
  getInstance: getOpenAIInstance,
}

// Exported for callers that want graceful degradation
export { generateFallbackResponse }

// Export types
export type { ChatMessage, ChatResponse, ChatResponseWithPersistence }
