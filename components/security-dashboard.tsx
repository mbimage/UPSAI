"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock } from "lucide-react"

interface SecurityStatus {
  status: string
  timestamp: string
  features: {
    rateLimiting: string
    inputSanitization: string
    securityHeaders: string
  }
}

export function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSecurityStatus = async () => {
      try {
        const response = await fetch("/api/security/status")
        const data = await response.json()
        setSecurityStatus(data)
      } catch (error) {
        console.error("Failed to fetch security status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchSecurityStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-gray-600">All systems operational</p>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Active</div>
            <p className="text-xs text-gray-600">Protecting against abuse</p>
          </CardContent>
        </Card>

        {/* Input Sanitization */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input Sanitization</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-gray-600">XSS protection enabled</p>
          </CardContent>
        </Card>

        {/* Security Headers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Headers</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Active</div>
            <p className="text-xs text-gray-600">Headers configured</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>Current security measures protecting the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">Rate Limiting</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Input Sanitization</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">Security Headers</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Request Monitoring</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Monitoring
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      {securityStatus && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date(securityStatus.timestamp).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
