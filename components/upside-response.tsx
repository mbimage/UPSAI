"use client"

import { useMemo } from "react"

interface UpsideResponseProps {
  content: string
}

// Action verbs that signal a genuine, do-this-now next step.
const ACTION_VERBS = [
  "try",
  "start",
  "focus",
  "practice",
  "write",
  "set",
  "break",
  "take",
  "make",
  "build",
  "create",
  "schedule",
  "review",
  "plan",
  "ask",
  "talk",
  "reach",
  "breathe",
  "rest",
  "drink",
  "sleep",
  "prioritize",
  "keep",
  "use",
  "list",
  "track",
  "reflect",
  "commit",
  "step",
  "pick",
  "choose",
  "send",
  "email",
  "text",
  "jot",
  "map",
  "name",
  "identify",
  "block",
  "draft",
]

// Split text into sentence-like chunks, preserving meaningful content.
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?\n]+(?:[.!?]+|\n+|$)/g)
  return matches ? matches.filter((s) => s.trim().length > 0) : [text]
}

// Strip a leading list marker ("1.", "-", "•") for clean display.
function stripMarker(sentence: string): string {
  return sentence.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim()
}

// Find a single, genuinely actionable "next move" — or null when there isn't one worth surfacing.
function extractNextMove(content: string): string | null {
  const sentences = splitIntoSentences(content)

  // Short replies, questions, and check-ins shouldn't get a forced "next move."
  if (sentences.length < 3) return null

  let best: string | null = null
  let bestScore = 0

  for (const raw of sentences) {
    const s = raw.trim()
    if (!s || s.endsWith("?")) continue

    const isBulleted = /^\s*(\d+[.)]|[-*•])\s/.test(s)
    const lower = s.toLowerCase()
    const firstWord = lower.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").split(/\s+/)[0] || ""
    const isImperative = ACTION_VERBS.includes(firstWord)

    // A real "move" is either an imperative sentence or an explicit step.
    if (!isImperative && !isBulleted) continue

    let score = 0
    if (isImperative) score += 3
    if (isBulleted) score += 2
    if (/\byou(r)?\b/.test(lower)) score += 1

    const wordCount = lower.split(/\s+/).length
    if (wordCount >= 4 && wordCount <= 22) score += 1
    if (wordCount > 32) score -= 2

    if (score > bestScore) {
      bestScore = score
      best = stripMarker(s)
    }
  }

  // Only surface when it clears a meaningful bar.
  return bestScore >= 4 ? best : null
}

export function UpsideResponse({ content }: UpsideResponseProps) {
  const nextMove = useMemo(() => extractNextMove(content), [content])

  return (
    <div>
      {/* Clean, open response text — no card. */}
      <div className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-200">{content}</div>

      {/* A single, subtle next step — only when it's genuinely useful. */}
      {nextMove && (
        <div className="mt-3.5 flex items-start gap-2.5 border-l-2 border-neon-500/50 pl-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-neon-400/90">
              Your next move
              <span aria-hidden="true">&rarr;</span>
            </div>
            <div className="text-sm leading-relaxed text-gray-100">{nextMove}</div>
          </div>
        </div>
      )}
    </div>
  )
}
