"use client"

import { useCallback } from "react"

export function useHapticFeedback() {
  const lightFeedback = useCallback(() => {
    try {
      // Check if the device supports haptic feedback
      if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
        // Light haptic feedback (very short vibration)
        navigator.vibrate(10)
      }
    } catch (error) {
      // Silently fail if haptic feedback is not supported
      console.debug("Haptic feedback not supported:", error)
    }
  }, [])

  const mediumFeedback = useCallback(() => {
    try {
      if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
        // Medium haptic feedback
        navigator.vibrate(25)
      }
    } catch (error) {
      console.debug("Haptic feedback not supported:", error)
    }
  }, [])

  const heavyFeedback = useCallback(() => {
    try {
      if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
        // Heavy haptic feedback
        navigator.vibrate(50)
      }
    } catch (error) {
      console.debug("Haptic feedback not supported:", error)
    }
  }, [])

  return {
    lightFeedback,
    mediumFeedback,
    heavyFeedback,
  }
}
