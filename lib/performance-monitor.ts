export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure page load time
  measurePageLoad(pageName: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      const metrics = {
        // Core Web Vitals
        firstContentfulPaint: this.getFCP(),
        largestContentfulPaint: this.getLCP(),
        cumulativeLayoutShift: this.getCLS(),
        firstInputDelay: this.getFID(),

        // Navigation timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,

        // Resource timing
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domProcessing: navigation.domComplete - navigation.domLoading,
      }

      console.group(`🚀 Performance Metrics for ${pageName}`)
      console.log("📊 Core Web Vitals:")
      console.log(`  FCP: ${metrics.firstContentfulPaint?.toFixed(2)}ms`)
      console.log(`  LCP: ${metrics.largestContentfulPaint?.toFixed(2)}ms`)
      console.log(`  CLS: ${metrics.cumulativeLayoutShift?.toFixed(4)}`)
      console.log(`  FID: ${metrics.firstInputDelay?.toFixed(2)}ms`)

      console.log("⏱️ Load Times:")
      console.log(`  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`)
      console.log(`  Total Load Time: ${metrics.totalLoadTime.toFixed(2)}ms`)
      console.log(`  Server Response: ${metrics.serverResponse.toFixed(2)}ms`)

      console.log("🌐 Network:")
      console.log(`  DNS Lookup: ${metrics.dnsLookup.toFixed(2)}ms`)
      console.log(`  TCP Connection: ${metrics.tcpConnection.toFixed(2)}ms`)
      console.groupEnd()

      // Store metrics
      this.metrics.set(pageName, metrics.totalLoadTime)

      // Send to analytics if available
      this.sendToAnalytics(pageName, metrics)
    }
  }

  // Get First Contentful Paint
  private getFCP(): number | null {
    const entries = performance.getEntriesByName("first-contentful-paint")
    return entries.length > 0 ? entries[0].startTime : null
  }

  // Get Largest Contentful Paint
  private getLCP(): number | null {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
      }).observe({ entryTypes: ["largest-contentful-paint"] })
    }) as any
  }

  // Get Cumulative Layout Shift
  private getCLS(): number | null {
    return new Promise((resolve) => {
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        resolve(clsValue)
      }).observe({ entryTypes: ["layout-shift"] })
    }) as any
  }

  // Get First Input Delay
  private getFID(): number | null {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          resolve((entry as any).processingStart - entry.startTime)
        }
      }).observe({ entryTypes: ["first-input"] })
    }) as any
  }

  // Measure resource loading
  measureResourceLoading(): void {
    if (typeof window !== "undefined") {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]

      const resourceMetrics = {
        images: resources.filter((r) => r.initiatorType === "img"),
        scripts: resources.filter((r) => r.initiatorType === "script"),
        stylesheets: resources.filter((r) => r.initiatorType === "link"),
        fonts: resources.filter((r) => r.initiatorType === "css"),
      }

      console.group("📦 Resource Loading Analysis")

      Object.entries(resourceMetrics).forEach(([type, items]) => {
        if (items.length > 0) {
          const totalSize = items.reduce((sum, item) => sum + (item.transferSize || 0), 0)
          const avgLoadTime = items.reduce((sum, item) => sum + item.duration, 0) / items.length

          console.log(`${type.toUpperCase()}:`)
          console.log(`  Count: ${items.length}`)
          console.log(`  Total Size: ${(totalSize / 1024).toFixed(2)} KB`)
          console.log(`  Avg Load Time: ${avgLoadTime.toFixed(2)}ms`)

          // Find slow resources
          const slowResources = items.filter((item) => item.duration > 1000)
          if (slowResources.length > 0) {
            console.warn(
              `  ⚠️ Slow ${type}:`,
              slowResources.map((r) => r.name),
            )
          }
        }
      })

      console.groupEnd()
    }
  }

  // Send metrics to analytics
  private sendToAnalytics(pageName: string, metrics: any): void {
    // You can integrate with Google Analytics, Vercel Analytics, etc.
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "page_load_performance", {
        page_name: pageName,
        load_time: metrics.totalLoadTime,
        fcp: metrics.firstContentfulPaint,
        lcp: metrics.largestContentfulPaint,
      })
    }
  }

  // Get performance recommendations
  getRecommendations(pageName: string): string[] {
    const recommendations: string[] = []
    const loadTime = this.metrics.get(pageName)

    if (loadTime && loadTime > 3000) {
      recommendations.push("🐌 Page load time is over 3 seconds - consider optimizing images and reducing bundle size")
    }

    if (loadTime && loadTime > 1000) {
      recommendations.push("⚡ Consider implementing code splitting and lazy loading")
    }

    // Check for large resources
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
    const largeImages = resources.filter(
      (r) => r.initiatorType === "img" && (r.transferSize || 0) > 500000, // 500KB
    )

    if (largeImages.length > 0) {
      recommendations.push("🖼️ Large images detected - consider compression and WebP format")
    }

    return recommendations
  }
}
