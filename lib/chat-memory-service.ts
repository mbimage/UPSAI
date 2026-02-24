/**
 * Chat Memory Layer Service
 * 
 * Provides intelligent memory management for conversations:
 * 1. Thread summary stored in DB per conversation
 * 2. Recent messages window (last 15)
 * 3. Prompt builder that assembles: system prompt + thread summary + recent messages + current message
 * 4. Summarizer that runs every 10 messages to update the summary
 */

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { env } from "@/lib/env"
import { UPSIDE_AI_SYSTEM_PROMPT } from "@/lib/openai-service"

// Configuration
export const MEMORY_CONFIG = {
  RECENT_MESSAGES_WINDOW: 15,      // Number of recent messages to include
  SUMMARIZE_EVERY_N_MESSAGES: 10,  // Run summarizer every N messages
  MAX_SUMMARY_LENGTH: 500,         // Max characters for summary
  MAX_TOKEN_ESTIMATE: 6000,        // Token budget for context
  AVG_CHARS_PER_TOKEN: 4,          // Rough token estimation
}

// Types
export interface AssembledPrompt {
  messages: { role: "system" | "user" | "assistant"; content: string }[]
  tokenEstimate: number
  includedMessageCount: number
  hasSummary: boolean
}

export interface ConversationContext {
  conversationId: string
  summary: string | null
  recentMessages: { role: "user" | "assistant"; content: string; createdAt: string }[]
  totalMessageCount: number
  needsSummarization: boolean
}

export interface SummaryResult {
  success: boolean
  summary?: string
  error?: string
}

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / MEMORY_CONFIG.AVG_CHARS_PER_TOKEN)
}

/**
 * Load conversation context from database
 * Returns summary + recent messages + metadata
 */
export async function loadConversationContext(
  conversationId: string,
  userId: string
): Promise<ConversationContext | null> {
  console.log("[v0] Memory: Loading context for conversation:", conversationId, "user:", userId)
  const supabase = await createServerSupabaseClient()
  
  // Get session with summary
  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("id, summary, messageCount")
    .eq("id", conversationId)
    .eq("userId", userId)
    .single()

  if (sessionError || !session) {
    console.log("[v0] Memory: Session not found or error:", sessionError?.message)
    return null
  }
  console.log("[v0] Memory: Loaded session, summary length:", session.summary?.length || 0, "messageCount:", session.messageCount)

  // Get recent messages (last N)
  const { data: messages, error: messagesError } = await supabase
    .from("chat_messages")
    .select("role, content, createdAt")
    .eq("sessionId", conversationId)
    .order("createdAt", { ascending: false })
    .limit(MEMORY_CONFIG.RECENT_MESSAGES_WINDOW)

  if (messagesError) {
    return null
  }

  // Reverse to get chronological order
  const recentMessages = (messages || [])
    .reverse()
    .map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: m.createdAt,
    }))

  // Calculate if summarization is needed
  const totalCount = session.messageCount || 0
  const needsSummarization = totalCount > 0 && 
    totalCount % MEMORY_CONFIG.SUMMARIZE_EVERY_N_MESSAGES === 0

  return {
    conversationId,
    summary: session.summary || null,
    recentMessages,
    totalMessageCount: totalCount,
    needsSummarization,
  }
}

/**
 * Build optimized prompt with memory layer
 * 
 * Structure:
 * 1. System prompt (always included)
 * 2. Thread summary (if available, as system context)
 * 3. Recent messages (as many as fit in token budget)
 * 4. Current user message
 */
export function buildPromptWithMemory(
  systemPrompt: string,
  summary: string | null,
  recentMessages: { role: "user" | "assistant"; content: string }[],
  currentMessage: string
): AssembledPrompt {
  const assembled: { role: "system" | "user" | "assistant"; content: string }[] = []
  let tokenCount = 0
  
  // 1. Always include the system prompt
  assembled.push({ role: "system", content: systemPrompt })
  tokenCount += estimateTokens(systemPrompt)
  
  // 2. Include thread summary if available
  if (summary && summary.trim().length > 0) {
    const summaryContext = `[CONVERSATION CONTEXT]\nPrevious conversation summary: ${summary}\n[END CONTEXT]`
    assembled.push({ role: "system", content: summaryContext })
    tokenCount += estimateTokens(summaryContext)
  }
  
  // Calculate remaining token budget
  const currentMessageTokens = estimateTokens(currentMessage)
  const reservedTokens = currentMessageTokens + 500 // Reserve for current message + response buffer
  let remainingBudget = MEMORY_CONFIG.MAX_TOKEN_ESTIMATE - tokenCount - reservedTokens
  
  // 3. Add recent messages (newest first priority, then reverse for chronological order)
  const messagesToInclude: { role: "user" | "assistant"; content: string }[] = []
  
  for (let i = recentMessages.length - 1; i >= 0; i--) {
    const msg = recentMessages[i]
    const msgTokens = estimateTokens(msg.content)
    
    if (remainingBudget - msgTokens < 0) {
      break // Token limit reached
    }
    
    messagesToInclude.unshift(msg)
    remainingBudget -= msgTokens
  }
  
  // Add messages to assembled prompt
  for (const msg of messagesToInclude) {
    assembled.push({ role: msg.role, content: msg.content })
    tokenCount += estimateTokens(msg.content)
  }
  
  // 4. Add current user message
  assembled.push({ role: "user", content: currentMessage })
  tokenCount += currentMessageTokens
  
  return {
    messages: assembled,
    tokenEstimate: tokenCount,
    includedMessageCount: messagesToInclude.length,
    hasSummary: !!summary && summary.trim().length > 0,
  }
}

