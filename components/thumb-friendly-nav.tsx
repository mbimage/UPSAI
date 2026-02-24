"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ThumbFriendlyNavProps {
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  isLastQuestion?: boolean
  isSubmitting?: boolean
  currentQuestion?: number
  totalQuestions?: number
  showHomeButton?: boolean
}

export function ThumbFriendlyNav({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious = true,
  canGoNext = true,
  isLastQuestion = false,
  isSubmitting = false,
  currentQuestion = 1,
  totalQuestions = 10,
  showHomeButton = false,
}: ThumbFriendlyNavProps) {
  const router = useRouter()

  const handleNext = () => {
    if (isLastQuestion && onSubmit) {
      onSubmit()
    } else if (onNext) {
      onNext()
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:h-24"></div>

      {/* Fixed bottom navigation - thumb zone optimized */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-midnight-900 via-midnight-900/95 to-transparent backdrop-blur-sm border-t border-neon-500/20">
        <div className="container mx-auto px-4 py-3">
          {/* Progress indicator */}
          <div className="flex justify-center mb-3">
            <div className="bg-midnight-800/50 rounded-full px-3 py-1 text-xs text-gray-300">
              {currentQuestion} of {totalQuestions}
            </div>
          </div>

          {/* Button layout optimized for thumbs */}
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Previous/Back button (left thumb zone) */}
            <div className="flex-1 max-w-[140px]">
              {showHomeButton ? (
                <Button
                  onClick={handleHome}
                  variant="outline"
                  className="w-full h-14 border-neon-500/30 text-white hover:bg-neon-500/20 hover:border-neon-500/50 transition-all duration-200 rounded-2xl"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Button>
              ) : currentQuestion === 1 ? (
                <Button
                  onClick={() => router.push("/assessments")}
                  variant="outline"
                  className="w-full h-14 border-neon-500/30 text-white hover:bg-neon-500/20 hover:border-neon-500/50 transition-all duration-200 rounded-2xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
              ) : (
                <Button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  variant="outline"
                  className="w-full h-14 border-neon-500/30 text-white hover:bg-neon-500/20 hover:border-neon-500/50 transition-all duration-200 rounded-2xl disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>
              )}
            </div>

            {/* Center - Progress dots for quick navigation */}
            <div className="flex-1 flex justify-center">
              <div className="flex space-x-2 max-w-[200px] overflow-x-auto">
                {Array.from({ length: Math.min(totalQuestions, 5) }, (_, i) => {
                  const questionNum = i + 1
                  const isActive = questionNum === currentQuestion
                  const isCompleted = questionNum < currentQuestion

                  return (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        isActive ? "w-8 bg-neon-500" : isCompleted ? "w-2 bg-electric-500" : "w-2 bg-gray-600"
                      }`}
                    />
                  )
                })}
                {totalQuestions > 5 && (
                  <div className="text-xs text-gray-400 self-center ml-2">+{totalQuestions - 5}</div>
                )}
              </div>
            </div>

            {/* Right side - Next/Submit button (right thumb zone) */}
            <div className="flex-1 max-w-[140px]">
              <Button
                onClick={handleNext}
                disabled={!canGoNext || isSubmitting}
                className={`w-full h-14 text-white font-semibold transition-all duration-200 rounded-2xl ${
                  isLastQuestion
                    ? "bg-electric-600 hover:bg-electric-700 hover:shadow-lg hover:shadow-electric-500/30"
                    : "bg-neon-600 hover:bg-neon-700 hover:shadow-lg hover:shadow-neon-500/30"
                } disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-2">
                      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1.5 w-1.5 bg-white rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm">Saving...</span>
                  </div>
                ) : isLastQuestion ? (
                  <>
                    <span>Finish</span>
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Additional thumb-friendly quick actions */}
          <div className="flex justify-center mt-3 space-x-4">
            <button
              className="h-10 w-10 rounded-full bg-midnight-800/50 hover:bg-midnight-700/50 transition-colors duration-200 flex items-center justify-center text-gray-400 hover:text-white"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top"
            >
              ↑
            </button>
            <button
              className="h-10 w-10 rounded-full bg-midnight-800/50 hover:bg-midnight-700/50 transition-colors duration-200 flex items-center justify-center text-gray-400 hover:text-white"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              aria-label="Scroll to bottom"
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
