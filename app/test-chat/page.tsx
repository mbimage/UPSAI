import { SimpleChat } from "@/components/simple-chat"

export const metadata = {
  title: "Test Chat | UpSide AI",
  description: "Test the chat functionality with your new API key",
}

export default function TestChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Test Your AI Teammate Chat</h1>
      <p className="text-center mb-6">This page uses your newly added OpenAI API key to test the chat functionality.</p>
      <SimpleChat />
    </div>
  )
}
