"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Server, Shield, MessageSquare } from "lucide-react"

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  environment: string
  services: {
    api: string
    security: string
    chat: string
  }
  version: string
}

export default function StatusPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()
        setHealthStatus(data)
      } catch (error) {
        console.error("Failed to fetch health status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-lg text-gray-600">Current operational status of UpSide AI services</p>
        </div>

        {healthStatus && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>All systems are operational</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Status</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                      {healthStatus.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Uptime</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">{formatUptime(healthStatus.uptime)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Version</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">{healthStatus.version}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Status */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Status of individual system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">API Service</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {healthStatus.services.api}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Security Service</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {healthStatus.services.security}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Chat Service</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {healthStatus.services.chat}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Information</CardTitle>
                <CardDescription>Current deployment environment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Environment</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">{healthStatus.environment}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Last Updated</div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(healthStatus.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Page last refreshed: {new Date().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
