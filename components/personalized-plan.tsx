"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Target, Calendar, Clock } from "lucide-react"

interface PlanItem {
  id: string
  title: string
  description: string
  category: "academic" | "athletic" | "social" | "personal"
  priority: "high" | "medium" | "low"
  estimatedTime: string
  completed: boolean
  dueDate?: string
}

export function PersonalizedPlan() {
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    {
      id: "1",
      title: "Practice Positive Self-Talk",
      description: "Replace negative thoughts with encouraging statements before your next game",
      category: "athletic",
      priority: "high",
      estimatedTime: "10 min",
      completed: false,
      dueDate: "Today",
    },
    {
      id: "2",
      title: "Complete Math Study Session",
      description: "Review algebra concepts for tomorrow's quiz using the Pomodoro technique",
      category: "academic",
      priority: "high",
      estimatedTime: "45 min",
      completed: false,
      dueDate: "Today",
    },
    {
      id: "3",
      title: "Practice Deep Breathing",
      description: "Use 4-7-8 breathing technique to manage pre-game anxiety",
      category: "personal",
      priority: "medium",
      estimatedTime: "5 min",
      completed: true,
      dueDate: "Yesterday",
    },
    {
      id: "4",
      title: "Connect with Teammate",
      description: "Have a meaningful conversation with a teammate about team goals",
      category: "social",
      priority: "medium",
      estimatedTime: "15 min",
      completed: false,
      dueDate: "This Week",
    },
    {
      id: "5",
      title: "Visualization Exercise",
      description: "Spend time visualizing successful performance in your sport",
      category: "athletic",
      priority: "low",
      estimatedTime: "10 min",
      completed: false,
      dueDate: "This Week",
    },
  ])

  const toggleComplete = (id: string) => {
    setPlanItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedItems = planItems.filter((item) => item.completed).length
  const totalItems = planItems.length
  const progressPercentage = (completedItems / totalItems) * 100

  const categoryColors = {
    academic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    athletic: "bg-green-500/20 text-green-400 border-green-500/30",
    social: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    personal: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  }

  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-green-500",
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Your Personalized Plan
            </CardTitle>
            <CardDescription>Tailored growth activities based on your goals and challenges</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {completedItems}/{totalItems}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>
        <Progress value={progressPercentage} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {planItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border-l-4 ${priorityColors[item.priority]} bg-gray-900/50 border border-gray-700`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <button onClick={() => toggleComplete(item.id)} className="mt-1">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className={`font-medium ${item.completed ? "text-gray-400 line-through" : "text-white"}`}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={categoryColors[item.category]}>{item.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {item.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {item.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-700">
          <Button className="w-full" variant="outline">
            Generate New Plan Items
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
