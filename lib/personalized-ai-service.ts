// Personalized AI Service using direct OpenAI integration
// This service provides personalized responses based on user context

interface UserProfile {
  id?: string
  name?: string
  sport?: string
  grade?: string
  school?: string
  biggestChallenge?: string
  currentMood?: string
  communicationStyle?: "direct" | "supportive" | "analytical"
  goals?: string[]
  recentSetbacks?: string[]
  strengths?: string[]
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface EnhancedContext {
  recentJournalEntry?: string
  recentMoodCheckins?: Array<{
    mood: string
    timestamp: string
    notes?: string
  }>
  upcomingEvents?: Array<{
    type: string
    date: string
    description: string
  }>
  progressMetrics?: {
    goalsCompleted: number
    totalGoals: number
    streakDays: number
  }
}

interface MessageAnalysis {
  topics: string[]
  emotions: string[]
  urgency: "low" | "medium" | "high"
  needsSupport: boolean
  suggestedActions: string[]
}

interface PersonalizedResponse {
  message: string
  suggestions?: string[]
  resources?: string[]
  nextSteps?: string[]
  actionButton?: {
    label: string
    action: string
    context?: string
  }
}

// Fallback responses for when OpenAI is not available
const fallbackResponses = {
  general: [
    "I'm here to support you on your journey. What's on your mind today?",
    "Every challenge is an opportunity to grow stronger. How can I help you tackle what you're facing?",
    "Your potential is unlimited. Let's work together to unlock it. What would you like to focus on?",
  ],
  motivation: [
    "Remember, every champion was once a beginner who refused to give up. Keep pushing forward!",
    "Your dedication to both academics and athletics shows incredible strength. Trust in your abilities.",
    "Setbacks are setups for comebacks. You've got the resilience to overcome any challenge.",
  ],
  goals: [
    "Great goals start with clear vision. What does success look like for you?",
    "Break your big dreams into smaller, actionable steps. What's one thing you can do today?",
    "Your goals are valid and achievable. Let's create a plan to make them happen.",
  ],
  stress: [
    "It's normal to feel overwhelmed sometimes. Let's break things down into manageable pieces.",
    "Remember to breathe and take things one step at a time. You don't have to do everything at once.",
    "Stress can be a sign that you care deeply. Let's channel that energy into positive action.",
  ],
}

// Get OpenAI API key from environment
function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY || null
}

// System prompt for personalized responses
const PERSONALIZED_SYSTEM_PROMPT = `You are an AI teammate specializing in helping rural student-athletes develop life skills, emotional intelligence, and achieve their goals. You provide personalized, encouraging, and practical advice.

Key principles:
- Be supportive and understanding of rural challenges
- Provide actionable, specific advice
- Acknowledge the unique pressures of being a student-athlete
- Focus on building self-efficacy and confidence
- Offer practical solutions that work in rural settings
- Be culturally sensitive and inclusive
- IMPORTANT: Naturally integrate the E+R=O (Event + Response = Outcome) framework into your responses when relevant
- Help students understand that while they can't control Events, they CAN control their Response, which determines the Outcome
- Reference E+R=O when discussing challenges, setbacks, or decision-making situations

Always respond with empathy, practical wisdom, and encouragement.`

