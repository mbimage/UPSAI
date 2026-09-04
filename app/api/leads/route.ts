import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"

// The public chat gate: after a set number of free questions, visitors enter an
// email to keep talking. That email is captured here and an unlock cookie is set
// so the /api/chat limiter (and the client overlay) let them continue.
const UNLOCK_COOKIE = "upside_unlocked"
const COUNT_COOKIE = "upside_q"
const ONE_YEAR = 60 * 60 * 24 * 365

// Conservative email shape check. Real validation is "can we reach it", but this
// rejects the obvious garbage before we ever store a row.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawEmail = typeof body?.email === "string" ? body.email : ""
    const questionCount =
      typeof body?.questionCount === "number" && Number.isFinite(body.questionCount)
        ? Math.max(0, Math.min(999, Math.trunc(body.questionCount)))
        : null

    const email = rawEmail.trim().toLowerCase()
    if (!email || email.length > 320 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "invalid_email", message: "Please enter a valid email address." },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const supabase = await createServerSupabaseClient()
    // Attach the user id when the visitor happens to be signed in (optional).
    const user = await getUser()

    const { error } = await supabase.from("leads").insert({
      email,
      user_id: user?.id ?? null,
      source: "chat_gate",
      question_count: questionCount,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    })

    if (error) {
      // Don't block the visitor over a storage hiccup, but do log it server-side.
      console.error("[v0] Leads API: failed to store lead", error.message)
    }

    // Unlock regardless of whether the row stored — the point is to let a real
    // person keep talking. These cookies are intentionally NOT httpOnly so the
    // client overlay can read the unlocked state on future loads.
    const response = NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
    response.cookies.set(UNLOCK_COOKIE, "1", {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
      httpOnly: false,
    })
    // Reset the running counter now that they're unlocked.
    response.cookies.set(COUNT_COOKIE, "0", {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
      httpOnly: false,
    })
    return response
  } catch (error) {
    console.error("[v0] Leads API critical error", error)
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
