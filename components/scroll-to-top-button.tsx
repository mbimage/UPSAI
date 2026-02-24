"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { SmoothScrollService } from "@/lib/smooth-scroll-service"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    const smoothScroll = SmoothScrollService.getInstance()
    smoothScroll.scrollToTop()
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-neon-600 hover:bg-neon-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
