"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function FallbackLogin() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setSuccess(false)

    try {
      // Direct Supabase login bypassing the context
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError("No user returned")
        setIsLoading(false)
        return
      }

      setSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="mt-2 text-center">
        <button onClick={() => setIsOpen(true)} className="text-xs text-neon-400 hover:text-neon-300 underline">
          Try alternative login method
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 border border-neon-500/20 rounded-lg bg-midnight-800">
      <h3 className="text-sm font-medium mb-2">Alternative Login Method</h3>

      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-900/20 border-green-900/50 text-green-300">
          <AlertDescription>Login successful! Redirecting...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleDirectLogin} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="direct-email" className="text-xs">
            Email
          </Label>
          <Input
            id="direct-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-8 text-sm"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="direct-password" className="text-xs">
            Password
          </Label>
          <Input
            id="direct-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 text-sm"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" disabled={isLoading || success} size="sm" className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Signing In...
            </>
          ) : (
            "Sign In Directly"
          )}
        </Button>
      </form>

      <div className="mt-3 text-center">
        <button onClick={() => setIsOpen(false)} className="text-xs text-neon-400 hover:text-neon-300 underline">
          Hide alternative login
        </button>
      </div>
    </div>
  )
}
