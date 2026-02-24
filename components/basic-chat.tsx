"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"

export function BasicChat() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Set initial welcome message
  useEffect(() => {
    if (!response) {
      setResponse("Welcome! Ask me anything about sports, academics, or personal development.")
    }
  }, [response])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setLoading(true)
    setError("")
    console.log("[v0] BasicChat - Sending message:", message.substring(0, 50))

    try {
      const result = await fetch("/api/basic-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      })

      console.log("[v0] BasicChat - Response status:", result.status)

      const data = await result.json()

      console.log("[v0] BasicChat - Response data:", { hasReply: !!data.reply, replyLength: data.reply?.length })

      if (!result.ok) {
        throw new Error(data.error || data.details || "Failed to get response")
      }

      setResponse(data.reply)
      setMessage("")
      console.log("[v0] BasicChat - Message sent successfully")
    } catch (err) {
      console.error("[v0] BasicChat - Error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border border-neon-500/20 shadow-lg">
      <CardHeader>
        <CardTitle>Basic Chat Test</CardTitle>
      </CardHeader>
      <CardContent>
        {response && (
          <div className="p-4 bg-muted rounded-lg mb-4">
            <p className="font-medium mb-1">Response:</p>
            <p>{response}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
            <p className="font-medium mb-1">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !message.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
