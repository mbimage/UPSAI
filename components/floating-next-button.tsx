"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle } from "lucide-react"

interface FloatingNextButtonProps {
  onNext: () => void
  onSubmit?: () => void
  isLastQuestion?: boolean
  isSubmitting?: boolean
  disabled?: boolean
}

export function FloatingNextButton({
  onNext,
  onSubmit,
  isLastQuestion = false,
  isSubmitting = false,
  disabled = false,
}: FloatingNextButtonProps) {
  const handleClick = () => {
    if (isLastQuestion && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        disabled={disabled || isSubmitting}
        className={`
          h-16 w-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95
          ${
            isLastQuestion
              ? "bg-electric-600 hover:bg-electric-700 hover:shadow-electric-500/40"
              : "bg-neon-600 hover:bg-neon-700 hover:shadow-neon-500/40"
          }
          text-white border-0 hover:shadow-xl
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
          <CheckCircle className="h-8 w-8" />
        ) : (
          <ChevronRight className="h-8 w-8" />
        )}
      </Button>
    </div>
  )
}
