"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Send,
  Sparkles,
  User,
  X,
  Maximize2,
  Mic,
  MicOff,
  Info,
  Lightbulb,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  id?: string
}

// Quick suggestions that appear above the input
const QUICK_SUGGESTIONS = [
  "How can I improve my leadership skills?",
  "I'm feeling nervous about my game",
  "How do I balance school and sports?",
  "Help me prepare for college",
]

export default function InstantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI teammate. How can I help you today?",
      id: "welcome-msg",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [showTips, setShowTips] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [hideMessages, setHideMessages] = useState(true)

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  // Load saved messages from local storage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("instantChatMessages")
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages)
          setHasInteracted(true)
        }
      }
    } catch (e) {
      console.error("Error loading saved messages:", e)
    }
  }, [])

  // Save messages to local storage when they change
  useEffect(() => {
    if (messages.length > 1 || hasInteracted) {
      localStorage.setItem("instantChatMessages", JSON.stringify(messages))
    }
  }, [messages, hasInteracted])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when component mounts or expands
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus()
    }
  }, [isExpanded])

  // Auto-expand on first visit if no interaction yet
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedChat")
    if (!hasVisited && !hasInteracted) {
      setTimeout(() => {
        setIsExpanded(true)
        localStorage.setItem("hasVisitedChat", "true")
      }, 1000)
    }
  }, [hasInteracted])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Show messages when sending a new message
    setHideMessages(false)

    const userMessage = input.trim()
    setInput("")
    setError(null)
    setHasInteracted(true)
    setShowTips(false)

    // Generate a unique ID for this message
    const messageId = `msg-${Date.now()}`

    // Add user message to chat
    const updatedMessages = [...messages, { role: "user", content: userMessage, id: messageId }]
    setMessages(updatedMessages)
    setIsLoading(true)

    // If offline, provide a graceful message
    if (!isOnline) {
      setTimeout(() => {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              "It looks like you're offline right now. I'll respond as soon as your connection is restored. In the meantime, you can continue typing your messages.",
            id: `offline-${Date.now()}`,
          },
        ])
        setIsLoading(false)
      }, 1000)
      return
    }

    try {
      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((msg) => msg.role !== "system") // Filter out system messages
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get a response")
      }

      const data = await response.json()

      // Add AI response to chat
      if (data.reply) {
        setMessages([...updatedMessages, { role: "assistant", content: data.reply, id: `reply-${Date.now()}` }])
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

  const goToFullChat = () => {
    // Store the current conversation in session storage
    sessionStorage.setItem("chatMessages", JSON.stringify(messages.filter((msg) => msg.role !== "system")))
    router.push("/chat")
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi there! I'm your AI teammate. How can I help you today?",
        id: `welcome-${Date.now()}`,
      },
    ])
    setHasInteracted(false)
    localStorage.removeItem("instantChatMessages")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    if (isExpanded) {
      inputRef.current?.focus()
    } else {
      setIsExpanded(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  const toggleVoiceInput = () => {
    if (!isRecording) {
      // Check if browser supports speech recognition
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        setError("Voice input is not supported in your browser. Try using Chrome or Edge.")
        return
      }

      setIsRecording(true)
      setIsExpanded(true)

      // Simulate voice recognition (in a real app, use the Web Speech API)
      setTimeout(() => {
        setIsRecording(false)
        setInput((prev) => prev + (prev ? " " : "") + "I need help with my leadership skills")
      }, 2000)
    } else {
      setIsRecording(false)
    }
  }

  return (
    <Card
      className={cn(
        "border border-neon-500/20 shadow-lg shadow-neon-500/5 transition-all duration-300 ease-in-out",
        isExpanded
          ? "fixed bottom-4 right-4 z-50 w-[90%] sm:w-[450px] h-[600px] max-h-[80vh]"
          : "w-full h-full relative",
      )}
    >
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 bg-amber-900/80 text-white text-xs py-1 px-3 text-center z-10">
          <WifiOff className="h-3 w-3 inline-block mr-1" /> You're offline. Chat will resume when connection is
          restored.
        </div>
      )}

      <CardHeader className="p-4 border-b border-neon-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center text-white">
          <Sparkles className="h-5 w-5 text-neon-400 mr-2" />
          Chat with UpSide AI
          {isOnline ? (
            <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-400 text-xs">
              <Wifi className="h-3 w-3 mr-1" /> Online
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-2 bg-amber-500/20 text-amber-400 text-xs">
              <WifiOff className="h-3 w-3 mr-1" /> Offline
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-neon-500/10"
                  onClick={clearChat}
                >
                  <Info className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear chat history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-neon-500/10"
                  onClick={() => setHideMessages(!hideMessages)}
                >
                  {hideMessages ? (
                    <Eye className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hideMessages ? "Show messages" : "Hide messages"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isExpanded ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-neon-500/10"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-neon-500/10"
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "p-0 overflow-y-auto",
          isExpanded ? "h-[calc(600px-130px)]" : "h-[300px]",
          !isExpanded && !hasInteracted && "flex items-center justify-center",
        )}
      >
        {!isExpanded && !hasInteracted ? (
          <div className="text-center p-6">
            <Sparkles className="h-12 w-12 text-neon-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Ready to chat?</h3>
            <p className="text-gray-400 mb-4">Get personalized guidance for your athletic and academic journey</p>
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
            >
              Start Chatting
            </Button>
          </div>
        ) : (
          <>
            {!hideMessages && (
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
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
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-neon-600 to-neon-700 text-white"
                            : "bg-midnight-800 text-gray-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex flex-row">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-electric-600 mr-2">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="p-3 rounded-lg bg-midnight-800 text-gray-100">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center">
                    <div className="p-3 rounded-lg bg-red-900/50 text-white border border-red-500/50 max-w-md">
                      <p className="text-sm">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-red-500/30 hover:bg-red-500/20 text-white"
                        onClick={() => sendMessage()}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}

                {showTips && isExpanded && !hasInteracted && (
                  <div className="bg-neon-500/10 border border-neon-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-neon-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-neon-400 mb-1">Tips for getting started:</h4>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                          <li>Ask about developing leadership skills</li>
                          <li>Get advice on balancing academics and athletics</li>
                          <li>Discuss strategies for managing pre-game anxiety</li>
                          <li>Explore career options that build on your athletic experience</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="p-3 border-t border-neon-500/10 flex-col">
        {isExpanded && (
          <div className="flex flex-wrap gap-2 mb-3 w-full">
            {QUICK_SUGGESTIONS.map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-midnight-800 hover:bg-neon-500/10 cursor-pointer border-neon-500/20 text-gray-300 hover:text-white transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 w-full">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="flex-1 bg-midnight-800 border-neon-500/20 text-white"
            disabled={isLoading || isRecording}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleVoiceInput}
                  className={cn(
                    "bg-midnight-800 border border-neon-500/20 hover:bg-neon-500/10",
                    isRecording && "bg-red-500/20 text-red-400 border-red-500/30",
                  )}
                  size="icon"
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRecording ? "Stop recording" : "Voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="link" className="w-full mt-2 text-neon-400 hover:text-neon-300" onClick={goToFullChat}>
          Go to full chat experience
        </Button>
      </CardFooter>
    </Card>
  )
}
