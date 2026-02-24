"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiTestPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello!" }],
        }),
      })

      const data = await res.json()
      console.log(data)
      setResponse(data)
    } catch (err) {
      console.error("API test error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {`const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello!" }],
  }),
});

const data = await res.json();
console.log(data);`}
          </pre>

          <Button onClick={testApi} className="mt-4" disabled={loading}>
            {loading ? "Testing..." : "Run Test"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-300">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