// Generate personalized response based on user context
export async function generatePersonalizedResponse(
  userMessage: string,
  userProfile: UserProfile,
  enhancedContext?: EnhancedContext,
): Promise<PersonalizedResponse> {
  const apiKey = getOpenAIKey()

  if (!apiKey) {
    return {
      message: generateFallbackResponse(userMessage, userProfile),
    }
  }

  try {
    // Build personalized system prompt
    let systemPrompt = `You are ${userProfile.name ? userProfile.name + "'s" : "a"} AI teammate, designed to provide personalized support for rural student-athletes.

CORE PERSONALITY:
- Supportive but direct - like a good teammate would be
- Speaks naturally using their name: ${userProfile.name || "[name]"}
- References their sport: ${userProfile.sport || "[sport]"} when relevant
- Understands rural challenges and provides practical solutions

RESPONSE STYLE:
- Keep responses to 1-2 sentences maximum
- Be specific and actionable - no generic advice
- Use their name naturally in conversation
- Reference their sport and current situation when relevant
- End with a specific question or next step when helpful
- Match their communication style: ${userProfile.communicationStyle || "supportive"}
- ALWAYS end with a thoughtful follow-up question or prompt that encourages next steps
- Ask specific, actionable questions like "What's the first small step you could take?" or "When could you try that?"
- Sound natural and conversational, like a real friend texting - use contractions, keep it casual
- Avoid robotic language or overly formal phrasing
- Be genuine and show you care about their answer
- IMPORTANT: Naturally weave in ONE of these three pillars in your response:
  * Self-efficacy (believing in your ability to succeed)
  * Emotional intelligence (understanding and managing emotions)
  * Career readiness (preparing for future workforce opportunities)
- When discussing challenges or decisions, naturally reference the E+R=O formula (Event + Response = Outcome)
- Help them see that while Events happen to them, their Response creates the Outcome
- Example: "That's the Event. Now, what Response will get you the Outcome you want?"`

    // Add user context
    const contextInfo: string[] = []
    if (userProfile.name) contextInfo.push(`Name: ${userProfile.name}`)
    if (userProfile.sport) contextInfo.push(`Sport: ${userProfile.sport}`)
    if (userProfile.grade) contextInfo.push(`Grade: ${userProfile.grade}`)
    if (userProfile.school) contextInfo.push(`School: ${userProfile.school}`)
    if (userProfile.biggestChallenge) contextInfo.push(`Biggest Challenge: ${userProfile.biggestChallenge}`)
    if (userProfile.currentMood) contextInfo.push(`Current Mood: ${userProfile.currentMood}`)

    if (contextInfo.length > 0) {
      systemPrompt += `\n\nUSER CONTEXT:\n${contextInfo.join("\n")}`
    }

    // Add communication style preferences
    if (userProfile.communicationStyle) {
      if (userProfile.communicationStyle === "direct") {
        systemPrompt += `\n\nSTYLE: Be direct and to-the-point. No fluff.`
      } else if (userProfile.communicationStyle === "supportive") {
        systemPrompt += `\n\nSTYLE: Be extra supportive and encouraging.`
      } else if (userProfile.communicationStyle === "analytical") {
        systemPrompt += `\n\nSTYLE: Provide detailed analysis and step-by-step breakdowns.`
      }
    }

    // Add enhanced context if available
    if (enhancedContext?.recentJournalEntry) {
      systemPrompt += `\n\nRECENT JOURNAL: ${enhancedContext.recentJournalEntry.substring(0, 200)}`
    }

    if (enhancedContext?.recentMoodCheckins && enhancedContext.recentMoodCheckins.length > 0) {
      const recentMood = enhancedContext.recentMoodCheckins[0]
      systemPrompt += `\n\nRECENT MOOD: ${recentMood.mood} (${recentMood.notes || "no notes"})`
    }

    if (enhancedContext?.progressMetrics) {
      const { goalsCompleted, totalGoals, streakDays } = enhancedContext.progressMetrics
      systemPrompt += `\n\nPROGRESS: ${goalsCompleted}/${totalGoals} goals completed, ${streakDays} day streak`
    }

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 120, // Reduced from 300 to 120 for more concise responses
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || ""

    return {
      message: aiMessage,
      suggestions: generateSuggestions(userMessage, userProfile),
      resources: generateResources(userMessage, userProfile),
      nextSteps: generateNextSteps(userMessage, userProfile),
      actionButton: suggestActionButton(userMessage, aiMessage),
    }
  } catch (error) {
    console.error("Error generating personalized response:", error)
    return {
      message: generateFallbackResponse(userMessage, userProfile),
    }
  }
}

