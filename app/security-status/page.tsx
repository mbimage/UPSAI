"use client"

import { useEffect, useState } from "react"
import { SecurityDashboard } from "@/components/security-dashboard"

type SecurityMetrics = {
  totalEvents: number
  criticalEvents: number
  highRiskEvents: number
  mediumRiskEvents: number
  lowRiskEvents: number
  lastUpdate: string
}

type SecurityStatus = {
  status: string
  security: {
    wallActive: boolean
    rateLimitingActive: boolean
    threatDetectionActive: boolean
    inputSanitizationActive: boolean
    auditLoggingActive: boolean
  }
  metrics: SecurityMetrics
  timestamp: string
}

export default function SecurityStatusPage() {
  const [status, setStatus] = useState<SecurityStatus | null>(null)
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/security/status", { cache: "no-store" })
      const data = (await res.json()) as SecurityStatus
      setStatus(data)

      // Read important security headers (set by middleware)
      const important = [
        "content-security-policy",
        "strict-transport-security",
        "x-frame-options",
        "x-content-type-options",
        "referrer-policy",
        "permissions-policy",
        "x-xss-protection",
        "x-ratelimit-remaining",
        "x-ratelimit-reset",
      ]
      const hdrs: Record<string, string> = {}
      important.forEach((h) => {
        const v = res.headers.get(h)
        if (v) hdrs[h] = v
      })
      setHeaders(hdrs)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load security status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const pill = (active: boolean) => (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
        active
          ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/20"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/20"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Security Status</h1>
          <p className="text-lg text-gray-600">Current security status and protection measures for UpSide AI</p>
        </div>

        <SecurityDashboard />
      </div>
    </div>
  )
}

function FeatureItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-midnight-700/60 bg-midnight-900/40 p-3">
      <span className="text-sm text-gray-300">{label}</span>
      <span
        className={`h-2 w-2 rounded-full ${active ? "bg-green-400 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" : "bg-red-400"}`}
        aria-label={active ? "active" : "inactive"}
      />
    </div>
  )
}

function Metric({ label, value, color = "text-gray-300" }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}
