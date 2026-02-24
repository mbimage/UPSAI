"use client"

import { useAuth } from "@/contexts/auth-context"
import { type ReactNode, useEffect, useState } from "react"

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const [isAuthContextAvailable, setIsAuthContextAvailable] = useState(true)

  useEffect(() => {
    try {
      // Just access the auth context to verify it's available
      // This will throw if not within an AuthProvider
      useAuth()
      setIsAuthContextAvailable(true)
    } catch (error) {
      setIsAuthContextAvailable(false)
    }
  }, [])

  if (!isAuthContextAvailable) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
