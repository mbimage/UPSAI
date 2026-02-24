"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, ImageIcon, FileText, Wifi, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface PerformanceMetrics {
  pageName: string
  loadTime: number
  fcp: number
  lcp: number
  cls: number
  fid: number
  resourceCount: number
  totalSize: number
  recommendations: string[]
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runPerformanceTest = async () => {
    setIsLoading(true)

    // Simulate performance testing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get actual performance metrics
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType("resource")

    const mockMetrics: PerformanceMetrics = {
      pageName: "Current Page",
      loadTime: navigation.loadEventEnd - navigation.navigationStart,
      fcp: 1200,
      lcp: 2100,
      cls: 0.05,
      fid: 45,
      resourceCount: resources.length,
      totalSize: resources.reduce((sum, r) => sum + ((r as any).transferSize || 0), 0),
      recommendations: [
        "Consider optimizing images with WebP format",
        "Implement lazy loading for below-the-fold content",
        "Minify CSS and JavaScript files",
        "Enable gzip compression on server",
      ],
    }

    setMetrics(mockMetrics)
    setIsLoading(false)
  }

  useEffect(() => {
    runPerformanceTest()
  }, [])

  const getScoreColor = (score: number, thresholds: { good: number; needs: number }) => {
    if (score <= thresholds.good) return "text-green-500"
    if (score <= thresholds.needs) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number, thresholds: { good: number; needs: number }) => {
    if (score <= thresholds.good) return <Badge className="bg-green-500">Good</Badge>
    if (score <= thresholds.needs) return <Badge className="bg-yellow-500">Needs Improvement</Badge>
    return <Badge className="bg-red-500">Poor</Badge>
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-neon-400" />
          <p>Running performance tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-midnight-900 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
        <Button onClick={runPerformanceTest} disabled={isLoading} className="bg-neon-600 hover:bg-neon-500">
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
          Run Test
        </Button>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-midnight-800 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-neon-400" />
              First Contentful Paint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{metrics.fcp.toFixed(0)}ms</div>
            {getScoreBadge(metrics.fcp, { good: 1800, needs: 3000 })}
          </CardContent>
        </Card>

        <Card className="bg-midnight-800 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2 text-electric-400" />
              Largest Contentful Paint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{metrics.lcp.toFixed(0)}ms</div>
            {getScoreBadge(metrics.lcp, { good: 2500, needs: 4000 })}
          </CardContent>
        </Card>

        <Card className="bg-midnight-800 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-neon-400" />
              First Input Delay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{metrics.fid.toFixed(0)}ms</div>
            {getScoreBadge(metrics.fid, { good: 100, needs: 300 })}
          </CardContent>
        </Card>

        <Card className="bg-midnight-800 border-neon-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-electric-400" />
              Cumulative Layout Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{metrics.cls.toFixed(3)}</div>
            {getScoreBadge(metrics.cls * 1000, { good: 100, needs: 250 })}
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance */}
      <Card className="bg-midnight-800 border-neon-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wifi className="h-5 w-5 mr-2 text-neon-400" />
            Overall Performance
          </CardTitle>
          <CardDescription>Total page load time and resource analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Load Time</span>
            <span className={`font-bold ${getScoreColor(metrics.loadTime, { good: 2000, needs: 4000 })}`}>
              {(metrics.loadTime / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Resources Loaded</span>
            <span className="text-white font-medium">{metrics.resourceCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Size</span>
            <span className="text-white font-medium">{(metrics.totalSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>

          <Progress value={Math.min(((4000 - metrics.loadTime) / 4000) * 100, 100)} className="h-2" />
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-midnight-800 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            Performance Recommendations
          </CardTitle>
          <CardDescription>Suggestions to improve your page load speed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="bg-midnight-800 border-electric-500/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Images</h4>
              <ul className="space-y-1">
                <li>• Use WebP format when possible</li>
                <li>• Compress images before upload</li>
                <li>• Implement lazy loading</li>
                <li>• Use appropriate image sizes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Code</h4>
              <ul className="space-y-1">
                <li>• Minify CSS and JavaScript</li>
                <li>• Remove unused code</li>
                <li>• Use code splitting</li>
                <li>• Enable gzip compression</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
