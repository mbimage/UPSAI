"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { checkInviteEmail } from "@/app/actions/check-invite"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name.trim()) {
      setError("Name is required")
      setIsSubmitting(false)
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      setIsSubmitting(false)
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsSubmitting(false)
      return
    }

    if (!supabase) {
      setError("Authentication is not configured. Please try again later.")
      setIsSubmitting(false)
      return
    }

    // Invite-only beta: block accounts that aren't on the allowlist.
    const invite = await checkInviteEmail(formData.email)
    if (!invite.allowed) {
      setError(
        "UpSide is in a private, invite-only beta. This email isn't on the invite list yet. Reach out to whoever invited you to get added.",
      )
      setIsSubmitting(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsSubmitting(false)
        return
      }

      if (data.user) {
        setSuccess(true)
        // If email confirmation is disabled, redirect directly
        if (data.session) {
          setTimeout(() => {
            router.push("/chat")
          }, 1500)
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-midnight-950 p-4">
        <Card className="w-full max-w-md bg-midnight-900 border-neon-500/20 text-white">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-neon-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Account Created!</h2>
            <p className="text-gray-400 mb-4">
              Check your email to confirm your account, then you can start chatting.
            </p>
            <Button 
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-midnight-950 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-midnight-900 border-neon-500/20 text-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign up to start chatting with UpSide AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-midnight-800 border-neon-500/20 text-white placeholder:text-gray-500 focus:border-neon-500/50"
                  autoComplete="name"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-midnight-800 border-neon-500/20 text-white placeholder:text-gray-500 focus:border-neon-500/50"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="bg-midnight-800 border-neon-500/20 text-white placeholder:text-gray-500 focus:border-neon-500/50"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 text-white font-medium h-11"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-neon-400 hover:text-neon-300 underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
