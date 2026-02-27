"use client"

import { useState } from "react"
import { ChatInput } from "@/components/chat-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatExampleClient() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  const handleMessageSent = (userMessage: string, aiReply: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userMessage }, { role: "assistant", content: aiReply }])
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with UpSide AI</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This is a simple example of how to use the ChatInput component. Messages will appear below as you chat.
        </p>

        {messages.length > 0 && (
          <div className="p-4 bg-muted rounded-lg mb-4 max-h-[300px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.role === "assistant" ? "pl-4 border-l-2 border-primary" : ""}`}
              >
                <p className="text-sm font-semibold">{message.role === "user" ? "You" : "UpSide AI"}</p>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm">The ChatInput component handles:</p>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li>Sending messages to the API</li>
            <li>Handling loading states</li>
            <li>Error handling</li>
            <li>Notifying parent components of new messages</li>
          </ul>
        </div>

        <ChatInput onMessageSent={handleMessageSent} />
      </CardContent>
    </Card>
  )
}
