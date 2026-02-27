"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Star, TrendingUp, BookOpen, Trophy, Users, ArrowRight, X, Lightbulb, Zap } from "lucide-react"
import Link from "next/link"

interface GoalPrompt {
  id: string
  title: string
  description: string
  category: "academic" | "athletic" | "social" | "personal" | "career"
  difficulty: "easy" | "medium" | "challenging"
  timeframe: string
  benefits: string[]
  icon: any
  color: string
}

const goalPrompts: GoalPrompt[] = [
  {
    id: "confidence-boost",
    title: "Build Your Confidence",
    description: "Start speaking up more in class and with friends",
    category: "personal",
    difficulty: "easy",
    timeframe: "2 weeks",
    benefits: ["Feel more confident", "Better relationships", "Improved grades"],
    icon: Star,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "study-habits",
    title: "Master Your Study Game",
    description: "Create a study routine that actually works for you",
    category: "academic",
    difficulty: "medium",
    timeframe: "1 month",
    benefits: ["Better grades", "Less stress", "More free time"],
    icon: BookOpen,
    color: "from-blue-400 to-purple-500",
  },
  {
    id: "team-leadership",
    title: "Become a Team Leader",
    description: "Step up as a leader on your team or in group projects",
    category: "athletic",
    difficulty: "challenging",
    timeframe: "3 months",
    benefits: ["Leadership skills", "Team respect", "College applications"],
    icon: Trophy,
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "social-connections",
    title: "Expand Your Circle",
    description: "Make meaningful connections with new people",
    category: "social",
    difficulty: "easy",
    timeframe: "1 month",
    benefits: ["New friendships", "Better social skills", "More opportunities"],
    icon: Users,
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "future-planning",
    title: "Plan Your Future",
    description: "Explore career paths and set up your next steps",
    category: "career",
    difficulty: "medium",
    timeframe: "2 months",
    benefits: ["Clear direction", "Better decisions", "Reduced anxiety"],
    icon: Target,
    color: "from-cyan-400 to-blue-500",
  },
]

export function GoalPrompts() {
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([])
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [showPrompts, setShowPrompts] = useState(true)

  const availablePrompts = goalPrompts.filter((prompt) => !dismissedPrompts.includes(prompt.id))
  const currentPrompt = availablePrompts[currentPromptIndex]

  const dismissPrompt = (promptId: string) => {
    setDismissedPrompts((prev) => [...prev, promptId])
    // Move to next prompt or hide if no more
    if (currentPromptIndex >= availablePrompts.length - 2) {
      setShowPrompts(false)
    }
  }

  const nextPrompt = () => {
    if (currentPromptIndex < availablePrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      case "medium":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
      case "challenging":
        return "bg-red-600/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-600/20 text-gray-300 border-gray-500/30"
    }
  }

  if (!showPrompts || !currentPrompt || availablePrompts.length === 0) {
    return null
  }

  const IconComponent = currentPrompt.icon

  return (
    <Card className="bg-midnight-900/80 border-neon-500/30 backdrop-blur-sm shadow-neon-500/20 relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentPrompt.color} opacity-5`} />

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${currentPrompt.color} shadow-lg`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Ready for a new challenge?</CardTitle>
              <CardDescription className="text-neon-200/80">
                Here's a goal that could make a real difference for you
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissPrompt(currentPrompt.id)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Goal Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">{currentPrompt.title}</h3>
            <Badge variant="outline" className={getDifficultyColor(currentPrompt.difficulty)}>
              {currentPrompt.difficulty}
            </Badge>
          </div>

          <p className="text-gray-300">{currentPrompt.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="capitalize">{currentPrompt.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{currentPrompt.timeframe}</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-neon-400" />
            What you'll gain:
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentPrompt.benefits.map((benefit, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-neon-600/20 text-neon-300 border-neon-500/30 text-xs"
              >
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        {availablePrompts.length > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Goal suggestions</span>
              <span>
                {currentPromptIndex + 1} of {availablePrompts.length}
              </span>
            </div>
            <Progress value={((currentPromptIndex + 1) / availablePrompts.length) * 100} className="h-1" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-midnight-900 font-semibold"
          >
            <Link href={`/goals/create?template=${currentPrompt.id}`}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Let's Do This!
            </Link>
          </Button>

          {availablePrompts.length > 1 && currentPromptIndex < availablePrompts.length - 1 && (
            <Button variant="outline" onClick={nextPrompt} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick alternative */}
        <div className="text-center pt-2 border-t border-gray-700/50">
          <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-neon-300">
            <Link href="/goals/create">Or create your own goal from scratch</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
