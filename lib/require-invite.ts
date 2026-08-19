import { NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { isEmailAllowed } from "@/lib/invite-allowlist"
import { getSecurityHeaders } from "@/lib/security-service"

// Shared invite-only guard for API routes that reach the AI.
// Returns { response } with a 403 when the caller is not an invited member,
// otherwise { user } with the authenticated user. Use at the top of a handler:
//
//   const { user, response } = await guardInvite()
//   if (response) return response
export async function guardInvite() {
  const user = await getUser()

  if (!user || !isEmailAllowed(user.email)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "UpSide is in private beta. Access is limited to invited members." },
        { status: 403, headers: getSecurityHeaders() },
      ),
    }
  }

  return { user, response: null as NextResponse | null }
}
