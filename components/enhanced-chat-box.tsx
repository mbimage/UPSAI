"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Trash2, MessageSquare } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function EnhancedChatBox() {
  const [messages, setMessages] = useLocalStorage<Message[]>("enhanced-chat-history", [])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  // Suggested prompts for users to get started
  const suggestions = [
    "How can I improve my confidence before a big game?",
    "What are some strategies for balancing school and sports?",
    "How do I communicate better with my coach?",
    "What should I do if I'm feeling overwhelmed?",
    "How can I develop leadership skills as an athlete?",
  ]

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi there! I'm your AI teammate. I'm here to help you develop skills like self-confidence, emotional intelligence, and career readiness. What would you like to talk about today?",
        },
      ])
    }
  }, [messages.length, setMessages])

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
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: userMessage },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      // Parse the JSON response
      const data = await response.json()

      // Add AI response to messages
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }])
      } else {
        throw new Error("Unexpected response format from API")
      }
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setLoading(false)
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
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm your AI teammate. I'm here to help you develop skills like self-confidence, emotional intelligence, and career readiness. What would you like to talk about today?",
      },
    ])
  }

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border border-neon-500/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Enhanced Chat
        </CardTitle>
        {messages.length > 1 && (
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
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-red-100 text-red-800">{error}</div>
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
          />
          <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {messages.length === 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => selectSuggestion(suggestion)}
                className="text-left"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
