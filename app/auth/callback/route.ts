import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Exchanges a Supabase auth code for a session (used by email-link / OAuth flows
// if they are ever enabled). Password sign-in doesn't hit this route. On success
// we send users to the chat, where their saved history loads.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirectParam = searchParams.get("redirect")
  const next = redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/chat"

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("[v0] Auth callback: failed to exchange code", { message: error.message?.slice(0, 200) })
      return NextResponse.redirect(`${origin}/auth?error=callback`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
