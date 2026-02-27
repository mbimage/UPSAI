"use client"

import type React from "react"

import { useEffect } from "react"
import { trackFeatureUsage } from "@/lib/analytics"

interface FeatureTrackerProps {
  feature: string
  context?: Record<string, any>
  trackOnMount?: boolean
  trackOnUnmount?: boolean
  children?: React.ReactNode
}

/**
 * Invisible component that tracks feature usage
 * Wrap any component to automatically track when users interact with it
 */
export function FeatureTracker({
  feature,
  context = {},
  trackOnMount = true,
  trackOnUnmount = false,
  children,
}: FeatureTrackerProps) {
  useEffect(() => {
    if (trackOnMount) {
      trackFeatureUsage(feature, { action: "mount", ...context })
    }

    return () => {
      if (trackOnUnmount) {
        trackFeatureUsage(feature, { action: "unmount", ...context })
      }
    }
  }, [feature, context, trackOnMount, trackOnUnmount])

  return <>{children}</>
}

/**
 * Hook for manual feature tracking
 */
export function useFeatureTracker(feature: string) {
  const track = (action: string, context: Record<string, any> = {}) => {
    trackFeatureUsage(feature, { action, ...context })
  }

  return { track }
}
