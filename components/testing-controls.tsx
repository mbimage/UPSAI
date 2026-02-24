"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, X } from "lucide-react"

export default function TestingControls() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/30 text-white mb-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/20"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
      <CardContent className="p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-300 mb-1">Testing Environment</h3>
            <p className="text-sm text-yellow-200/80">
              This is a demo version of UpSide AI. Data is not saved between sessions and some features may be limited.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
