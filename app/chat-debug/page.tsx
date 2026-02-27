"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, MessageSquare, AlertTriangle } from "lucide-react"

interface ChatTestResult {
  success: boolean
  reply?: string
  error?: string
  timestamp?: string
  responseTime?: number
}

export default function ChatDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState("Hi, I'm feeling stressed about my upcoming game. Any advice?")
  const [result, setResult] = useState<ChatTestResult | null>(null)
  const [apiStatus, setApiStatus] = useState<any>(null)

  const testChatAPI = async () => {
    setIsLoading(true)
    setResult(null)

    const startTime = Date.now()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: testMessage }],
          userId: "debug-test",
          enhancedContext: {
            requestLongerResponse: true,
            userProfile: {
              name: "Alex",
              sport: "Basketball",
              grade: "11th",
            },
          },
        }),
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          reply: data.reply,
          timestamp: data.timestamp,
          responseTime,
        })
      } else {
        setResult({
          success: false,
          error: data.error || `HTTP ${response.status}`,
          responseTime,
        })
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Network error",
        responseTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkAPIStatus = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "GET",
      })
      const data = await response.json()
      setApiStatus(data)
    } catch (error) {
      setApiStatus({ error: "Failed to check API status" })
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Chat Debug & Test</h1>
          <p className="text-gray-600 mb-8">Test and debug the chat functionality</p>
        </div>

        {/* API Status Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              API Status Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={checkAPIStatus} variant="outline" className="mb-4 bg-transparent">
              Check API Status
            </Button>

            {apiStatus && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm overflow-auto">{JSON.stringify(apiStatus, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Chat Function Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="testMessage" className="block text-sm font-medium mb-2">
                Test Message:
              </label>
              <Textarea
                id="testMessage"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a message to test..."
                rows={3}
              />
            </div>

            <Button onClick={testChatAPI} disabled={isLoading} size="lg" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Chat...
                </>
              ) : (
                "Test Chat Response"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Chat Test Passed
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      Chat Test Failed
                    </>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "SUCCESS" : "FAILED"}
                  </Badge>
                  {result.responseTime && <Badge variant="outline">{result.responseTime}ms</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Chat Response Generated</h4>
                    <div className="text-green-700">
                      <strong>AI Reply:</strong>
                      <div className="mt-2 p-3 bg-white rounded border italic">"{result.reply}"</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Response Length:</strong> {result.reply?.length} characters
                    </div>
                    <div>
                      <strong>Response Time:</strong> {result.responseTime}ms
                    </div>
                    <div>
                      <strong>Timestamp:</strong>{" "}
                      {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : "N/A"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">❌ Error Details</h4>
                  <p className="text-red-700 mb-2">{result.error}</p>
                  <div className="text-sm text-red-600">
                    <strong>Response Time:</strong> {result.responseTime}ms
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Troubleshooting Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Common Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>
                  <strong>API Key Missing:</strong> Check that{" "}
                  <code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code> is set in environment variables
                </li>
                <li>
                  <strong>Rate Limiting:</strong> OpenAI API has rate limits - wait a moment between requests
                </li>
                <li>
                  <strong>Network Issues:</strong> Ensure internet connectivity and firewall settings allow OpenAI API
                  access
                </li>
                <li>
                  <strong>Invalid API Key:</strong> Verify your OpenAI API key is valid and has sufficient credits
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Debug Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>First, check API status to see if the endpoint is responding</li>
                <li>Test with a simple message to verify basic functionality</li>
                <li>Check browser console for additional error details</li>
                <li>Verify environment variables are properly loaded</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
