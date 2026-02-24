"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, Sparkles, ArrowRight, Lightbulb } from "lucide-react"

const inspirationalPrompts = [
  "What would make you proud of yourself?",
  "What challenge excites you most?",
  "What skill would change your life?",
  "What would boost your confidence?",
  "What dream feels just out of reach?",
  "What would your future self thank you for?",
  "What small step could make a big difference?",
  "What would make this year unforgettable?",
]

const quickGoalSuggestions = [
  "Read 12 books this year",
  "Learn a new language",
  "Make the honor roll",
  "Join a new club or team",
  "Volunteer in my community",
  "Start a creative project",
  "Improve my public speaking",
  "Build a stronger friendship",
]

export function AnimatedGoalCreator() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const [goalInput, setGoalInput] = useState("")
  const [isPromptFading, setIsPromptFading] = useState(false)
  const [isSuggestionFading, setIsSuggestionFading] = useState(false)
  const [showInput, setShowInput] = useState(false)

  // Auto-cycle prompts
  useEffect(() => {
    const promptInterval = setInterval(() => {
      setIsPromptFading(true)
      setTimeout(() => {
        setCurrentPrompt((prev) => (prev + 1) % inspirationalPrompts.length)
        setIsPromptFading(false)
      }, 500)
    }, 3500)

    return () => clearInterval(promptInterval)
  }, [])

  // Auto-cycle suggestions
  useEffect(() => {
    const suggestionInterval = setInterval(() => {
      setIsSuggestionFading(true)
      setTimeout(() => {
        setCurrentSuggestion((prev) => (prev + 1) % quickGoalSuggestions.length)
        setIsSuggestionFading(false)
      }, 400)
    }, 2800)

    return () => clearInterval(suggestionInterval)
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setGoalInput(suggestion)
    setShowInput(true)
  }

  const handleStartTyping = () => {
    setShowInput(true)
  }

  return (
    <div className="space-y-4">
      {/* Main Prompt Card */}
      <Card className="bg-midnight-900/80 border-neon-500/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-400/5 to-electric-400/5" />

        <CardContent className="p-8 text-center relative">
          <div className="space-y-6">
            {/* Animated Prompt */}
            <div className="min-h-[60px] flex items-center justify-center">
              <h2
                className={`text-2xl md:text-3xl font-bold text-white transition-all duration-500 ${
                  isPromptFading ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
                }`}
              >
                {inspirationalPrompts[currentPrompt]}
              </h2>
            </div>

            {/* Goal Input */}
            <div
              className={`transition-all duration-500 ${
                showInput ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
              }`}
            >
              {showInput && (
                <div className="space-y-4">
                  <Input
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Type your goal here..."
                    className="text-lg p-4 bg-midnight-800/50 border-neon-500/50 text-white placeholder:text-gray-400 focus:border-neon-400"
                    autoFocus
                  />
                  <Button
                    disabled={!goalInput.trim()}
                    className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-midnight-900 font-semibold px-8"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Create This Goal
                  </Button>
                </div>
              )}
            </div>

            {/* Start Button */}
            {!showInput && (
              <Button
                onClick={handleStartTyping}
                size="lg"
                className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-midnight-900 font-semibold px-8 py-3"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      {!showInput && (
        <Card className="bg-midnight-900/60 border-electric-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-electric-300">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-medium">Quick Ideas</span>
              </div>

              <div className="min-h-[40px] flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleSuggestionClick(quickGoalSuggestions[currentSuggestion])}
                  className={`border-electric-500/50 text-electric-300 hover:bg-electric-500/20 transition-all duration-400 ${
                    isSuggestionFading ? "opacity-50 transform scale-95" : "opacity-100 transform scale-100"
                  }`}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {quickGoalSuggestions[currentSuggestion]}
                </Button>
              </div>

              <div className="flex justify-center space-x-1">
                {quickGoalSuggestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSuggestion ? "bg-electric-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