// Generate personalized chat response based on message and user profile
export async function generatePersonalizedChatResponse(
  message: string,
  userProfile: UserProfile,
  enhancedContext?: EnhancedContext,
): Promise<string> {
  const apiKey = getOpenAIKey()

  if (!apiKey) {
    return generateFallbackResponse(message, userProfile)
  }

  try {
    // Build personalized system prompt
    let systemPrompt = `You are ${userProfile.name ? userProfile.name + "'s" : "a"} AI teammate for rural student-athletes.

CORE PERSONALITY:
- Direct and supportive - like a knowledgeable teammate
- Uses their name naturally: ${userProfile.name || "[name]"}
- References their sport: ${userProfile.sport || "[sport]"} and grade: ${userProfile.grade || "[grade]"}
- Understands the unique pressures of rural student-athletes

RESPONSE STYLE:
- Keep responses to 1-2 sentences maximum unless they specifically ask for more detail
- Be specific and actionable - avoid generic motivational speak
- Use their name naturally in conversation
- Reference their sport and current situation when relevant
- Match their communication style: ${userProfile.communicationStyle || "supportive"}
- ALWAYS end with a thoughtful follow-up question or prompt that encourages next steps
- Ask specific, actionable questions like "What's the first small step you could take?" or "When could you try that?"
- Sound natural and conversational, like a real friend texting - use contractions, keep it casual
- Avoid robotic language or overly formal phrasing
- Be genuine and show you care about their answer
- IMPORTANT: Naturally weave in ONE of these three pillars in your response:
  * Self-efficacy (believing in your ability to succeed)
  * Emotional intelligence (understanding and managing emotions)
  * Career readiness (preparing for future workforce opportunities)
- When discussing challenges or decisions, naturally reference the E+R=O formula (Event + Response = Outcome)
- Help them see that while Events happen to them, their Response creates the Outcome
- Example: "That's the Event. Now, what Response will get you the Outcome you want?"`

    // Add user context
    const contextInfo: string[] = []
    if (userProfile.name) contextInfo.push(`Name: ${userProfile.name}`)
    if (userProfile.sport) contextInfo.push(`Sport: ${userProfile.sport}`)
    if (userProfile.grade) contextInfo.push(`Grade: ${userProfile.grade}`)
    if (userProfile.school) contextInfo.push(`School: ${userProfile.school}`)
    if (userProfile.biggestChallenge) contextInfo.push(`Biggest Challenge: ${userProfile.biggestChallenge}`)
    if (userProfile.currentMood) contextInfo.push(`Current Mood: ${userProfile.currentMood}`)

    if (contextInfo.length > 0) {
      systemPrompt += `\n\nUSER CONTEXT:\n${contextInfo.join("\n")}`
    }

    // Add communication style preferences
    if (userProfile.communicationStyle) {
      if (userProfile.communicationStyle === "direct") {
        systemPrompt += `\n\nSTYLE: Be direct and to-the-point. No fluff.`
      } else if (userProfile.communicationStyle === "supportive") {
        systemPrompt += `\n\nSTYLE: Be extra supportive and encouraging.`
      } else if (userProfile.communicationStyle === "analytical") {
        systemPrompt += `\n\nSTYLE: Provide detailed analysis and step-by-step breakdowns.`
      }
    }

    // Add enhanced context if available
    if (enhancedContext?.recentJournalEntry) {
      systemPrompt += `\n\nRECENT JOURNAL: ${enhancedContext.recentJournalEntry.substring(0, 200)}`
    }

    if (enhancedContext?.recentMoodCheckins && enhancedContext.recentMoodCheckins.length > 0) {
      const recentMood = enhancedContext.recentMoodCheckins[0]
      systemPrompt += `\n\nRECENT MOOD: ${recentMood.mood} (${recentMood.notes || "no notes"})`
    }

    if (enhancedContext?.progressMetrics) {
      const { goalsCompleted, totalGoals, streakDays } = enhancedContext.progressMetrics
      systemPrompt += `\n\nPROGRESS: ${goalsCompleted}/${totalGoals} goals completed, ${streakDays} day streak`
    }

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.8,
        max_tokens: 100, // Reduced from 120 to 100 for even shorter responses
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "I'm here to help you succeed. What's on your mind?"
  } catch (error) {
    console.error("Error generating personalized chat response:", error)
    return generateFallbackResponse(message, userProfile)
  }
}

