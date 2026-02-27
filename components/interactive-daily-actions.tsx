"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Zap, Target, Heart, Brain } from "lucide-react"

interface DailyAction {
  id: number
  title: string
  description: string
  points: number
  completed: boolean
  category: "mindset" | "physical" | "social" | "academic"
}

export function InteractiveDailyActions() {
  const [actions, setActions] = useState<DailyAction[]>([
    {
      id: 1,
      title: "Power Pose Practice",
      description: "Stand in a confident pose for 2 minutes",
      points: 15,
      completed: false,
      category: "mindset",
    },
    {
      id: 2,
      title: "Gratitude Reflection",
      description: "Write down 3 things you're grateful for",
      points: 10,
      completed: true,
      category: "mindset",
    },
    {
      id: 3,
      title: "Team Connection",
      description: "Check in with a teammate or friend",
      points: 20,
      completed: false,
      category: "social",
    },
    {
      id: 4,
      title: "Goal Visualization",
      description: "Spend 5 minutes visualizing your goals",
      points: 15,
      completed: false,
      category: "academic",
    },
  ])

  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)

  const handleActionComplete = (actionId: number) => {
    setActions((prev) =>
      prev.map((action) => {
        if (action.id === actionId && !action.completed) {
          const messages = [
            `Excellent work! You earned ${action.points} points for "${action.title}"!`,
            `Amazing! "${action.title}" completed. You're building great habits!`,
            `Fantastic! ${action.points} points added to your total. Keep it up!`,
            `Outstanding! You're making real progress with "${action.title}".`,
          ]
          setFeedback(messages[Math.floor(Math.random() * messages.length)])
          setShowFeedback(true)
          setTimeout(() => setShowFeedback(false), 4000)
          return { ...action, completed: true }
        }
        return action
      }),
    )
  }

  const completedActions = actions.filter((action) => action.completed).length
  const totalPoints = actions.filter((action) => action.completed).reduce((sum, action) => sum + action.points, 0)
  const progressPercentage = (completedActions / actions.length) * 100

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mindset":
        return <Brain className="h-4 w-4 text-neon-400" />
      case "physical":
        return <Zap className="h-4 w-4 text-electric-400" />
      case "social":
        return <Heart className="h-4 w-4 text-purple-400" />
      case "academic":
        return <Target className="h-4 w-4 text-blue-400" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mindset":
        return "border-neon-500/30 bg-neon-500/5"
      case "physical":
        return "border-electric-500/30 bg-electric-500/5"
      case "social":
        return "border-purple-500/30 bg-purple-500/5"
      case "academic":
        return "border-blue-500/30 bg-blue-500/5"
      default:
        return "border-gray-500/30 bg-gray-500/5"
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Notification */}
      {showFeedback && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-neon-600 to-electric-600 text-white px-6 py-4 rounded-lg shadow-xl border border-neon-400/30 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <Card className="bg-midnight-900/80 border-neon-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Daily Actions Progress</span>
            <Badge className="bg-neon-600/20 text-neon-300 border-neon-500/30">{totalPoints} points earned</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-neon-200">
                Completed: {completedActions}/{actions.length}
              </span>
              <span className="text-electric-200">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-midnight-800"
              indicatorClassName="bg-gradient-to-r from-neon-500 to-electric-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Card
            key={action.id}
            className={`${getCategoryColor(action.category)} border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
              action.completed ? "opacity-75" : "hover:border-neon-400/50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(action.category)}
                  <div>
                    <h3 className="font-medium text-white">{action.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{action.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-neon-500/50 text-neon-300">
                  {action.points} pts
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {action.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={`text-sm ${action.completed ? "text-green-400" : "text-gray-400"}`}>
                    {action.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                {!action.completed && (
                  <Button
                    size="sm"
                    onClick={() => handleActionComplete(action.id)}
                    className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white border-0"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Message */}
      {completedActions === actions.length && (
        <Card className="bg-gradient-to-r from-neon-600/20 to-electric-600/20 border-neon-500/30 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">All Actions Complete!</h3>
            </div>
            <p className="text-neon-200">
              Outstanding work! You've completed all your daily actions and earned {totalPoints} points. You're building
              incredible habits that will serve you well!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
