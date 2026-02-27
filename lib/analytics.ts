import { env } from "@/lib/env"

// Analytics state
let initialized = false
let userId: string | null = null
let sessionId: string | null = null

/**
 * Initialize analytics
 */
export function initAnalytics() {
  if (initialized) return

  // Generate a session ID
  sessionId = generateSessionId()

  // Log initialization
  console.log("Analytics initialized", { enabled: env.NEXT_PUBLIC_ENABLE_ANALYTICS })

  initialized = true
}

/**
 * Track a page view
 * @param url The URL of the page
 */
export function trackPageView(url: string) {
  if (!initialized || !env.NEXT_PUBLIC_ENABLE_ANALYTICS) return

  // In a real implementation, you would send this to your analytics service
  console.log("Page view", { url, userId, sessionId })
}

/**
 * Track an event
 * @param eventName The name of the event
 * @param properties Additional properties to track
 */
export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  if (!initialized || !env.NEXT_PUBLIC_ENABLE_ANALYTICS) return

  // In a real implementation, you would send this to your analytics service
  console.log("Event", { eventName, properties, userId, sessionId })
}

/**
 * Track a button click
 * @param buttonName The name of the button
 * @param properties Additional properties to track
 */
export function trackButtonClick(buttonName: string, properties: Record<string, any> = {}) {
  trackEvent("button_click", { button_name: buttonName, ...properties })
}

/**
 * Track feature usage with detailed context
 * @param featureName The name of the feature
 * @param context Additional context about the usage
 */
export function trackFeatureUsage(featureName: string, context: Record<string, any> = {}) {
  if (!initialized || !env.NEXT_PUBLIC_ENABLE_ANALYTICS) return

  const enrichedContext = {
    ...context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "unknown",
    sessionId,
    userId,
  }

  console.log("Feature Usage", {
    feature: featureName,
    context: enrichedContext,
    userId,
    sessionId,
  })
}

/**
 * Track user journey through the app
 * @param step The current step in the user journey
 * @param metadata Additional metadata about the step
 */
export function trackUserJourney(step: string, metadata: Record<string, any> = {}) {
  trackEvent("user_journey", { step, ...metadata })
}

/**
 * Track resource engagement
 * @param resourceId The ID of the resource
 * @param action The action taken (view, download, complete, etc.)
 * @param timeSpent Time spent on the resource in seconds
 */
export function trackResourceEngagement(resourceId: string, action: string, timeSpent?: number) {
  trackEvent("resource_engagement", {
    resource_id: resourceId,
    action,
    time_spent: timeSpent,
  })
}

/**
 * Track assessment interactions
 * @param assessmentId The ID of the assessment
 * @param action The action taken
 * @param score The score if applicable
 */
export function trackAssessmentInteraction(assessmentId: string, action: string, score?: number) {
  trackEvent("assessment_interaction", {
    assessment_id: assessmentId,
    action,
    score,
  })
}

/**
 * Track chat interactions
 * @param chatType The type of chat (basic, enhanced, personalized, etc.)
 * @param messageCount Number of messages in the conversation
 * @param satisfaction User satisfaction rating if provided
 */
export function trackChatInteraction(chatType: string, messageCount: number, satisfaction?: number) {
  trackEvent("chat_interaction", {
    chat_type: chatType,
    message_count: messageCount,
    satisfaction,
  })
}

/**
 * Identify a user
 * @param id The user ID
 * @param traits Additional user traits
 */
export function identifyUser(id: string, traits: Record<string, any> = {}) {
  if (!initialized || !env.NEXT_PUBLIC_ENABLE_ANALYTICS) return

  userId = id

  // In a real implementation, you would send this to your analytics service
  console.log("User identified", { userId, traits, sessionId })
}

/**
 * Generate a random session ID
 * @returns A random session ID
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