// Generate personalized chat response with conversation history
export async function generatePersonalizedChatResponseWithHistory(
  messages: Array<{ role: string; content: string }>,
  userProfile: UserProfile,
  enhancedContext?: EnhancedContext,
): Promise<string> {
  const apiKey = getOpenAIKey()

  if (!apiKey) {
    return generateFallbackResponse(messages[messages.length - 1]?.content || "", userProfile)
  }

  try {
    // Build system prompt with user context
    let systemPrompt = `You are an AI teammate for ${userProfile.name || "a student-athlete"}, specifically designed to help with life strategy, self-efficacy, emotional intelligence, and future planning.

CORE PERSONALITY:
- Direct and supportive - like a knowledgeable teammate
- Uses their name naturally: ${userProfile.name || "[name]"}
- References their sport: ${userProfile.sport || "[sport]"} when relevant
- Understands the unique pressures of rural student-athletes

RESPONSE STYLE:
- Keep responses to 1-2 sentences maximum unless they specifically ask for more detail
- Be specific and actionable - avoid generic motivational speak
- Use their name naturally in conversation
- Reference their sport and current situation when relevant
- Match their preferred style: ${userProfile.communicationStyle || "supportive"}
- ALWAYS end with a thoughtful follow-up question or prompt that encourages next steps
- Ask specific, actionable questions like "What's the first small step you could take?" or "When could you try that?"
- Sound natural and conversational, like a real friend texting - use contractions, keep it casual
- Avoid robotic language or overly formal phrasing
- Be genuine and show you care about their answer
- IMPORTANT: Naturally weave in ONE of these three pillars in your response:
  * Self-efficacy (believing in your ability to succeed)
  * Emotional intelligence (understanding and managing emotions)
  * Career readiness (preparing for future workforce opportunities)
- When discussing challenges or decisions, naturally reference the E+R=O formula (Event + Response = Outcome)
- Help them see that while Events happen to them, their Response creates the Outcome
- Example: "That's the Event. Now, what Response will get you the Outcome you want?"`

    // Add user profile information
    const contextInfo: string[] = []
    if (userProfile.name) contextInfo.push(`Name: ${userProfile.name}`)
    if (userProfile.sport) contextInfo.push(`Sport: ${userProfile.sport}`)
    if (userProfile.grade) contextInfo.push(`Grade: ${userProfile.grade}`)
    if (userProfile.school) contextInfo.push(`School: ${userProfile.school}`)
    if (userProfile.biggestChallenge) contextInfo.push(`Biggest Challenge: ${userProfile.biggestChallenge}`)
    if (userProfile.currentMood) contextInfo.push(`Current Mood: ${userProfile.currentMood}`)

    if (contextInfo.length > 0) {
      systemPrompt += `\n${contextInfo.join("\n")}`
    }

    // Add communication style preferences
    if (userProfile.communicationStyle) {
      if (userProfile.communicationStyle === "direct") {
        systemPrompt += `\n\nSTYLE: Be direct and to-the-point. No fluff.`
      } else if (userProfile.communicationStyle === "supportive") {
        systemPrompt += `\n\nSTYLE: Be extra supportive and encouraging.`
      } else if (userProfile.communicationStyle === "analytical") {
        systemPrompt += `\n\nSTYLE: Provide detailed analysis and step-by-step breakdowns.`
      }
    }

    // Add enhanced context if available
    if (enhancedContext?.recentJournalEntry) {
      systemPrompt += `\n\nRECENT JOURNAL: ${enhancedContext.recentJournalEntry.substring(0, 200)}`
    }

    if (enhancedContext?.recentMoodCheckins && enhancedContext.recentMoodCheckins.length > 0) {
      const recentMood = enhancedContext.recentMoodCheckins[0]
      systemPrompt += `\n\nRECENT MOOD: ${recentMood.mood} (${recentMood.notes || "no notes"})`
    }

    if (enhancedContext?.progressMetrics) {
      const { goalsCompleted, totalGoals, streakDays } = enhancedContext.progressMetrics
      systemPrompt += `\n\nPROGRESS: ${goalsCompleted}/${totalGoals} goals completed, ${streakDays} day streak`
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openaiMessages,
        temperature: 0.8,
        max_tokens: 120, // Reduced from 300 to 120 for more concise responses
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "I'm here to support you. What would you like to talk about?"
  } catch (error) {
    console.error("Error generating personalized response:", error)

    // Provide a fallback response based on user context
    const name = userProfile.name || "teammate"
    const sport = userProfile.sport || "your sport"

    return `Hey ${name}, I'm having some technical difficulties right now, but I'm here to help you with ${sport} and whatever else you're working through. Can you try asking me again in a moment?`
  }
}

// Analyze message content for context clues
export async function analyzeMessageContent(message: string): Promise<MessageAnalysis> {
  const apiKey = getOpenAIKey()

  if (!apiKey) {
    // Return safe fallback analysis
    return {
      topics: ["general"],
      emotions: ["neutral"],
      urgency: "medium" as const,
      needsSupport: true,
      suggestedActions: ["provide supportive response"],
    }
  }

  try {
    const analysisPrompt = `Analyze this message from a student-athlete and return a JSON object with the following structure:
{
  "topics": ["array of main topics discussed"],
  "emotions": ["array of emotions detected"],
  "urgency": "low|medium|high",
  "needsSupport": boolean,
  "suggestedActions": ["array of suggested response approaches"]
}

Message to analyze: "${message}"`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing student-athlete communications. Return only valid JSON.",
          },
          { role: "user", content: analysisPrompt },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || "{}"

    try {
      return JSON.parse(result)
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      return {
        topics: ["general"],
        emotions: ["neutral"],
        urgency: "medium" as const,
        needsSupport: true,
        suggestedActions: ["provide supportive response"],
      }
    }
  } catch (error) {
    console.error("Error analyzing message content:", error)

    // Return safe fallback analysis
    return {
      topics: ["general"],
      emotions: ["neutral"],
      urgency: "medium" as const,
      needsSupport: true,
      suggestedActions: ["provide supportive response"],
    }
  }
}

