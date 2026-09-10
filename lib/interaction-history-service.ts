// Interaction History + Memory service for UpSide
// Separates two things on purpose:
//   1. conversation_insights = a timestamped record of what happened (history)
//   2. athlete_memory = only durable facts worth remembering for future chats
//
// Extraction runs in the background after a reply is sent, so it never blocks
// the athlete's response. All writes are owner-scoped (userId) and rely on RLS.

import { generateText } from "ai"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Model served through the Vercel AI Gateway (zero-config in v0 + Vercel)
const EXTRACTION_MODEL = "openai/gpt-4o-mini"

// Keep memory small and meaningful. Broad categories only, no scores or labels.
const MEMORY_CATEGORIES = [
  "goal",
  "interest",
  "relationship",
  "concern",
  "plan",
  "identity",
] as const

export interface ExtractedInsight {
  meaningful: boolean
  topic?: string
  goal?: string
  nextStep?: string
  campusResource?: string
  theme?: string
  memories?: { category: string; content: string }[]
}

export interface ConversationInsight {
  id: string
  userMessage: string | null
  upsideResponse: string | null
  topic: string | null
  goal: string | null
  nextStep: string | null
  campusResource: string | null
  theme: string | null
  createdAt: string
}

export interface AthleteMemory {
  id: string
  category: string | null
  content: string
  createdAt: string
}

const EXTRACTION_SYSTEM_PROMPT = `You quietly take notes for UpSide, an AI teammate for Texas JUCO college athletes (18+). After each exchange you decide what, if anything, is worth keeping.

You separate two things:
1. HISTORY: a short record of what this exchange was about. Save history only when the exchange had real substance (the athlete shared something about their life, a decision, a feeling, a plan, or asked a question that matters). Skip pure small talk, greetings, tests, and throwaway lines.
2. MEMORY: only durable facts that would make a FUTURE conversation better. Examples worth saving: "I want to transfer after this year", "I'm interested in physical therapy", "I want a better relationship with my coach", "I'm worried about life after basketball", "I planned to meet my advisor." Do NOT save random comments, one-off reactions, or anything that will not matter next week.

The JUCO experience moves fast. Common threads: playing time, coaches, academics, transfer decisions, career planning, relationships, confidence, campus life, adjusting to college, life after sport, and opportunities the athlete may not have considered.

Write everything in plain, warm language at about a high school senior reading level. No jargon, no clinical or corporate words, no labels or scores.

Return ONLY a valid JSON object with these exact keys:
{
  "meaningful": true or false,
  "topic": "a few words naming the broad topic",
  "goal": "the goal or question the athlete had, if any, else empty string",
  "nextStep": "a concrete next step if one came up, else empty string",
  "campusResource": "a campus resource mentioned if relevant (advisor, career services, coach, tutoring, etc), else empty string",
  "theme": "a useful recurring theme if one shows up, else empty string",
  "memories": [ { "category": "one of goal|interest|relationship|concern|plan|identity", "content": "one plain sentence worth remembering" } ]
}

If nothing is worth saving, return "meaningful": false and an empty "memories" array. Only include memories that are genuinely durable. Return ONLY the JSON, no other text.`

function safeParseExtraction(text: string): ExtractedInsight | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? jsonMatch[0] : text
    const parsed = JSON.parse(jsonString)
    return parsed as ExtractedInsight
  } catch {
    return null
  }
}

function cleanField(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "n/a") {
    return null
  }
  return trimmed
}

/**
 * Extract history + memory from a single exchange and store it.
 * Runs in the background. Owner-scoped by userId, guarded by RLS.
 */
