"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { LoginTroubleshooter } from "@/components/login-troubleshooter"
import { FallbackLogin } from "@/components/fallback-login"
import { useSeamlessAuth } from "@/contexts/seamless-auth-context"
import { Loader2 } from "lucide-react"
import { useSupabaseStatus } from "@/hooks/use-supabase-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { DemoLoginButton } from "@/components/demo-login-button"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Dynamically import the login form with client-side only rendering
const LoginForm = dynamic(() => import("@/components/login-form"), {
  ssr: false,
  loading: () => <LoginFormSkeleton />,
})

export default function LoginClient() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const defaultTab = tab === "passwordless" ? "passwordless" : "password"
  const { isLoading: authLoading } = useSeamlessAuth()
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState<boolean | null>(null)
  const [showTroubleshooter, setShowTroubleshooter] = useState(false)
  const supabaseStatus = useSupabaseStatus()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    // Check if Supabase is available
    setIsSupabaseAvailable(supabaseStatus.available)

    // Show troubleshooter after a delay if Supabase is not available
    if (supabaseStatus.available === false) {
      const timer = setTimeout(() => {
        setShowTroubleshooter(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [supabaseStatus.available])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!supabase) {
      setMessage({ type: "error", text: "Authentication is not configured. Please try again later." })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: "Check your email for a magic link to sign in!",
      })
      setEmail("")
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send magic link. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-neon-500" />
          <p className="mt-4 text-neon-400">Initializing authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-midnight-950 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-midnight-900 border-neon-500/10 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Choose how you'd like to sign in</p>
              </div>

              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="passwordless">Magic Link</TabsTrigger>
                </TabsList>
                <TabsContent value="password">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="passwordless">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="athlete@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="text-base"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    {message && (
                      <div
                        className={`p-3 rounded-md text-sm ${
                          message.type === "success"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending magic link...
                        </>
                      ) : (
                        "Continue with Email"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      We'll send you a magic link to sign in. No password needed.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              <p className="px-8 text-center text-sm text-muted-foreground">
                <Link href="/signup" className="hover:text-brand underline underline-offset-4">
                  Don't have an account? Sign up
                </Link>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <DemoLoginButton />
            </div>
          </CardContent>
          <LoginTroubleshooter />
          <FallbackLogin />
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-neon-400 hover:text-neon-300">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Skeleton loader for the login form
function LoginFormSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  )
}
