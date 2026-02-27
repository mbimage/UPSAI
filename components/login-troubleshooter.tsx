"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LoginTroubleshooter() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<Record<string, any>>({})
  const [isChecking, setIsChecking] = useState(false)

  const checkSupabaseConnection = async () => {
    setIsChecking(true)
    const results: Record<string, any> = {}

    try {
      // Check if we have the Supabase URL and key
      results.hasConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Check if we can connect to Supabase
      const start = Date.now()
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      const end = Date.now()

      results.connectionSuccess = !error
      results.connectionTime = `${end - start}ms`
      results.connectionError = error ? error.message : null

      // Check local storage
      results.hasLocalStorage = typeof window !== "undefined" && !!window.localStorage
      if (results.hasLocalStorage) {
        const testKey = `test_${Date.now()}`
        try {
          localStorage.setItem(testKey, "test")
          localStorage.removeItem(testKey)
          results.localStorageWorks = true
        } catch (e) {
          results.localStorageWorks = false
          results.localStorageError = e instanceof Error ? e.message : "Unknown error"
        }
      }

      // Check for stored demo credentials
      if (results.hasLocalStorage && results.localStorageWorks) {
        results.hasDemoEmail = !!localStorage.getItem("demoUserEmail")
        results.hasDemoPassword = !!localStorage.getItem("demoUserPassword")
      }

      setStatus(results)
    } catch (error) {
      results.unexpectedError = error instanceof Error ? error.message : "Unknown error"
      setStatus(results)
    } finally {
      setIsChecking(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="mt-4 text-center">
        <button onClick={() => setIsOpen(true)} className="text-xs text-neon-400 hover:text-neon-300 underline">
          Having trouble logging in?
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 p-4 border border-neon-500/20 rounded-lg bg-midnight-800">
      <h3 className="text-sm font-medium mb-2">Login Troubleshooter</h3>

      <Button size="sm" variant="outline" onClick={checkSupabaseConnection} disabled={isChecking} className="mb-4">
        {isChecking ? "Checking..." : "Check Connection Status"}
      </Button>

      {Object.keys(status).length > 0 && (
        <Alert className="bg-midnight-700 border-neon-500/30">
          <AlertTitle>Diagnostic Results</AlertTitle>
          <AlertDescription>
            <pre className="text-xs mt-2 overflow-auto max-h-40">{JSON.stringify(status, null, 2)}</pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 text-xs">
        <p>Try these troubleshooting steps:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Clear your browser cache and cookies</li>
          <li>Try using a different browser</li>
          <li>Check your internet connection</li>
          <li>Make sure you're using the correct email and password</li>
          <li>If you're using a demo account, try creating a new one</li>
        </ul>
      </div>

      <div className="mt-4 text-center">
        <button onClick={() => setIsOpen(false)} className="text-xs text-neon-400 hover:text-neon-300 underline">
          Hide troubleshooter
        </button>
      </div>
    </div>
  )
}
