"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Menu, Plus, Trash2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/seamless-auth-context"
import { getChatHistoryService } from "@/lib/chat-history-service"
import type { ChatSession } from "@/lib/chat-history-service"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  actionButton?: {
    label: string
    action: string
    context?: string
  }
}

interface ChatProps {
  initialMessage?: string
  apiEndpoint?: string
}

interface ChatGPTStyleChatProps {
  userId?: string
}

export function ChatGPTStyleChat({
  initialMessage,
  apiEndpoint = "/api/personalized-chat",
  userId,
}: ChatGPTStyleChatProps) {
  const { userId: authUserId } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        initialMessage ||
        "Hey! What can I help you with? Remember: E+R=O (Event + Response = Outcome) - you control your response!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Session management and history loading
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("upside_current_session_id")
  })
  const [userSessions, setUserSessions] = useState<ChatSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const chatHistoryService = getChatHistoryService()

  useEffect(() => {
    if (authUserId && authUserId !== "demo-user") {
      loadOrCreateSession()
    }
  }, [authUserId])

  const loadOrCreateSession = async () => {
    try {
      // Check if we have a current session ID
      const sessionId = localStorage.getItem("upside_current_session_id")

      if (sessionId) {
        // Load existing session messages
        const sessionMessages = await chatHistoryService.loadSession(sessionId)

        if (sessionMessages.length > 0) {
          const loadedMessages: Message[] = sessionMessages.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.createdAt),
            actionButton: msg.metadata?.actionButton,
          }))

          setMessages(loadedMessages)
          setCurrentSessionId(sessionId)
          console.log("[v0] Loaded chat history:", loadedMessages.length, "messages")
          return
        }
      }

      // No existing session, start fresh with welcome message
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            initialMessage ||
            "Hey! What can I help you with? Remember: E+R=O (Event + Response = Outcome) - you control your response!",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("[v0] Error loading chat history:", error)
    }
  }

  // Load user's past sessions when history opens
  useEffect(() => {
    if (isHistoryOpen && authUserId && authUserId !== "demo-user") {
      loadUserSessions()
    }
  }, [isHistoryOpen, authUserId])

  const loadUserSessions = async () => {
    setIsLoadingHistory(true)
    try {
      const sessions = await chatHistoryService.getUserSessions(authUserId)
      setUserSessions(sessions)
    } catch (error) {
      console.error("[v0] Error loading user sessions:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      const sessionMessages = await chatHistoryService.loadSession(sessionId)

      // Convert to Message format
      const loadedMessages: Message[] = sessionMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        actionButton: msg.metadata?.actionButton,
      }))

      setMessages(loadedMessages)
      setCurrentSessionId(sessionId)
      localStorage.setItem("upside_current_session_id", sessionId)
      setIsHistoryOpen(false)
    } catch (error) {
      console.error("[v0] Error loading session:", error)
    }
  }

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("Delete this conversation? This cannot be undone.")) {
      return
    }

    const success = await chatHistoryService.deleteSession(sessionId)
    if (success) {
      setUserSessions((prev) => prev.filter((s) => s.session_id !== sessionId))

      if (sessionId === currentSessionId) {
        setCurrentSessionId(null)
        localStorage.removeItem("upside_current_session_id")
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              initialMessage ||
              "Hey! What can I help you with? Remember: E+R=O (Event + Response = Outcome) - you control your response!",
            timestamp: new Date(),
          },
        ])
      }
    }
  }

  const startNewConversation = () => {
    setCurrentSessionId(null)
    localStorage.removeItem("upside_current_session_id")
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          initialMessage ||
          "Hey! What can I help you with? Remember: E+R=O (Event + Response = Outcome) - you control your response!",
        timestamp: new Date(),
      },
    ])
    console.log("[v0] Started new conversation")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const typewriterEffect = (messageId: string, fullText: string) => {
    let currentIndex = 0

    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: fullText.substring(0, currentIndex), isTyping: currentIndex < fullText.length }
              : msg,
          ),
        )
        currentIndex++

        if (currentIndex <= fullText.length) {
          typewriterTimeoutRef.current = setTimeout(typeNextChar, 20)
        } else {
          setTypingMessageId(null)
        }
      }
    }

    typeNextChar()
  }

  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    let sessionId = currentSessionId
    if (!sessionId && authUserId && authUserId !== "demo-user") {
      try {
        const session = await chatHistoryService.createSession(authUserId, userMessage.content)
        if (session) {
          sessionId = session.id
          setCurrentSessionId(sessionId)
          localStorage.setItem("upside_current_session_id", sessionId)
          console.log("[v0] Created new chat session:", sessionId)
        }
      } catch (error) {
        console.error("[v0] Error creating session:", error)
      }
    }

    if (sessionId && authUserId && authUserId !== "demo-user") {
      try {
        await chatHistoryService.saveMessage(authUserId, sessionId, "user", userMessage.content)
        console.log("[v0] Saved user message to history")
      } catch (error) {
        console.error("[v0] Error saving user message:", error)
      }
    }

    try {
      const messagesToSend = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      messagesToSend.push({
        role: "user",
        content: userMessage.content,
      })

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend,
          conversationId: currentSessionId || undefined,
          sessionHistory: messagesToSend.slice(0, -1),
          connectionStrength: "building",
          personalizationLevel: "medium",
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
        actionButton: data.actionButton,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTypingMessageId(assistantMessageId)

      typewriterEffect(assistantMessageId, data.reply)

      setTimeout(
        async () => {
          if (sessionId && authUserId && authUserId !== "demo-user") {
            try {
              await chatHistoryService.saveMessage(authUserId, sessionId, "assistant", data.reply, {
                actionButton: data.actionButton,
              })
              console.log("[v0] Saved assistant response to history")
            } catch (error) {
              console.error("[v0] Error saving assistant message:", error)
            }
          }
        },
        data.reply.length * 20 + 100,
      )
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {/* Chat History Sidebar - Always visible on desktop, toggleable on mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 z-40 lg:static lg:translate-x-0 ${
          isHistoryOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-foreground">Chat History</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsHistoryOpen(false)} className="h-8 w-8 p-0 lg:hidden">
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>

          <div className="p-2 border-b border-border">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent"
              onClick={startNewConversation}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Current session questions */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Current Session</h3>
              <div className="space-y-2">
                {messages.filter((msg) => msg.role === "user").length === 0 ? (
                  <p className="text-foreground/50 text-sm text-center py-4">No questions yet</p>
                ) : (
                  messages
                    .filter((msg) => msg.role === "user")
                    .map((message) => (
                      <div
                        key={message.id}
                        className="p-3 bg-card/50 rounded-lg border border-border hover:border-foreground/30 hover:bg-card transition-all cursor-pointer group"
                        onClick={() => {
                          const messageElement = document.getElementById(`msg-${message.id}`)
                          if (messageElement) {
                            messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
                            messageElement.classList.add("ring-2", "ring-foreground/50")
                            setTimeout(() => {
                              messageElement.classList.remove("ring-2", "ring-foreground/50")
                            }, 2000)
                          }
                          setIsHistoryOpen(false)
                        }}
                      >
                        <p className="text-sm text-foreground line-clamp-2 group-hover:line-clamp-none">
                          {message.content}
                        </p>
                        <p className="text-xs text-foreground/50 mt-1.5">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Past sessions */}
            {authUserId && authUserId !== "demo-user" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                  Past Conversations
                </h3>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                ) : userSessions.length === 0 ? (
                  <p className="text-foreground/50 text-sm text-center py-4">No past conversations</p>
                ) : (
                  <div className="space-y-2">
                    {userSessions.map((session) => (
                      <div
                        key={session.session_id}
                        className="p-3 bg-card/30 rounded-lg border border-border hover:border-foreground/30 hover:bg-card/50 transition-all cursor-pointer group"
                        onClick={() => loadSession(session.session_id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-2 group-hover:line-clamp-none">
                              {session.first_message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <p className="text-xs text-foreground/50">{session.message_count} messages</p>
                              <span className="text-foreground/30">•</span>
                              <p className="text-xs text-foreground/50">
                                {new Date(session.last_activity).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => deleteSession(session.session_id, e)}
                            className="p-1 hover:bg-destructive rounded text-destructive/50 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`flex items-center gap-2 ${isHistoryOpen ? "lg:hidden" : ""}`}
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">UpSide AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {messages.filter((m) => m.role === "user").length} questions
            </span>
          </div>
        </div>

        {/* Messages area - full width like ChatGPT */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={message.id}
                id={`msg-${message.id}`}
                className={`px-4 py-8 ${message.role === "assistant" ? "bg-card/50 backdrop-blur-sm" : ""} animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="max-w-3xl mx-auto flex gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-card text-foreground border border-foreground/30"
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-sm font-semibold">U</span>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-foreground"
                        >
                          <path
                            d="M5 10L8 7L11 10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground leading-7 whitespace-pre-wrap">
                      {message.content}
                      {message.isTyping && (
                        <span className="inline-block w-1 h-4 ml-1 bg-foreground animate-pulse"></span>
                      )}
                    </div>

                    {message.role === "assistant" && message.actionButton && !message.isTyping && (
                      <div className="mt-4">
                        <Button
                          onClick={() => {
                            console.log("[v0] Action button clicked:", message.actionButton)
                            // TODO: Implement action button functionality
                          }}
                          className="px-4 py-2 bg-background/10 hover:bg-background/20 border border-foreground/30 text-foreground rounded-lg text-sm font-medium transition-colors"
                        >
                          {message.actionButton.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="px-4 py-8 bg-card/50">
                <div className="max-w-3xl mx-auto flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-card text-foreground border border-foreground/30">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground"
                      >
                        <path
                          d="M5 10L8 7L11 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - fixed at bottom like ChatGPT */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message UpSide AI..."
                className="w-full p-4 pr-12 bg-card border border-border text-foreground placeholder-foreground/50 rounded-xl resize-none focus:outline-none focus:border-foreground/50 focus:shadow-lg focus:shadow-foreground/10 max-h-32 min-h-[56px] transition-all duration-300"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-foreground hover:bg-foreground/90 hover:scale-110 disabled:bg-border text-background disabled:text-foreground/50 rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-lg hover:shadow-foreground/30"
              >
                <Send className="h-5 w-5 text-background" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatGPTStyleChat
