import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { isEmailAllowed } from "@/lib/invite-allowlist"
import ClientChatPage from "./client-page"

// Invite-only: enforce access on the server before rendering the chat.
export default async function ChatPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login?redirectTo=/chat")
  }

  if (!isEmailAllowed(user.email)) {
    redirect("/not-invited")
  }

  return <ClientChatPage initialMessage="" />
}
