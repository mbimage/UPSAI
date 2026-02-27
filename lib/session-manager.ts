import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  email: string
  lastActivity: number
  ipAddress: string
  userAgent: string
  sessionId: string
}

export class SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours
  private static readonly ACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000 // 2 hours

  static async validateSession(request: Request): Promise<SessionData | null> {
    try {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options)
                })
              } catch {
                // setAll is called from Server Component - ignore
              }
            },
          },
        },
      )

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      const sessionData: SessionData = {
        userId: user.id,
        email: user.email!,
        lastActivity: Date.now(),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        sessionId: user.id + "_" + Date.now(),
      }

      // Check for session timeout
      const lastActivity = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0
      if (Date.now() - lastActivity > this.SESSION_TIMEOUT) {
        await this.invalidateSession(supabase)
        return null
      }

      return sessionData
    } catch (error) {
      console.error("Session validation error:", error instanceof Error ? error.message : "Unknown error")
      return null
    }
  }

  static async invalidateSession(supabase: any) {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Session invalidation error:", error instanceof Error ? error.message : "Unknown error")
    }
  }

  static async refreshSession(supabase: any): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        return false
      }
      return !!data.session
    } catch (error) {
      return false
    }
  }

  static getSecureCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: this.SESSION_TIMEOUT / 1000,
      path: "/",
    }
  }
}
