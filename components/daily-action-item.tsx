"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Zap, RefreshCw, Clock, Target } from "lucide-react"

interface DailyAction {
  id: string
  title: string
  description: string
  category: "mindset" | "skill" | "wellness" | "academic"
  estimatedTime: string
  difficulty: "easy" | "medium" | "challenging"
  completed: boolean
}

export function DailyActionItem() {
  const [currentAction, setCurrentAction] = useState<DailyAction>({
    id: "1",
    title: "Power Pose Practice",
    description:
      "Stand in a confident pose (hands on hips, chest out) for 2 minutes before your next challenge. This simple technique can help boost your confidence and presence.",
    category: "mindset",
    estimatedTime: "2 min",
    difficulty: "easy",
    completed: false,
  })

  const [streak, setStreak] = useState(7)

  const dailyActions: DailyAction[] = [
    {
      id: "1",
      title: "Power Pose Practice",
      description:
        "Stand in a confident pose (hands on hips, chest out) for 2 minutes before your next challenge. This simple technique can help boost your confidence and presence.",
      category: "mindset",
      estimatedTime: "2 min",
      difficulty: "easy",
      completed: false,
    },
    {
      id: "2",
      title: "Gratitude Reflection",
      description:
        "Write down 3 things you're grateful for today. Focus on specific moments or people that made a positive impact.",
      category: "wellness",
      estimatedTime: "5 min",
      difficulty: "easy",
      completed: false,
    },
    {
      id: "3",
      title: "Skill Visualization",
      description:
        "Close your eyes and mentally practice a specific skill from your sport for 5 minutes. See yourself performing it perfectly.",
      category: "skill",
      estimatedTime: "5 min",
      difficulty: "medium",
      completed: false,
    },
    {
      id: "4",
      title: "Study Sprint",
      description:
        "Use the Pomodoro technique: 25 minutes of focused study, then a 5-minute break. Perfect for maintaining concentration.",
      category: "academic",
      estimatedTime: "30 min",
      difficulty: "medium",
      completed: false,
    },
    {
      id: "5",
      title: "Positive Affirmations",
      description:
        "Repeat 5 positive statements about yourself and your abilities. Say them out loud with conviction and belief.",
      category: "mindset",
      estimatedTime: "3 min",
      difficulty: "easy",
      completed: false,
    },
  ]

  const toggleComplete = () => {
    setCurrentAction((prev) => ({ ...prev, completed: !prev.completed }))
    if (!currentAction.completed) {
      setStreak((prev) => prev + 1)
    }
  }

  const getNewAction = () => {
    const availableActions = dailyActions.filter((action) => action.id !== currentAction.id)
    const randomAction = availableActions[Math.floor(Math.random() * availableActions.length)]
    setCurrentAction({ ...randomAction, completed: false })
  }

  const categoryColors = {
    mindset: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    skill: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    wellness: "bg-green-500/20 text-green-400 border-green-500/30",
    academic: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  }

  const difficultyColors = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    challenging: "text-red-400",
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Today's Action Item
            </CardTitle>
            <CardDescription>A small step toward your bigger goals</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{streak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <button onClick={toggleComplete} className="mt-1">
              {currentAction.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
              )}
            </button>
            <div className="flex-1">
              <h3
                className={`text-lg font-medium ${currentAction.completed ? "text-gray-400 line-through" : "text-white"}`}
              >
                {currentAction.title}
              </h3>
              <p className="text-gray-300 mt-2 leading-relaxed">{currentAction.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={categoryColors[currentAction.category]}>{currentAction.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              {currentAction.estimatedTime}
            </div>
            <div className={`text-sm font-medium ${difficultyColors[currentAction.difficulty]}`}>
              {currentAction.difficulty}
            </div>
          </div>

          {currentAction.completed && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Great job! You completed today's action.</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">
                Consistency builds confidence. Keep up the momentum tomorrow!
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={getNewAction} variant="outline" className="flex-1 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Get Different Action
            </Button>
            {!currentAction.completed && (
              <Button onClick={toggleComplete} className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
