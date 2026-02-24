"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface DemoLoginButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DemoLoginButton({ className, variant = "default", size = "default" }: DemoLoginButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    // Navigate to chat - demo mode works without auth
    router.push("/chat")
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden",
        variant === "default" && "bg-neon-600 text-white hover:bg-neon-700",
        className,
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Try Demo (No Login)"
      )}
    </Button>
  )
}
