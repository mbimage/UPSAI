import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSecurityHeaders } from "@/lib/security-service"

// Server-side sign-up. Email confirmation is intentionally skipped for now (per
// product decision) by creating the user as already-confirmed with the service
// role key. This key is NEVER exposed to the client. Running sign-up on the
// server also means Supabase's rate limits apply to our server IP collectively,
// and lets us log real errors while returning generic messages to the client
// (so we don't leak whether an email is already registered).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400, headers: getSecurityHeaders() },
      )
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[v0] Signup: missing Supabase service role configuration")
      return NextResponse.json(
        { error: "Sign-up is temporarily unavailable. Please try again later." },
        { status: 503, headers: getSecurityHeaders() },
      )
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { error } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // skip the email confirmation step for now
    })

    if (error) {
      // Log the real reason server-side for debugging, but return a generic
      // message so the response can't be used to enumerate existing accounts.
      console.error("[v0] Signup error", {
        status: (error as { status?: number }).status ?? "unknown",
        message: error.message?.slice(0, 200),
      })

      const msg = error.message?.toLowerCase() || ""
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        // Generic: don't confirm the address exists.
        return NextResponse.json(
          { error: "We couldn't create that account. Try signing in instead." },
          { status: 409, headers: getSecurityHeaders() },
        )
      }
      if (msg.includes("password")) {
        return NextResponse.json(
          { error: "Please choose a stronger password." },
          { status: 400, headers: getSecurityHeaders() },
        )
      }
      return NextResponse.json(
        { error: "We couldn't create your account. Please try again." },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    // Success. The client will sign in with the same credentials to get a session.
    return NextResponse.json({ success: true }, { status: 201, headers: getSecurityHeaders() })
  } catch (error) {
    console.error("[v0] Signup route crashed:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
