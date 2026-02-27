"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useLocalStorage } from "@/hooks/use-local-storage"

type PublicUserContextType = {
  userId: string
  username: string | null
  setUsername: (name: string) => void
  preferences: Record<string, any>
  updatePreference: (key: string, value: any) => void
  resetUser: () => void
}

const PublicUserContext = createContext<PublicUserContextType | undefined>(undefined)

export function PublicUserProvider({ children }: { children: React.ReactNode }) {
  // Use local storage to persist user ID and preferences
  const [userId, setUserId] = useLocalStorage<string>("upside-public-user-id", "")
  const [username, setUsername] = useLocalStorage<string | null>("upside-public-username", null)
  const [preferences, setPreferences] = useLocalStorage<Record<string, any>>("upside-public-preferences", {})

  // Generate a user ID if one doesn't exist
  useEffect(() => {
    if (!userId) {
      setUserId(uuidv4())
    }
  }, [userId, setUserId])

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetUser = () => {
    setUserId(uuidv4())
    setUsername(null)
    setPreferences({})
  }

  return (
    <PublicUserContext.Provider
      value={{
        userId,
        username,
        setUsername,
        preferences,
        updatePreference,
        resetUser,
      }}
    >
      {children}
    </PublicUserContext.Provider>
  )
}

export function usePublicUser() {
  const context = useContext(PublicUserContext)
  if (context === undefined) {
    throw new Error("usePublicUser must be used within a PublicUserProvider")
  }
  return context
}
