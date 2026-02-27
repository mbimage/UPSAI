"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Lightbulb, Heart, Target, Zap, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface MindsetPrompt {
  id: string
  prompt: string
  category: "gratitude" | "growth" | "confidence" | "goals" | "reflection"
  icon: any
}

interface PromptResponse {
  id: string
  date: string
  prompt: string
  response: string
  category: string
}

const MINDSET_PROMPTS: MindsetPrompt[] = [
  {
    id: "1",
    prompt: "What's one thing you're grateful for about your athletic journey today?",
    category: "gratitude",
    icon: Heart,
  },
  {
    id: "2",
    prompt: "Describe a challenge you faced recently and how it helped you grow.",
    category: "growth",
    icon: Target,
  },
  {
    id: "3",
    prompt: "What's one skill you've improved this week, even if it's a small improvement?",
    category: "confidence",
    icon: Zap,
  },
  {
    id: "4",
    prompt: "If you could give advice to a teammate facing a similar challenge, what would you say?",
    category: "reflection",
    icon: Lightbulb,
  },
  {
    id: "5",
    prompt: "What's one goal you're excited to work toward this week?",
    category: "goals",
    icon: Target,
  },
  {
    id: "6",
    prompt: "How did you show resilience today, even in a small way?",
    category: "confidence",
    icon: Zap,
  },
  {
    id: "7",
    prompt: "What's something positive you learned about yourself recently?",
    category: "growth",
    icon: Lightbulb,
  },
  {
    id: "8",
    prompt: "Who in your life are you thankful for and why?",
    category: "gratitude",
    icon: Heart,
  },
  {
    id: "9",
    prompt: "What's one way you can support a teammate or classmate this week?",
    category: "reflection",
    icon: Heart,
  },
  {
    id: "10",
    prompt: "Describe a moment when you felt proud of your effort, regardless of the outcome.",
    category: "confidence",
    icon: Zap,
  },
]

export function DailyMindsetPrompt() {
  const { user } = useAuth()
  const [todayPrompt, setTodayPrompt] = useState<MindsetPrompt | null>(null)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)
  const [recentResponses, setRecentResponses] = useState<PromptResponse[]>([])

  useEffect(() => {
    generateTodayPrompt()
    loadRecentResponses()
  }, [user])

  const generateTodayPrompt = () => {
    // Use date as seed for consistent daily prompt
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const promptIndex = dayOfYear % MINDSET_PROMPTS.length
    setTodayPrompt(MINDSET_PROMPTS[promptIndex])

    // Check if user already responded today
    const todayString = today.toDateString()
    const hasRespondedToday = false // In real app, check database
    setHasResponded(hasRespondedToday)
  }

  const loadRecentResponses = async () => {
    // In a real app, this would fetch from your database
    const mockResponses: PromptResponse[] = [
      {
        id: "1",
        date: new Date(Date.now() - 86400000).toISOString(),
        prompt: "What's one thing you're grateful for about your athletic journey today?",
        response: "I'm grateful for my coach who always believes in me, even when I don't believe in myself.",
        category: "gratitude",
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000).toISOString(),
        prompt: "Describe a challenge you faced recently and how it helped you grow.",
        response:
          "I struggled with my free throws, but practicing extra helped me realize I can improve anything with effort.",
        category: "growth",
      },
    ]

    setRecentResponses(mockResponses)
  }

  const handleSubmit = async () => {
    if (!user?.id || !response.trim() || !todayPrompt) return

    setIsSubmitting(true)
    try {
      const newResponse: PromptResponse = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        prompt: todayPrompt.prompt,
        response: response.trim(),
        category: todayPrompt.category,
      }

      // In a real app, this would save to your database
      console.log("Saving mindset response:", newResponse)

      setRecentResponses([newResponse, ...recentResponses.slice(0, 4)])
      setHasResponded(true)
      setResponse("")

      // Track this action
      // await trackJourneyStep(user.id, "mindset_prompt_response", { category: todayPrompt.category })
    } catch (error) {
      console.error("Error saving mindset response:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getNewPrompt = () => {
    const availablePrompts = MINDSET_PROMPTS.filter((p) => p.id !== todayPrompt?.id)
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)]
    setTodayPrompt(randomPrompt)
    setHasResponded(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gratitude":
        return "bg-pink-500/20 text-pink-400"
      case "growth":
        return "bg-green-500/20 text-green-400"
      case "confidence":
        return "bg-neon-500/20 text-neon-400"
      case "goals":
        return "bg-blue-500/20 text-blue-400"
      case "reflection":
        return "bg-purple-500/20 text-purple-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (!todayPrompt) return null

  const IconComponent = todayPrompt.icon

  return (
    <Card className="bg-midnight-900 border-neon-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <IconComponent className="w-5 h-5 mr-2 text-neon-400" />
              Daily Mindset Prompt
            </CardTitle>
            <CardDescription>Take a moment to reflect and grow</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(todayPrompt.category)}>{todayPrompt.category}</Badge>
            <Button variant="outline" size="sm" onClick={getNewPrompt}>
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-midnight-800 rounded-lg border border-neon-500/10">
          <p className="text-white font-medium leading-relaxed">{todayPrompt.prompt}</p>
        </div>

        {hasResponded ? (
          <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">Great job reflecting today!</p>
            <p className="text-sm text-gray-400 mt-1">Come back tomorrow for a new prompt</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Take your time to reflect and share your thoughts..."
              className="bg-midnight-800 border-neon-500/20 text-white min-h-[100px]"
              rows={4}
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !response.trim()}
              className="w-full bg-neon-500 hover:bg-neon-600"
            >
              {isSubmitting ? "Saving..." : "Submit Reflection"}
            </Button>
          </div>
        )}

        {recentResponses.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Recent Reflections</h4>
            <div className="space-y-3">
              {recentResponses.slice(0, 2).map((resp) => (
                <div key={resp.id} className="p-3 bg-midnight-800 rounded-lg border border-neon-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(resp.category)} variant="outline">
                      {resp.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{new Date(resp.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1 italic">"{resp.prompt}"</p>
                  <p className="text-sm text-gray-300">{resp.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
