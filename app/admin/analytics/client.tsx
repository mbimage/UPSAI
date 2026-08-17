"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getAggregateOutcomeStats } from "@/lib/outcome-analytics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [historyData, setHistoryData] = useState<any[]>([])
  const [engagementData, setEngagementData] = useState<any[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([])

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // In a real implementation, this would fetch from your API with the selected time range
        // For now, we'll use mock data

        // Get aggregate stats
        const aggregateStats = await getAggregateOutcomeStats()
        setStats(aggregateStats)

        // Mock history data
        const mockHistory = [
          { date: "Week 1", users: 25, assessments: 42, resources: 78, chats: 120 },
          { date: "Week 2", users: 38, assessments: 65, resources: 95, chats: 145 },
          { date: "Week 3", users: 52, assessments: 88, resources: 110, chats: 180 },
          { date: "Week 4", users: 65, assessments: 105, resources: 135, chats: 210 },
          { date: "Week 5", users: 85, assessments: 140, resources: 165, chats: 250 },
          { date: "Week 6", users: 105, assessments: 180, resources: 210, chats: 310 },
          { date: "Week 7", users: 127, assessments: 220, resources: 260, chats: 380 },
        ]
        setHistoryData(mockHistory)

        // Mock engagement data
        const mockEngagement = [
          { name: "Assessments", completed: 342, started: 450 },
          { name: "Resources", completed: 260, started: 380 },
          { name: "Chat Sessions", completed: 380, started: 420 },
          { name: "Goals", completed: 180, started: 320 },
        ]
        setEngagementData(mockEngagement)

        // Mock category distribution
        const mockDistribution = [
          { name: "Self-Efficacy", value: 35 },
          { name: "Emotional Intelligence", value: 25 },
          { name: "Social Awareness", value: 15 },
          { name: "Career Readiness", value: 10 },
          { name: "Leadership", value: 8 },
          { name: "Resilience", value: 7 },
        ]
        setCategoryDistribution(mockDistribution)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#a855f7", "#ec4899"]

  if (loading || !stats) {
    return (
      <Card className="bg-midnight-900 border-neon-500/20">
        <CardHeader>
          <CardTitle className="text-white">Analytics Dashboard</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">User Outcomes Analytics</h2>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <SelectTrigger className="w-[180px] bg-midnight-800 border-neon-500/20 text-white">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="bg-midnight-800 border-neon-500/20 text-white">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-midnight-900 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.userCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400">↑ 24% from previous period</div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-900 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Assessments Completed</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.assessmentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400">↑ 18% from previous period</div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-900 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Self-Efficacy Score</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.averageScores.self_efficacy}/100</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400">↑ 8.2 points average growth</div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-900 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Emotional Intelligence</CardDescription>
            <CardTitle className="text-2xl text-white">{stats.averageScores.emotional_intelligence}/100</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-400">↑ 7.5 points average growth</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="distribution">Category Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card className="bg-midnight-900 border-neon-500/20">
            <CardHeader>
              <CardTitle className="text-white">Average Growth by Category</CardTitle>
              <CardDescription>Average point increase across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    averageGrowth: {
                      label: "Average Growth (points)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: "Self-Efficacy", averageGrowth: stats.averageGrowth.self_efficacy },
                        {
                          category: "Emotional Intelligence",
                          averageGrowth: stats.averageGrowth.emotional_intelligence,
                        },
                        { category: "Social Awareness", averageGrowth: stats.averageGrowth.social_awareness },
                        { category: "Career Readiness", averageGrowth: stats.averageGrowth.career_readiness },
                        { category: "Leadership", averageGrowth: stats.averageGrowth.leadership },
                        { category: "Resilience", averageGrowth: stats.averageGrowth.resilience },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="averageGrowth" fill="var(--color-averageGrowth)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="bg-midnight-900 border-neon-500/20">
            <CardHeader>
              <CardTitle className="text-white">Platform Growth Over Time</CardTitle>
              <CardDescription>Users, assessments, resources, and chat sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    users: {
                      label: "Users",
                      color: "hsl(var(--chart-1))",
                    },
                    assessments: {
                      label: "Assessments",
                      color: "hsl(var(--chart-2))",
                    },
                    resources: {
                      label: "Resources",
                      color: "hsl(var(--chart-3))",
                    },
                    chats: {
                      label: "Chat Sessions",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="var(--color-users)" name="Users" />
                      <Line
                        type="monotone"
                        dataKey="assessments"
                        stroke="var(--color-assessments)"
                        name="Assessments"
                      />
                      <Line type="monotone" dataKey="resources" stroke="var(--color-resources)" name="Resources" />
                      <Line type="monotone" dataKey="chats" stroke="var(--color-chats)" name="Chat Sessions" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card className="bg-midnight-900 border-neon-500/20">
              <CardHeader>
                <CardTitle className="text-white">Completion Rates</CardTitle>
                <CardDescription>Started vs. completed activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      completed: {
                        label: "Completed",
                        color: "hsl(var(--chart-1))",
                      },
                      started: {
                        label: "Started",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                        <Bar dataKey="started" fill="var(--color-started)" name="Started" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className="bg-midnight-900 border-neon-500/20">
            <CardHeader>
              <CardTitle className="text-white">Category Interest Distribution</CardTitle>
              <CardDescription>Percentage of user engagement by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
