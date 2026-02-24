"use client"

import { useParams } from "next/navigation"
import ClientChatPage from "../client-page"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.conversationId as string

  return <ClientChatPage initialMessage="" conversationId={conversationId} />
}
