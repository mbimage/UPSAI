"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  RefreshCw,
  BarChart3,
  Target,
} from "lucide-react"
import { PerformanceTester, type TestResult } from "@/lib/performance-tester"

export default function PerformanceTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([])

  const tester = new PerformanceTester()

  const runTests = async () => {
    setTesting(true)
    setResults([])
    setProgress(0)
    setCurrentTest("Initializing tests...")

    try {
      const endpoints = ["/api/health", "/api/chat", "/api/feedback", "/api/simple-chat", "/api/security/status"]

      const testResults: TestResult[] = []

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i]
        setCurrentTest(`Testing ${endpoint}...`)
        setProgress((i / endpoints.length) * 100)

        let result: TestResult

        if (endpoint === "/api/chat") {
          result = await tester.testEndpoint(
            endpoint,
            "POST",
            {
              messages: [{ role: "user", content: "Hello, this is a performance test." }],
              userId: "test-user",
            },
            8,
          )
        } else if (endpoint === "/api/feedback") {
          result = await tester.testEndpoint(
            endpoint,
            "POST",
            {
              rating: 5,
              feedback: "Test feedback",
              userId: "test-user",
            },
            8,
          )
        } else if (endpoint === "/api/simple-chat") {
          result = await tester.testEndpoint(
            endpoint,
            "POST",
            {
              message: "Test message",
            },
            8,
          )
        } else {
          result = await tester.testEndpoint(endpoint, "GET", undefined, 8)
        }

        testResults.push(result)
        setResults([...testResults])
      }

      setProgress(100)
      setCurrentTest("Generating recommendations...")

      const recs = tester.getRecommendations(testResults)
      setRecommendations(recs)

      setCurrentTest("Tests completed!")
    } catch (error) {
      console.error("Performance test failed:", error)
      setCurrentTest("Test failed - check console for details")
    } finally {
      setTesting(false)
    }
  }

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case "excellent":
        return "bg-green-600 hover:bg-green-600"
      case "good":
        return "bg-blue-600 hover:bg-blue-600"
      case "fair":
        return "bg-yellow-600 hover:bg-yellow-600"
      case "poor":
        return "bg-red-600 hover:bg-red-600"
      default:
        return "bg-gray-600 hover:bg-gray-600"
    }
  }

  const getReliabilityIcon = (reliability: string) => {
    switch (reliability) {
      case "excellent":
        return <CheckCircle className="h-4 w-4" />
      case "good":
        return <CheckCircle className="h-4 w-4" />
      case "fair":
        return <AlertTriangle className="h-4 w-4" />
      case "poor":
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const overallStats =
    results.length > 0
      ? {
          avgResponseTime: results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length,
          avgSuccessRate: results.reduce((sum, r) => sum + r.successRate, 0) / results.length,
          totalTests: results.reduce((sum, r) => sum + r.totalTests, 0),
          totalFailures: results.reduce((sum, r) => sum + r.failureCount, 0),
        }
      : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-600 via-electric-500 to-neon-500 rounded-xl flex items-center justify-center shadow-lg shadow-electric-600/50">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-electric-200 to-neon-300 bg-clip-text text-transparent">
                Performance Testing
              </h1>
              <p className="text-sm text-gray-400">API response times and reliability analysis</p>
            </div>
          </div>
          <Button onClick={runTests} disabled={testing} className="bg-electric-600 hover:bg-electric-700 text-white">
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
        </div>

        {/* Test Progress */}
        {testing && (
          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{currentTest}</span>
                  <span className="text-sm text-gray-400">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Stats */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-electric-500" />
                  <div>
                    <p className="text-sm text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-white">{formatTime(overallStats.avgResponseTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-white">{overallStats.avgSuccessRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-neon-500" />
                  <div>
                    <p className="text-sm text-gray-400">Total Tests</p>
                    <p className="text-2xl font-bold text-white">{overallStats.totalTests}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Failures</p>
                    <p className="text-2xl font-bold text-white">{overallStats.totalFailures}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-midnight-800/50 border-midnight-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <Card key={index} className="bg-midnight-800/50 border-midnight-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <code className="text-sm bg-midnight-900/60 px-2 py-1 rounded">{result.endpoint}</code>
                        </CardTitle>
                        <Badge className={getReliabilityColor(result.reliability)}>
                          {getReliabilityIcon(result.reliability)}
                          {result.reliability}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Avg Response</p>
                          <p className="text-white font-mono">{formatTime(result.averageResponseTime)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Success Rate</p>
                          <p className="text-white font-mono">{result.successRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Min/Max</p>
                          <p className="text-white font-mono">
                            {formatTime(result.minResponseTime)}/{formatTime(result.maxResponseTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Tests</p>
                          <p className="text-white font-mono">{result.totalTests}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Failures</p>
                          <p className="text-white font-mono">{result.failureCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="bg-midnight-800/50 border-midnight-700">
                  <CardHeader>
                    <CardTitle className="text-white">{result.endpoint}</CardTitle>
                    <CardDescription>Individual test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.metrics.map((metric, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded bg-midnight-900/40 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {metric.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-gray-300">Test {i + 1}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-white font-mono">{formatTime(metric.responseTime)}</span>
                            <Badge variant={metric.success ? "default" : "destructive"}>{metric.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="bg-midnight-800/50 border-midnight-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-electric-500" />
                    Performance Recommendations
                  </CardTitle>
                  <CardDescription>Suggestions to improve your API performance and reliability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-midnight-900/40">
                        <Zap className="h-5 w-5 text-electric-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Getting Started */}
        {results.length === 0 && !testing && (
          <Card className="bg-midnight-800/50 border-midnight-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Testing</CardTitle>
              <CardDescription>Test your API endpoints to measure response times and reliability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Click "Run Tests" to start a comprehensive performance analysis of your UpSide AI application. This will
                test all major API endpoints and provide detailed metrics and recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">What we'll test:</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Health check endpoint</li>
                    <li>• Chat API performance</li>
                    <li>• Feedback system</li>
                    <li>• Security status</li>
                    <li>• Simple chat endpoint</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Metrics measured:</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Response times (avg, min, max)</li>
                    <li>• Success rates</li>
                    <li>• Error rates</li>
                    <li>• Reliability scores</li>
                    <li>• Performance recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
