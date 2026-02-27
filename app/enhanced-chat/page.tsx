import { EnhancedChatBox } from "@/components/enhanced-chat-box"

export default function EnhancedChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Enhanced Chat</h1>
      <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
        This enhanced chat interface provides a more complete user experience with conversation history, suggested
        prompts, and a clean interface. Your chat history is stored locally on your device.
      </p>

      <EnhancedChatBox />
    </div>
  )
}
