"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, X, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SuggestionBannerProps {
  trigger?: "no-goals" | "completed-goal" | "inactive" | "new-user"
  className?: string
}

export function GoalSuggestionBanner({ trigger = "no-goals", className }: SuggestionBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const getContent = () => {
    switch (trigger) {
      case "no-goals":
        return {
          title: "Ready to level up? 🚀",
          description: "Set your first goal and start your growth journey!",
          cta: "Create My First Goal",
          color: "from-neon-400 to-electric-400",
        }
      case "completed-goal":
        return {
          title: "Amazing work! 🎉",
          description: "You crushed that goal! Ready for your next challenge?",
          cta: "Set Another Goal",
          color: "from-green-400 to-emerald-400",
        }
      case "inactive":
        return {
          title: "Miss us? 👋",
          description: "It's been a while! A new goal might be just what you need.",
          cta: "Get Back on Track",
          color: "from-purple-400 to-pink-400",
        }
      case "new-user":
        return {
          title: "Welcome to UpSide AI! ✨",
          description: "Let's start with a goal that's perfect for you.",
          cta: "Get Started",
          color: "from-cyan-400 to-blue-400",
        }
      default:
        return {
          title: "Time for a new goal? 🎯",
          description: "Keep the momentum going with another challenge!",
          cta: "Create Goal",
          color: "from-neon-400 to-electric-400",
        }
    }
  }

  const content = getContent()

  return (
    <Card className={`bg-midnight-900/60 border-neon-500/30 backdrop-blur-sm relative overflow-hidden ${className}`}>
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${content.color} opacity-10 animate-pulse`} />

      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${content.color} shadow-lg`}>
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{content.title}</h3>
              <p className="text-gray-300 text-sm">{content.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className={`bg-gradient-to-r ${content.color} hover:opacity-90 text-midnight-900 font-semibold`}
            >
              <Link href="/goals/create">
                {content.cta}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
