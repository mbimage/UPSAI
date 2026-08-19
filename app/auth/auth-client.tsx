"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/seamless-auth-context"
import { Loader2, Lock, ArrowLeft } from "lucide-react"

// Only allow internal redirects (prevent open-redirect via ?redirect=).
function safeRedirect(target: string | null): string {
  if (!target) return "/chat"
  if (target.startsWith("/") && !target.startsWith("//")) return target
  return "/chat"
}

export default function AuthClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp } = useAuth()

  const redirectTo = safeRedirect(searchParams.get("redirect"))
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  )
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === "signup"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.")
      return
    }
    if (isSignup && password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setSubmitting(true)
    const result = isSignup ? await signUp(trimmedEmail, password) : await signIn(trimmedEmail, password)
    setSubmitting(false)

    if (!result.success) {
      // Genericize the credential signal to avoid account enumeration.
      if (!isSignup) {
        setError("Invalid email or password.")
      } else {
        setError(result.error || "We couldn't create your account. Please try again.")
      }
      return
    }

    // Refresh so server components re-read the new session, then continue.
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-midnight-950 px-4 py-10 text-foreground">
      {/* Subtle brand glow, consistent with the rest of the app */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-500/10 blur-3xl"
      />

      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      <div className="relative w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
            Up
            <span className="relative">
              Side
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-gradient-to-r from-neon-400 to-electric-400"
              />
            </span>
            {" AI"}
          </span>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-gray-400">
            {isSignup
              ? "Create a free account to save your conversations privately and continue across devices."
              : "Welcome back. Sign in to pick up where you left off."}
          </p>
        </div>

        <div className="rounded-2xl border border-neon-500/20 bg-midnight-900/70 p-6 backdrop-blur-md md:p-8">
          {/* Mode toggle */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-midnight-800 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin")
                setError(null)
              }}
              className={
                "rounded-lg py-2 text-sm font-medium transition-colors " +
                (!isSignup ? "bg-neon-500/90 text-white" : "text-gray-400 hover:text-white")
              }
              aria-pressed={!isSignup}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup")
                setError(null)
              }}
              className={
                "rounded-lg py-2 text-sm font-medium transition-colors " +
                (isSignup ? "bg-neon-500/90 text-white" : "text-gray-400 hover:text-white")
              }
              aria-pressed={isSignup}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-midnight-800 border-neon-500/25 text-white placeholder:text-gray-500 focus-visible:border-neon-500/60 focus-visible:ring-neon-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "At least 8 characters" : "Your password"}
                required
                minLength={isSignup ? 8 : undefined}
                className="bg-midnight-800 border-neon-500/25 text-white placeholder:text-gray-500 focus-visible:border-neon-500/60 focus-visible:ring-neon-500/20"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-900/20 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-neon-500 to-electric-500 text-white hover:from-neon-400 hover:to-electric-400"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignup ? "Creating account…" : "Signing in…"}
                </>
              ) : isSignup ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Privacy notice */}
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-midnight-800/60 px-3 py-3">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-neon-400" />
            <p className="text-xs leading-relaxed text-gray-400">
              Your conversations are private to your account and protected by row-level security, so no one else can
              read them. We store your email and your chat history to sync across your devices. You can rename or delete
              any conversation at any time.{" "}
              <Link href="/privacy" className="text-neon-400 underline-offset-2 hover:underline">
                Read our privacy notice
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          You can also{" "}
          <Link href="/chat" className="text-gray-300 underline-offset-2 hover:text-white hover:underline">
            continue as a guest
          </Link>{" "}
          — guest chats aren&apos;t saved.
        </p>
      </div>
    </div>
  )
}
