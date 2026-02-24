"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSeamlessAuth } from "@/contexts/seamless-auth-context"
import { createTestUser } from "@/lib/test-auth-service"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTestAccount, setShowTestAccount] = useState(false)

  const { signIn } = useSeamlessAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/chat"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password")
        setIsLoading(false)
        return
      }

      console.log("Attempting to sign in with:", { email })
      const { success, error } = await signIn(email, password)

      if (!success) {
        // Show test account option if login fails
        setShowTestAccount(true)

        // Provide more specific error message
        if (error?.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again or use the test account option below.")
        } else {
          setError(error || "Failed to sign in")
        }
        setIsLoading(false)
        return
      }

      router.push(redirect)
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setShowTestAccount(true)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestAccount = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { success, credentials, error } = await createTestUser()

      if (!success || !credentials) {
        setError(`Failed to create test account: ${error}`)
        setIsLoading(false)
        return
      }

      // Auto-fill the form with test credentials
      setEmail(credentials.email)
      setPassword(credentials.password)

      // Sign in with the test account
      const { success: signInSuccess, error: signInError } = await signIn(credentials.email, credentials.password)

      if (!signInSuccess) {
        setError(`Failed to sign in with test account: ${signInError}`)
        setIsLoading(false)
        return
      }

      router.push(redirect)
    } catch (err) {
      console.error("Test account error:", err)
      setError("Failed to create test account. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <CardContent>
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-midnight-800 border-neon-500/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password" className="text-sm text-neon-400 hover:text-neon-300">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-midnight-800 border-neon-500/20 text-white"
          />
        </div>
        <Button type="submit" className="w-full bg-neon-600 hover:bg-neon-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {showTestAccount && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Having trouble logging in? Use our test account:</p>
            <Button
              type="button"
              variant="outline"
              className="w-full border-neon-500/30 text-neon-400 hover:bg-neon-500/10 bg-transparent"
              onClick={handleTestAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Test Account...
                </>
              ) : (
                "Use Test Account"
              )}
            </Button>
          </div>
        )}
      </form>
    </CardContent>
  )
}
