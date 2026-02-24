"use client"

import { useEffect } from "react"
import { PerformanceMonitor } from "@/lib/performance-monitor"

export function usePerformanceMonitoring(pageName: string) {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()

    // Measure page load when component mounts
    const timer = setTimeout(() => {
      monitor.measurePageLoad(pageName)
      monitor.measureResourceLoading()

      // Get and log recommendations
      const recommendations = monitor.getRecommendations(pageName)
      if (recommendations.length > 0) {
        console.group("💡 Performance Recommendations")
        recommendations.forEach((rec) => console.log(rec))
        console.groupEnd()
      }
    }, 1000) // Wait 1 second for page to fully load

    return () => clearTimeout(timer)
  }, [pageName])
}
