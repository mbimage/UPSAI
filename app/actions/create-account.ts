"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sanitizeInput } from "@/lib/security-service"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const createAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    return age >= 13 && age <= 25 // Reasonable age range for scholar-athletes
  }, "Invalid date of birth"),
  school: z.string().min(2, "School name required").max(200, "School name too long"),
  sport: z.string().min(2, "Sport required").max(100, "Sport name too long"),
  requiresParentalConsent: z.boolean(),
  parentEmail: z.string().email("Invalid parent email").optional(),
})

type AccountData = z.infer<typeof createAccountSchema>

export async function createAccount(data: AccountData) {
  try {
    // Validate and sanitize input
    const validatedData = createAccountSchema.parse({
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email.toLowerCase()),
      password: data.password, // Don't sanitize password
      dateOfBirth: data.dateOfBirth,
      school: sanitizeInput(data.school),
      sport: sanitizeInput(data.sport),
      requiresParentalConsent: data.requiresParentalConsent,
      parentEmail: data.parentEmail ? sanitizeInput(data.parentEmail.toLowerCase()) : undefined,
    })

    // Calculate age for parental consent validation
    const dob = new Date(validatedData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    const isUnder18 = age < 18

    if (isUnder18 && !validatedData.requiresParentalConsent) {
      return { success: false, error: "Parental consent required for users under 18" }
    }

    if (isUnder18 && !validatedData.parentEmail) {
      return { success: false, error: "Parent email required for users under 18" }
    }

    const supabase = await createServerSupabaseClient()

    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        data: {
          full_name: validatedData.name,
          sport: validatedData.sport,
          school: validatedData.school,
          date_of_birth: validatedData.dateOfBirth,
          requires_parental_consent: isUnder18,
          parent_email: validatedData.parentEmail,
        },
      },
    })

    if (authError) {
      console.error("Supabase auth error:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user account" }
    }

    // Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: validatedData.email,
      full_name: validatedData.name,
      sport: validatedData.sport,
      grade: "", // Will be updated later
      school: validatedData.school,
      goals: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail the entire operation for profile creation errors
    }

    revalidatePath("/login")

    return {
      success: true,
      accountId: authData.user.id,
      needsEmailConfirmation: !authData.session, // User needs to confirm email
    }
  } catch (error) {
    console.error("Error creating account:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return { success: false, error: "Failed to create account. Please try again." }
  }
}
