"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Target, Lightbulb, ArrowRight, Sparkles, CheckCircle } from "lucide-react"

interface GoalPrompt {
  id: string
  text: string
  category: string
  example: string
}

const goalPrompts: GoalPrompt[] = [
  {
    id: "confidence",
    text: "What would make you feel more confident?",
    category: "Personal Growth",
    example: "Speak up in class discussions",
  },
  {
    id: "academic",
    text: "Which subject could you improve in?",
    category: "Academic",
    example: "Raise my math grade to a B+",
  },
  {
    id: "social",
    text: "How could you strengthen your relationships?",
    category: "Social",
    example: "Make two new friends this semester",
  },
  {
    id: "athletic",
    text: "What athletic goal excites you?",
    category: "Athletic",
    example: "Make the varsity team",
  },
  {
    id: "leadership",
    text: "Where could you show more leadership?",
    category: "Leadership",
    example: "Run for student council",
  },
  {
    id: "skills",
    text: "What new skill would benefit you?",
    category: "Skills",
    example: "Learn to code or play guitar",
  },
  {
    id: "future",
    text: "What step toward your future matters most?",
    category: "Future Planning",
    example: "Research colleges I want to attend",
  },
]

export function GoalInputWithPrompts() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [goalTitle, setGoalTitle] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [isPromptVisible, setIsPromptVisible] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const currentPrompt = goalPrompts[currentPromptIndex]

  // Auto-cycle through prompts
  useEffect(() => {
    if (!goalTitle && !goalDescription) {
      const interval = setInterval(() => {
        setIsPromptVisible(false)
        setTimeout(() => {
          setCurrentPromptIndex((prev) => (prev + 1) % goalPrompts.length)
          setIsPromptVisible(true)
        }, 300) // Half second fade out before changing
      }, 4000) // Change every 4 seconds

      return () => clearInterval(interval)
    }
  }, [goalTitle, goalDescription])

  const handlePromptClick = (prompt: GoalPrompt) => {
    setGoalTitle(prompt.example)
    setGoalDescription(`I want to ${prompt.example.toLowerCase()} because it will help me grow and build confidence.`)
  }

  const handleCreateGoal = async () => {
    if (!goalTitle.trim()) return

    setIsCreating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsCreating(false)
    setShowSuccess(true)

    // Reset after success
    setTimeout(() => {
      setShowSuccess(false)
      setGoalTitle("")
      setGoalDescription("")
    }, 3000)
  }

  if (showSuccess) {
    return (
      <Card className="bg-midnight-900/80 border-green-500/30 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Goal Created! 🎉</h3>
              <p className="text-gray-300">You're on your way to achieving "{goalTitle}"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-midnight-900/80 border-neon-500/30 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-400/5 to-electric-400/5 animate-pulse" />

      <CardHeader className="relative">
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-neon-400" />
          Create Your Goal
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Fading Prompt Section */}
        <div className="min-h-[120px] flex items-center justify-center">
          <div
            className={`text-center space-y-3 transition-all duration-500 ${
              isPromptVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            <Badge variant="outline" className="bg-neon-600/20 text-neon-300 border-neon-500/30 mb-2">
              {currentPrompt.category}
            </Badge>
            <h3 className="text-xl font-semibold text-white mb-3">{currentPrompt.text}</h3>
            <Button
              variant="outline"
              onClick={() => handlePromptClick(currentPrompt)}
              className="border-electric-500/50 text-electric-300 hover:bg-electric-500/20 group"
            >
              <Lightbulb className="h-4 w-4 mr-2 group-hover:text-electric-200" />
              Try: "{currentPrompt.example}"
            </Button>
          </div>
        </div>

        {/* Goal Input Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-white font-medium text-sm">What's your goal?</label>
            <Input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Enter your goal here..."
              className="bg-midnight-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-neon-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white font-medium text-sm">Why is this important to you? (optional)</label>
            <Textarea
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="This goal matters to me because..."
              className="bg-midnight-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-neon-500 min-h-[80px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleCreateGoal}
            disabled={!goalTitle.trim() || isCreating}
            className="flex-1 bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-midnight-900 font-semibold disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Creating Goal...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentPromptIndex((prev) => (prev + 1) % goalPrompts.length)
              setIsPromptVisible(false)
              setTimeout(() => setIsPromptVisible(true), 100)
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-1">
          {goalPrompts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPromptIndex ? "bg-neon-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Helper Text */}
        <div className="text-center text-xs text-gray-400">
          {goalTitle
            ? "Looking good! Add more details or create your goal."
            : "Watch the prompts change or click one to get started"}
        </div>
      </CardContent>
    </Card>
  )
}
