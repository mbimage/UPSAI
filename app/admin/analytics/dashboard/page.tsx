"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data - in real app, this would come from your analytics service
const mockFeatureUsage = [
  { feature: "Chat", usage: 1250, growth: 15 },
  { feature: "Resources", usage: 890, growth: 22 },
  { feature: "Assessments", usage: 650, growth: 8 },
  { feature: "Scenarios", usage: 420, growth: 35 },
  { feature: "Dashboard", usage: 380, growth: 12 },
]

const mockUserJourney = [
  { step: "Landing", users: 1000, conversion: 100 },
  { step: "Sign Up", users: 750, conversion: 75 },
  { step: "First Chat", users: 600, conversion: 60 },
  { step: "Resource View", users: 450, conversion: 45 },
  { step: "Assessment", users: 300, conversion: 30 },
  { step: "Return Visit", users: 200, conversion: 20 },
]

const mockEngagement = [
  { name: "High Engagement", value: 35, color: "#10b981" },
  { name: "Medium Engagement", value: 45, color: "#f59e0b" },
  { name: "Low Engagement", value: 20, color: "#ef4444" },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track feature usage and user engagement</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Badge variant="secondary">+12%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Active in last {timeRange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Usage</CardTitle>
            <Badge variant="secondary">+8%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,234</div>
            <p className="text-xs text-muted-foreground">Total interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Badge variant="secondary">+5%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5m</div>
            <p className="text-xs text-muted-foreground">Session duration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention</CardTitle>
            <Badge variant="secondary">+3%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">7-day retention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Trends</CardTitle>
                <CardDescription>Most popular features over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockFeatureUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Growth</CardTitle>
                <CardDescription>Growth rate by feature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockFeatureUsage.map((feature) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{feature.feature}</span>
                      <span className="text-green-600">+{feature.growth}%</span>
                    </div>
                    <Progress value={feature.growth} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Funnel</CardTitle>
              <CardDescription>How users progress through the app</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockUserJourney}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Levels</CardTitle>
                <CardDescription>User engagement distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockEngagement}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockEngagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
                <CardDescription>Most common user actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: "Start Chat", count: 1250 },
                  { action: "View Resource", count: 890 },
                  { action: "Take Assessment", count: 650 },
                  { action: "Browse Scenarios", count: 420 },
                  { action: "Share Content", count: 280 },
                ].map((item) => (
                  <div key={item.action} className="flex justify-between items-center">
                    <span className="text-sm">{item.action}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity</CardTitle>
              <CardDescription>Live user activity feed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: "Student #1247", action: "Started chat session", time: "2 seconds ago" },
                  { user: "Student #1098", action: "Completed self-efficacy assessment", time: "15 seconds ago" },
                  { user: "Student #1356", action: "Downloaded resource guide", time: "32 seconds ago" },
                  { user: "Student #1189", action: "Viewed scenario library", time: "1 minute ago" },
                  { user: "Student #1445", action: "Shared app with friend", time: "2 minutes ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <span className="font-medium">{activity.user}</span>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