// Generate contextual prompts based on user profile
export async function generateContextualPrompts(userProfile: UserProfile): Promise<string[]> {
  const prompts: string[] = []

  if (userProfile.sport) {
    prompts.push(`How can I improve my performance in ${userProfile.sport}?`)
    prompts.push(`What mental strategies work best for ${userProfile.sport}?`)
  }

  if (userProfile.biggestChallenge) {
    prompts.push(`Help me work through: ${userProfile.biggestChallenge}`)
  }

  if (userProfile.grade) {
    const gradeLevel = userProfile.grade.toLowerCase()
    if (gradeLevel.includes("senior") || gradeLevel.includes("12")) {
      prompts.push("What should I know about college recruiting?")
      prompts.push("How do I balance senior year stress?")
    } else if (gradeLevel.includes("junior") || gradeLevel.includes("11")) {
      prompts.push("How do I prepare for college applications?")
      prompts.push("What should I focus on this year?")
    }
  }

  // Add general prompts
  prompts.push("How do I stay motivated when things get tough?")
  prompts.push("What's the best way to manage my time?")
  prompts.push("How can I be a better teammate?")

  return prompts.slice(0, 6) // Return max 6 prompts
}

// Generate follow-up questions based on user profile and conversation history
export async function generateFollowUpQuestions(
  userProfile: UserProfile,
  conversationHistory: ChatMessage[] = [],
): Promise<string[]> {
  const apiKey = getOpenAIKey()

  if (!apiKey) {
    return [
      "What's one thing you're looking forward to this week?",
      "How do you usually handle challenges like this?",
      "What would success look like for you right now?",
    ]
  }

  try {
    const recentMessages = conversationHistory
      .slice(-5)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI coach generating thoughtful follow-up questions for a student-athlete.",
          },
          {
            role: "user",
            content: `Generate 3 thoughtful follow-up questions for ${userProfile.name || "this student-athlete"}.

User Profile:
- Sport: ${userProfile.sport || "Not specified"}
- Grade: ${userProfile.grade || "Not specified"}
- Biggest Challenge: ${userProfile.biggestChallenge || "Not specified"}
- Current Mood: ${userProfile.currentMood || "Not specified"}

Recent conversation:
${recentMessages}

Generate questions that:
- Build on the recent conversation
- Are specific to their sport and situation
- Encourage deeper reflection
- Are supportive and motivating

Return as a JSON array of 3 strings.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || "[]"

    try {
      return JSON.parse(result)
    } catch (parseError) {
      console.error("Error parsing follow-up questions JSON:", parseError)
      return [
        "What's one thing you're looking forward to this week?",
        "How do you usually handle challenges like this?",
        "What would success look like for you right now?",
      ]
    }
  } catch (error) {
    console.error("Error generating follow-up questions:", error)
    return [
      "What's one thing you're looking forward to this week?",
      "How do you usually handle challenges like this?",
      "What would success look like for you right now?",
    ]
  }
}

// Helper function to generate fallback responses
function generateFallbackResponse(message: string, userProfile: UserProfile): string {
  const lowerMessage = message.toLowerCase()
  let responseCategory = "general"

  if (lowerMessage.includes("goal") || lowerMessage.includes("plan") || lowerMessage.includes("achieve")) {
    responseCategory = "goals"
  } else if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("pressure") ||
    lowerMessage.includes("overwhelm")
  ) {
    responseCategory = "stress"
  } else if (
    lowerMessage.includes("motivat") ||
    lowerMessage.includes("inspire") ||
    lowerMessage.includes("encourage")
  ) {
    responseCategory = "motivation"
  }

  const responses = fallbackResponses[responseCategory as keyof typeof fallbackResponses]
  let selectedResponse = responses[Math.floor(Math.random() * responses.length)]

  // Personalize the response if we have user context
  if (userProfile.name) {
    selectedResponse = `${userProfile.name}, ${selectedResponse.toLowerCase()}`
  }

  return selectedResponse
}

// Get user context from database or session (placeholder implementation)
export async function getUserContext(userId: string): Promise<UserProfile> {
  // In a real implementation, this would fetch from a database
  // For now, return empty context
  return {}
}

// Update user context (placeholder implementation)
export async function updateUserContext(userId: string, context: Partial<UserProfile>): Promise<void> {
  // In a real implementation, this would update the database
  console.log(`Updating context for user ${userId}:`, context)
}

// Analyze user message for context clues
export function extractContextFromMessage(message: string): Partial<UserProfile> {
  const context: Partial<UserProfile> = {}

  // Extract sport mentions
  const sports = ["football", "basketball", "baseball", "soccer", "track", "volleyball", "tennis", "golf"]
  for (const sport of sports) {
    if (message.toLowerCase().includes(sport)) {
      context.sport = sport
      break
    }
  }

  // Extract goal-related information
  if (message.toLowerCase().includes("want to") || message.toLowerCase().includes("goal")) {
    // This could be enhanced with NLP to extract specific goals
    context.goals = ["Improve performance"]
  }

  return context
}

// Export the service instance
export const personalizedAIService = {
  generatePersonalizedResponse,
  generatePersonalizedChatResponse,
  generatePersonalizedChatResponseWithHistory,
  analyzeMessageContent,
  generateContextualPrompts,
  generateFollowUpQuestions,
  getUserContext,
  updateUserContext,
  extractContextFromMessage,
  suggestActionButton,
}

// Generate suggestions based on user message and profile
function generateSuggestions(userMessage: string, userProfile: UserProfile): string[] {
  const suggestions: string[] = []

  if (userProfile.sport) {
    suggestions.push(`Consider how your ${userProfile.sport} training can apply to this situation`)
  }

  if (userMessage.toLowerCase().includes("stress") || userMessage.toLowerCase().includes("pressure")) {
    suggestions.push("Try deep breathing exercises before important events")
    suggestions.push("Break down overwhelming tasks into smaller, manageable steps")
  }

  if (userMessage.toLowerCase().includes("goal")) {
    suggestions.push("Write down your goals and review them weekly")
    suggestions.push("Share your goals with a trusted mentor or coach")
  }

  return suggestions.slice(0, 3) // Return max 3 suggestions
}

// Generate relevant resources based on user message and profile
function generateResources(userMessage: string, userProfile: UserProfile): string[] {
  const resources: string[] = []

  if (userMessage.toLowerCase().includes("college") || userMessage.toLowerCase().includes("scholarship")) {
    resources.push("NCAA Eligibility Center")
    resources.push("Local college counseling resources")
  }

  if (userMessage.toLowerCase().includes("mental") || userMessage.toLowerCase().includes("stress")) {
    resources.push("Mental health resources for student-athletes")
    resources.push("Mindfulness and meditation apps")
  }

  if (userProfile.sport) {
    resources.push(`${userProfile.sport}-specific training resources`)
  }

  return resources.slice(0, 3) // Return max 3 resources
}

// Generate next steps based on user message and profile
function generateNextSteps(userMessage: string, userProfile: UserProfile): string[] {
  const nextSteps: string[] = []

  if (userMessage.toLowerCase().includes("goal")) {
    nextSteps.push("Define one specific, measurable goal for this week")
    nextSteps.push("Identify potential obstacles and plan how to overcome them")
  }

  if (userMessage.toLowerCase().includes("time") || userMessage.toLowerCase().includes("schedule")) {
    nextSteps.push("Create a weekly schedule that includes study, practice, and rest time")
    nextSteps.push("Identify your most productive hours and schedule important tasks then")
  }

  nextSteps.push("Reflect on this conversation and write down key insights")

  return nextSteps.slice(0, 3) // Return max 3 next steps
}

export function suggestActionButton(
  userMessage: string,
  aiResponse: string,
): {
  label: string
  action: string
  context?: string
} | null {
  if (typeof userMessage !== "string" || typeof aiResponse !== "string") {
    console.error("[v0] suggestActionButton received non-string parameters:", { userMessage, aiResponse })
    return null
  }

  const lowerMessage = userMessage.toLowerCase()
  const lowerResponse = aiResponse.toLowerCase()

  // Goal-related (most common)
  if (
    lowerMessage.includes("goal") ||
    lowerResponse.includes("goal") ||
    lowerMessage.includes("want to") ||
    lowerMessage.includes("trying to") ||
    lowerMessage.includes("achieve")
  ) {
    return {
      label: "Save goal",
      action: "save_goal",
      context: userMessage,
    }
  }

  // Step/plan-related
  if (
    lowerMessage.includes("step") ||
    lowerMessage.includes("plan") ||
    lowerMessage.includes("how do i") ||
    lowerMessage.includes("what should i")
  ) {
    return {
      label: "Add step",
      action: "add_step",
      context: userMessage,
    }
  }

  // Reminder-related
  if (
    lowerMessage.includes("remind") ||
    lowerMessage.includes("don't forget") ||
    lowerMessage.includes("remember to") ||
    lowerMessage.includes("later") ||
    lowerMessage.includes("tomorrow")
  ) {
    return {
      label: "Set reminder",
      action: "set_reminder",
      context: userMessage,
    }
  }

  // Win/success-related
  if (
    lowerMessage.includes("won") ||
    lowerMessage.includes("success") ||
    lowerMessage.includes("achieved") ||
    lowerMessage.includes("proud") ||
    lowerMessage.includes("accomplished") ||
    lowerMessage.includes("did it")
  ) {
    return {
      label: "Celebrate win",
      action: "celebrate_win",
      context: userMessage,
    }
  }

  // Progress tracking
  if (
    lowerMessage.includes("track") ||
    lowerMessage.includes("progress") ||
    lowerMessage.includes("improve") ||
    lowerMessage.includes("better")
  ) {
    return {
      label: "Track progress",
      action: "track_progress",
      context: userMessage,
    }
  }

  // Default to "Save goal" for general conversations
  return {
    label: "Save goal",
    action: "save_goal",
    context: userMessage,
  }
}

// Export types for use in other modules
export type { UserProfile, ChatMessage, EnhancedContext, MessageAnalysis }
