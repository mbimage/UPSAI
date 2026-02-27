"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, User, Info, History, Plus } from "lucide-react"
import { ScenarioSuggestions } from "@/components/scenario-suggestions"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChatFeedback } from "@/components/chat-feedback"
import { TypewriterText } from "./typewriter-text"
import { ChatHistorySidebar } from "./chat-history-sidebar"
import { v4 as uuidv4 } from "uuid"
import {
  createChatSession,
  saveChatMessage,
  getChatSessions,
  getChatMessages,
  localChatHistory,
  type ChatSession,
} from "@/lib/chat-history-service"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
  conversationId?: string
  showFeedback?: boolean
  originalPrompt?: string
  timestamp?: string
}

interface PersonalizedChatProps {
  initialMessage?: string
  showPersonalizationIndicator?: boolean
  initialUserId?: string
}

export default function PersonalizedChat({
  initialMessage = "",
  showPersonalizationIndicator = true,
  initialUserId,
}: PersonalizedChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialMessage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personalizationLevel, setPersonalizationLevel] = useState<"low" | "medium" | "high">("low")
  const [conversationId, setConversationId] = useState<string>(uuidv4())
  const [typewriterMessages, setTypewriterMessages] = useState<Set<string>>(new Set())
  const [showHistory, setShowHistory] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [connectionStrength, setConnectionStrength] = useState<"building" | "connected" | "deeply_connected">(
    "building",
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const userId = initialUserId || user?.id

  // Load chat sessions on mount
  useEffect(() => {
    if (userId) {
      loadChatSessions()
    } else {
      // Load local sessions for demo users
      const localSessions = localChatHistory.getSessions()
      setChatSessions(localSessions)
    }
  }, [userId])

  // Load initial message from session storage if available
  useEffect(() => {
    const storedMessage = sessionStorage.getItem("initialMessage")
    if (storedMessage) {
      setInput(storedMessage)
      sessionStorage.removeItem("initialMessage")
    }

    // Focus the input if requested
    const shouldFocus = sessionStorage.getItem("focusMessageBox")
    if (shouldFocus === "true") {
      inputRef.current?.focus()
      sessionStorage.removeItem("focusMessageBox")
    }
  }, [])

  // Initialize with welcome message if no messages and no current session
  useEffect(() => {
    if (messages.length === 0 && !currentSession) {
      const welcomeMessageId = "welcome-initial"
      const welcomeMessage = {
        role: "assistant" as const,
        content: getPersonalizedWelcomeMessage(),
        id: welcomeMessageId,
        conversationId,
        timestamp: new Date().toISOString(),
      }

      setMessages([welcomeMessage])
    }
  }, [messages.length, conversationId, currentSession])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update personalization level and connection strength as conversation progresses
  useEffect(() => {
    const userMessageCount = messages.filter((m) => m.role === "user").length
    const totalSessions = chatSessions.length

    // Update personalization level
    if (userMessageCount > 15 || totalSessions > 5) {
      setPersonalizationLevel("high")
      setConnectionStrength("deeply_connected")
    } else if (userMessageCount > 5 || totalSessions > 2) {
      setPersonalizationLevel("medium")
      setConnectionStrength("connected")
    } else {
      setPersonalizationLevel("low")
      setConnectionStrength("building")
    }
  }, [messages, chatSessions])

  const loadChatSessions = async () => {
    if (!userId) return

    try {
      const sessions = await getChatSessions(userId)
      setChatSessions(sessions)
    } catch (error) {
      console.error("Error loading chat sessions:", error)
      // Fallback to local storage
      const localSessions = localChatHistory.getSessions()
      setChatSessions(localSessions)
    }
  }

  const loadChatSession = async (session: ChatSession) => {
    try {
      let sessionMessages: any[] = []

      if (userId) {
        sessionMessages = await getChatMessages(session.id)
      } else {
        sessionMessages = localChatHistory.getMessages(session.id)
      }

      // Convert to our message format
      const formattedMessages = sessionMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        id: msg.id,
        conversationId: session.id,
        timestamp: msg.createdAt,
        showFeedback: msg.role === "assistant",
      }))

      setMessages(formattedMessages)
      setCurrentSession(session)
      setConversationId(session.id)
      setShowHistory(false)
    } catch (error) {
      console.error("Error loading chat session:", error)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentSession(null)
    setConversationId(uuidv4())
    setShowHistory(false)

    // Add welcome message for new chat
    setTimeout(() => {
      const welcomeMessage = {
        role: "assistant" as const,
        content: getPersonalizedWelcomeMessage(),
        id: "welcome-new",
        conversationId: uuidv4(),
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }, 100)
  }

  const getPersonalizedWelcomeMessage = (): string => {
    const sessionCount = chatSessions.length

    if (sessionCount === 0) {
      return "Hey there! 👋 I'm your AI teammate, here to help you build confidence, emotional intelligence, and navigate life as a student-athlete. What's on your mind today?"
    } else if (sessionCount < 3) {
      return "Welcome back! 🌟 I'm getting to know you better with each conversation. What would you like to work on today?"
    } else {
      return "Great to see you again! 💪 Based on our previous chats, I'm here to continue supporting your growth. What's happening in your world today?"
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    console.log("[v0] PersonalizedChat - Sending message:", userMessage.substring(0, 50))
    setInput("")
    setError(null)

    const messageId = uuidv4()
    const timestamp = new Date().toISOString()

    // Create new session if this is the first message
    let sessionId = conversationId
    if (!currentSession && messages.filter((m) => m.role === "user").length === 0) {
      try {
        let newSession: ChatSession | null = null

        if (userId) {
          newSession = await createChatSession(userId, userMessage)
        } else {
          newSession = localChatHistory.createSession(userMessage)
        }

        if (newSession) {
          setCurrentSession(newSession)
          setConversationId(newSession.id)
          sessionId = newSession.id
          setChatSessions((prev) => [newSession!, ...prev])
        }
      } catch (error) {
        console.error("Error creating chat session:", error)
      }
    }

    // Add user message to chat
    const userMsg = {
      role: "user" as const,
      content: userMessage,
      id: messageId,
      conversationId: sessionId,
      timestamp,
    }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    // Save user message
    try {
      if (userId && currentSession) {
        await saveChatMessage(currentSession.id, "user", userMessage)
      } else if (currentSession) {
        localChatHistory.addMessage(currentSession.id, "user", userMessage)
      }
    } catch (error) {
      console.error("Error saving user message:", error)
    }

    try {
      console.log("[v0] PersonalizedChat - Calling /api/personalized-chat")

      // Send request to personalized API with enhanced context
      const response = await fetch("/api/personalized-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.filter((msg) => msg.role !== "system"),
          userId: userId || "demo-user",
          conversationId: sessionId,
          sessionHistory: chatSessions.slice(0, 5), // Include recent session context
          connectionStrength,
          personalizationLevel,
        }),
      })

      console.log("[v0] PersonalizedChat - Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] PersonalizedChat - Error response:", errorData)
        throw new Error(errorData.error || "Failed to get a response")
      }

      const data = await response.json()

      console.log("[v0] PersonalizedChat - Response data:", {
        hasReply: !!data.reply,
        replyLength: data.reply?.length,
        messageId: data.messageId,
      })

      // Add AI response to chat
      if (data.reply) {
        const aiMessageId = data.messageId || uuidv4()
        const aiTimestamp = new Date().toISOString()

        const aiMessage = {
          role: "assistant" as const,
          content: data.reply,
          id: aiMessageId,
          conversationId: sessionId,
          showFeedback: true,
          originalPrompt: userMessage,
          timestamp: aiTimestamp,
        }

        const finalMessages = [...updatedMessages, aiMessage]
        setMessages(finalMessages)

        // Enable typewriter for new AI responses
        setTypewriterMessages((prev) => new Set([...prev, aiMessageId]))

        // Save AI message
        try {
          if (userId && currentSession) {
            await saveChatMessage(currentSession.id, "assistant", data.reply)
          } else if (currentSession) {
            localChatHistory.addMessage(currentSession.id, "assistant", data.reply)
          }
        } catch (error) {
          console.error("Error saving AI message:", error)
        }

        // Update session list
        if (currentSession) {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.id === currentSession.id
                ? { ...session, updatedAt: aiTimestamp, lastMessage: data.reply.substring(0, 100) }
                : session,
            ),
          )
        }
        console.log("[v0] PersonalizedChat - Response added to chat successfully")
      } else {
        throw new Error("No response content received")
      }
    } catch (err) {
      console.error("[v0] PersonalizedChat - Error:", err)
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

  // Get personalization indicator color and tooltip
  const getPersonalizationColor = () => {
    switch (personalizationLevel) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getPersonalizationTooltip = () => {
    const sessionCount = chatSessions.length
    switch (connectionStrength) {
      case "deeply_connected":
        return `Deep connection: I know you well from ${sessionCount} conversations and can provide highly personalized support`
      case "connected":
        return `Good connection: Building understanding from ${sessionCount} conversations`
      default:
        return `Building connection: Getting to know you better with each message`
    }
  }

  const handleFeedbackSubmitted = (messageId: string, feedbackType: string, improvedResponse?: string) => {
    if (improvedResponse) {
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, content: improvedResponse, showFeedback: false } : msg,
        ),
      )
    } else {
      setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, showFeedback: false } : msg)))
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Chat History Sidebar - Always visible on desktop */}
      <div
        className={`transform transition-transform duration-300 z-10 lg:static lg:translate-x-0 ${
          showHistory ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <ChatHistorySidebar
          currentSessionId={currentSession?.id}
          onSessionSelect={loadChatSession}
          onNewChat={startNewChat}
          userId={userId}
          className="h-full"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 p-4 relative z-0">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-gray-400 hover:text-neon-400 lg:hidden"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button variant="ghost" size="sm" onClick={startNewChat} className="text-gray-400 hover:text-electric-400">
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>

          {showPersonalizationIndicator && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-midnight-800 text-xs">
                    <div className={`h-2 w-2 rounded-full ${getPersonalizationColor()}`}></div>
                    <span className="capitalize">{connectionStrength.replace("_", " ")}</span>
                    <Info className="h-3 w-3 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{getPersonalizationTooltip()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div key={message.id || index} className="space-y-1">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      message.role === "user" ? "bg-neon-600 ml-2" : "bg-electric-600 mr-2"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <Card
                    className={`p-3 ${
                      message.role === "user" ? "bg-neon-600 text-white" : "bg-midnight-800 text-gray-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.role === "assistant" && message.id && typewriterMessages.has(message.id) ? (
                        <TypewriterText
                          text={message.content}
                          speed={25}
                          className="text-gray-100"
                          onComplete={() => {
                            setTypewriterMessages((prev) => {
                              const newSet = new Set(prev)
                              newSet.delete(message.id!)
                              return newSet
                            })
                          }}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.timestamp && (
                      <div className="text-xs opacity-50 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    )}
                  </Card>
                </div>
              </div>

              {message.role === "assistant" && message.showFeedback && message.id && userId && (
                <div className="flex justify-start ml-10">
                  <ChatFeedback
                    messageId={message.id}
                    conversationId={message.conversationId || conversationId}
                    userId={userId}
                    aiResponse={message.content}
                    originalPrompt={message.originalPrompt || ""}
                    onFeedbackSubmitted={(feedbackType, improvedResponse) =>
                      handleFeedbackSubmitted(message.id!, feedbackType, improvedResponse)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-electric-600 mr-2">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <Card className="p-3 bg-midnight-800 text-gray-100">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <Card className="p-3 bg-red-900/50 text-white border border-red-500/50 max-w-md">
                <p className="text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-red-500/30 hover:bg-red-500/20 text-white bg-transparent"
                  onClick={() => sendMessage()}
                >
                  Retry
                </Button>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scenario Suggestions */}
        {messages.length > 0 && messages.length < 3 && (
          <div className="mb-4">
            <ScenarioSuggestions
              messageContent={messages[messages.length - 1]?.content}
              onSelectScenario={(scenario) => {
                setInput(`Can you help me with this scenario: ${scenario.title}? ${scenario.description}`)
              }}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-midnight-800 border-neon-500/20 text-white"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
