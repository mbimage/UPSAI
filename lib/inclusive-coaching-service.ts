import { generatePersonalizedChatResponseWithHistory } from "./personalized-ai-service"

export interface IdentityContext {
  gender?: string
  orientation?: string
  belief?: string
  ethnicity?: string
  socioeconomic?: string
  genderIdentity?: string
  pronouns?: string
  transitionStatus?: string
}

export interface CoachingContext {
  userProfile: {
    name: string
    level: string
    identity: IdentityContext
    sport: string
    age: number
  }
  situation: {
    event: string
    emotional_state: string
  }
}

export function generateInclusiveSystemPrompt(context: CoachingContext): string {
  const { userProfile, situation } = context

  const prompt = `You are UpSide AI, a real teammate for a ${userProfile.age}-year-old ${userProfile.level.toLowerCase()} ${userProfile.sport.toLowerCase()} athlete.

IDENTITY AWARENESS & TRANSGENDER ATHLETE SUPPORT:
- Gender Identity: ${userProfile.identity.genderIdentity || "Not specified"}
- Pronouns: ${userProfile.identity.pronouns || "Not specified"}
- Orientation: ${userProfile.identity.orientation || "Not specified"}  
- Beliefs: ${userProfile.identity.belief || "Not specified"}

TRANSGENDER ATHLETE SPECIFIC UNDERSTANDING:
- Recognize the unique challenges transgender athletes face (policy barriers, team dynamics, facility access, competition eligibility)
- Understand the intersection of athletic identity and gender identity
- Be aware of mental health impacts of discrimination, exclusion, or unsupportive environments
- Know that transgender athletes may face additional scrutiny, questioning, or isolation
- Understand the courage it takes to be authentic in sports environments
- Recognize that athletic performance and gender identity are separate aspects of a person

CURRENT SITUATION:
- Event: ${situation.event}
- Emotional State: ${situation.emotional_state}

INCLUSIVE RESPONSE APPROACH:
1. AFFIRM IDENTITY: "Your identity is valid. You belong in sports."
2. VALIDATE EXPERIENCES: Acknowledge unique challenges without assumptions
3. FOCUS ON STRENGTHS: Highlight resilience, courage, and athletic abilities
4. PROVIDE PRACTICAL SUPPORT: Offer concrete strategies for navigating challenges
5. CONNECT TO COMMUNITY: Remind them they're not alone

TONE & LANGUAGE:
- Use their correct pronouns consistently
- Avoid assumptions about their experience or transition status
- Be empathetic about identity-related challenges in sports
- Focus on their athletic goals and personal growth
- Use affirming language: "You have every right to compete" / "Your authenticity is your strength"
- Address both athletic and identity-related concerns with equal respect

SPECIFIC SUPPORT AREAS:
- Team dynamics and acceptance
- Facility and locker room navigation
- Dealing with policy changes or restrictions
- Building confidence in competitive environments
- Handling questions or comments from others
- Connecting with supportive resources and communities
- Balancing authenticity with safety
- Mental health and resilience building

RESPONSE STYLE:
- Start with identity affirmation when relevant
- Validate both athletic and identity experiences
- Provide practical, actionable advice
- End with empowerment and community connection
- Use "You belong here" and "Your story matters" when appropriate

Remember: Transgender athletes are athletes first. Support their whole person - their athletic dreams, identity journey, and everything in between.`

  return prompt
}

export async function generateInclusiveCoachingResponse(
  context: CoachingContext,
  conversationHistory: Array<{ role: string; content: string }> = [],
): Promise<string> {
  const systemPrompt = generateInclusiveSystemPrompt(context)

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    {
      role: "user",
      content: `I'm feeling ${context.situation.emotional_state} because ${context.situation.event}. Can you help me process this?`,
    },
  ]

  // Use the existing personalized AI service with the inclusive context
  return await generatePersonalizedChatResponseWithHistory("inclusive-coaching", messages)
}

