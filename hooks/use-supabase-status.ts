"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useSupabaseStatus() {
  const [status, setStatus] = useState<{
    isConnected: boolean
    error: string | null
    latency: number | null
    lastChecked: Date | null
  }>({
    isConnected: false,
    error: null,
    latency: null,
    lastChecked: null,
  })

  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    if (isChecking) return

    setIsChecking(true)

    try {
      const start = Date.now()
      const { error } = await supabase.from("profiles").select("count").limit(1)
      const end = Date.now()

      setStatus({
        isConnected: !error,
        error: error ? error.message : null,
        latency: end - start,
        lastChecked: new Date(),
      })
    } catch (err) {
      setStatus({
        isConnected: false,
        error: err instanceof Error ? err.message : "Unknown error",
        latency: null,
        lastChecked: new Date(),
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check connection on mount
    checkConnection()

    // Set up interval to check connection periodically
    const interval = setInterval(checkConnection, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return {
    ...status,
    isChecking,
    checkConnection,
  }
}
