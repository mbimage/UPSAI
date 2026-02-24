"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Trash2, MessageSquare, AlertCircle } from "lucide-react"

interface Message {
  role: "user" | "assistant" | "error"
  content: string
}

export function ReliableChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [apiStatus, setApiStatus] = useState<"unknown" | "working" | "error">("unknown")

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi there! I'm your AI teammate. How can I help you today with sports, academics, or personal development?",
        },
      ])
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = input.trim()
    console.log("[v0] ReliableChat - Sending message:", userMessage.substring(0, 50))
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

    try {
      console.log("[v0] ReliableChat - Calling /api/simple-ai-chat")

      const response = await fetch("/api/simple-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      console.log("[v0] ReliableChat - Response status:", response.status)

      const data = await response.json()

      console.log("[v0] ReliableChat - Response data:", { hasReply: !!data.reply, replyLength: data.reply?.length })

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`)
      }

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      setApiStatus("working")
      console.log("[v0] ReliableChat - Message sent successfully")
    } catch (err) {
      console.error("[v0] ReliableChat - Error:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content:
            err instanceof Error ? `Error: ${err.message}` : "Sorry, I encountered an error. Please try again later.",
        },
      ])
      setApiStatus("error")
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
          "Hi there! I'm your AI teammate. How can I help you today with sports, academics, or personal development?",
      },
    ])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border border-neon-500/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Teammate Chat
        </CardTitle>
        <div className="flex items-center gap-2">
          {apiStatus === "error" && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              API Error
            </div>
          )}
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
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-muted"
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
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            variant={input.trim() ? "gradient" : "default"}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
