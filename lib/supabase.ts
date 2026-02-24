import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Some features may not work properly.")
  console.warn("Missing:", {
    url: !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : "✓",
    key: !supabaseAnonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "✓",
  })
}

// Create a mock client for development when env vars are missing
const createMockClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    signIn: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
  }),
})

// Create the Supabase client with fallback
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : createMockClient()

// Export types for use throughout the app
export type Profile = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "student" | "coach" | "parent" | "admin"
  grade?: string
  school?: string
  sport?: string
  createdAt: string
  hasCompletedOnboarding?: boolean
  isDemoUser?: boolean
  isTestUser?: boolean
}

export type Assessment = {
  id: string
  user_id: string
  assessment_id: string
  title: string
  completed_date: string
  overall_score: number
  primary_style: string
  secondary_style: string
  dimension_scores: any // JSONB in postgres
  time_spent: string
}

export type ChatMessage = {
  id: string
  user_id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export type UserSkill = {
  id: string
  userId: string
  skillCategory: string
  level: number
  lastUpdated: string
}

export type UserReflection = {
  id: string
  userId: string
  content: string
  type: string
  skillCategory: string
  createdAt: string
}

export type UserEngagement = {
  id: string
  userId: string
  activityType: string
  activityId: string
  status: string
  skillCategories: string[]
  completedAt?: string
  startedAt: string
}

export type GrowthOpportunity = {
  id: string
  title: string
  description: string
  skillCategory: string
  type: string
  difficulty: string
  estimatedTime: string
  isRecommended: boolean
  isPopular?: boolean
  isNew?: boolean
  aiGenerated?: boolean
  createdAt: string
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to get configuration status
export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured(),
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    client: supabase ? "initialized" : "mock",
  }
}
