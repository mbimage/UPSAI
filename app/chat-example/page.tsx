import { ChatExampleClient } from "@/components/chat-example-client"

export default function ChatExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chat Example</h1>
      <ChatExampleClient />
    </div>
  )
}
