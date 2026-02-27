"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Clock, TrendingUp, Star, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"

interface NudgeProps {
  userActivity?: {
    lastGoalCreated?: Date
    completedGoals?: number
    currentStreak?: number
    preferredCategories?: string[]
  }
}

export function SmartGoalNudges({ userActivity }: NudgeProps) {
  const [currentNudge, setCurrentNudge] = useState(0)
  const [showNudges, setShowNudges] = useState(true)

  // Smart nudges based on user behavior
  const getNudges = () => {
    const nudges = []

    // No goals yet
    if (!userActivity?.completedGoals || userActivity.completedGoals === 0) {
      nudges.push({
        type: "first-goal",
        title: "Your journey starts with one goal 🌟",
        description: "Most successful students start with just one small, achievable goal.",
        action: "Create Your First Goal",
        urgency: "high",
        timeframe: "5 minutes",
        benefits: ["Build confidence", "Create momentum", "Start winning"],
      })
    }

    // Completed goals but no recent activity
    if (userActivity?.lastGoalCreated) {
      const daysSinceLastGoal = Math.floor(
        (Date.now() - userActivity.lastGoalCreated.getTime()) / (1000 * 60 * 60 * 24),
      )
      if (daysSinceLastGoal > 14) {
        nudges.push({
          type: "comeback",
          title: "Ready to get back in the game? 🏆",
          description: `It's been ${daysSinceLastGoal} days since your last goal. Time to level up again!`,
          action: "Set New Challenge",
          urgency: "medium",
          timeframe: "10 minutes",
          benefits: ["Rebuild momentum", "Stay on track", "Keep growing"],
        })
      }
    }

    // Streak building
    if (userActivity?.currentStreak && userActivity.currentStreak > 0) {
      nudges.push({
        type: "streak",
        title: `Keep that ${userActivity.currentStreak}-day streak alive! 🔥`,
        description: "You're on a roll! Don't break the chain - set another goal to keep growing.",
        action: "Extend Streak",
        urgency: "medium",
        timeframe: "7 minutes",
        benefits: ["Maintain momentum", "Build habits", "Stay motivated"],
      })
    }

    // Seasonal/contextual nudges
    const currentMonth = new Date().getMonth()
    if (currentMonth === 0) {
      // January
      nudges.push({
        type: "new-year",
        title: "New year, new goals! ✨",
        description: "Start 2025 strong with a goal that matters to you.",
        action: "Set 2025 Goal",
        urgency: "high",
        timeframe: "8 minutes",
        benefits: ["Fresh start", "Clear direction", "Build momentum"],
      })
    }

    if (currentMonth >= 7 && currentMonth <= 9) {
      // Back to school season
      nudges.push({
        type: "school-year",
        title: "New school year, new opportunities! 📚",
        description: "Set a goal to make this your best school year yet.",
        action: "Plan School Success",
        urgency: "high",
        timeframe: "10 minutes",
        benefits: ["Better grades", "More confidence", "Stronger future"],
      })
    }

    return nudges.length > 0
      ? nudges
      : [
          {
            type: "general",
            title: "Time to challenge yourself! 💪",
            description: "Growth happens when you step outside your comfort zone.",
            action: "Create New Goal",
            urgency: "low",
            timeframe: "5 minutes",
            benefits: ["Personal growth", "New skills", "Increased confidence"],
          },
        ]
  }

  const nudges = getNudges()
  const nudge = nudges[currentNudge]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "from-red-400 to-orange-400"
      case "medium":
        return "from-yellow-400 to-amber-400"
      case "low":
        return "from-green-400 to-emerald-400"
      default:
        return "from-neon-400 to-electric-400"
    }
  }

  const nextNudge = () => {
    setCurrentNudge((prev) => (prev + 1) % nudges.length)
  }

  if (!showNudges) return null

  return (
    <Card className="bg-midnight-900/80 border-neon-500/30 backdrop-blur-sm shadow-lg relative overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getUrgencyColor(nudge.urgency)} opacity-5 animate-pulse`} />

      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getUrgencyColor(nudge.urgency)} shadow-lg`}>
              <Target className="h-4 w-4 text-white" />
            </div>
            Goal Suggestion
          </CardTitle>
          <Badge variant="outline" className="text-xs border-neon-500/50 text-neon-300">
            {nudge.urgency} priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{nudge.title}</h3>
          <p className="text-gray-300">{nudge.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{nudge.timeframe}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Quick win</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm flex items-center gap-1">
            <Star className="h-4 w-4 text-neon-400" />
            You'll gain:
          </h4>
          <div className="flex flex-wrap gap-1">
            {nudge.benefits.map((benefit, index) => (
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

        {/* Progress if multiple nudges */}
        {nudges.length > 1 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Suggestions</span>
              <span>
                {currentNudge + 1} of {nudges.length}
              </span>
            </div>
            <Progress value={((currentNudge + 1) / nudges.length) * 100} className="h-1" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            asChild
            className={`flex-1 bg-gradient-to-r ${getUrgencyColor(nudge.urgency)} hover:opacity-90 text-midnight-900 font-semibold`}
          >
            <Link href="/goals/create">
              <Lightbulb className="h-4 w-4 mr-2" />
              {nudge.action}
            </Link>
          </Button>

          {nudges.length > 1 && (
            <Button variant="outline" onClick={nextNudge} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Dismiss option */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNudges(false)}
            className="text-gray-400 hover:text-gray-300 text-xs"
          >
            Maybe later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
