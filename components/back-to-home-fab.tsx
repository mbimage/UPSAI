"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface NavigationHistory {
  path: string
  timestamp: number
}

export default function BackToHomeFab() {
  const pathname = usePathname()
  const router = useRouter()
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([])
  const [canGoBack, setCanGoBack] = useState(false)
  const [isVisible, setIsVisible] = useState(pathname !== "/")
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [touchStartX, setTouchStartX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    setIsVisible(pathname !== "/")
  }, [pathname])

  // Track navigation history
  useEffect(() => {
    const newEntry: NavigationHistory = {
      path: pathname,
      timestamp: Date.now(),
    }

    setNavigationHistory((prev) => {
      const filtered = prev.filter((entry) => entry.path !== pathname)
      return [...filtered, newEntry].slice(-10) // Keep last 10 entries
    })

    // Check if we can go back
    setCanGoBack(window.history.length > 1)
  }, [pathname])

  // Track scroll position to hide/show on mobile
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      setHasScrolled(scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault()
        handleSmartBack()
      }
      if (e.altKey && e.key === "h") {
        e.preventDefault()
        router.push("/")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  // Touch swipe navigation for mobile
  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX)
      setIsSwiping(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return

      const touchX = e.touches[0].clientX
      const diff = touchStartX - touchX

      // If swiping left to right (diff is negative) and we're not on the home page
      if (diff < -100 && pathname !== "/") {
        setIsSwiping(false)
        handleSmartBack()
      }
    }

    const handleTouchEnd = () => {
      setIsSwiping(false)
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobile, touchStartX, pathname])

  const getSmartBackDestination = (): string => {
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

  const handleSmartBack = () => {
    // Try browser back first if available and makes sense
    if (canGoBack && navigationHistory.length > 1) {
      const previousPage = navigationHistory[navigationHistory.length - 2]
      if (previousPage && Date.now() - previousPage.timestamp < 300000) {
        // 5 minutes
        router.back()
        return
      }
    }

    // Fall back to logical parent
    const destination = getSmartBackDestination()
    router.push(destination)
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

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-20 left-4 z-40 flex flex-col gap-2 transition-all duration-300 ease-in-out",
        isMobile && hasScrolled ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100",
      )}
    >
      {/* Home Button */}
      <Link href="/" className="block md:hidden">
        <Button
          size="lg"
          className="rounded-full h-12 w-12 bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-400/95 hover:to-purple-400/95 shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 transition-all duration-200 hover:scale-105"
          title="Home (Alt + H)"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>

      {/* Back Button - Desktop only */}
      <Button
        onClick={handleSmartBack}
        size="lg"
        variant="outline"
        className="rounded-full h-12 w-12 md:w-auto md:px-4 bg-slate-900/90 border-purple-500/30 hover:bg-slate-800/95 hover:border-purple-400/50 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 group hidden md:flex"
        title={`${getBackButtonLabel()} (Alt + ←)`}
      >
        <ChevronLeft className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
        <span className="hidden md:inline ml-1 text-gray-300 group-hover:text-white">{getBackButtonLabel()}</span>
      </Button>

      {/* Swipe indicator for mobile - only shows briefly when page loads */}
      {isMobile && (
        <div
          className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-neon-500/20 rounded-full p-2 animate-pulse opacity-0 animate-fade-out pointer-events-none"
          style={{ animation: "pulse 2s infinite, fadeOut 3s forwards" }}
        >
          <ChevronLeft className="h-6 w-6 text-neon-400" />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeOut {
          0% { opacity: 0.7; }
          70% { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
