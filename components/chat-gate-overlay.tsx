"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatGateOverlayProps {
  /** How many free questions the visitor has already used (sent to storage). */
  questionsUsed: number
  /** Prefilled email when we already know it (e.g. a signed-in visitor). */
  defaultEmail?: string
  /** Resolve to an error string to show, or null on success. */
  onSubmit: (email: string) => Promise<string | null>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The lock screen shown over the (blurred) transcript once the free-question
// limit is reached. A single email field is all that stands between the visitor
// and continuing the conversation.
export function ChatGateOverlay({ questionsUsed, defaultEmail = "", onSubmit }: ChatGateOverlayProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const value = email.trim()
    if (!EMAIL_REGEX.test(value)) {
      setError("Please enter a valid email address.")
      return
    }

    setError(null)
    setIsSubmitting(true)
    const result = await onSubmit(value)
    setIsSubmitting(false)
    if (result) setError(result)
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
      {/* Dim + blur the transcript sitting behind the card. */}
      <div className="absolute inset-0 bg-midnight-950/70 backdrop-blur-md" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-gate-title"
        className="relative w-full max-w-md animate-fadeIn rounded-3xl border border-neon-500/25 bg-midnight-900/90 p-6 shadow-2xl shadow-black/40 md:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <span
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-neon-500/30 bg-neon-500/10 text-neon-400 shadow-[0_0_18px_rgba(153,51,255,0.35)]"
            aria-hidden="true"
          >
            <Mail className="h-6 w-6" />
          </span>

          <h2 id="chat-gate-title" className="text-balance text-xl font-semibold text-white md:text-2xl">
            Keep the conversation going
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-gray-300">
            You&apos;ve used your {questionsUsed} free questions. Drop your email to keep talking with UpSide — no
            password, no cost.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3" noValidate>
          <div>
            <label htmlFor="chat-gate-email" className="sr-only">
              Email address
            </label>
            <Input
              id="chat-gate-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              placeholder="you@email.com"
              aria-invalid={!!error}
              aria-describedby={error ? "chat-gate-error" : undefined}
              className="h-12 rounded-xl border-2 border-neon-500/30 bg-midnight-800 text-base text-white placeholder:text-gray-500 focus-visible:border-neon-500/60 focus-visible:ring-2 focus-visible:ring-neon-500/20 focus-visible:ring-offset-0"
            />
            {error && (
              <p id="chat-gate-error" role="alert" className="mt-2 text-sm text-amber-300">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-neon-500 to-electric-500 text-base font-medium text-white",
              "hover:from-neon-400 hover:to-electric-400 active:scale-[0.99] disabled:opacity-70",
            )}
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
          We&apos;ll only use this to keep in touch about UpSide.
        </p>
      </div>
    </div>
  )
}
