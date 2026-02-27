"use client"

import { useState, useEffect } from "react"
import { ImprovedChatBox } from "./improved-chat-box"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

export function ReliableChatBox() {
  const [useFallback, setUseFallback] = useState(false)
  const [apiTested, setApiTested] = useState(false)
  const [apiWorking, setApiWorking] = useState(true)

  // Test the OpenAI API on component mount
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "test" }),
        })

        // Try to parse the response as JSON
        try {
          await response.json()
          setApiWorking(true)
        } catch (e) {
          console.error("API returned non-JSON response:", e)
          setApiWorking(false)
        }
      } catch (e) {
        console.error("API test failed:", e)
        setApiWorking(false)
      } finally {
        setApiTested(true)
      }
    }

    testApi()
  }, [])

  // If API test failed, automatically use fallback
  useEffect(() => {
    if (apiTested && !apiWorking) {
      setUseFallback(true)
    }
  }, [apiTested, apiWorking])

  return (
    <div className="space-y-4">
      {apiTested && !apiWorking && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              OpenAI API Issue Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              We've detected an issue with the OpenAI API connection. You can continue using the fallback mode which
              uses pre-defined responses for testing.
            </p>
            <div className="flex items-center space-x-2">
              <Switch id="use-fallback" checked={useFallback} onCheckedChange={setUseFallback} />
              <Label htmlFor="use-fallback">Use Fallback Mode</Label>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-500/30 to-electric-500/30 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
        <div className="relative">
          <ImprovedChatBox apiEndpoint={useFallback ? "/api/fallback-chat" : "/api/chat"} />
        </div>
      </div>
    </div>
  )
}
