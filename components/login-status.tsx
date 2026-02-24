"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function LoginStatus() {
  const [status, setStatus] = useState<{
    supabaseConnected: boolean
    authInitialized: boolean
    error: string | null
  }>({
    supabaseConnected: false,
    authInitialized: false,
    error: null,
  })

  useEffect(() => {
    async function checkStatus() {
      try {
        // Check if Supabase client is initialized
        if (!supabase || !supabase.auth) {
          setStatus({
            supabaseConnected: false,
            authInitialized: false,
            error: "Supabase client not initialized",
          })
          return
        }

        // Check if we can connect to Supabase
        const { error } = await supabase.from("profiles").select("id").limit(1)

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "JWT expired" which is expected if not logged in
          setStatus({
            supabaseConnected: false,
            authInitialized: true,
            error: `Supabase connection error: ${error.message}`,
          })
          return
        }

        setStatus({
          supabaseConnected: true,
          authInitialized: true,
          error: null,
        })
      } catch (err) {
        setStatus({
          supabaseConnected: false,
          authInitialized: false,
          error: err instanceof Error ? err.message : "Unknown error checking status",
        })
      }
    }

    checkStatus()
  }, [])

  if (status.error) {
    return (
      <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-900/50 text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Authentication service issue: {status.error}</AlertDescription>
      </Alert>
    )
  }

  if (status.supabaseConnected && status.authInitialized) {
    return (
      <Alert className="mt-4 bg-green-900/20 border-green-900/50 text-green-300">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>Authentication service is working properly</AlertDescription>
      </Alert>
    )
  }

  return null
}
