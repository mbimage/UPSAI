"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SeamlessAuthPromptProps {
  onClose: () => void
  onSuccess: () => void
  mode?: "minimal" | "full"
  message?: string
}

export function SeamlessAuthPrompt({
  onClose,
  onSuccess,
  mode = "minimal",
  message = "Sign in to continue",
}: SeamlessAuthPromptProps) {
  const router = useRouter()

  const handleContinue = () => {
    // Just close the prompt and trigger success
    onSuccess()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="bg-midnight-900 border border-neon-500/20 rounded-lg p-6 max-w-md w-full shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Continue as Guest</h2>
      <p className="text-gray-400 mb-6">{message}</p>

      <div className="flex flex-col gap-3">
        <Button onClick={handleContinue} className="w-full bg-neon-600 hover:bg-neon-700">
          Continue as Guest
        </Button>
        {mode === "full" && (
          <Button variant="outline" onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
