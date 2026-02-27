"use client"

import { PerformanceDashboard } from "@/components/performance-dashboard"
import { usePerformanceMonitoring } from "@/hooks/use-performance"

export default function PerformancePage() {
  usePerformanceMonitoring("Performance Dashboard")

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Performance Testing</h1>
        <p className="text-gray-300">Monitor and optimize your app's loading speed and user experience.</p>
      </div>

      <PerformanceDashboard />
    </div>
  )
}
