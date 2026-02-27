"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Brain,
  Shield,
  Activity,
  MessageSquare,
  Users,
  BarChart3,
  Globe,
} from "lucide-react"

type SystemStatus = {
  overall: "healthy" | "warning" | "error"
  components: {
    database: "healthy" | "warning" | "error"
    ai: "healthy" | "warning" | "error"
    security: "healthy" | "warning" | "error"
    api: "healthy" | "warning" | "error"
    frontend: "healthy" | "warning" | "error"
  }
  metrics: {
    uptime: number
    responseTime: number
    activeUsers: number
    totalRequests: number
    errorRate: number
  }
  timestamp: string
}

export default function SystemCheckPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const runSystemCheck = async () => {
    setChecking(true)
    setLoading(true)

    try {
      // Simulate comprehensive system check
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock system status - in production, this would call actual health endpoints
      const mockStatus: SystemStatus = {
        overall: "healthy",
        components: {
          database: "healthy",
          ai: "healthy",
          security: "healthy",
          api: "healthy",
          frontend: "healthy",
        },
        metrics: {
          uptime: 99.9,
          responseTime: 145,
          activeUsers: 23,
          totalRequests: 1247,
          errorRate: 0.1,
        },
        timestamp: new Date().toISOString(),
      }

      setStatus(mockStatus)
    } catch (error) {
      console.error("System check failed:", error)
    } finally {
      setLoading(false)
      setChecking(false)
    }
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-600 hover:bg-green-600">Healthy</Badge>
      case "warning":
        return <Badge className="bg-yellow-600 hover:bg-yellow-600">Warning</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-600 via-neon-500 to-electric-500 rounded-xl flex items-center justify-center shadow-lg shadow-neon-600/50">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-neon-200 to-electric-300 bg-clip-text text-transparent">
                System Health Check
              </h1>
              <p className="text-sm text-gray-400">Comprehensive system status and diagnostics</p>
            </div>
          </div>
          <Button onClick={runSystemCheck} disabled={checking}>
            <RefreshCw className={`mr-2 h-4 w-4 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Checking..." : "Run Check"}
          </Button>
        </div>

        {/* Overall Status */}
        <Card className="bg-midnight-800/50 border-midnight-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {status && getStatusIcon(status.overall)}
              System Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Overall system health: {status && getStatusBadge(status.overall)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Running diagnostics...</span>
                  <Progress value={checking ? 75 : 100} className="w-32" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{status?.metrics.uptime}%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{status?.metrics.responseTime}ms</div>
                  <div className="text-sm text-gray-400">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{status?.metrics.activeUsers}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Component Status */}
        <Card className="bg-midnight-800/50 border-midnight-700">
          <CardHeader>
            <CardTitle className="text-white">Component Health</CardTitle>
            <CardDescription className="text-gray-400">Individual system component status</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-midnight-700/60 bg-midnight-900/40">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-neon-500" />
                <span className="text-gray-300">Database</span>
              </div>
              {status && getStatusBadge(status.components.database)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-midnight-700/60 bg-midnight-900/40">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-electric-500" />
                <span className="text-gray-300">AI Engine</span>
              </div>
              {status && getStatusBadge(status.components.ai)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-midnight-700/60 bg-midnight-900/40">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-300">Security</span>
              </div>
              {status && getStatusBadge(status.components.security)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-midnight-700/60 bg-midnight-900/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">API</span>
              </div>
              {status && getStatusBadge(status.components.api)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-midnight-700/60 bg-midnight-900/40">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="text-gray-300">Frontend</span>
              </div>
              {status && getStatusBadge(status.components.frontend)}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-midnight-800/50 border-midnight-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Navigate to detailed monitoring dashboards</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <a href="/admin/metrics">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Metrics</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <a href="/performance-test">
                <Activity className="h-5 w-5" />
                <span className="text-sm">Performance</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <a href="/security-status">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Security</span>
              </a>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
              <a href="/admin/analytics">
                <Users className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </a>
            </Button>
          </CardContent>
        </Card>

        {status && (
          <div className="text-center text-xs text-gray-400">
            Last updated: {new Date(status.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </main>
  )
}
