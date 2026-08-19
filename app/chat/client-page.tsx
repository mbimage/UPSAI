"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, Menu, ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react"
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

export default function ClientChatPage({ initialMessage = "", conversationId }: ClientChatPageProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialMessage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile drawer (slide-over)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // Desktop collapse
  const [hasTitle, setHasTitle] = useState(false)
  const [sidebarKey, setSidebarKey] = useState(0) // Force sidebar refresh
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
      const fullMessage =
        "Hey, I'm UpSide, someone in your corner, 24/7. Whether you're building self-efficacy, strengthening emotional intelligence, preparing for your career, navigating college decisions, relationships, opportunities, or figuring out what comes next, I'm here for it. No forms, no script, so I'll get to know you as we talk. So what's going on with you right now?"

      // Show the complete message right away (it fades in) — no typewriter.
      setMessages([{ role: "assistant", content: fullMessage, id: welcomeId }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const messageId = Date.now().toString()
    const isFirstMessage = messages.length === 1 && messages[0].role === "assistant"
    setInput("")
    setError(null)

    const updatedMessages = [...messages, { role: "user" as const, content: userMessage, id: messageId }]
    setMessages(updatedMessages)
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
        // Reveal the full response at once (it fades in) — no typewriter.
        setMessages([...updatedMessages, { role: "assistant", content: data.message, id: assistantId }])
      } else {
        throw new Error("No response content received")
      }
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "Failed to get a response")
    } finally {
      setIsLoading(false)
    }
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
    setError(null)
    setCurrentSession(null)
    setHasTitle(false)

    setTimeout(() => {
      setSidebarKey((prev) => prev + 1)
    }, 400)

    setTimeout(() => {
      const welcomeId = Date.now().toString()
      const fullMessage =
        "Fresh start. What's on your mind: college, relationships, opportunities, career, or what comes next? Wherever you want to begin is good with me."

      // Show the complete message right away (it fades in) — no typewriter.
      setMessages([{ role: "assistant", content: fullMessage, id: welcomeId }])
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

  return (
    <div className="relative flex h-[100dvh] bg-midnight-950 text-foreground overflow-hidden">
      {/* Ambient "alive" background */}
      <AmbientBackground />

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
          isSidebarCollapsed ? "md:w-0 md:border-r-0" : "md:w-80",
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
          
          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <HumanSupport />
            {/* New Chat button */}
            <Button
              onClick={() => {
                startNewChat()
                inputRef.current?.focus()
              }}
              disabled={isCreatingNewChat || messages.length === 0}
              size="sm"
              className="bg-neon-500/20 hover:bg-neon-500/30 active:bg-neon-500/40 text-neon-300 border border-neon-500/30 flex-shrink-0 touch-manipulation h-9 px-2 md:px-3"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">New</span>
            </Button>
          </div>
        </header>

        {/* Messages Area - ChatGPT style centered layout */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
          <div
            className="max-w-3xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4 pb-4"
            role="log"
            aria-live="polite"
            aria-label="Conversation with UpSide"
          >
            {messages.map((message) => (
              <div key={message.id} className="group animate-fadeIn">
                {message.role === "user" ? (
                  // Compact, right-aligned gradient bubble.
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-neon-500/90 to-electric-500/90 px-4 py-2.5 text-white shadow-[0_0_18px_rgba(153,51,255,0.32)]">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ) : (
                  // Clean, open response text with a small UpSide icon — no card.
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(153,51,255,0.3)]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-neon-400"
                      >
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
                        <path
                          d="M9 16L14 11L19 16"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                    <div className="flex-1 min-w-0 pt-0.5">
                      <UpsideResponse content={message.content} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-fadeIn" role="status" aria-label="UpSide is thinking">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(153,51,255,0.5)] animate-pulse">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-neon-400"
                  >
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
                    <path
                      d="M9 16L14 11L19 16"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                <div className="flex items-center pt-1.5">
                  <span className="text-sm text-gray-400 animate-pulse">Thinking it through...</span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-900/20 border border-red-500/30 p-4 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - ChatGPT style sticky bottom */}
        <div className="sticky bottom-0 border-t border-neon-500/20 bg-midnight-900/95 backdrop-blur-md safe-area-bottom">
          <div className="max-w-3xl mx-auto px-3 md:px-6 py-3 md:py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="relative flex items-end gap-2"
            >
              {/* Input container with ChatGPT style */}
              <div className="relative flex-1 flex items-end bg-midnight-800 rounded-2xl border border-neon-500/20 focus-within:border-neon-500/40 focus-within:ring-1 focus-within:ring-neon-500/20 transition-all">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message UpSide AI..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 min-h-[48px] md:min-h-[52px] text-base px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
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
