"use client"

import { useState, useEffect } from "react"

interface SimpleTypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function SimpleTypewriter({ text, speed = 30, className = "", onComplete }: SimpleTypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, speed, onComplete, isComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-neon-400">|</span>}
    </span>
  )
}
