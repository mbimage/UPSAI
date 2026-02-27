"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-neon-500/20 to-electric-500/20 border-b border-neon-500/30">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-neon-100">
              🚀 You're using the UpSide AI demo - Experience the full power of personalized teammate support!
            </span>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-neon-300 hover:text-neon-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
