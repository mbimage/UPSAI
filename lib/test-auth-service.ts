import { supabase } from "@/lib/supabase"

// Test user credentials
const TEST_EMAIL_PREFIX = "test-user-"
const TEST_PASSWORD = "Test123!" // Strong password that meets requirements

/**
 * Creates a test user account that is guaranteed to work
 */
export async function createTestUser() {
  try {
    // Generate a unique test user email
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const email = `${TEST_EMAIL_PREFIX}${timestamp}-${randomString}@test.upside.ai`

    console.log("Creating test user with email:", email)

    // Create the user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: TEST_PASSWORD,
      options: {
        // Skip email verification for test users
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    })

    if (error) {
      console.error("Error creating test user:", error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "Failed to create test user" }
    }

    // Create a profile for the test user
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email,
        firstName: "Test",
        lastName: "User",
        role: "student",
        grade: "11",
        school: "Test High School",
        sport: "Basketball",
        createdAt: new Date().toISOString(),
        isTestUser: true,
      },
    ])

    if (profileError) {
      console.error("Error creating test profile:", profileError)
      return { success: false, error: profileError.message }
    }

    return {
      success: true,
      user: data.user,
      credentials: { email, password: TEST_PASSWORD },
    }
  } catch (error) {
    console.error("Unexpected error creating test user:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Checks if the current user is a test user
 */
export function isTestUser(email: string | undefined | null) {
  if (!email) return false
  return email.includes(TEST_EMAIL_PREFIX)
}