export async function extractAndStoreInteraction(params: {
  conversationId: string | null
  userId: string
  userMessage: string
  upsideResponse: string
}): Promise<void> {
  const { conversationId, userId, userMessage, upsideResponse } = params

  if (!userId || !userMessage?.trim() || !upsideResponse?.trim()) {
    return
  }

  try {
    const { text } = await generateText({
      model: EXTRACTION_MODEL,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `ATHLETE: ${userMessage}\n\nUPSIDE: ${upsideResponse}`,
        },
      ],
      temperature: 0.3,
      maxOutputTokens: 400,
    })

    const extracted = safeParseExtraction(text)
    if (!extracted || !extracted.meaningful) {
      console.log("[v0] History: exchange not meaningful, skipping")
      return
    }

    const supabase = await createServerSupabaseClient()

    // 1. Store the history record (what happened)
    const { error: insightError } = await supabase.from("conversation_insights").insert({
      userId,
      sessionId: conversationId,
      userMessage: userMessage.substring(0, 2000),
      upsideResponse: upsideResponse.substring(0, 4000),
      topic: cleanField(extracted.topic),
      goal: cleanField(extracted.goal),
      nextStep: cleanField(extracted.nextStep),
      campusResource: cleanField(extracted.campusResource),
      theme: cleanField(extracted.theme),
      createdAt: new Date().toISOString(),
    })

    if (insightError) {
      console.error("[v0] History: failed to save insight:", insightError.message)
    }

    // 2. Store only durable memories, and avoid obvious duplicates
    const memories = Array.isArray(extracted.memories) ? extracted.memories : []
    if (memories.length > 0) {
      const { data: existing } = await supabase
        .from("athlete_memory")
        .select("content")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(50)

      const existingContents = new Set(
        (existing || []).map((m) => m.content.trim().toLowerCase()),
      )

      const rows = memories
        .map((m) => ({
          category: MEMORY_CATEGORIES.includes(m.category as (typeof MEMORY_CATEGORIES)[number])
            ? m.category
            : "interest",
          content: cleanField(m.content),
        }))
        .filter(
          (m): m is { category: string; content: string } =>
            !!m.content && !existingContents.has(m.content.trim().toLowerCase()),
        )
        .map((m) => ({
          userId,
          category: m.category,
          content: m.content.substring(0, 500),
          sourceSessionId: conversationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))

      if (rows.length > 0) {
        const { error: memoryError } = await supabase.from("athlete_memory").insert(rows)
        if (memoryError) {
          console.error("[v0] History: failed to save memory:", memoryError.message)
        } else {
          console.log("[v0] History: saved", rows.length, "new memories")
        }
      }
    }
  } catch (error) {
    // Background task: never throw into the request path
    console.error("[v0] History: extraction failed:", error)
  }
}

/**
 * Fire-and-forget wrapper so the chat route can call this without awaiting.
 */
export function queueInteractionExtraction(params: {
  conversationId: string | null
  userId: string
  userMessage: string
  upsideResponse: string
}): void {
  extractAndStoreInteraction(params).catch((error) => {
    console.error("[v0] History: background extraction error:", error)
  })
}

/**
 * Fetch recent history for an athlete (owner-scoped).
 */
export async function getInteractionHistory(
  userId: string,
  limit = 40,
): Promise<ConversationInsight[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("conversation_insights")
    .select("id, userMessage, upsideResponse, topic, goal, nextStep, campusResource, theme, createdAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] History: failed to fetch insights:", error.message)
    return []
  }
  return (data || []) as ConversationInsight[]
}

/**
 * Fetch durable memories for an athlete (owner-scoped).
 */
export async function getAthleteMemory(userId: string, limit = 50): Promise<AthleteMemory[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("athlete_memory")
    .select("id, category, content, createdAt")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] History: failed to fetch memory:", error.message)
    return []
  }
  return (data || []) as AthleteMemory[]
}

// ---------------------------------------------------------------------------
// Your UpSide: turn saved history + memory into five short, warm sections.
// ---------------------------------------------------------------------------

export interface UpsideSection {
  text: string
  talkPrompt: string
}

export interface YourUpsideSections {
  lately: UpsideSection
  nextUp: UpsideSection
  onYourRadar: UpsideSection
  lookingBack: UpsideSection
  lookingAhead: UpsideSection
}

export interface YourUpsideResult {
  sections: YourUpsideSections
  hasData: boolean
  // "empty"  = athlete has no saved history yet
  // "ok"     = sections generated from real history
  // "error"  = athlete has history, but we couldn't build the summary right now
  status: "empty" | "ok" | "error"
}

const YOUR_UPSIDE_MODEL = "openai/gpt-4o-mini"

