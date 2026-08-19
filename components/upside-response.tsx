"use client"

import { useMemo, type ReactNode } from "react"

interface UpsideResponseProps {
  content: string
}

// Render inline emphasis (**bold**) as real formatting and strip any stray asterisks/underscores.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const cleaned = text.replace(/\s*\*\s*(?=$|\s)/g, " ")
  const nodes: ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|__(.+?)__/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(cleaned.slice(lastIndex, match.index))
    }
    nodes.push(
      <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-white">
        {match[1] ?? match[2]}
      </strong>,
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < cleaned.length) {
    nodes.push(cleaned.slice(lastIndex))
  }

  // Remove any remaining lone asterisks left over from malformed markdown.
  return nodes.map((n) => (typeof n === "string" ? n.replace(/\*+/g, "") : n))
}

interface Block {
  type: "paragraph" | "list"
  // For paragraphs: a single string. For lists: an array of item strings.
  text?: string
  items?: string[]
}

// Group the raw reply into clean paragraphs and bullet lists (no visible markdown markers).
function parseBlocks(content: string): Block[] {
  const lines = content.split("\n")
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: [...list] })
      list = []
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    const bulletMatch = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/)
    if (bulletMatch) {
      flushParagraph()
      list.push(bulletMatch[1].trim())
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()

  return blocks
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
  const blocks = useMemo(() => parseBlocks(content), [content])

  return (
    <div>
      {/* Clean, open response text — real formatting, no visible markdown. */}
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-200">
        {blocks.map((block, bi) =>
          block.type === "list" ? (
            <ul key={`block-${bi}`} className="space-y-1.5">
              {block.items?.map((item, ii) => (
                <li key={`block-${bi}-item-${ii}`} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neon-400/70" />
                  <span>{renderInline(item, `block-${bi}-item-${ii}`)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p key={`block-${bi}`}>{renderInline(block.text ?? "", `block-${bi}`)}</p>
          ),
        )}
      </div>

      {/* A single, subtle next step — only when it's genuinely useful. */}
      {nextMove && (
        <div className="mt-3.5 flex items-start gap-2.5 border-l-2 border-neon-500/50 pl-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-neon-400/90">
              Your next move
              <span aria-hidden="true">&rarr;</span>
            </div>
            <div className="text-sm leading-relaxed text-gray-100">{renderInline(nextMove, "next-move")}</div>
          </div>
        </div>
      )}
    </div>
  )
}
