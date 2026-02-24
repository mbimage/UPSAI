import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getFullUrl } from "@/lib/url-utils"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  // Use the environment variable for consistent behavior
  return NextResponse.redirect(getFullUrl("/dashboard"))
}
