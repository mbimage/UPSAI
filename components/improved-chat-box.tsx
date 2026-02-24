"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Trash2, MessageSquare, Sparkles, AlertTriangle, RefreshCw } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { trackFeatureUsage, trackButtonClick } from "@/lib/analytics"

interface ChatMessage {
  role: "user" | "assistant" | "system" | "error"
  content: string
}

interface ImprovedChatBoxProps {
  apiEndpoint?: string
  fallbackApiEndpoint?: string
}

export function ImprovedChatBox({
  apiEndpoint = "/api/chat",
  fallbackApiEndpoint = "/api/fallback-chat",
}: ImprovedChatBoxProps) {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("improved-chat-history", [])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<"idle" | "error" | "success">("idle")
  const [useFallbackApi, setUseFallbackApi] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Track component mount
  useEffect(() => {
    trackFeatureUsage("chat_opened")
    return () => {
      trackFeatureUsage("chat_closed")
    }
  }, [])

  // Suggested prompts for users to get started
  const suggestions = [
    "How can I improve my confidence before a big game?",
    "What are some strategies for balancing school and sports?",
    "How do I communicate better with my coach?",
    "What should I do if I'm feeling overwhelmed?",
    "How can I develop leadership skills as an athlete?",
  ]

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = input.trim()
    const newUserMessage = { role: "user" as const, content: userMessage }

    // Add to messages state
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setLoading(true)

    // Track message sent
    trackFeatureUsage("chat_message_sent", { messageLength: userMessage.length })

    // Get all messages that should be sent to the API (excluding error messages)
    const apiMessages = messages.filter((msg) => msg.role !== "error").concat(newUserMessage)

    try {
      // Determine which API endpoint to use
      const endpoint = useFallbackApi ? fallbackApiEndpoint : apiEndpoint

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          message: userMessage, // For backward compatibility
        }),
      })

      // Check if the response is ok first
      if (!response.ok) {
        // For error responses, try to get error details from JSON if possible
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.details || `Error: ${response.status}`)
        } catch (jsonError) {
          // If JSON parsing fails, just use the status text
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
      }

      // For successful responses, parse the JSON
      const data = await response.json()

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      setApiStatus("success")
      setRetryCount(0) // Reset retry count on success

      // Track successful response
      trackFeatureUsage("chat_response_received", { responseLength: data.reply.length })
    } catch (err) {
      console.error("Chat error:", err)
      setApiStatus("error")

      // If we're not already using the fallback API and this is our first retry
      if (!useFallbackApi && retryCount === 0) {
        setRetryCount(1)
        setUseFallbackApi(true)

        // Try again with fallback API
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: "Switching to offline mode due to connectivity issues...",
          },
        ])

        // Retry with the same message
        setTimeout(() => {
          handleSendMessage()
        }, 1000)

        return
      }

      const errorMessage =
        err instanceof Error ? `Error: ${err.message}` : "Sorry, I encountered an error. Please try again later."

      setMessages((prev) => [...prev, { role: "error", content: errorMessage }])

      // Track error
      trackFeatureUsage("chat_error", {
        error: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setLoading(false)
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleRetry = () => {
    // Remove the last error message
    setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1))

    // Reset API status
    setApiStatus("idle")

    // Try again with the original API
    setUseFallbackApi(false)
    setRetryCount(0)

    // Re-send the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")
    if (lastUserMessage) {
      setInput(lastUserMessage.content)
      setTimeout(() => {
        handleSendMessage()
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!loading && input.trim()) {
        handleSendMessage()
      }
    }
  }

  const clearChat = () => {
    setMessages([])
    setApiStatus("idle")
    setUseFallbackApi(false)
    setRetryCount(0)
    trackButtonClick("clear_chat")
  }

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion)
    trackButtonClick("select_suggestion", { suggestion })
    // Focus the input after selecting a suggestion
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-2 border-primary/20 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Your AI Teammate
          {useFallbackApi && (
            <Badge variant="outline" className="ml-2">
              Offline Mode
            </Badge>
          )}
          {apiStatus === "error" && !useFallbackApi && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              API Error
            </Badge>
          )}
        </CardTitle>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            title="Clear chat history"
            aria-label="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Try asking about:
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors duration-200"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "error"
                        ? "bg-red-100 text-red-800"
                        : message.role === "system"
                          ? "bg-amber-100 text-amber-800 text-sm italic"
                          : "bg-muted"
                  }`}
                >
                  {message.content}
                  {message.role === "error" && (
                    <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Retry
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1"
            ref={inputRef}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            variant={input.trim() ? "gradient" : "default"}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {useFallbackApi && (
          <div className="w-full text-center text-xs text-amber-600 mt-2">
            Using offline mode due to connectivity issues. Limited responses available.
          </div>
        )}
        <div className="w-full text-center text-xs text-muted-foreground mt-2">
          Your chat history is stored locally on your device.
        </div>
      </CardFooter>
    </Card>
  )
}
