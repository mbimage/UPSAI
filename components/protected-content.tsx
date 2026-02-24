"use client"

import type React from "react"

import { useState } from "react"
import { useSeamlessAuth } from "@/contexts/seamless-auth-context"
import { SeamlessAuthPrompt } from "@/components/seamless-auth-prompt"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface ProtectedContentProps {
  children: React.ReactNode
  message?: string
  blurContent?: boolean
}

export function ProtectedContent({
  children,
  message = "Sign in to view this content",
  blurContent = true,
}: ProtectedContentProps) {
  const { user } = useSeamlessAuth()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  if (user) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Content with optional blur */}
      <div className={blurContent ? "blur-sm pointer-events-none" : ""}>{children}</div>

      {/* Auth overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-midnight-950/70 backdrop-blur-sm">
        <div className="text-center p-6 max-w-md">
          <Lock className="mx-auto h-12 w-12 text-neon-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Protected Content</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <Button
            onClick={() => setShowAuthPrompt(true)}
            className="bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-600 hover:to-electric-600 text-white"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>

      {/* Auth prompt */}
      {showAuthPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-midnight-950/80 backdrop-blur-md">
          <div className="relative max-w-md w-full">
            <SeamlessAuthPrompt
              onClose={() => setShowAuthPrompt(false)}
              onSuccess={() => setShowAuthPrompt(false)}
              message={message}
            />
          </div>
        </div>
      )}
    </div>
  )
}
