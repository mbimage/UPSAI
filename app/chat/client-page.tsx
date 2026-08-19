"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Menu, ArrowLeft, PanelLeftClose, PanelLeftOpen, Copy, Check, Wand2, ArrowRight, RefreshCw, Pencil } from "lucide-react"
import { useAuth } from "@/contexts/seamless-auth-context"
import { getChatHistoryService, type ChatSession } from "@/lib/chat-history-service"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { UpsideResponse } from "@/components/upside-response"
import { HumanSupport } from "@/components/human-support"
import { AmbientBackground } from "@/components/ambient-background"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

interface ClientChatPageProps {
  initialMessage?: string
  conversationId?: string
}

// Three calm starting points, shown in the welcome state before a conversation begins.
const STARTER_PROMPTS = [
  "Help me think through something",
  "Help me prepare for a conversation",
  "Help me write a message",
]

const WELCOME_MESSAGE =
  "Hey, I'm UpSide. Think of me as a teammate you can think out loud with. What's going on?"

// The UpSide "mark" (soft neon circle + chevron). Reused for the welcome hero,
// each assistant reply, and the thinking indicator so they stay consistent.
function UpsideMark({ className, pulse }: { className?: string; pulse?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(153,51,255,0.3)]",
        pulse && "animate-pulse",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[58%] h-[58%] text-neon-400">
        <circle
          cx="14"
          cy="14"
          r="11"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        <path d="M9 16L14 11L19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10 17L14 13L18 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  )
}

