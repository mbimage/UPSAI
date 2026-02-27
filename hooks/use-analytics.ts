"use client"

import { useCallback } from "react"

export function useAnalytics() {
  const trackFeature = useCallback((feature: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      console.log("Feature tracked:", feature, metadata)
    }
  }, [])

  const trackResource = useCallback((resourceId: string, action: string, timeSpent?: number) => {
    if (typeof window !== "undefined") {
      console.log("Resource tracked:", resourceId, action, timeSpent)
    }
  }, [])

  const trackPageView = useCallback((path: string) => {
    if (typeof window !== "undefined") {
      console.log("Page view tracked:", path)
    }
  }, [])

  return {
    trackFeature,
    trackResource,
    trackPageView,
  }
}
