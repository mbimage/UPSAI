"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Heart, TrendingUp, Target, Zap } from "lucide-react"

export function InteractiveConfidenceTracker() {
  const [currentConfidence, setCurrentConfidence] = useState(78)
  const [weeklyData, setWeeklyData] = useState([65, 70, 68, 75, 72, 78, 78])
  const [feedback, setFeedback] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

  const handleConfidenceUpdate = (newValue: number[]) => {
    const value = newValue[0]
    setCurrentConfidence(value)

    // Update weekly data
    setWeeklyData((prev) => [...prev.slice(1), value])

    // Provide contextual feedback
    let message = ""
    if (value >= 90) {
      message = "Incredible! You're radiating confidence. This energy will carry you far!"
    } else if (value >= 80) {
      message = "Excellent confidence level! You're in a great headspace for success."
    } else if (value >= 70) {
      message = "Good confidence! You're building solid self-belief. Keep it up!"
    } else if (value >= 60) {
      message = "You're growing! Every step forward builds stronger confidence."
    } else {
      message = "It's okay to have lower days. You're still amazing and capable of great things!"
    }

    setFeedback(message)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 4000)
  }

  const getConfidenceBoost = () => {
    const boost = Math.min(currentConfidence + 5, 100)
    setCurrentConfidence(boost)
    setWeeklyData((prev) => [...prev.slice(1), boost])
    setFeedback("Power boost activated! Remember: You are capable, strong, and ready for anything!")
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 4000)
  }

  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: "Unstoppable", color: "text-green-400" }
    if (score >= 80) return { label: "Strong", color: "text-neon-400" }
    if (score >= 70) return { label: "Growing", color: "text-electric-400" }
    if (score >= 60) return { label: "Building", color: "text-blue-400" }
    return { label: "Developing", color: "text-purple-400" }
  }

  const weeklyAverage = Math.round(weeklyData.reduce((sum, val) => sum + val, 0) / weeklyData.length)
  const weeklyTrend = weeklyData[weeklyData.length - 1] - weeklyData[0]
  const confidenceLevel = getConfidenceLevel(currentConfidence)

  return (
    <div className="space-y-6">
      {/* Feedback Notification */}
      {showFeedback && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-neon-600 to-electric-600 text-white px-6 py-4 rounded-lg shadow-xl border border-neon-400/30 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5" />
              <p className="text-sm font-medium">{feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Confidence Tracker */}
      <Card className="bg-midnight-900/80 border-neon-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-neon-400" />
              Confidence Tracker
            </div>
            <Badge className={`${confidenceLevel.color} border-neon-500/30`}>{confidenceLevel.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Level Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-white">{currentConfidence}%</div>
            <Progress
              value={currentConfidence}
              className="h-4 bg-midnight-800"
              indicatorClassName="bg-gradient-to-r from-neon-500 to-electric-500"
            />
          </div>

          {/* Interactive Slider */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-neon-200">How confident are you feeling right now?</label>
            <Slider
              value={[currentConfidence]}
              onValueChange={handleConfidenceUpdate}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
          </div>

          {/* Quick Boost Button */}
          <Button
            onClick={getConfidenceBoost}
            className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white border-0"
            disabled={currentConfidence >= 100}
          >
            <Zap className="h-4 w-4 mr-2" />
            Confidence Boost (+5)
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Insights */}
      <Card className="bg-midnight-900/80 border-electric-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-electric-400" />
            Weekly Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-midnight-800/50 rounded-lg border border-neon-500/20">
              <div className="text-2xl font-bold text-white">{weeklyAverage}%</div>
              <div className="text-sm text-neon-300">Weekly Average</div>
            </div>
            <div className="text-center p-4 bg-midnight-800/50 rounded-lg border border-electric-500/20">
              <div className={`text-2xl font-bold ${weeklyTrend >= 0 ? "text-green-400" : "text-orange-400"}`}>
                {weeklyTrend >= 0 ? "+" : ""}
                {weeklyTrend}%
              </div>
              <div className="text-sm text-electric-300">Weekly Trend</div>
            </div>
          </div>

          {/* Weekly Progress Dots */}
          <div className="space-y-2">
            <div className="text-sm text-gray-300">This Week's Journey</div>
            <div className="flex justify-between items-center">
              {weeklyData.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      value >= 80
                        ? "bg-green-400"
                        : value >= 70
                          ? "bg-neon-400"
                          : value >= 60
                            ? "bg-electric-400"
                            : "bg-gray-400"
                    }`}
                  />
                  <div className="text-xs text-gray-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Tips */}
      <Card className="bg-midnight-900/80 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Confidence Building Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-neon-500/10 rounded-lg border border-neon-500/20">
              <div className="text-sm font-medium text-white">Power Pose</div>
              <div className="text-xs text-neon-300">Stand tall for 2 minutes before important moments</div>
            </div>
            <div className="p-3 bg-electric-500/10 rounded-lg border border-electric-500/20">
              <div className="text-sm font-medium text-white">Positive Self-Talk</div>
              <div className="text-xs text-electric-300">Replace "I can't" with "I'm learning how to"</div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-sm font-medium text-white">Celebrate Small Wins</div>
              <div className="text-xs text-purple-300">Acknowledge every step forward, no matter how small</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
