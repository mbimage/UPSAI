"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  Target,
  Award,
  Lightbulb,
  Heart,
  Briefcase,
  Download,
  Share2,
} from "lucide-react"
import { type MonthlyDigestData, getMonthlyDigest, getAvailableDigests } from "@/lib/monthly-digest-service"

interface MonthlyDigestViewerProps {
  className?: string
}

export function MonthlyDigestViewer({ className }: MonthlyDigestViewerProps) {
  const [digest, setDigest] = useState<MonthlyDigestData | null>(null)
  const [availableDigests, setAvailableDigests] = useState<{ month: string; year: number }[]>([])
  const [selectedDigest, setSelectedDigest] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableDigests()
  }, [])

  useEffect(() => {
    if (selectedDigest) {
      loadDigest(selectedDigest)
    }
  }, [selectedDigest])

  const loadAvailableDigests = async () => {
    try {
      const digests = await getAvailableDigests()
      setAvailableDigests(digests)

      // Auto-select the most recent digest
      if (digests.length > 0) {
        const latest = digests[0]
        setSelectedDigest(`${latest.month}-${latest.year}`)
      }
    } catch (error) {
      console.error("Error loading available digests:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDigest = async (digestKey: string) => {
    try {
      setLoading(true)
      const [month, year] = digestKey.split("-")
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1

      const digestData = await getMonthlyDigest(monthNumber, Number.parseInt(year))
      setDigest(digestData)
    } catch (error) {
      console.error("Error loading digest:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "improving":
      case "growing":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "decreasing":
      case "declining":
      case "shrinking":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "improving":
      case "growing":
        return "text-green-500"
      case "decreasing":
      case "declining":
      case "shrinking":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-500"></div>
      </div>
    )
  }

  if (!digest) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground">No digest data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Parent Digest</h1>
          <p className="text-muted-foreground">
            Student engagement and progress overview for {digest.month} {digest.year}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedDigest} onValueChange={setSelectedDigest}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableDigests.map((d) => (
                <SelectItem key={`${d.month}-${d.year}`} value={`${d.month}-${d.year}`}>
                  {d.month} {d.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{digest.totalActiveStudents}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getTrendIcon(digest.trends.participationTrend)}
                  <span className={`ml-1 ${getTrendColor(digest.trends.participationTrend)}`}>
                    {digest.trends.participationTrend}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{digest.engagementMetrics.averageSessionsPerStudent}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {getTrendIcon(digest.trends.engagementTrend)}
                  <span className={`ml-1 ${getTrendColor(digest.trends.engagementTrend)}`}>
                    {digest.trends.engagementTrend}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{digest.milestones.goalsAchieved}</div>
                <p className="text-xs text-muted-foreground">{digest.milestones.goalsSet} goals set</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{digest.milestones.assessmentsCompleted}</div>
                <p className="text-xs text-muted-foreground">Completed this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Average scores and improvement rates across key development areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Emotional Intelligence</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {digest.progressMetrics.emotionalIntelligence.averageScore}/100
                    </span>
                  </div>
                  <Progress value={digest.progressMetrics.emotionalIntelligence.averageScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {digest.progressMetrics.emotionalIntelligence.studentsImproving} students improving
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Self-Efficacy</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {digest.progressMetrics.selfEfficacy.averageScore}/100
                    </span>
                  </div>
                  <Progress value={digest.progressMetrics.selfEfficacy.averageScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {digest.progressMetrics.selfEfficacy.studentsImproving} students improving
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Career Readiness</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {digest.progressMetrics.careerReadiness.averageScore}/100
                    </span>
                  </div>
                  <Progress value={digest.progressMetrics.careerReadiness.averageScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {digest.progressMetrics.careerReadiness.studentsImproving} students improving
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Areas</CardTitle>
                <CardDescription>Detailed progress in key skill areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(digest.progressMetrics).map(([key, metrics]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                      <Badge variant="secondary">{metrics.improvementRate}% improving</Badge>
                    </div>
                    <Progress value={metrics.averageScore} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Average Score: {metrics.averageScore}/100</span>
                      <span>{metrics.studentsImproving} students improving</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Milestones</CardTitle>
                <CardDescription>Key achievements and activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-neon-500">{digest.milestones.assessmentsCompleted}</div>
                    <p className="text-sm text-muted-foreground">Assessments Completed</p>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-electric-500">{digest.milestones.goalsAchieved}</div>
                    <p className="text-sm text-muted-foreground">Goals Achieved</p>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{digest.milestones.resourcesAccessed}</div>
                    <p className="text-sm text-muted-foreground">Resources Accessed</p>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {digest.milestones.coachingSessionsCompleted}
                    </div>
                    <p className="text-sm text-muted-foreground">Coaching Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
                <CardDescription>When and how students are engaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Peak Usage Hours</h4>
                  <div className="flex flex-wrap gap-2">
                    {digest.engagementMetrics.peakUsageHours.map((hour) => (
                      <Badge key={hour} variant="outline">
                        {hour}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Average Session Duration</h4>
                  <div className="text-2xl font-bold text-neon-500">
                    {Math.round(digest.engagementMetrics.averageSessionDuration)} minutes
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Features</CardTitle>
                <CardDescription>Most used platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {digest.engagementMetrics.mostPopularFeatures.map((feature, index) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="capitalize">{feature.replace(/_/g, " ")}</span>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Positive trends and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {digest.insights.successStories.map((story, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{story}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas of Focus</CardTitle>
                <CardDescription>Challenges and recommended attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Challenges</h4>
                    <ul className="space-y-1">
                      {digest.insights.topChallenges.map((challenge, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommended Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {digest.insights.recommendedFocus.map((focus) => (
                        <Badge key={focus} variant="outline">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tips for Parents</CardTitle>
                <CardDescription>Ways to support your student's development at home</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {digest.insights.parentTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
