"use client"
import { ImprovedChatBox } from "@/components/improved-chat-box"

export default function ClientChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
        Chat with UpSide
      </h1>
      <p className="max-w-2xl mx-auto mb-8 text-center text-muted-foreground">
        Get personalized support on college decisions, academic success, emotional intelligence, relationships, and
        career planning. UpSide is here to help you navigate whatever comes up.
      </p>

      <ImprovedChatBox />
    </div>
  )
}
