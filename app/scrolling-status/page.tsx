"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AccessibilityChecker } from "@/lib/accessibility-checker"
import {
  Monitor,
  Laptop,
  Smartphone,
  CheckCircle,
  AlertCircle,
  XCircle,
  Accessibility,
  Gauge,
  RefreshCw,
  Eye,
  Zap,
} from "lucide-react"

interface ScrollingResults {
  desktop: any
  laptop: any
  mobile: any
  accessibility: any
  performance: any
}

export default function ScrollingStatusPage() {
  const [results, setResults] = useState<ScrollingResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const runScrollingTest = async () => {
    setLoading(true)
    try {
      const checker = AccessibilityChecker.getInstance()
      const testResults = await checker.checkScrollingAccessibility()
      setResults(testResults)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Error running scrolling test:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runScrollingTest()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
      case "optimal":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "fair":
        return "text-yellow-500"
      case "poor":
      case "needs-improvement":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "optimal":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "fair":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "poor":
      case "needs-improvement":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variant =
      status === "excellent" || status === "optimal"
        ? "default"
        : status === "good"
          ? "secondary"
          : status === "fair"
            ? "outline"
            : "destructive"

    return <Badge variant={variant}>{status}</Badge>
  }

  if (loading && !results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-neon-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Testing Scrolling Performance</h2>
          <p className="text-neon-300">Checking desktop, laptop, and mobile accessibility...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent mb-4">
            Scrolling & Accessibility Status
          </h1>
          <p className="text-neon-200 text-lg mb-6">
            Comprehensive analysis of scrolling performance across all devices
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button onClick={runScrollingTest} disabled={loading} className="bg-neon-600 hover:bg-neon-700 text-white">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>

            {lastChecked && <p className="text-sm text-neon-400">Last checked: {lastChecked.toLocaleTimeString()}</p>}
          </div>
        </div>

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">Desktop Scrolling</CardTitle>
                    <CardDescription>Large screen optimization</CardDescription>
                  </div>
                  {getStatusIcon(results.desktop.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Status</span>
                  {getStatusBadge(results.desktop.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Screen Width</span>
                  <span className="text-white">{results.desktop.screenWidth}px</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Smooth Scroll</span>
                  {results.desktop.smoothScrollSupported ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Custom Scrollbars</span>
                  {results.desktop.customScrollbars ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Performance</span>
                  <span className={getStatusColor(results.desktop.scrollPerformance.rating)}>
                    {results.desktop.scrollPerformance.rating}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Laptop className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">Laptop Scrolling</CardTitle>
                    <CardDescription>Trackpad optimization</CardDescription>
                  </div>
                  {getStatusIcon(results.laptop.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Status</span>
                  {getStatusBadge(results.laptop.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Screen Width</span>
                  <span className="text-white">{results.laptop.screenWidth}px</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Trackpad Support</span>
                  {results.laptop.touchpadSupported ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Optimized</span>
                  {results.laptop.trackpadOptimized.optimized ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Performance</span>
                  <span className={getStatusColor(results.laptop.scrollPerformance.rating)}>
                    {results.laptop.scrollPerformance.rating}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">Mobile Scrolling</CardTitle>
                    <CardDescription>Touch optimization</CardDescription>
                  </div>
                  {getStatusIcon(results.mobile.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Status</span>
                  {getStatusBadge(results.mobile.status)}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Platform</span>
                  <span className="text-white">{results.mobile.platform}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Momentum Scroll</span>
                  {results.mobile.momentumScrolling.enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Touch Optimized</span>
                  {results.mobile.touchOptimized.touchStartOptimized ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Performance</span>
                  <span className={getStatusColor(results.mobile.scrollPerformance.rating)}>
                    {results.mobile.scrollPerformance.rating}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">Performance</CardTitle>
                    <CardDescription>Frame rate & responsiveness</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">FPS</span>
                  <span className="text-white font-mono">{results.performance.fps}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Performance</span>
                  {getStatusBadge(results.performance.performance)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neon-200">Frame Time</span>
                    <span className="text-white font-mono">{results.performance.frameTime.toFixed(2)}ms</span>
                  </div>
                  <Progress value={Math.min((60 / results.performance.fps) * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Accessibility className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">Accessibility</CardTitle>
                    <CardDescription>A11y compliance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Keyboard Nav</span>
                  {results.accessibility.keyboardNavigation.tabIndexProperlySet ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Screen Reader</span>
                  {results.accessibility.screenReaderSupport.ariaLabelsPresent ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Focus Management</span>
                  {results.accessibility.focusManagement.skipLinks ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Color Contrast</span>
                  <span className={getStatusColor(results.accessibility.colorContrast.rating)}>
                    {results.accessibility.colorContrast.rating}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neon-200">ARIA Coverage</span>
                    <span className="text-white">{results.accessibility.ariaLabels.coverage}%</span>
                  </div>
                  <Progress value={results.accessibility.ariaLabels.coverage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-midnight-800/50 border-midnight-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-neon-400" />
                  <div>
                    <CardTitle className="text-white">User Experience</CardTitle>
                    <CardDescription>Interaction quality</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Reduced Motion</span>
                  {results.accessibility.reducedMotion.respectsUserPreference ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Heading Structure</span>
                  {results.accessibility.screenReaderSupport.headingStructure.properHierarchy ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Skip Links</span>
                  {results.accessibility.keyboardNavigation.skipLinksPresent ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neon-200">Landmark Roles</span>
                  {results.accessibility.screenReaderSupport.landmarkRoles ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {results && (
          <Card className="mt-8 bg-midnight-800/50 border-midnight-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Overall Assessment</CardTitle>
              <CardDescription>Comprehensive scrolling and accessibility summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neon-300 mb-2">Scrolling Performance</h3>
                  <div className="text-3xl font-bold text-white mb-2">{results.performance.fps} FPS</div>
                  <p className="text-neon-200 text-sm">
                    {results.performance.performance === "excellent"
                      ? "Buttery smooth scrolling"
                      : results.performance.performance === "good"
                        ? "Smooth scrolling"
                        : results.performance.performance === "fair"
                          ? "Acceptable scrolling"
                          : "Needs optimization"}
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neon-300 mb-2">Accessibility Score</h3>
                  <div className="text-3xl font-bold text-white mb-2">{results.accessibility.ariaLabels.coverage}%</div>
                  <p className="text-neon-200 text-sm">
                    {results.accessibility.ariaLabels.coverage >= 90
                      ? "Excellent accessibility"
                      : results.accessibility.ariaLabels.coverage >= 75
                        ? "Good accessibility"
                        : results.accessibility.ariaLabels.coverage >= 60
                          ? "Fair accessibility"
                          : "Needs improvement"}
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neon-300 mb-2">Device Support</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    {
                      [results.desktop.status, results.laptop.status, results.mobile.status].filter(
                        (s) => s === "optimal",
                      ).length
                    }
                    /3
                  </div>
                  <p className="text-neon-200 text-sm">Desktop, Laptop & Mobile optimized</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
