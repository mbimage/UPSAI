import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { isEmailAllowed } from "@/lib/invite-allowlist"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Only create Supabase client if environment variables are available
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      })

      // Refresh session if needed
      await supabase.auth.getUser()

      // Routes that require authentication.
      const protectedPaths = ["/chat", "/assessments", "/profile"]
      // Routes that additionally require being on the invite allowlist.
      const inviteOnlyPaths = ["/chat"]

      const { pathname } = request.nextUrl
      const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
      const isInviteOnlyPath = inviteOnlyPaths.some((path) => pathname.startsWith(path))

      if (isProtectedPath) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          const redirectUrl = new URL("/login", request.url)
          redirectUrl.searchParams.set("redirectTo", pathname)
          return NextResponse.redirect(redirectUrl)
        }

        // Invite-only: signed in, but not on the allowlist -> friendly block.
        if (isInviteOnlyPath && !isEmailAllowed(user.email)) {
          return NextResponse.redirect(new URL("/not-invited", request.url))
        }
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
