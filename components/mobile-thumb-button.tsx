"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface MobileThumbButtonProps {
  onNext?: () => void
  onSubmit?: () => void
  isLastQuestion?: boolean
  isSubmitting?: boolean
  disabled?: boolean
  position?: "left" | "right"
}

export function MobileThumbButton({
  onNext,
  onSubmit,
  isLastQuestion = false,
  isSubmitting = false,
  disabled = false,
  position = "right",
}: MobileThumbButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleClick = () => {
    if (isLastQuestion && onSubmit) {
      onSubmit()
    } else if (onNext) {
      onNext()
    }
  }

  const positionClasses = position === "left" ? "left-4 md:left-6" : "right-4 md:right-6"

  return (
    <div
      className={`fixed bottom-24 ${positionClasses} z-40 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isSubmitting}
        className={`
          h-16 w-16 md:h-20 md:w-20 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95
          ${
            isLastQuestion
              ? "bg-electric-600 hover:bg-electric-700 hover:shadow-electric-500/50"
              : "bg-neon-600 hover:bg-neon-700 hover:shadow-neon-500/50"
          }
          text-white border-0 hover:shadow-2xl
          ${position === "left" ? "hover:translate-x-1" : "hover:translate-x-[-4px]"}
        `}
        aria-label={isLastQuestion ? "Submit Assessment" : "Next Question"}
      >
        {isSubmitting ? (
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
          </div>
        ) : isLastQuestion ? (
          <CheckCircle className="h-8 w-8 md:h-10 md:w-10" />
        ) : (
          <ChevronRight className="h-8 w-8 md:h-10 md:w-10" />
        )}
      </Button>

      {/* Thumb guide indicator */}
      <div className="absolute -top-2 -left-2 h-4 w-4 bg-neon-400/20 rounded-full animate-ping"></div>
    </div>
  )
}
