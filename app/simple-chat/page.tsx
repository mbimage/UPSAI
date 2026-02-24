import { SimpleChat } from "@/components/simple-chat"

export default function SimpleChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Simple Chat</h1>
      <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
        This simple chat interface stores your conversation history in local storage and provides suggested prompts to
        help you get started. It's designed to be easy to use while still providing a good user experience.
      </p>

      <SimpleChat />
    </div>
  )
}
