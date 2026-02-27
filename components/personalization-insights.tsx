"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { getFrequentUserTopics, getUserPreferences } from "@/lib/user-history-service"

export function PersonalizationInsights() {
  const { user } = useAuth()
  const [topics, setTopics] = useState<any[]>([])
  const [preferences, setPreferences] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [personalizationScore, setPersonalizationScore] = useState(0)

  useEffect(() => {
    const loadInsights = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Load frequent topics
        const userTopics = await getFrequentUserTopics(user.id, 5)
        setTopics(userTopics)

        // Load preferences
        const userPreferences = await getUserPreferences(user.id)
        setPreferences(userPreferences)

        // Calculate personalization score (0-100)
        // Based on number of interactions, preferences set, and topics tracked
        const topicsScore = Math.min(userTopics.length * 10, 40)
        const preferencesScore = userPreferences.length * 15
        const totalScore = Math.min(topicsScore + preferencesScore, 100)
        setPersonalizationScore(totalScore)
      } catch (error) {
        console.error("Error loading personalization insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [user])

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-midnight-900 border-neon-500/20">
        <CardHeader>
          <CardTitle className="text-white">Personalization Insights</CardTitle>
          <CardDescription>Loading your personalization data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-midnight-800 rounded animate-pulse"></div>
          <div className="h-20 w-full bg-midnight-800 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-midnight-900 border-neon-500/20">
      <CardHeader>
        <CardTitle className="text-white">Personalization Insights</CardTitle>
        <CardDescription>How UpSide AI is adapting to you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Personalization Level</span>
            <span className="text-sm font-medium text-white">{personalizationScore}%</span>
          </div>
          <Progress value={personalizationScore} className="h-2" />
          <p className="text-xs text-gray-400 mt-2">
            {personalizationScore < 30
              ? "Just getting started! Continue using the platform to improve personalization."
              : personalizationScore < 70
                ? "Making progress! Your experience is becoming more tailored."
                : "Great! UpSide AI has learned a lot about your needs and preferences."}
          </p>
        </div>

        {topics.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Your Top Topics</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center space-x-1 px-3 py-1 rounded-full bg-midnight-800 text-white text-xs"
                >
                  <span className={`h-2 w-2 rounded-full ${getSentimentColor(topic.sentiment)}`}></span>
                  <span>{topic.topic}</span>
                  <span className="text-gray-400">({topic.interactionCount})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {preferences.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Your Preferences</h3>
            <div className="space-y-2">
              {preferences.map((pref) => (
                <div key={pref.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{pref.key}</span>
                  <Badge variant="outline" className="text-neon-500 border-neon-500/50">
                    {typeof pref.value === "string" ? pref.value : JSON.stringify(pref.value)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {topics.length === 0 && preferences.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400">
              No personalization data yet. Continue using the platform to build your profile.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
