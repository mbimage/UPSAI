"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, RefreshCw, Star, TrendingUp } from "lucide-react"

interface CoachingTip {
  id: string
  title: string
  tip: string
  category: "performance" | "mindset" | "study" | "social" | "wellness"
  difficulty: "beginner" | "intermediate" | "advanced"
  timeToImplement: string
  scientificBasis?: string
}

export function AICoachingTips() {
  const [currentTip, setCurrentTip] = useState<CoachingTip>({
    id: "1",
    title: "The 2-Minute Rule",
    tip: "When facing a big task that feels overwhelming, commit to just 2 minutes. Often, starting is the hardest part, and you'll find yourself continuing beyond the 2 minutes once you build momentum.",
    category: "mindset",
    difficulty: "beginner",
    timeToImplement: "Immediate",
    scientificBasis: "Based on behavioral psychology research on habit formation and overcoming procrastination.",
  })

  const coachingTips: CoachingTip[] = [
    {
      id: "1",
      title: "The 2-Minute Rule",
      tip: "When facing a big task that feels overwhelming, commit to just 2 minutes. Often, starting is the hardest part, and you'll find yourself continuing beyond the 2 minutes once you build momentum.",
      category: "mindset",
      difficulty: "beginner",
      timeToImplement: "Immediate",
      scientificBasis: "Based on behavioral psychology research on habit formation and overcoming procrastination.",
    },
    {
      id: "2",
      title: "Pre-Performance Routine",
      tip: "Develop a consistent 5-minute routine before games or tests. This could include deep breathing, positive self-talk, and visualization. Consistency reduces anxiety and improves focus.",
      category: "performance",
      difficulty: "intermediate",
      timeToImplement: "1 week to establish",
      scientificBasis: "Sports psychology research shows routines reduce cortisol and improve performance consistency.",
    },
    {
      id: "3",
      title: "Active Recall Study Method",
      tip: "Instead of re-reading notes, test yourself. Close your book and try to explain the concept out loud or write it down from memory. This strengthens neural pathways more effectively.",
      category: "study",
      difficulty: "intermediate",
      timeToImplement: "Next study session",
      scientificBasis:
        "Cognitive science research demonstrates active recall significantly improves retention compared to passive review.",
    },
    {
      id: "4",
      title: "The Power of 'Yet'",
      tip: "Add 'yet' to negative self-talk. Instead of 'I can't do this,' say 'I can't do this yet.' This simple word shift activates growth mindset and reduces fixed thinking patterns.",
      category: "mindset",
      difficulty: "beginner",
      timeToImplement: "Immediate",
      scientificBasis: "Carol Dweck's research on growth mindset and neuroplasticity.",
    },
    {
      id: "5",
      title: "Social Energy Management",
      tip: "Notice which people and activities give you energy vs. drain it. Spend more time with energy-givers, especially before important events. Your social environment directly impacts performance.",
      category: "social",
      difficulty: "advanced",
      timeToImplement: "2-3 weeks to assess",
      scientificBasis: "Research on emotional contagion and social influence on performance outcomes.",
    },
    {
      id: "6",
      title: "Box Breathing for Focus",
      tip: "Use 4-4-4-4 breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. This activates your parasympathetic nervous system and improves focus within minutes.",
      category: "wellness",
      difficulty: "beginner",
      timeToImplement: "Immediate",
      scientificBasis: "Neuroscience research on breathing techniques and autonomic nervous system regulation.",
    },
  ]

  const getNewTip = () => {
    const availableTips = coachingTips.filter((tip) => tip.id !== currentTip.id)
    const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)]
    setCurrentTip(randomTip)
  }

  const categoryColors = {
    performance: "bg-red-500/20 text-red-400 border-red-500/30",
    mindset: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    study: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    social: "bg-green-500/20 text-green-400 border-green-500/30",
    wellness: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  }

  const difficultyColors = {
    beginner: "text-green-400",
    intermediate: "text-yellow-400",
    advanced: "text-red-400",
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Teammate Tip
        </CardTitle>
        <CardDescription>Science-backed strategies for peak performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{currentTip.title}</h3>
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </div>

          <p className="text-gray-300 leading-relaxed">{currentTip.tip}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={categoryColors[currentTip.category]}>{currentTip.category}</Badge>
            <div className={`text-sm font-medium ${difficultyColors[currentTip.difficulty]}`}>
              {currentTip.difficulty}
            </div>
            <div className="text-sm text-gray-400">⏱️ {currentTip.timeToImplement}</div>
          </div>

          {currentTip.scientificBasis && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Star className="h-4 w-4" />
                <span className="font-medium text-sm">Scientific Basis</span>
              </div>
              <p className="text-sm text-gray-300">{currentTip.scientificBasis}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={getNewTip} variant="outline" className="flex-1 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Tip
          </Button>
          <Button className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Try This Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
