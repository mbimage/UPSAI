"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { sanitizeInput } from "@/lib/security-service"
import { processAssessmentResponses } from "@/lib/assessment-service"
import { trackAssessmentOutcome } from "./track-assessment-outcome"
import type { OutcomeCategory } from "@/lib/outcome-analytics"
import { z } from "zod"

const submitAssessmentSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID required").max(100, "Invalid assessment ID"),
  responses: z
    .record(z.string(), z.any())
    .refine((responses) => Object.keys(responses).length > 0, "At least one response required"),
})

export async function submitAssessment(formData: FormData) {
  try {
    // Require authentication
    const user = await getAuthenticatedUser()
    if (!user) {
      return {
        success: false,
        error: "Authentication required to submit assessment",
      }
    }

    // Get the assessment data and validate
    const assessmentId = sanitizeInput((formData.get("assessmentId") as string) || "")

    if (!assessmentId) {
      return {
        success: false,
        error: "Assessment ID is required",
      }
    }

    // Convert form data to responses object with sanitization
    const responses: Record<string, any> = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("question_")) {
        responses[key] = sanitizeInput(value as string)
      }
    }

    // Validate the data
    const validatedData = submitAssessmentSchema.parse({
      assessmentId,
      responses,
    })

    const supabase = await createServerSupabaseClient()

    // Process the assessment responses
    const results = await processAssessmentResponses(validatedData.assessmentId, validatedData.responses, user.id)

    // Store assessment in database
    const { data: assessment, error: dbError } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        assessment_type: validatedData.assessmentId,
        questions: {}, // Store questions if needed
        answers: validatedData.responses,
        results: results,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error storing assessment:", dbError)
      return {
        success: false,
        error: "Failed to save assessment results",
      }
    }

    // Track the assessment outcome
    if (results.overallScore !== undefined) {
      const categoryMap: Record<string, OutcomeCategory> = {
        "self-efficacy-quick": "self_efficacy",
        "emotional-intelligence": "emotional_intelligence",
        "social-awareness": "social_awareness",
        "career-readiness": "career_readiness",
        leadership: "leadership",
        resilience: "resilience",
      }

      const category = categoryMap[validatedData.assessmentId] || "self_efficacy"

      await trackAssessmentOutcome(user.id, validatedData.assessmentId, category, results.overallScore, {
        domainScores: results.domainScores,
        completedAt: new Date().toISOString(),
      })
    }

    // Revalidate relevant pages
    revalidatePath("/assessments")
    revalidatePath(`/assessments/${validatedData.assessmentId}`)

    return {
      success: true,
      submissionId: assessment.id,
      redirectUrl: `/assessments/${validatedData.assessmentId}/results`,
    }
  } catch (error) {
    console.error("Error submitting assessment:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: "Failed to submit assessment. Please try again.",
    }
  }
}

// Get assessment result with proper authentication
export async function getAssessmentResult(assessmentId: string) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return null
    }

    const sanitizedAssessmentId = sanitizeInput(assessmentId)
    const supabase = await createServerSupabaseClient()

    // Get the most recent assessment result for this user and assessment type
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", user.id)
      .eq("assessment_type", sanitizedAssessmentId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching assessment result:", error)
      return null
    }

    return assessment?.results || null
  } catch (error) {
    console.error("Error getting assessment result:", error)
    return null
  }
}
