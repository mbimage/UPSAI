"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

interface SeamlessAuthContextType {
  user: User | null
  userId: string | null // Added userId for easier access
  isLoading: boolean
  showAuthPrompt: boolean
  setShowAuthPrompt: (show: boolean) => void
  attemptSeamlessSignIn: () => Promise<boolean>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const SeamlessAuthContext = createContext<SeamlessAuthContextType>({
  user: null,
  userId: null,
  isLoading: true,
  showAuthPrompt: false,
  setShowAuthPrompt: () => {},
  attemptSeamlessSignIn: async () => false,
  signIn: async () => ({ success: false, error: "Not initialized" }),
  signUp: async () => ({ success: false, error: "Not initialized" }),
  signOut: async () => {},
})

export function SeamlessAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserSupabaseClient> | null>(null)

  // Safety net: never let the app hang on "Initializing authentication..." forever.
  // If session restoration stalls (slow/blocked network, flaky mobile connection, etc.),
  // resolve loading after a short timeout so the UI always renders.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading((current) => {
        if (current) {
          console.warn("[v0] Auth init timed out - continuing without a restored session")
        }
        return false
      })
    }, 3000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    try {
      const client = createBrowserSupabaseClient()
      if (client) {
        setSupabase(client)
        console.log("[v0] Supabase client created successfully")
      } else {
        console.warn("[v0] Supabase client not available - running in degraded mode")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("[v0] Failed to create Supabase client:", error)
      setIsLoading(false)
      // Continue without Supabase - app will work in degraded mode
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        console.log("[v0] Initial session loaded:", session?.user ? "User found" : "No user")
      } catch (error) {
        console.error("[v0] Error getting initial session:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const attemptSeamlessSignIn = async (): Promise<boolean> => {
    if (!supabase) return false

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Error during seamless sign in:", error)
      return false
    }
  }

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "Supabase not initialized" }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        setUser(data.user)
        return { success: true }
      }

      return { success: false, error: "No user returned" }
    } catch (error: any) {
      console.error("[v0] Error signing in:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: "Supabase not initialized" }

    try {
      // Create the account on the server (service role, email pre-confirmed).
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return { success: false, error: data.error || "We couldn't create your account. Please try again." }
      }

      // Account exists and is confirmed — establish a session by signing in.
      return await signIn(email, password)
    } catch (error: any) {
      console.error("[v0] Error signing up:", error)
      return { success: false, error: "An unexpected error occurred. Please try again." }
    }
  }

  const signOut = async (): Promise<void> => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("[v0] Error signing out:", error)
    }
  }

  const value = {
    user,
    userId: user?.id ?? null,
    isLoading,
    showAuthPrompt,
    setShowAuthPrompt,
    attemptSeamlessSignIn,
    signIn,
    signUp,
    signOut,
  }

  return <SeamlessAuthContext.Provider value={value}>{children}</SeamlessAuthContext.Provider>
}

export function useSeamlessAuth() {
  return useContext(SeamlessAuthContext)
}

export const useAuth = useSeamlessAuth
