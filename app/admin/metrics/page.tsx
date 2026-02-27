"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Target,
  Shield,
  BookOpen,
  TrendingUp,
  Download,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Star,
  Brain,
} from "lucide-react"
import type { AdminDashboardData } from "@/lib/admin-metrics-service"

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/metrics")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      } else {
        console.error("Failed to fetch metrics:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: "json" | "csv") => {
    try {
      setExporting(true)
      const response = await fetch("/api/admin/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `upside-ai-metrics.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting report:", error)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 p-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-neon-500" />
              <span className="text-white">Loading metrics...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-600 via-neon-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg shadow-neon-600/50">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-neon-200 to-electric-300 bg-clip-text text-transparent">
                Admin Metrics Dashboard
              </h1>
              <p className="text-sm text-gray-400">Comprehensive analytics and insights for UpSide AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchMetrics} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => exportReport("json")} disabled={exporting} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button onClick={() => exportReport("csv")} disabled={exporting} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-neon-500" />
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{metrics?.userEngagement.totalUsers || 0}</p>
                  <p className="text-xs text-green-400">+{metrics?.userEngagement.newUsersThisWeek || 0} this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-electric-500" />
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{metrics?.userEngagement.activeUsers || 0}</p>
                  <p className="text-xs text-blue-400">{metrics?.userEngagement.retentionRate || 0}% retention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-white">{metrics?.performance.averageResponseTime || 0}ms</p>
                  <p className="text-xs text-green-400">{metrics?.performance.uptime || 0}% uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-400">Goal Completion</p>
                  <p className="text-2xl font-bold text-white">{metrics?.outcomes.goalCompletionRate || 0}%</p>
                  <p className="text-xs text-purple-400">{metrics?.outcomes.userGrowthRate || 0}% growth rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList className="bg-midnight-800/50 border-midnight-700">
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="outcomes">Student Outcomes</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="content">Content Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-neon-500" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Chat Interactions</span>
                    <span className="text-white font-mono">{metrics?.userEngagement.chatInteractions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Assessment Completions</span>
                    <span className="text-white font-mono">{metrics?.userEngagement.assessmentCompletions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Resource Views</span>
                    <span className="text-white font-mono">{metrics?.userEngagement.resourceViews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Avg Session Duration</span>
                    <span className="text-white font-mono">
                      {metrics?.userEngagement.averageSessionDuration || 0} min
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-electric-500" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">User Retention Rate</span>
                      <span className="text-white font-mono">{metrics?.userEngagement.retentionRate || 0}%</span>
                    </div>
                    <Progress value={metrics?.userEngagement.retentionRate || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Weekly Growth</span>
                      <span className="text-white font-mono">{metrics?.outcomes.userGrowthRate || 0}%</span>
                    </div>
                    <Progress value={metrics?.outcomes.userGrowthRate || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-electric-500" />
                    API Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Success Rate</span>
                    <Badge className="bg-green-600 hover:bg-green-600">
                      {metrics?.performance.apiSuccessRate || 0}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Error Rate</span>
                    <Badge variant={metrics && metrics.performance.errorRate < 1 ? "default" : "destructive"}>
                      {metrics?.performance.errorRate || 0}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Requests</span>
                    <span className="text-white font-mono">{metrics?.performance.totalRequests || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Peak Concurrent Users</span>
                    <span className="text-white font-mono">{metrics?.performance.peakConcurrentUsers || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Uptime</span>
                      <span className="text-white font-mono">{metrics?.performance.uptime || 0}%</span>
                    </div>
                    <Progress value={metrics?.performance.uptime || 0} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Response Time</span>
                    <Badge variant={metrics && metrics.performance.averageResponseTime < 200 ? "default" : "secondary"}>
                      {metrics?.performance.averageResponseTime || 0}ms
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Assessment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Self-Efficacy</span>
                      <span className="text-white font-mono">{metrics?.outcomes.averageSelfEfficacyScore || 0}</span>
                    </div>
                    <Progress value={metrics?.outcomes.averageSelfEfficacyScore || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Emotional Intelligence</span>
                      <span className="text-white font-mono">
                        {metrics?.outcomes.averageEmotionalIntelligenceScore || 0}
                      </span>
                    </div>
                    <Progress value={metrics?.outcomes.averageEmotionalIntelligenceScore || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-neon-500" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Success Stories</span>
                    <span className="text-white font-mono">{metrics?.outcomes.successStories || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block mb-2">Top Improvement Areas:</span>
                    <div className="space-y-1">
                      {metrics?.outcomes.improvementAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-yellow-500" />
                    Security Events (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Events</span>
                    <span className="text-white font-mono">{metrics?.security.totalSecurityEvents || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Critical Threats</span>
                    <Badge variant={metrics && metrics.security.criticalThreats === 0 ? "default" : "destructive"}>
                      {metrics?.security.criticalThreats || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Blocked Requests</span>
                    <span className="text-white font-mono">{metrics?.security.blockedRequests || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Rate Limit Hits</span>
                    <span className="text-white font-mono">{metrics?.security.rateLimitHits || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Threat Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Suspicious Activity</span>
                    <Badge variant={metrics && metrics.security.suspiciousActivity === 0 ? "default" : "secondary"}>
                      {metrics?.security.suspiciousActivity || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Incident</span>
                    <span className="text-white font-mono">{metrics?.security.lastSecurityIncident || "None"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Popular Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {metrics?.content.mostPopularResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{resource.name}</span>
                      <span className="text-white font-mono">{resource.views} views</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    User Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{metrics?.content.averageRating || 0}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= (metrics?.content.averageRating || 0)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sentiment</span>
                    <Badge
                      className={
                        metrics?.content.feedbackSentiment === "positive"
                          ? "bg-green-600 hover:bg-green-600"
                          : metrics?.content.feedbackSentiment === "neutral"
                            ? "bg-yellow-600 hover:bg-yellow-600"
                            : "bg-red-600 hover:bg-red-600"
                      }
                    >
                      {metrics?.content.feedbackSentiment || "neutral"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          Last updated: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleString() : "Never"}
        </div>
      </div>
    </main>
  )
}