const YOUR_UPSIDE_SYSTEM_PROMPT = `You write "Your UpSide", a short private reflection for a Texas JUCO college athlete (18+), using notes from their past conversations with UpSide. This belongs to the athlete alone.

Write like a trusted teammate texting them, at about a high school senior reading level. Warm, clear, concise, human, practical. No jargon, no clinical or corporate words, no scores or labels. Do not talk down to them. Keep the ideas thoughtful but the words simple.

Quietly lean on UpSide's frameworks without ever naming them: Event + Response = Outcome, self-efficacy (they have real power over their next move), emotional intelligence (naming what they feel), and career readiness (life during and after sport). Never turn these into tests, scores, courses, or labels.

The JUCO road moves fast: playing time, coaches, academics, transfer decisions, career planning, relationships, confidence, campus life, adjusting to college, life after sport, and opportunities they may not have considered.

The goal is simple: help them remember what matters, notice opportunities, prepare, act, and connect with real people. Never try to keep them in the app.

Write these five sections. Keep EACH to one to three short sentences:
- lately: what has been coming up in recent conversations.
- nextUp: things the athlete said they wanted to do.
- onYourRadar: opportunities, people, resources, or ideas worth exploring.
- lookingBack: helpful ways their thinking may have changed.
- lookingAhead: decisions or opportunities that may be coming next.

For each section also write a short "talkPrompt": a first-person message the athlete could send to start a chat about it (for example, "I want to talk more about my transfer decision"). Keep it natural and specific to them.

Return ONLY a valid JSON object with this exact shape:
{
  "lately": { "text": "...", "talkPrompt": "..." },
  "nextUp": { "text": "...", "talkPrompt": "..." },
  "onYourRadar": { "text": "...", "talkPrompt": "..." },
  "lookingBack": { "text": "...", "talkPrompt": "..." },
  "lookingAhead": { "text": "...", "talkPrompt": "..." }
}
If a section has nothing to draw from yet, write a short, kind line inviting them to start there, and a matching talkPrompt. Return ONLY the JSON, no other text.`

const EMPTY_SECTIONS: YourUpsideSections = {
  lately: {
    text: "Nothing here yet. Once you start talking with UpSide, this is where you'll see what's been on your mind.",
    talkPrompt: "I want to talk through something that's on my mind.",
  },
  nextUp: {
    text: "When you name something you want to do, it'll show up here so it doesn't slip away.",
    talkPrompt: "Help me figure out a next step I can take this week.",
  },
  onYourRadar: {
    text: "Ideas, people, and resources worth a look will land here as we talk.",
    talkPrompt: "What's something I might be overlooking right now?",
  },
  lookingBack: {
    text: "Over time, you'll be able to see how your thinking has grown.",
    talkPrompt: "I want to look back at how I've been handling things.",
  },
  lookingAhead: {
    text: "Big decisions and chances coming your way will show up here.",
    talkPrompt: "What decisions should I start getting ready for?",
  },
}

/**
 * Build the Your UpSide sections for an athlete from their saved history + memory.
 * Owner-scoped; no raw identifiers are ever exposed to the model or the client.
 */
export async function generateYourUpside(userId: string): Promise<YourUpsideResult> {
  const [history, memory] = await Promise.all([
    getInteractionHistory(userId, 40),
    getAthleteMemory(userId, 50),
  ])

  const hasData = history.length > 0 || memory.length > 0
  if (!hasData) {
    return { sections: EMPTY_SECTIONS, hasData: false, status: "empty" }
  }

  const memoryText = memory.length
    ? memory.map((m) => `- (${m.category ?? "note"}) ${m.content}`).join("\n")
    : "None saved yet."

  const historyText = history.length
    ? history
        .map((h) => {
          const when = new Date(h.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          const parts = [
            h.topic && `topic: ${h.topic}`,
            h.goal && `goal/question: ${h.goal}`,
            h.nextStep && `next step: ${h.nextStep}`,
            h.campusResource && `resource: ${h.campusResource}`,
            h.theme && `theme: ${h.theme}`,
          ].filter(Boolean)
          return `[${when}] ${parts.join(" | ")}`
        })
        .join("\n")
    : "No conversations recorded yet."

  const userContent = `WHAT THE ATHLETE HAS SHARED (memory, newest first):\n${memoryText}\n\nRECENT CONVERSATION NOTES (newest first):\n${historyText}`

  try {
    const { text } = await generateText({
      model: YOUR_UPSIDE_MODEL,
      system: YOUR_UPSIDE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
      temperature: 0.6,
      maxOutputTokens: 700,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const sections = JSON.parse(jsonMatch ? jsonMatch[0] : text) as YourUpsideSections
    return { sections, hasData: true, status: "ok" }
  } catch (error) {
    console.error("[v0] Your UpSide: generation failed:", error)
    // Athlete DOES have history; we just couldn't summarize it this moment.
    return { sections: EMPTY_SECTIONS, hasData, status: "error" }
  }
}
