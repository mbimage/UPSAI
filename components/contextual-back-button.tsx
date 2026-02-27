"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ContextualBackButtonProps {
  className?: string
  variant?: "default" | "minimal" | "header"
  showLabel?: boolean
  size?: "default" | "sm" | "lg" | "icon"
  destination?: string
}

export default function ContextualBackButton({
  className,
  variant = "default",
  showLabel = true,
  size = "default",
  destination,
}: ContextualBackButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if we can go back in browser history
    setCanGoBack(window.history.length > 1)
  }, [])

  const getSmartBackDestination = (): string => {
    if (destination) return destination

    // Define logical parent pages
    const pageHierarchy: Record<string, string> = {
      "/chat": "/dashboard",
      "/assessments": "/dashboard",
      "/resources": "/dashboard",
      "/feedback": "/dashboard",
      "/settings": "/dashboard",
      "/about": "/",
      "/contact": "/",
      "/privacy": "/",
      "/terms": "/",
      "/faq": "/",
      "/mission": "/about",
      "/how-to-use-ai": "/resources",
      "/inclusive-coaching": "/resources",
      "/ero-guide": "/resources",
    }

    // Check for dynamic routes
    if (pathname.startsWith("/resources/")) {
      return "/resources"
    }
    if (pathname.startsWith("/assessments/")) {
      return "/assessments"
    }
    if (pathname.startsWith("/admin/")) {
      return "/dashboard"
    }

    return pageHierarchy[pathname] || "/"
  }

  const getBackButtonLabel = (): string => {
    const destination = getSmartBackDestination()
    const labels: Record<string, string> = {
      "/": "Home",
      "/dashboard": "Dashboard",
      "/resources": "Resources",
      "/assessments": "Assessments",
      "/about": "About",
    }
    return labels[destination] || "Back"
  }

  const handleSmartBack = () => {
    // Try browser back first if available
    if (canGoBack) {
      router.back()
      return
    }

    // Fall back to logical parent
    const destination = getSmartBackDestination()
    router.push(destination)
  }

  // Don't render on home page
  if (pathname === "/") return null

  if (variant === "minimal") {
    return (
      <button
        onClick={handleSmartBack}
        className={cn(
          "flex items-center text-gray-400 hover:text-blue-400 transition-all duration-200 group",
          className,
        )}
        aria-label={`Back to ${getBackButtonLabel()}`}
      >
        <ChevronLeft className="h-5 w-5 mr-1 group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
        {showLabel && <span>{getBackButtonLabel()}</span>}
      </button>
    )
  }

  if (variant === "header") {
    return (
      <div className={cn("flex items-center", className)}>
        <Button
          onClick={handleSmartBack}
          variant="ghost"
          size={size}
          className="group text-gray-300 hover:text-white hover:bg-slate-800/50"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
          {showLabel && getBackButtonLabel()}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleSmartBack}
      size={size}
      variant="outline"
      className={cn(
        "rounded-full bg-slate-900/90 border-purple-500/30 hover:bg-slate-800/95 hover:border-purple-400/50 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 group",
        className,
      )}
      title={`Back to ${getBackButtonLabel()}`}
    >
      <ChevronLeft className="h-5 w-5 text-blue-400 group-hover:text-blue-300 group-hover:transform group-hover:-translate-x-0.5 transition-transform" />
      {showLabel && <span className="ml-1">{getBackButtonLabel()}</span>}
    </Button>
  )
}

// Add named export for compatibility
export { ContextualBackButton }
