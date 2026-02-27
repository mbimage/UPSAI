export interface PerformanceMetric {
  endpoint: string
  method: string
  responseTime: number
  status: number
  success: boolean
  timestamp: number
  error?: string
  size?: number
}

export interface TestResult {
  endpoint: string
  totalTests: number
  successCount: number
  failureCount: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  successRate: number
  reliability: "excellent" | "good" | "fair" | "poor"
  metrics: PerformanceMetric[]
}

export class PerformanceTester {
  private results: Map<string, PerformanceMetric[]> = new Map()

  async testEndpoint(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any,
    iterations = 5,
  ): Promise<TestResult> {
    const metrics: PerformanceMetric[] = []

    console.log(`Testing ${endpoint} with ${iterations} iterations...`)

    for (let i = 0; i < iterations; i++) {
      const metric = await this.singleTest(endpoint, method, body)
      metrics.push(metric)

      // Small delay between tests
      if (i < iterations - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    const result = this.calculateResults(endpoint, metrics)
    this.results.set(endpoint, metrics)

    return result
  }

  private async singleTest(endpoint: string, method: "GET" | "POST", body?: any): Promise<PerformanceMetric> {
    const startTime = performance.now()
    const timestamp = Date.now()

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (body && method === "POST") {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const endTime = performance.now()
      const responseTime = endTime - startTime

      // Try to get response size
      let size: number | undefined
      try {
        const text = await response.text()
        size = new Blob([text]).size
      } catch (e) {
        // Size calculation failed, continue without it
      }

      return {
        endpoint,
        method,
        responseTime,
        status: response.status,
        success: response.ok,
        timestamp,
        size,
      }
    } catch (error) {
      const endTime = performance.now()
      const responseTime = endTime - startTime

      return {
        endpoint,
        method,
        responseTime,
        status: 0,
        success: false,
        timestamp,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private calculateResults(endpoint: string, metrics: PerformanceMetric[]): TestResult {
    const successCount = metrics.filter((m) => m.success).length
    const failureCount = metrics.length - successCount
    const responseTimes = metrics.map((m) => m.responseTime)

    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const minResponseTime = Math.min(...responseTimes)
    const maxResponseTime = Math.max(...responseTimes)
    const successRate = (successCount / metrics.length) * 100

    let reliability: "excellent" | "good" | "fair" | "poor"
    if (successRate >= 99 && averageResponseTime < 200) {
      reliability = "excellent"
    } else if (successRate >= 95 && averageResponseTime < 500) {
      reliability = "good"
    } else if (successRate >= 90 && averageResponseTime < 1000) {
      reliability = "fair"
    } else {
      reliability = "poor"
    }

    return {
      endpoint,
      totalTests: metrics.length,
      successCount,
      failureCount,
      averageResponseTime,
      minResponseTime,
      maxResponseTime,
      successRate,
      reliability,
      metrics,
    }
  }

  async runFullSuite(): Promise<TestResult[]> {
    const endpoints = [
      { url: "/api/health", method: "GET" as const },
      {
        url: "/api/chat",
        method: "POST" as const,
        body: {
          messages: [{ role: "user", content: "Hello, this is a performance test." }],
          userId: "test-user",
        },
      },
      {
        url: "/api/feedback",
        method: "POST" as const,
        body: {
          rating: 5,
          feedback: "Test feedback",
          userId: "test-user",
        },
      },
      {
        url: "/api/simple-chat",
        method: "POST" as const,
        body: {
          message: "Test message",
        },
      },
      { url: "/api/security/status", method: "GET" as const },
    ]

    const results: TestResult[] = []

    for (const endpoint of endpoints) {
      try {
        const result = await this.testEndpoint(
          endpoint.url,
          endpoint.method,
          endpoint.body,
          10, // More iterations for comprehensive testing
        )
        results.push(result)
      } catch (error) {
        console.error(`Failed to test ${endpoint.url}:`, error)
        // Add failed result
        results.push({
          endpoint: endpoint.url,
          totalTests: 0,
          successCount: 0,
          failureCount: 1,
          averageResponseTime: 0,
          minResponseTime: 0,
          maxResponseTime: 0,
          successRate: 0,
          reliability: "poor",
          metrics: [],
        })
      }
    }

    return results
  }

  getRecommendations(results: TestResult[]): string[] {
    const recommendations: string[] = []

    results.forEach((result) => {
      if (result.successRate < 95) {
        recommendations.push(
          `🔴 ${result.endpoint}: Low success rate (${result.successRate.toFixed(1)}%) - investigate error handling`,
        )
      }

      if (result.averageResponseTime > 1000) {
        recommendations.push(
          `🐌 ${result.endpoint}: Slow response time (${result.averageResponseTime.toFixed(0)}ms) - consider optimization`,
        )
      }

      if (result.averageResponseTime > 500 && result.averageResponseTime <= 1000) {
        recommendations.push(
          `⚠️ ${result.endpoint}: Moderate response time (${result.averageResponseTime.toFixed(0)}ms) - monitor closely`,
        )
      }

      if (result.maxResponseTime > result.averageResponseTime * 3) {
        recommendations.push(
          `📊 ${result.endpoint}: High response time variance - investigate inconsistent performance`,
        )
      }
    })

    // Overall recommendations
    const avgSuccessRate = results.reduce((sum, r) => sum + r.successRate, 0) / results.length
    const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length

    if (avgSuccessRate < 98) {
      recommendations.push("🔧 Overall reliability needs improvement - implement better error handling and monitoring")
    }

    if (avgResponseTime > 300) {
      recommendations.push("⚡ Consider implementing caching, database optimization, or CDN for better performance")
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ Excellent performance! All endpoints are performing within optimal ranges.")
    }

    return recommendations
  }
}
