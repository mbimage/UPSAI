"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Heart, Brain, Zap, Target, CheckCircle } from "lucide-react"

interface DailyAssessmentModalProps {
  onComplete: () => void
  onSkip: () => void
  userName: string
}

const dailyQuestions = [
  {
    id: "mood",
    question: "How are you feeling today?",
    type: "scale",
    icon: <Heart className="w-5 h-5 text-pink-400" />,
    min: 1,
    max: 10,
    minLabel: "Rough day",
    maxLabel: "Great day",
  },
  {
    id: "energy",
    question: "What's your energy level?",
    type: "scale",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    min: 1,
    max: 10,
    minLabel: "Drained",
    maxLabel: "Energized",
  },
  {
    id: "confidence",
    question: "How confident do you feel?",
    type: "scale",
    icon: <Brain className="w-5 h-5 text-blue-400" />,
    min: 1,
    max: 10,
    minLabel: "Low confidence",
    maxLabel: "Very confident",
  },
  {
    id: "focus",
    question: "What's your main focus today?",
    type: "text",
    icon: <Target className="w-5 h-5 text-green-400" />,
    placeholder: "e.g., 'Preparing for the big game' or 'Studying for finals'",
  },
]

export function DailyAssessmentModal({ onComplete, onSkip, userName }: DailyAssessmentModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < dailyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Save daily assessment data
    const assessmentData = {
      date: new Date().toISOString(),
      answers,
      userName,
    }

    // Store in localStorage (in a real app, this would go to a database)
    const existingData = JSON.parse(localStorage.getItem("upside_daily_assessments") || "[]")
    existingData.push(assessmentData)
    localStorage.setItem("upside_daily_assessments", JSON.stringify(existingData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onComplete()
  }

  const currentQ = dailyQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / dailyQuestions.length) * 100

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Ambient Background Orbs for Modal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <Card className="w-full max-w-lg bg-midnight-900 border-neon-500/20 shadow-2xl relative z-10">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={onSkip}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            {currentQ.icon}
            <CardTitle className="text-white">Daily Check-in</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                Question {currentQuestion + 1} of {dailyQuestions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-midnight-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-neon-500 to-electric-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">{currentQ.question}</h3>

            {currentQ.type === "scale" && (
              <div className="space-y-4">
                <Slider
                  value={answers[currentQ.id] !== undefined ? [answers[currentQ.id]] : [5]}
                  min={currentQ.min}
                  max={currentQ.max}
                  step={1}
                  onValueChange={(value) => handleAnswer(currentQ.id, value[0])}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{currentQ.minLabel}</span>
                  <Badge variant="outline" className="border-neon-500/50 text-neon-300">
                    {answers[currentQ.id] || 5}
                  </Badge>
                  <span>{currentQ.maxLabel}</span>
                </div>
              </div>
            )}

            {currentQ.type === "text" && (
              <Textarea
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="bg-midnight-800 border-neon-500/20 text-white focus-visible:ring-neon-500/30"
                rows={3}
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="border-midnight-600 text-gray-300 hover:bg-midnight-700 bg-transparent"
            >
              Back
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={onSkip} className="text-gray-400 hover:text-white">
                Skip for today
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : currentQuestion === dailyQuestions.length - 1 ? (
                  <>
                    Complete <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
