"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Plus, Menu, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/seamless-auth-context"
import { getChatHistoryService, type ChatSession } from "@/lib/chat-history-service"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import { KeyPlaySpotlight } from "@/components/key-play-spotlight"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Start closed on mobile
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
        "Hey, I'm UpSide, your teammate beyond the game. Whether you're building self-efficacy, strengthening emotional intelligence, preparing for your career, navigating college decisions, NIL, relationships, or figuring out life after sport, I'm here for it. No forms, no script, so I'll get to know you as we talk. So what's going on with you right now?"

      setMessages([{ role: "assistant", content: "", id: welcomeId }])

      let index = 0
      const interval = setInterval(() => {
        if (index < fullMessage.length) {
          setMessages([{ role: "assistant", content: fullMessage.slice(0, index + 1), id: welcomeId }])
          index++
        } else {
          clearInterval(interval)
        }
      }, 20)

      return () => clearInterval(interval)
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

    // Create a new conversation if needed (via API)
    let sessionId = currentSession?.id
    if (!sessionId && userId) {
      try {
        const createResponse = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: userMessage.substring(0, 100) }),
        })
        if (createResponse.ok) {
          const newSession = await createResponse.json()
          sessionId = newSession.id
          setCurrentSession({
            id: newSession.id,
            userId: userId,
            title: newSession.title,
            createdAt: newSession.createdAt,
            updatedAt: newSession.updatedAt,
            messageCount: 0,
          })
          // Navigate to the new conversation URL
          router.replace(`/chat/${newSession.id}`, { scroll: false })
          // Refresh the sidebar so the new conversation appears in "Your Conversations"
          setSidebarKey((prev) => prev + 1)
        }
      } catch (error) {
        console.error("Error creating session:", error)
      }
    }

    try {
      // Send message via secure API with conversationId for ownership validation
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: sessionId, // Pass conversationId for security
          hasTitle: hasTitle,
          isFirstMessage: isFirstMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get a response")
      }

      const data = await response.json()

      if (data.conversationTitle && !hasTitle && currentSession?.id) {
        setHasTitle(true)
        try {
          await chatHistoryService.updateSessionTitle(currentSession.id, data.conversationTitle, userId ?? undefined)
          // Refresh the sidebar so the auto-generated title shows up
          setSidebarKey((prev) => prev + 1)
        } catch (error) {
          console.error("Error updating session title:", error)
        }
      }

      if (data.message) {
        const assistantId = (Date.now() + 1).toString()
        const fullReply = data.message

        setMessages([...updatedMessages, { role: "assistant", content: "", id: assistantId }])

        let index = 0
        const typeInterval = setInterval(() => {
          if (index < fullReply.length) {
            index++
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantId ? { ...msg, content: fullReply.slice(0, index) } : msg)),
            )
          } else {
            clearInterval(typeInterval)
            if (currentSession?.id && userId) {
              chatHistoryService
                .saveMessage(userId, currentSession.id, "assistant", fullReply)
                .catch((error) => console.error("Error saving assistant message:", error))
            }
          }
        }, 15)
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
    if (e.key === "Enter" && !e.shiftKey) {
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
        "Fresh start. What's on your mind: college, NIL, your team, career, or life beyond the game? Wherever you want to begin is good with me."

      setMessages([{ role: "assistant", content: "", id: welcomeId }])

      let index = 0
      const interval = setInterval(() => {
        if (index < fullMessage.length) {
          setMessages([{ role: "assistant", content: fullMessage.slice(0, index + 1), id: welcomeId }])
          index++
        } else {
          clearInterval(interval)
          setIsCreatingNewChat(false)
          inputRef.current?.focus()
        }
      }, 20)
    }, 300)
  }

  const loadSession = async (sessionId: string) => {
    try {
      const sessionMessages = await chatHistoryService.loadSession(sessionId)
      if (sessionMessages.length > 0) {
        setMessages(
          sessionMessages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          })),
        )
        setCurrentSession({
          id: sessionId,
          userId: userId || "demo-user",
          title: sessionMessages[0].content.substring(0, 50),
          createdAt: sessionMessages[0].createdAt,
          updatedAt: sessionMessages[sessionMessages.length - 1].createdAt,
          messageCount: sessionMessages.length,
        })
        setHasTitle(true) // Track if conversation has a title
      }
    } catch (error) {
      console.error("Error loading session:", error)
    }
  }

  return (
    <div className="relative flex h-[100dvh] bg-midnight-950 text-foreground overflow-hidden">
      {/* Ambient "alive" background */}
      <AmbientBackground />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            const startX = touch.clientX
            const handleTouchMove = (moveEvent: TouchEvent) => {
              const currentX = moveEvent.touches[0].clientX
              if (startX - currentX > 50) {
                setIsSidebarOpen(false)
                document.removeEventListener('touchmove', handleTouchMove)
              }
            }
            document.addEventListener('touchmove', handleTouchMove, { passive: true })
            setTimeout(() => document.removeEventListener('touchmove', handleTouchMove), 300)
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - ChatGPT style */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-80 bg-midnight-900/95 backdrop-blur-md border-r border-neon-500/20 transition-transform duration-300 ease-out will-change-transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
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
            {/* Menu button - Mobile only */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2.5 -ml-1 hover:bg-neon-500/10 active:bg-neon-500/20 rounded-xl transition-colors touch-manipulation"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-neon-400" />
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
          <h1 className="text-sm md:text-lg font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent truncate max-w-[140px] sm:max-w-none">
            UpSide AI
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
          <div className="max-w-3xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
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
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-neon-500/90 to-electric-500/90 text-white shadow-[0_0_20px_rgba(153,51,255,0.4)]"
                        : "bg-midnight-900/80 text-gray-200 border border-neon-500/10"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <KeyPlaySpotlight content={message.content} />
                    ) : (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-electric-500/10 border border-electric-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,183,255,0.3)]">
                      <User className="h-4 w-4 text-electric-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
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
                <div className="rounded-2xl px-4 py-3 bg-midnight-900/80 border border-neon-500/10">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neon-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neon-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-neon-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-4 text-sm text-red-400">{error}</div>
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
            <p className="hidden md:block text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
