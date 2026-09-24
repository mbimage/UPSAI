import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"
import { getAthleteMemory } from "@/lib/interaction-history-service"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/memory - list the athlete's durable memories (owner-scoped by RLS).
export async function GET() {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const memories = await getAthleteMemory(user.id, 200)
  return NextResponse.json({ memories }, { status: 200, headers: getSecurityHeaders() })
}

// PATCH /api/memory - correct the text of a single memory the athlete owns.
export async function PATCH(request: NextRequest) {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const { id, content } = await request.json()
  if (typeof id !== "string" || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid memory id" }, { status: 400, headers: getSecurityHeaders() })
  }
  if (typeof content !== "string" || content.trim().length === 0 || content.length > 500) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400, headers: getSecurityHeaders() })
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("athlete_memory")
    .update({ content: content.trim(), updatedAt: new Date().toISOString() })
    .eq("id", id)
    .eq("userId", user.id) // defense in depth alongside RLS
    .select("id, category, content, createdAt")
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: "Could not update that memory." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json({ memory: data }, { status: 200, headers: getSecurityHeaders() })
}

// DELETE /api/memory?id=<uuid> - delete one memory. DELETE /api/memory?all=1 - delete all.
export async function DELETE(request: NextRequest) {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const all = searchParams.get("all")

  if (all === "1") {
    const { error } = await supabase.from("athlete_memory").delete().eq("userId", user.id)
    if (error) {
      return NextResponse.json({ error: "Could not clear memories." }, { status: 400, headers: getSecurityHeaders() })
    }
    return NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
  }

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid memory id" }, { status: 400, headers: getSecurityHeaders() })
  }
  const { error } = await supabase.from("athlete_memory").delete().eq("id", id).eq("userId", user.id)
  if (error) {
    return NextResponse.json({ error: "Could not delete that memory." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
}
