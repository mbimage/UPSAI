import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = await createServerSupabaseClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/login")
    }

    return user
  } catch (error) {
    console.error("Auth check failed:", error)
    redirect("/login")
  }
}

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's no user but no error, it's just an unauthenticated request (guest)
    if (!user && !error) {
      return null
    }

    // Only throw/log for actual authentication errors (not missing sessions)
    if (error && error.message !== "Auth session missing!") {
      console.error("Authentication error:", error)
      throw new Error(`Authentication error: ${error.message}`)
    }

    return user
  } catch (error) {
    // Only log unexpected errors, not missing sessions
    if (error instanceof Error && !error.message.includes("Auth session missing")) {
      console.error("Failed to get authenticated user:", error)
    }
    return null
  }
}

export async function requireAdminAuth() {
  const user = await requireAuth()
  const supabase = await createServerSupabaseClient()

  try {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error || !profile) {
      throw new Error("Profile not found")
    }

    // Check if user has admin role in metadata
    const isAdmin = user.user_metadata?.role === "admin" || user.app_metadata?.role === "admin"

    if (!isAdmin) {
      throw new Error("Admin access required")
    }

    return { user, profile }
  } catch (error) {
    console.error("Admin auth check failed:", error)
    redirect("/unauthorized")
  }
}
