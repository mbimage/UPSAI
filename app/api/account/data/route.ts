import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"
import { getInteractionHistory } from "@/lib/interaction-history-service"

// GET /api/account/data - a summary of what UpSide has saved for this athlete,
// so they can see their conversation history and activity in one place.
export async function GET() {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const supabase = await createServerSupabaseClient()

  const [{ data: sessions }, insights] = await Promise.all([
    supabase
      .from("chat_sessions")
      .select("id, title, messageCount, updatedAt")
      .eq("userId", user.id)
      .order("updatedAt", { ascending: false })
      .limit(200),
    getInteractionHistory(user.id, 100),
  ])

  return NextResponse.json(
    { conversations: sessions || [], activity: insights },
    { status: 200, headers: getSecurityHeaders() },
  )
}

// DELETE /api/account/data?scope=history|all
//  history = delete all conversations, messages, and activity insights (keeps memory)
//  all     = also delete durable memories
export async function DELETE(request: NextRequest) {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const supabase = await createServerSupabaseClient()
  const scope = new URL(request.url).searchParams.get("scope") || "history"

  try {
    // Delete chat messages first (fetch owned session ids, then delete their messages).
    const { data: sessions } = await supabase.from("chat_sessions").select("id").eq("userId", user.id)
    const sessionIds = (sessions || []).map((s) => s.id)
    if (sessionIds.length > 0) {
      await supabase.from("chat_messages").delete().in("sessionId", sessionIds)
    }
    await supabase.from("chat_sessions").delete().eq("userId", user.id)
    await supabase.from("conversation_insights").delete().eq("userId", user.id)

    if (scope === "all") {
      await supabase.from("athlete_memory").delete().eq("userId", user.id)
    }

    return NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
  } catch (error) {
    console.error("[v0] Account data delete failed:", error)
    return NextResponse.json({ error: "Could not delete your data." }, { status: 400, headers: getSecurityHeaders() })
  }
}
