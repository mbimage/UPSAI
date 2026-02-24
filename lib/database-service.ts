import {
  supabase,
  type Profile,
  type Assessment,
  type ChatMessage,
  type UserSkill,
  type UserReflection,
  type UserEngagement,
  type GrowthOpportunity,
} from "./supabase"

// User Profile Functions
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as Profile
}

export async function createUserProfile(
  profile: Omit<Profile, "id" | "createdAt">,
): Promise<{ success: boolean; data?: Profile; error?: string }> {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        ...profile,
        createdAt: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Error creating user profile:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data[0] as Profile }
}

// Assessment Functions
export async function getAssessmentResult(assessmentId: string, userId: string): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("assessmentId", assessmentId)
    .eq("userId", userId)
    .single()

  if (error) {
    console.error("Error fetching assessment result:", error)
    return null
  }

  return data as Assessment
}

export async function saveAssessmentResult(
  assessment: Omit<Assessment, "id">,
): Promise<{ success: boolean; data?: Assessment; error?: string }> {
  const { data, error } = await supabase.from("assessments").insert([assessment]).select()

  if (error) {
    console.error("Error saving assessment result:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data[0] as Assessment }
}

// Chat Functions
export async function getChatHistory(userId: string, limit = 100): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching chat history:", error)
    return []
  }

  return (data as ChatMessage[]).reverse()
}

export async function saveChatMessage(
  message: Omit<ChatMessage, "id" | "createdAt">,
): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        ...message,
        createdAt: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Error saving chat message:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data[0] as ChatMessage }
}

// User Skills Functions
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const { data, error } = await supabase.from("user_skills").select("*").eq("userId", userId)

  if (error) {
    console.error("Error fetching user skills:", error)
    return []
  }

  return data as UserSkill[]
}

// User Reflections Functions
export async function getUserReflections(userId: string): Promise<UserReflection[]> {
  const { data, error } = await supabase.from("user_reflections").select("*").eq("userId", userId)

  if (error) {
    console.error("Error fetching user reflections:", error)
    return []
  }

  return data as UserReflection[]
}

// User Engagements Functions
export async function getUserEngagements(userId: string): Promise<UserEngagement[]> {
  const { data, error } = await supabase.from("user_engagements").select("*").eq("userId", userId)

  if (error) {
    console.error("Error fetching user engagements:", error)
    return []
  }

  return data as UserEngagement[]
}

// Growth Opportunities Functions
export async function getGrowthOpportunities(): Promise<GrowthOpportunity[]> {
  const { data, error } = await supabase.from("growth_opportunities").select("*")

  if (error) {
    console.error("Error fetching growth opportunities:", error)
    return []
  }

  return data as GrowthOpportunity[]
}
