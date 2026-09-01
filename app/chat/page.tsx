"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ClientChatPage from "./client-page"

function ChatPageInner() {
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get("q") ?? ""
  return <ClientChatPage initialMessage={initialMessage} />
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ClientChatPage initialMessage="" />}>
      <ChatPageInner />
    </Suspense>
  )
}
