import { supabase } from "@/lib/supabase"

// Demo user credentials - in a real app, you would generate these dynamically
const DEMO_EMAIL_PREFIX = "demo-user-"
const DEMO_PASSWORD = "demo-password-123"

/**
 * Creates a demo user account with a unique email
 */
export async function createDemoUser() {
  try {
    // Generate a unique demo user email
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const email = `${DEMO_EMAIL_PREFIX}${timestamp}-${randomString}@demo.upside.ai`

    console.log("Creating demo user with email:", email)

    // Create the user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: DEMO_PASSWORD,
      options: {
        // Skip email verification for demo users
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    })

    if (error) {
      console.error("Error creating demo user:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "Failed to create demo user" }
    }

    // Create a profile for the demo user
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email,
        firstName: "Demo",
        lastName: "User",
        role: "student",
        grade: "11",
        school: "Demo High School",
        sport: "Basketball",
        createdAt: new Date().toISOString(),
        isDemoUser: true,
      },
    ])

    if (profileError) {
      console.error("Error creating demo profile:", profileError)
      return { success: false, error: profileError.message }
    }

    // Store demo credentials in localStorage for future sessions
    if (typeof window !== "undefined") {
      localStorage.setItem("demoUserEmail", email)
      localStorage.setItem("demoUserPassword", DEMO_PASSWORD)
      console.log("Demo credentials stored in localStorage")
    }

    return {
      success: true,
      user: data.user,
      credentials: { email, password: DEMO_PASSWORD },
    }
  } catch (error) {
    console.error("Unexpected error creating demo user:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Signs in with the stored demo credentials if they exist
 */
export async function signInWithStoredDemoCredentials() {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot access localStorage on server" }
  }

  const email = localStorage.getItem("demoUserEmail")
  const password = localStorage.getItem("demoUserPassword")

  if (!email || !password) {
    console.log("No stored demo credentials found")
    return { success: false, error: "No stored demo credentials" }
  }

  console.log("Attempting to sign in with stored demo credentials")

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in with demo credentials:", error)
      // Clear invalid stored credentials
      localStorage.removeItem("demoUserEmail")
      localStorage.removeItem("demoUserPassword")
      return { success: false, error: error.message }
    }

    console.log("Successfully signed in with demo credentials")
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error signing in with demo credentials:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Checks if the current user is a demo user
 */
export function isDemoUser(email: string | undefined | null) {
  if (!email) return false
  return email.includes(DEMO_EMAIL_PREFIX)
}