export default function ClientChatPage({ initialMessage = "", conversationId }: ClientChatPageProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialMessage)
  const [isLoading, setIsLoading] = useState(false)
  // A failed turn: the user's question is preserved so they can retry or edit it.
  // This is a transient UI-only state; it is never saved to conversation history.
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile drawer (slide-over)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // Desktop collapse
  const [hasTitle, setHasTitle] = useState(false)
  const [sidebarKey, setSidebarKey] = useState(0) // Force sidebar refresh
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyResponse = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000)
    } catch {
      // Clipboard can be unavailable; fail quietly.
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user, userId } = useAuth()
  const chatHistoryService = getChatHistoryService()

  useEffect(() => {
    async function loadConversation() {
      if (!userId) return

      try {
        // If a specific conversationId is provided via route, load that conversation
        if (conversationId) {
          const messagesResponse = await fetch(`/api/conversations/${conversationId}`)
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            
            if (messagesData.messages && messagesData.messages.length > 0) {
              setMessages(
                messagesData.messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                })),
              )
              setCurrentSession({
                id: conversationId,
                userId: userId,
                title: messagesData.title || messagesData.messages[0]?.content?.substring(0, 50) || "Conversation",
                createdAt: messagesData.createdAt || new Date().toISOString(),
                updatedAt: messagesData.updatedAt || new Date().toISOString(),
                messageCount: messagesData.messages.length,
              })
              setHasTitle(!!messagesData.title)
              return
            }
          }
        }

        // If no conversationId, load the latest conversation (for /chat route)
        const response = await fetch("/api/conversations")
        if (!response.ok) return
        
        const data = await response.json()
        if (data.conversations && data.conversations.length > 0) {
          const latestSession = data.conversations[0]
          
          // Load messages for the latest session via API
          const messagesResponse = await fetch(`/api/conversations/${latestSession.id}`)
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            
            if (messagesData.messages && messagesData.messages.length > 0) {
              setMessages(
                messagesData.messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                })),
              )
              setCurrentSession({
                id: latestSession.id,
                userId: userId,
                title: latestSession.title,
                createdAt: latestSession.createdAt,
                updatedAt: latestSession.updatedAt,
                messageCount: latestSession.messageCount,
              })
              setHasTitle(!!latestSession.title)
            }
          }
        }
      } catch (error) {
        console.error("Error loading conversation:", error)
      }
    }

    loadConversation()
  }, [userId, conversationId])

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeId = Date.now().toString()
      // Show the complete message right away (it fades in). No typewriter.
      setMessages([{ role: "assistant", content: WELCOME_MESSAGE, id: welcomeId }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // `isRetry` re-sends the last failed question WITHOUT appending a duplicate
  // user bubble (it's already on screen). Normal sends append a new user bubble.
  const sendMessage = async (overrideText?: string, isRetry = false) => {
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return

    const userMessage = text
    const messageId = Date.now().toString()

    // Clear any prior failure now that we're actively trying again.
    setFailedQuestion(null)

    let updatedMessages: Message[]
    if (isRetry) {
      // The user's question is already the last message on screen. Reuse it as-is
      // so Try again never produces a duplicate question.
      updatedMessages = messages
    } else {
      setInput("")
      updatedMessages = [...messages, { role: "user" as const, content: userMessage, id: messageId }]
      setMessages(updatedMessages)
    }

    const isFirstMessage =
      updatedMessages.length >= 1 &&
      updatedMessages.filter((m) => m.role === "user").length === 1

    setIsLoading(true)

    try {
      // The secure /api/chat endpoint owns conversation creation + persistence.
      // It saves the user message, generates the reply, saves it, and returns the
      // conversationId (existing or newly created) so follow-ups stay in-thread.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: currentSession?.id, // undefined => server creates one
          hasTitle,
          isFirstMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get a response")
      }

      const data = await response.json()

      // Capture the conversation the server used/created so every follow-up question
      // threads into the SAME conversation instead of starting a new chat.
      if (data.conversationId && data.conversationId !== currentSession?.id) {
        const now = new Date().toISOString()
        setCurrentSession({
          id: data.conversationId,
          userId: userId || "demo-user",
          title: data.conversationTitle || userMessage.substring(0, 50),
          createdAt: now,
          updatedAt: now,
          messageCount: updatedMessages.length,
        })
        // Update the URL in place (no remount) so the exchange stays on screen,
        // while refreshes and deep-links still resolve to this conversation.
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/chat/${data.conversationId}`)
        }
        setSidebarKey((prev) => prev + 1)
      }

      // The title is auto-generated + persisted server-side; just reflect it in the UI.
      if (data.conversationTitle && !hasTitle) {
        setHasTitle(true)
        setCurrentSession((prev) => (prev ? { ...prev, title: data.conversationTitle } : prev))
        setSidebarKey((prev) => prev + 1)
      }

      if (data.message) {
        const assistantId = (Date.now() + 1).toString()
        // Reveal the full response at once (it fades in). No typewriter.
        setMessages([...updatedMessages, { role: "assistant", content: data.message, id: assistantId }])
      } else {
        throw new Error("No response content received")
      }
    } catch (err) {
      console.error("[v0] Chat error:", err)
      // Keep the user's question on screen and remember it so they can retry or
      // edit it. We do NOT insert a fake assistant reply into the transcript.
      setFailedQuestion(userMessage)
    } finally {
      // Always reset the loading/streaming state, on success or failure.
      setIsLoading(false)
    }
  }

  // Re-send the exact failed question without adding a duplicate user bubble.
  const retryFailed = () => {
    if (!failedQuestion || isLoading) return
    sendMessage(failedQuestion, true)
  }

  // Move the failed question back into the input for editing, and drop it from
  // the transcript so it isn't duplicated when they resend.
  const editFailedQuestion = () => {
    if (!failedQuestion) return
    setInput(failedQuestion)
    setMessages((prev) => {
      const next = [...prev]
      // Remove the trailing user message (the one that failed).
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "user") {
          next.splice(i, 1)
          break
        }
      }
      return next
    })
    setFailedQuestion(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't submit mid-IME composition (CJK input); Safari's final event reports keyCode 229.
    if ((e.nativeEvent as any).isComposing || e.keyCode === 229) return
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewChat = async () => {
    if (currentSession?.id && messages.length > 1 && userId) {
      try {
        // Get the actual title if it was set, otherwise use first user message
        const sessionTitle = hasTitle
          ? currentSession.title
          : messages.find((m) => m.role === "user")?.content.substring(0, 50) || "New Conversation"

        const messageCount = messages.length

        // Update session metadata
        await chatHistoryService.updateSessionMetadata(currentSession.id, {
          messageCount,
          updatedAt: new Date().toISOString(),
        })

        // Ensure title is saved
        await chatHistoryService.updateSessionTitle(currentSession.id, sessionTitle)

        // Wait a bit for the database to process
        await new Promise((resolve) => setTimeout(resolve, 300))
      } catch (error) {
        console.error("Error saving session before new chat:", error)
      }
    }

    // Navigate to /chat (no conversationId) for new chat
    router.push("/chat")
    
    setIsCreatingNewChat(true)
    setMessages([])
    setInput("")
    setFailedQuestion(null)
    setCurrentSession(null)
    setHasTitle(false)

    setTimeout(() => {
      setSidebarKey((prev) => prev + 1)
    }, 400)

    setTimeout(() => {
      const welcomeId = Date.now().toString()
      // Show the complete message right away (it fades in). No typewriter.
      setMessages([{ role: "assistant", content: WELCOME_MESSAGE, id: welcomeId }])
      setIsCreatingNewChat(false)
      inputRef.current?.focus()
    }, 300)
  }

  const loadSession = async (sessionId: string) => {
    try {
      // Load via the secure API so ownership is enforced and the stored title is used.
      const response = await fetch(`/api/conversations/${sessionId}`)
      if (!response.ok) return

      const data = await response.json()
      const sessionMessages = data.messages || []

      setMessages(
        sessionMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })),
      )
      setCurrentSession({
        id: sessionId,
        userId: userId || "demo-user",
        title: data.conversation?.title || "Conversation",
        createdAt: data.conversation?.createdAt || new Date().toISOString(),
        updatedAt: data.conversation?.updatedAt || new Date().toISOString(),
        messageCount: sessionMessages.length,
      })
      setHasTitle(!!data.conversation?.title)
    } catch (error) {
      console.error("Error loading session:", error)
    }
  }

  // A conversation has "started" once the athlete has sent at least one message.
  // Before that we show a calm, compact welcome instead of a chat transcript.
  const conversationStarted = messages.some((m) => m.role === "user")

  return (
    <div className="relative flex h-[100dvh] bg-midnight-950 text-foreground overflow-hidden">
      {/* Ambient "alive" background. Calm at rest, near-solid once talking begins. */}
      <AmbientBackground dimmed={conversationStarted} />

      {/* Mobile overlay - tap anywhere to close the drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - ChatGPT style */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 bg-midnight-900/95 backdrop-blur-md border-r border-neon-500/20 transition-all duration-300 ease-out will-change-transform overflow-hidden",
          // Mobile: slide in/out as a drawer
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop: collapse to zero width instead of sliding away
          isSidebarCollapsed ? "md:w-0 md:border-r-0" : "md:w-64",
        )}
      >
        <ChatHistorySidebar
          key={sidebarKey}
          currentSessionId={currentSession?.id}
          onSessionSelect={(sessionId) => {
            loadSession(sessionId)
            setIsSidebarOpen(false) // Auto-close on mobile after selection
          }}
          onNewChat={() => {
            startNewChat()
            setIsSidebarOpen(false) // Auto-close on mobile after new chat
          }}
          userId={userId || "demo-user"}
          className="h-full"
        />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - Compact on mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 px-3 py-2 md:px-4 md:py-3 border-b border-neon-500/20 bg-midnight-900/80 backdrop-blur-md safe-area-top">
          <div className="flex items-center gap-1 md:gap-2">
            {/* Menu button - Mobile only (slide-over drawer) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2.5 -ml-1 hover:bg-neon-500/10 active:bg-neon-500/20 rounded-xl transition-colors touch-manipulation"
              aria-label="Open conversation history"
            >
              <Menu className="w-5 h-5 text-neon-400" />
            </button>
            {/* Collapse toggle - Desktop only */}
            <button
              onClick={() => setIsSidebarCollapsed((v) => !v)}
              className="hidden md:flex items-center justify-center p-2.5 -ml-1 hover:bg-neon-500/10 active:bg-neon-500/20 rounded-xl transition-colors"
              aria-label={isSidebarCollapsed ? "Expand conversation history" : "Collapse conversation history"}
              aria-expanded={!isSidebarCollapsed}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-neon-400" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-neon-400" />
              )}
            </button>
            {/* Home button */}
            <Button
              onClick={() => (window.location.href = "/")}
              variant="ghost"
              size="sm"
              className="hover:bg-neon-500/10 active:bg-neon-500/20 text-neon-400 border border-neon-500/20 hover:border-neon-500/40 transition-colors touch-manipulation h-9 px-2 md:px-3"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Home</span>
            </Button>
          </div>
          
          {/* Title - Centered */}
          <h1 className="text-sm md:text-lg font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent max-w-[140px] sm:max-w-none">
            Up
            <span className="relative bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
              Side
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-gradient-to-r from-neon-400 to-electric-400"
              />
            </span>
            {" AI"}
          </h1>
          
          {/* Right-side actions. New conversation lives in the sidebar; keep this lean. */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <HumanSupport />
          </div>
        </header>

        {/* Messages Area - ChatGPT style centered layout */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
          <div
            className="mx-auto max-w-[800px] px-4 md:px-6 py-4 md:py-6 pb-4"
            role="log"
            aria-live="polite"
            aria-label="Conversation with UpSide"
          >
            {!conversationStarted ? (
              // Compact, centered welcome instead of a big empty gradient panel.
              <div className="flex min-h-[54vh] flex-col items-center justify-center text-center animate-fadeIn">
                <UpsideMark className="mb-5 h-14 w-14" />
                <p className="max-w-lg text-pretty text-lg leading-relaxed text-gray-200 md:text-xl">
                  {WELCOME_MESSAGE}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-2.5" aria-label="Ways to get started">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-neon-500/25 bg-midnight-900/60 px-4 py-2 text-sm text-gray-200 transition-all hover:border-neon-500/50 hover:bg-neon-500/10 hover:text-white active:scale-95 touch-manipulation"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div key={message.id} className="group animate-fadeIn">
                    {message.role === "user" ? (
                      // Restrained purple bubble, right-aligned.
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-neon-500/80 px-4 py-2.5 text-white">
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    ) : (
                      // UpSide reply in a subtle dark card, with small contextual actions.
                      <div className="flex gap-3">
                        <UpsideMark className="mt-0.5 h-8 w-8 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="rounded-2xl rounded-tl-md border border-white/10 bg-midnight-900/70 px-4 py-3">
                            <UpsideResponse content={message.content} />
                          </div>
                          {index !== 0 && (
                            <div className="mt-2 flex flex-wrap items-center gap-1">
                              <button
                                type="button"
                                onClick={() => copyResponse(message.id, message.content)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-3.5 w-3.5 text-neon-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                                {copiedId === message.id ? "Copied" : "Copy"}
                              </button>
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => sendMessage("Can you help me make that sound more like me?")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                                Make it sound like me
                              </button>
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => sendMessage("Help me take the next step with this.")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                                Help me take the next step
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 animate-fadeIn" role="status" aria-label="UpSide is thinking">
                    <UpsideMark className="h-8 w-8 flex-shrink-0" pulse />
                    <div className="flex items-center pt-1.5">
                      <span className="text-sm text-gray-400 animate-pulse">Thinking it through...</span>
                    </div>
                  </div>
                )}

                {failedQuestion && !isLoading && (
                  // System error (NOT an assistant message). The user's question
                  // stays visible above; this is never saved to history.
                  <div
                    role="alert"
                    className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-4 py-3.5 animate-fadeIn"
                  >
                    <p className="text-sm leading-relaxed text-amber-200/90">
                      UpSide couldn&apos;t answer that just yet. Your question is still here.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        onClick={retryFailed}
                        size="sm"
                        className="h-8 gap-1.5 bg-neon-500/90 text-white hover:bg-neon-500"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Try again
                      </Button>
                      <Button
                        type="button"
                        onClick={editFailedQuestion}
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 border-white/15 bg-transparent text-gray-200 hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit question
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - ChatGPT style sticky bottom */}
        <div className="sticky bottom-0 border-t border-neon-500/20 bg-midnight-900/95 backdrop-blur-md safe-area-bottom">
          <div className="max-w-[800px] mx-auto px-3 md:px-6 py-3 md:py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="relative flex items-end gap-2"
            >
              {/* Inviting, high-contrast input container. */}
              <div className="relative flex-1 flex items-end bg-midnight-800 rounded-2xl border-2 border-neon-500/30 focus-within:border-neon-500/60 focus-within:ring-2 focus-within:ring-neon-500/20 shadow-lg shadow-black/20 transition-all">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything or think out loud…"
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-400 min-h-[48px] md:min-h-[52px] text-base px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoComplete="off"
                  enterKeyHint="send"
                />
              </div>
              
              {/* Send button */}
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className={cn(
                  "flex-shrink-0 w-12 h-12 md:w-[52px] md:h-[52px] rounded-xl transition-all duration-200 touch-manipulation",
                  input.trim()
                    ? "bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 active:scale-95 shadow-lg shadow-neon-500/25"
                    : "bg-midnight-800 text-gray-600 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
            
            {/* Helper text - hidden on mobile to save space */}
            <p className="hidden md:block text-xs text-gray-500 mt-2 text-center">Press Enter to send</p>
          </div>
        </div>
      </main>
    </div>
  )
}
