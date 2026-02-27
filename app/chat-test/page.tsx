"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"

interface TestResult {
  success: boolean
  message?: string
  response?: string
  error?: string
  details?: {
    hasOpenAIKey: boolean
    keyPrefix: string
    model?: string
    timestamp?: string
    errorType?: string
    suggestion?: string
  }
}

export default function ChatTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const runChatTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/chat-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to connect to chat test API",
        details: {
          hasOpenAIKey: false,
          keyPrefix: "unknown",
          suggestion: "Check your network connection and try again",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Chat Function Test</h1>
          <p className="text-gray-600 mb-8">Test your OpenAI API connection and chat functionality</p>

          <Button onClick={runChatTest} disabled={isLoading} size="lg" className="min-w-[200px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Chat Test"
            )}
          </Button>
        </div>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Test Passed
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      Test Failed
                    </>
                  )}
                </CardTitle>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "SUCCESS" : "FAILED"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Chat Function Working</h4>
                    <p className="text-green-700">{result.message}</p>
                  </div>

                  {result.response && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">AI Response:</h4>
                      <p className="text-blue-700 italic">"{result.response}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>API Key Status:</strong> ✅ Configured
                    </div>
                    <div>
                      <strong>Model:</strong> {result.details?.model || "gpt-4o"}
                    </div>
                    <div>
                      <strong>Key Prefix:</strong> {result.details?.keyPrefix}
                    </div>
                    <div>
                      <strong>Test Time:</strong>{" "}
                      {result.details?.timestamp ? new Date(result.details.timestamp).toLocaleTimeString() : "Now"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">❌ Error Details</h4>
                    <p className="text-red-700 mb-2">{result.error}</p>
                    {result.details?.suggestion && (
                      <p className="text-red-600 text-sm">
                        <strong>Suggestion:</strong> {result.details.suggestion}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <strong>API Key:</strong>
                      {result.details?.hasOpenAIKey ? (
                        <Badge variant="default">Found</Badge>
                      ) : (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </div>
                    <div>
                      <strong>Key Prefix:</strong> {result.details?.keyPrefix}
                    </div>
                    {result.details?.errorType && (
                      <div>
                        <strong>Error Type:</strong> {result.details.errorType}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Troubleshooting Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">If the test fails:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>
                  Check that your <code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code> environment variable
                  is set
                </li>
                <li>Verify your OpenAI API key is valid and has sufficient credits</li>
                <li>Ensure you have internet connectivity</li>
                <li>Check the browser console for additional error details</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Next steps after success:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>
                  Try the main chat interface at <code className="bg-gray-100 px-1 rounded">/chat</code>
                </li>
                <li>Test the personalized features with your profile</li>
                <li>Explore the journal integration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
