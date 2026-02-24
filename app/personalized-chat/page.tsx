import { ChatGPTStyleChat } from "@/components/chatgpt-style-chat"

export const metadata = {
  title: "Personalized Chat with UpSide AI",
  description: "Chat with your AI teammate for personalized guidance tailored to your history and needs",
}

export default function PersonalizedChatPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get the initial message from the URL query parameter
  const initialMessage = typeof searchParams.message === "string" ? searchParams.message : ""

  return (
    <main className="min-h-screen">
      <ChatGPTStyleChat initialMessage={initialMessage} />
    </main>
  )
}
