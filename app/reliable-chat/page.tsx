import { ReliableChat } from "@/components/reliable-chat"

export const metadata = {
  title: "Reliable Chat | UpSide AI",
  description: "A reliable chat interface for UpSide AI",
}

export default function ReliableChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Chat with Your AI Teammate</h1>
      <ReliableChat />
    </div>
  )
}
