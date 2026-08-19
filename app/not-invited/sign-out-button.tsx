"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()
    try {
      await supabase?.auth.signOut()
    } finally {
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="w-full bg-gradient-to-r from-neon-500 to-electric-500 text-white hover:from-neon-400 hover:to-electric-400"
    >
      {isSigningOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  )
}
