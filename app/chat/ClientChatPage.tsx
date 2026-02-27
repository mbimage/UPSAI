"use client"
import { ImprovedChatBox } from "@/components/improved-chat-box"

export default function ClientChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
        Chat with Your AI Teammate
      </h1>
      <p className="max-w-2xl mx-auto mb-8 text-center text-muted-foreground">
        Get personalized advice on sports performance, academic success, emotional intelligence, and career planning.
        Your AI teammate is here to help you navigate challenges both on and off the field.
      </p>

      <ImprovedChatBox />
    </div>
  )
}
