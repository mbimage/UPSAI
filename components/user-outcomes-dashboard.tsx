"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { OutcomeCategory } from "@/lib/outcome-analytics"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, Award, Zap, Heart, Compass } from "lucide-react"

interface OutcomeData {
  category: OutcomeCategory
  score: number
  previousScore?: number
  change?: number
  timestamp: string
}

interface OutcomeHistoryData {
  date: string
  [key: string]: string | number
}

interface UserOutcomesDashboardProps {
  userId: string
}

export function UserOutcomesDashboard({ userId }: UserOutcomesDashboardProps) {
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([])
  const [historyData, setHistoryData] = useState<OutcomeHistoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<OutcomeCategory>("self_efficacy")

  useEffect(() => {
    async function fetchOutcomes() {
      try {
        // In a real implementation, this would fetch from your API
        // For now, we'll use mock data
        const mockOutcomes: OutcomeData[] = [
          {
            category: "self_efficacy",
            score: 78,
            previousScore: 72,
            change: 6,
            timestamp: new Date().toISOString(),
          },
          {
            category: "emotional_intelligence",
            score: 65,
            previousScore: 60,
            change: 5,
            timestamp: new Date().toISOString(),
          },
          {
            category: "social_awareness",
            score: 70,
            previousScore: 68,
            change: 2,
            timestamp: new Date().toISOString(),
          },
          {
            category: "career_readiness",
            score: 55,
            previousScore: 45,
            change: 10,
            timestamp: new Date().toISOString(),
          },
          {
            category: "leadership",
            score: 62,
            previousScore: 58,
            change: 4,
            timestamp: new Date().toISOString(),
          },
          {
            category: "resilience",
            score: 75,
            previousScore: 70,
            change: 5,
            timestamp: new Date().toISOString(),
          },
        ]

        setOutcomes(mockOutcomes)

        // Mock history data (in a real app, this would come from your API)
        const mockHistory: OutcomeHistoryData[] = [
          {
            date: "Jan",
            self_efficacy: 65,
            emotional_intelligence: 50,
            social_awareness: 60,
            career_readiness: 40,
            leadership: 45,
            resilience: 55,
          },
          {
            date: "Feb",
            self_efficacy: 68,
            emotional_intelligence: 53,
            social_awareness: 62,
            career_readiness: 42,
            leadership: 48,
            resilience: 60,
          },
          {
            date: "Mar",
            self_efficacy: 70,
            emotional_intelligence: 56,
            social_awareness: 64,
            career_readiness: 45,
            leadership: 52,
            resilience: 65,
          },
          {
            date: "Apr",
            self_efficacy: 72,
            emotional_intelligence: 60,
            social_awareness: 68,
            career_readiness: 45,
            leadership: 58,
            resilience: 70,
          },
          {
            date: "May",
            self_efficacy: 78,
            emotional_intelligence: 65,
            social_awareness: 70,
            career_readiness: 55,
            leadership: 62,
            resilience: 75,
          },
        ]

        setHistoryData(mockHistory)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching outcomes:", error)
        setLoading(false)
      }
    }

    fetchOutcomes()
  }, [userId])

  const getCategoryIcon = (category: OutcomeCategory) => {
    switch (category) {
      case "self_efficacy":
        return <Target className="h-5 w-5 text-neon-400" />
      case "emotional_intelligence":
        return <Brain className="h-5 w-5 text-purple-400" />
      case "social_awareness":
        return <Compass className="h-5 w-5 text-blue-400" />
      case "career_readiness":
        return <Award className="h-5 w-5 text-yellow-400" />
      case "leadership":
        return <Zap className="h-5 w-5 text-orange-400" />
      case "resilience":
        return <Heart className="h-5 w-5 text-red-400" />
      default:
        return <Target className="h-5 w-5 text-neon-400" />
    }
  }

  const getCategoryName = (category: OutcomeCategory): string => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getScoreLevel = (score: number): string => {
    if (score >= 90) return "Expert"
    if (score >= 80) return "Advanced"
    if (score >= 70) return "Proficient"
    if (score >= 60) return "Developing"
    if (score >= 50) return "Basic"
    return "Beginner"
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-green-400"
    if (score >= 70) return "bg-neon-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const getChangeColor = (change?: number): string => {
    if (!change) return "text-gray-400"
    return change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-gray-400"
  }

  const getChangeIcon = (change?: number): string => {
    if (!change) return "→"
    return change > 0 ? "↑" : change < 0 ? "↓" : "→"
  }

  if (loading) {
    return (
      <Card className="bg-midnight-900 border-neon-500/20">
        <CardHeader>
          <CardTitle className="text-white">Outcome Tracking</CardTitle>
          <CardDescription>Loading your progress data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-midnight-900 border-neon-500/20">
      <CardHeader>
        <CardTitle className="text-white">Your Growth Journey</CardTitle>
        <CardDescription>Track your progress across key skill areas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Progress History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outcomes.map((outcome) => (
                <Card key={outcome.category} className="bg-midnight-800 border-neon-500/10">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getCategoryIcon(outcome.category)}
                        <h3 className="ml-2 font-medium text-white">{getCategoryName(outcome.category)}</h3>
                      </div>
                      <Badge variant="outline" className="bg-midnight-700">
                        {getScoreLevel(outcome.score)}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Current Score</span>
                        <span className="text-sm font-medium text-white">{outcome.score}/100</span>
                      </div>
                      <Progress
                        value={outcome.score}
                        className="h-2 bg-midnight-700"
                        indicatorClassName={getScoreColor(outcome.score)}
                      />
                    </div>

                    {outcome.change !== undefined && (
                      <div className="mt-2 text-sm flex justify-end">
                        <span className={getChangeColor(outcome.change)}>
                          {getChangeIcon(outcome.change)} {Math.abs(outcome.change)} points since last assessment
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-midnight-800 border-neon-500/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Progress Over Time</CardTitle>
                <CardDescription>See how your skills have developed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      self_efficacy: {
                        label: "Self Efficacy",
                        color: "hsl(var(--chart-1))",
                      },
                      emotional_intelligence: {
                        label: "Emotional Intelligence",
                        color: "hsl(var(--chart-2))",
                      },
                      social_awareness: {
                        label: "Social Awareness",
                        color: "hsl(var(--chart-3))",
                      },
                      career_readiness: {
                        label: "Career Readiness",
                        color: "hsl(var(--chart-4))",
                      },
                      leadership: {
                        label: "Leadership",
                        color: "hsl(var(--chart-5))",
                      },
                      resilience: {
                        label: "Resilience",
                        color: "hsl(var(--chart-6))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="self_efficacy"
                          stroke="var(--color-self_efficacy)"
                          name="Self Efficacy"
                        />
                        <Line
                          type="monotone"
                          dataKey="emotional_intelligence"
                          stroke="var(--color-emotional_intelligence)"
                          name="Emotional Intelligence"
                        />
                        <Line
                          type="monotone"
                          dataKey="social_awareness"
                          stroke="var(--color-social_awareness)"
                          name="Social Awareness"
                        />
                        <Line
                          type="monotone"
                          dataKey="career_readiness"
                          stroke="var(--color-career_readiness)"
                          name="Career Readiness"
                        />
                        <Line type="monotone" dataKey="leadership" stroke="var(--color-leadership)" name="Leadership" />
                        <Line type="monotone" dataKey="resilience" stroke="var(--color-resilience)" name="Resilience" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="bg-midnight-800 border-neon-500/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Growth Insights</CardTitle>
                <CardDescription>Key observations about your development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-midnight-700 rounded-lg border border-neon-500/20">
                  <h3 className="font-medium text-white mb-2">Strengths</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-green-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-neon-400">Self-Efficacy (78/100)</strong>: You've shown significant
                        improvement in your belief in your abilities to succeed.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-green-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-neon-400">Resilience (75/100)</strong>: Your ability to bounce back from
                        challenges is developing well.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-midnight-700 rounded-lg border border-neon-500/20">
                  <h3 className="font-medium text-white mb-2">Growth Areas</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-yellow-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-yellow-400">Career Readiness (55/100)</strong>: This is your biggest
                        opportunity for growth. Consider exploring more career-focused resources.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-yellow-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-yellow-400">Leadership (62/100)</strong>: You're making progress, but
                        could benefit from more leadership practice opportunities.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-midnight-700 rounded-lg border border-neon-500/20">
                  <h3 className="font-medium text-white mb-2">Biggest Improvements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-electric-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-electric-400">Career Readiness</strong>: +10 points (Most improved area)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-electric-400">•</div>
                      <span className="text-gray-300">
                        <strong className="text-electric-400">Self-Efficacy</strong>: +6 points
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