export function identifyMaslowLevel(emotionalState: string, situation: string): { level: string; description: string } {
  const lowerState = emotionalState.toLowerCase()
  const lowerSituation = situation.toLowerCase()

  // Check for identity-related safety concerns first
  if (
    lowerState.includes("unsafe") ||
    lowerSituation.includes("threat") ||
    lowerSituation.includes("discrimination") ||
    lowerSituation.includes("harassment")
  ) {
    return {
      level: "Safety",
      description: "Need for physical and emotional safety, security, and acceptance of identity",
    }
  }

  if (
    lowerState.includes("lonely") ||
    lowerState.includes("isolated") ||
    lowerState.includes("excluded") ||
    lowerSituation.includes("team") ||
    lowerSituation.includes("acceptance")
  ) {
    return {
      level: "Belonging",
      description: "Need for connection, acceptance, and being part of a team/community",
    }
  }

  if (
    lowerState.includes("ignored") ||
    lowerState.includes("unseen") ||
    lowerState.includes("questioned") ||
    lowerSituation.includes("recognition") ||
    lowerSituation.includes("validation")
  ) {
    return {
      level: "Esteem",
      description: "Need for recognition, respect, confidence, and validation of identity and abilities",
    }
  }

  if (
    lowerState.includes("unfulfilled") ||
    lowerSituation.includes("potential") ||
    lowerSituation.includes("authentic")
  ) {
    return {
      level: "Self-Actualization",
      description: "Need for personal growth, authenticity, and reaching full potential as both athlete and person",
    }
  }

  return {
    level: "Esteem",
    description: "Need for recognition, respect, confidence, and validation",
  }
}

export function generateInclusiveMessaging(identity: IdentityContext): {
  faith_inclusive: string
  identity_inclusive: string
  transgender_specific?: string
} {
  const faithMessage =
    identity.belief === "Agnostic"
      ? "Whatever gives your life meaning - that's real. You're figuring things out, and that's totally okay."
      : identity.belief === "Atheist"
        ? "Your values are what matter. Trust what feels right to you as you work through this."
        : "Your faith is part of who you are. Let that be a source of strength right now."

  let identityMessage = "You belong here. Your story matters, and so do you."
  let transgenderSpecific = undefined

  if (identity.orientation?.includes("LGBTQIA+") || identity.genderIdentity?.includes("transgender")) {
    identityMessage =
      "You're not alone in this. Being LGBTQIA+ and an athlete? That takes incredible courage. You belong here, exactly as you are."
  }

  if (identity.genderIdentity?.includes("transgender") || identity.genderIdentity?.includes("trans")) {
    transgenderSpecific = `Your identity is valid. Your place in sports is valid. The courage it takes to be authentic while pursuing your athletic dreams is remarkable. You have every right to compete and belong in your sport.`
  }

  return {
    faith_inclusive: faithMessage,
    identity_inclusive: identityMessage,
    transgender_specific: transgenderSpecific,
  }
}

// Transgender athlete specific resources and support
export const transgenderAthleteResources = {
  mentalHealth: [
    "Trans-affirming sports psychologists",
    "LGBTQIA+ athlete support groups",
    "Identity and athletics counseling",
    "Resilience building for marginalized athletes",
  ],
  practical: [
    "Know your rights in sports participation",
    "Facility navigation strategies",
    "Team communication approaches",
    "Policy advocacy and change",
  ],
  community: [
    "Athlete Ally resources",
    "Trans athlete networks",
    "LGBTQIA+ sports organizations",
    "Supportive coach and teammate connections",
  ],
  empowerment: [
    "Your authenticity is your superpower",
    "Visibility creates change for future athletes",
    "Your athletic achievements matter regardless of identity politics",
    "You're paving the way for others",
  ],
}

export function getTransgenderAthleteSupport(situation: string): string[] {
  const lowerSituation = situation.toLowerCase()

  if (lowerSituation.includes("team") || lowerSituation.includes("acceptance")) {
    return transgenderAthleteResources.community
  }
  if (lowerSituation.includes("policy") || lowerSituation.includes("rules")) {
    return transgenderAthleteResources.practical
  }
  if (
    lowerSituation.includes("mental") ||
    lowerSituation.includes("depression") ||
    lowerSituation.includes("anxiety")
  ) {
    return transgenderAthleteResources.mentalHealth
  }

  return transgenderAthleteResources.empowerment
}
