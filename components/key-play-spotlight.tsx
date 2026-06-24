"use client"

import { useMemo, useState } from "react"
import { Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeyPlaySpotlightProps {
  content: string
}

interface Segment {
  text: string
  isKeyPlay: boolean
}

// Action-oriented keywords that signal a takeaway worth spotlighting.
const ACTION_KEYWORDS = [
  "try",
  "start",
  "focus",
  "practice",
  "remember",
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
  "reach out",
  "breathe",
  "rest",
  "drink",
  "sleep",
  "prioritize",
  "avoid",
  "keep",
  "use",
  "list",
  "track",
  "celebrate",
  "reflect",
  "commit",
  "show up",
  "step",
  "goal",
  "tip",
  "key",
  "next",
]

// Split text into sentence-like chunks while preserving their trailing punctuation/whitespace.
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?\n]+(?:[.!?]+|\n+|$)/g)
  return matches ? matches.filter((s) => s.trim().length > 0) : [text]
}

// Score a sentence for how "actionable" it is. Higher = more likely a key play.
function scoreSentence(sentence: string): number {
  const lower = sentence.toLowerCase().trim()
  let score = 0

  // Numbered or bulleted lines are usually concrete steps.
  if (/^\s*(\d+[.)]|[-*•])\s/.test(sentence)) score += 3

  // Imperative-ish opener (starts with an action verb).
  const firstWord = lower.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").split(/\s+/)[0] || ""
  if (ACTION_KEYWORDS.includes(firstWord)) score += 2

  // Contains action keywords anywhere.
  for (const kw of ACTION_KEYWORDS) {
    if (lower.includes(kw)) {
      score += 1
      break
    }
  }

  // "you" / "your" addressed advice tends to be the takeaway.
  if (/\byou(r)?\b/.test(lower)) score += 1

  // Penalize very long rambling sentences and very short fragments.
  const wordCount = lower.split(/\s+/).length
  if (wordCount >= 4 && wordCount <= 24) score += 1
  if (wordCount > 40) score -= 2

  return score
}

export function KeyPlaySpotlight({ content }: KeyPlaySpotlightProps) {
  const [focusMode, setFocusMode] = useState(false)

  const { segments, keyPlays } = useMemo(() => {
    const sentences = splitIntoSentences(content)

    // Score and pick the indices of the top 1-2 actionable sentences.
    const scored = sentences
      .map((text, index) => ({ index, score: scoreSentence(text) }))
      .filter((s) => s.score >= 2)
      .sort((a, b) => b.score - a.score)

    const keyCount = sentences.length <= 2 ? 0 : Math.min(2, scored.length)
    const keyIndices = new Set(scored.slice(0, keyCount).map((s) => s.index))

    const segs: Segment[] = sentences.map((text, index) => ({
      text,
      isKeyPlay: keyIndices.has(index),
    }))

    const plays = segs.filter((s) => s.isKeyPlay).map((s) => s.text.trim())

    return { segments: segs, keyPlays: plays }
  }, [content])

  const hasKeyPlays = keyPlays.length > 0

  return (
    <div>
      {/* Full message, rendered instantly. In focus mode, non-key text dims. */}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {segments.map((seg, i) =>
          seg.isKeyPlay ? (
            <mark
              key={i}
              className="rounded bg-neon-500/20 px-1 text-neon-200 shadow-[0_0_12px_rgba(34,197,94,0.25)] transition-colors"
            >
              {seg.text}
            </mark>
          ) : (
            <span
              key={i}
              className={cn(
                "transition-opacity duration-300",
                focusMode && hasKeyPlays ? "opacity-30" : "opacity-100",
              )}
            >
              {seg.text}
            </span>
          ),
        )}
      </div>

      {hasKeyPlays && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setFocusMode((f) => !f)}
            aria-pressed={focusMode}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all touch-manipulation",
              focusMode
                ? "border-neon-400/60 bg-neon-500/20 text-neon-200 shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                : "border-neon-500/30 bg-neon-500/10 text-neon-300 hover:border-neon-400/50 hover:bg-neon-500/20",
            )}
          >
            <Target className="h-3.5 w-3.5" />
            {focusMode ? "Exit focus" : "Focus on key plays"}
          </button>

          {/* Spotlight card surfaces the takeaways on their own when focusing. */}
          {focusMode && (
            <div className="mt-3 rounded-xl border border-neon-500/30 bg-midnight-950/60 p-3 shadow-[0_0_24px_rgba(34,197,94,0.18)]">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neon-400">
                <Zap className="h-3.5 w-3.5" />
                Key plays
              </div>
              <ul className="space-y-2">
                {keyPlays.map((play, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-neon-100">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neon-500/20 text-[11px] font-bold text-neon-300">
                      {i + 1}
                    </span>
                    <span>{play}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
