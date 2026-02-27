"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { trackFeatureUsage } from "@/lib/analytics"

interface AutoTrackerProps {
  children: React.ReactNode
  feature: string
  trackClicks?: boolean
  trackViews?: boolean
  trackTimeSpent?: boolean
  className?: string
}

/**
 * Automatically tracks user interactions with wrapped elements
 * Completely invisible to users, powerful for analytics
 */
export function AutoTracker({
  children,
  feature,
  trackClicks = true,
  trackViews = true,
  trackTimeSpent = false,
  className,
}: AutoTrackerProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (trackViews) {
      trackFeatureUsage(feature, { action: "view" })
    }

    return () => {
      if (trackTimeSpent) {
        const timeSpent = Date.now() - startTimeRef.current
        trackFeatureUsage(feature, {
          action: "time_spent",
          duration_ms: timeSpent,
          duration_seconds: Math.round(timeSpent / 1000),
        })
      }
    }
  }, [feature, trackViews, trackTimeSpent])

  const handleClick = (e: React.MouseEvent) => {
    if (trackClicks) {
      const target = e.target as HTMLElement
      trackFeatureUsage(feature, {
        action: "click",
        element: target.tagName.toLowerCase(),
        text: target.textContent?.slice(0, 50) || "",
      })
    }
  }

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      className={className}
      style={{ display: "contents" }} // Invisible wrapper
    >
      {children}
    </div>
  )
}
