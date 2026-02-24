"use server"

import { revalidatePath } from "next/cache"

// In a real app, this would connect to a database
// For now, we'll use a simple in-memory store
const pendingConsents = new Map()

type ParentalConsentRequest = {
  studentName: string
  studentEmail: string
  parentEmail: string
  dateOfBirth: string
}

export async function requestParentalConsent(data: ParentalConsentRequest) {
  try {
    // Validate inputs
    if (!data.studentName || !data.studentEmail || !data.parentEmail || !data.dateOfBirth) {
      return { success: false, error: "Missing required fields" }
    }

    // Generate a unique consent token
    const consentToken = generateUniqueToken()

    // Store the consent request
    pendingConsents.set(consentToken, {
      ...data,
      requestDate: new Date().toISOString(),
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiry
    })

    // In a real app, send an email to the parent with the consent link
    await sendParentalConsentEmail(data.parentEmail, data.studentName, consentToken)

    // Create a pending account
    await createPendingAccount({
      name: data.studentName,
      email: data.studentEmail,
      dateOfBirth: data.dateOfBirth,
      parentEmail: data.parentEmail,
      consentToken,
    })

    return { success: true, consentToken }
  } catch (error) {
    console.error("Error requesting parental consent:", error)
    return { success: false, error: "Failed to process consent request" }
  }
}

// Helper function to generate a unique token
function generateUniqueToken() {
  return `consent_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Mock function to simulate sending an email
async function sendParentalConsentEmail(parentEmail: string, studentName: string, consentToken: string) {
  console.log(`Sending consent email to ${parentEmail} for ${studentName} with token ${consentToken}`)

  // In a real app, this would use an email service like SendGrid, Mailchimp, etc.
  // For demo purposes, we'll just log it

  return { success: true }
}

// Mock function to create a pending account
async function createPendingAccount(data: any) {
  console.log("Creating pending account:", data)

  // In a real app, this would store the pending account in a database
  // with a status of "awaiting_consent"

  return { success: true }
}

// Function to verify a parental consent token
export async function verifyParentalConsent(token: string) {
  try {
    const consentRequest = pendingConsents.get(token)

    if (!consentRequest) {
      return { success: false, error: "Invalid consent token" }
    }

    if (new Date(consentRequest.expiresAt) < new Date()) {
      return { success: false, error: "Consent request has expired" }
    }

    // Mark the consent as approved
    consentRequest.status = "approved"
    consentRequest.approvedDate = new Date().toISOString()
    pendingConsents.set(token, consentRequest)

    // In a real app, activate the student's account here
    await activateStudentAccount(consentRequest.studentEmail)

    revalidatePath("/signup/consent-verification")

    return { success: true, studentName: consentRequest.studentName }
  } catch (error) {
    console.error("Error verifying parental consent:", error)
    return { success: false, error: "Failed to verify consent" }
  }
}

// Mock function to activate a student account
async function activateStudentAccount(studentEmail: string) {
  console.log(`Activating account for ${studentEmail}`)

  // In a real app, this would update the account status in the database

  return { success: true }
}