/**
 * Generate a summary of the conversation
 * Called every N messages to update the thread summary
 */
export async function generateConversationSummary(
  conversationId: string,
  userId: string
): Promise<SummaryResult> {
  const apiKey = env.OPENAI_API_KEY
  
  if (!apiKey) {
    return { success: false, error: "No API key configured" }
  }

  const supabase = await createServerSupabaseClient()
  
  // Get existing summary and all messages for this conversation
  const { data: session } = await supabase
    .from("chat_sessions")
    .select("summary")
    .eq("id", conversationId)
    .eq("userId", userId)
    .single()

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("sessionId", conversationId)
    .order("createdAt", { ascending: true })
    .limit(50) // Limit to prevent token overflow

  if (!messages || messages.length === 0) {
    return { success: false, error: "No messages to summarize" }
  }

  // Build summarization prompt
  const existingSummary = session?.summary || ""
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n")

  const summaryPrompt = `You are a conversation summarizer. Create a concise summary of this conversation that captures:
1. The main topics discussed
2. Key concerns or challenges the user mentioned
3. Any goals or action items identified
4. The emotional tone and where the user is on their journey

${existingSummary ? `Previous summary to update: ${existingSummary}\n\n` : ""}

Conversation:
${conversationText}

Provide a summary in 2-3 sentences (max ${MEMORY_CONFIG.MAX_SUMMARY_LENGTH} characters). Focus on information that would help continue this conversation naturally.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant that creates concise conversation summaries." },
          { role: "user", content: summaryPrompt },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: `API error: ${response.status} - ${errorText}` }
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content?.trim() || ""

    if (!summary) {
      return { success: false, error: "Empty summary returned" }
    }

    // Truncate if too long
    const truncatedSummary = summary.length > MEMORY_CONFIG.MAX_SUMMARY_LENGTH
      ? summary.substring(0, MEMORY_CONFIG.MAX_SUMMARY_LENGTH - 3) + "..."
      : summary

    // Save summary to database
    const { error: updateError } = await supabase
      .from("chat_sessions")
      .update({ 
        summary: truncatedSummary,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .eq("userId", userId)

    if (updateError) {
      return { success: false, error: `Failed to save summary: ${updateError.message}` }
    }

    return { success: true, summary: truncatedSummary }
  } catch (error) {
    return { success: false, error: `Summarization failed: ${error}` }
  }
}

/**
 * Check if summarization should run and execute if needed
 * Called after saving a new message
 */
export async function checkAndRunSummarizer(
  conversationId: string,
  userId: string,
  currentMessageCount: number
): Promise<void> {
  console.log("[v0] Memory: Checking summarizer - messageCount:", currentMessageCount, "threshold:", MEMORY_CONFIG.SUMMARIZE_EVERY_N_MESSAGES)
  // Check if we've hit the summarization threshold
  if (currentMessageCount > 0 && currentMessageCount % MEMORY_CONFIG.SUMMARIZE_EVERY_N_MESSAGES === 0) {
    console.log("[v0] Memory: Running summarizer for conversation:", conversationId)
    // Run summarization in the background (don't await to avoid blocking response)
    generateConversationSummary(conversationId, userId)
      .then(result => {
        if (result.success) {
          console.log("[v0] Memory: Summary generated successfully, length:", result.summary?.length)
        } else {
          console.error(`[v0] Memory: Summarization failed for conversation ${conversationId}:`, result.error)
        }
      })
      .catch(err => {
        console.error(`[v0] Memory: Summarization error for conversation ${conversationId}:`, err)
      })
  }
}

/**
 * Main function to assemble the complete prompt for a chat request
 * This is the primary entry point for the memory layer
 */
export async function assemblePromptForChat(
  conversationId: string | null,
  userId: string | null,
  currentMessage: string,
  systemPrompt: string = UPSIDE_AI_SYSTEM_PROMPT
): Promise<AssembledPrompt> {
  console.log("[v0] Memory: assemblePromptForChat called - conversationId:", conversationId, "userId:", userId)
  
  // If no conversation ID or user, return basic prompt without memory
  if (!conversationId || !userId) {
    console.log("[v0] Memory: No conversation/user - returning basic prompt")
    return {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: currentMessage },
      ],
      tokenEstimate: estimateTokens(systemPrompt) + estimateTokens(currentMessage),
      includedMessageCount: 0,
      hasSummary: false,
    }
  }

  // Load conversation context
  const context = await loadConversationContext(conversationId, userId)
  
  if (!context) {
    console.log("[v0] Memory: Context not found - returning basic prompt")
    // Conversation not found or access denied - return basic prompt
    return {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: currentMessage },
      ],
      tokenEstimate: estimateTokens(systemPrompt) + estimateTokens(currentMessage),
      includedMessageCount: 0,
      hasSummary: false,
    }
  }

  console.log("[v0] Memory: Building prompt with context - recentMessages:", context.recentMessages.length, "hasSummary:", !!context.summary)
  // Build and return the assembled prompt
  return buildPromptWithMemory(
    systemPrompt,
    context.summary,
    context.recentMessages,
    currentMessage
  )
}

/**
 * Force regenerate summary for a conversation
 * Useful for admin tools or manual refresh
 */
export async function forceRegenerateSummary(
  conversationId: string,
  userId: string
): Promise<SummaryResult> {
  return generateConversationSummary(conversationId, userId)
}
