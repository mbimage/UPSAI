import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getClientIP } from "./security-service"

export interface SecurityEvent {
  id?: string
  event_type: string
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
  ip_address?: string
  user_agent?: string
  user_id?: string
  timestamp?: string
  resolved?: boolean
  resolution_notes?: string
}

export interface ThreatAlert {
  id?: string
  threat_type: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  source_ip: string
  user_id?: string
  metadata: Record<string, any>
  status: "active" | "investigating" | "resolved" | "false_positive"
  created_at?: string
  resolved_at?: string
}

export interface SecurityMetrics {
  totalEvents: number
  threatsByType: Record<string, number>
  threatsBySeverity: Record<string, number>
  recentThreats: number
  blockedIPs: number
  activeAlerts: number
  topThreats: Array<{ type: string; count: number }>
  timeSeriesData: Array<{ timestamp: string; count: number; severity: string }>
}

export class SecurityMonitor {
  private static instance: SecurityMonitor
  private _supabaseClient: any = null

  private async getSupabase() {
    if (!this._supabaseClient) {
      this._supabaseClient = await createServerSupabaseClient()
    }
    return this._supabaseClient
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }

  async logEvent(event: Omit<SecurityEvent, "id" | "timestamp">): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const { error } = await supabase.from("security_logs").insert({
        event_type: event.event_type,
        details: event.details,
        severity: event.severity,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        user_id: event.user_id,
        timestamp: new Date().toISOString(),
      })

      if (error) {
        console.error("Failed to log security event:", error)
        console.log("Security Event (fallback):", event)
      }

      await this.checkForThreatAlert(event)
    } catch (error) {
      console.error("Error logging security event:", error)
    }
  }

  private async checkForThreatAlert(event: Omit<SecurityEvent, "id" | "timestamp">): Promise<void> {
    if (event.severity === "high" || event.severity === "critical") {
      const alert: Omit<ThreatAlert, "id" | "created_at"> = {
        threat_type: event.event_type,
        description: this.generateThreatDescription(event),
        severity: event.severity,
        source_ip: event.ip_address || "unknown",
        user_id: event.user_id,
        metadata: event.details,
        status: "active",
      }
      await this.createThreatAlert(alert)
    }
  }

  private generateThreatDescription(event: Omit<SecurityEvent, "id" | "timestamp">): string {
    const descriptions: Record<string, string> = {
      rate_limit_exceeded: "Rate limit exceeded - potential DDoS or brute force attack",
      threat_detected: "Malicious request pattern detected",
      suspicious_user_agent: "Suspicious user agent detected - potential bot or scanner",
      sql_injection_attempt: "SQL injection attempt detected",
      xss_attempt: "Cross-site scripting (XSS) attempt detected",
      authentication_failure: "Multiple authentication failures detected",
      unauthorized_access: "Unauthorized access attempt detected",
      data_breach_attempt: "Potential data breach attempt detected",
      privilege_escalation: "Privilege escalation attempt detected",
    }
    return descriptions[event.event_type] || `Security event: ${event.event_type}`
  }

  async createThreatAlert(alert: Omit<ThreatAlert, "id" | "created_at">): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const { error } = await supabase.from("threat_alerts").insert({
        threat_type: alert.threat_type,
        description: alert.description,
        severity: alert.severity,
        source_ip: alert.source_ip,
        user_id: alert.user_id,
        metadata: alert.metadata,
        status: alert.status,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Failed to create threat alert:", error)
      }

      if (alert.severity === "critical") {
        await this.sendCriticalThreatNotification(alert)
      }
    } catch (error) {
      console.error("Error creating threat alert:", error)
    }
  }

  private async sendCriticalThreatNotification(alert: Omit<ThreatAlert, "id" | "created_at">): Promise<void> {
    console.error("CRITICAL THREAT ALERT:", {
      type: alert.threat_type,
      description: alert.description,
      source: alert.source_ip,
      timestamp: new Date().toISOString(),
    })
  }

  async getSecurityMetrics(timeRange: "1h" | "24h" | "7d" | "30d" = "24h"): Promise<SecurityMetrics> {
    try {
      const supabase = await this.getSupabase()
      const timeRangeHours = { "1h": 1, "24h": 24, "7d": 168, "30d": 720 }
      const hoursAgo = timeRangeHours[timeRange]
      const startTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

      const { count: totalEvents } = await supabase
        .from("security_logs")
        .select("*", { count: "exact", head: true })
        .gte("timestamp", startTime)

      const { data: threatsByTypeData } = await supabase
        .from("security_logs")
        .select("event_type")
        .gte("timestamp", startTime)

      const threatsByType: Record<string, number> = {}
      threatsByTypeData?.forEach((row: any) => {
        threatsByType[row.event_type] = (threatsByType[row.event_type] || 0) + 1
      })

      const { data: threatsBySeverityData } = await supabase
        .from("security_logs")
        .select("severity")
        .gte("timestamp", startTime)

      const threatsBySeverity: Record<string, number> = {}
      threatsBySeverityData?.forEach((row: any) => {
        threatsBySeverity[row.severity] = (threatsBySeverity[row.severity] || 0) + 1
      })

      const { count: recentThreats } = await supabase
        .from("security_logs")
        .select("*", { count: "exact", head: true })
        .gte("timestamp", new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .in("severity", ["high", "critical"])

      const { count: blockedIPs } = await supabase
        .from("blocked_ips")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      const { count: activeAlerts } = await supabase
        .from("threat_alerts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      const topThreats = Object.entries(threatsByType)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count }))

      const { data: timeSeriesRaw } = await supabase
        .from("security_logs")
        .select("timestamp, severity")
        .gte("timestamp", startTime)
        .order("timestamp", { ascending: true })

      const timeSeriesData = this.formatTimeSeriesData(timeSeriesRaw || [], hoursAgo)

      return {
        totalEvents: totalEvents || 0,
        threatsByType,
        threatsBySeverity,
        recentThreats: recentThreats || 0,
        blockedIPs: blockedIPs || 0,
        activeAlerts: activeAlerts || 0,
        topThreats,
        timeSeriesData,
      }
    } catch (error) {
      console.error("Error getting security metrics:", error)
      return {
        totalEvents: 0,
        threatsByType: {},
        threatsBySeverity: {},
        recentThreats: 0,
        blockedIPs: 0,
        activeAlerts: 0,
        topThreats: [],
        timeSeriesData: [],
      }
    }
  }

  private formatTimeSeriesData(
    data: Array<{ timestamp: string; severity: string }>,
    hoursAgo: number,
  ): Array<{ timestamp: string; count: number; severity: string }> {
    const bucketSize = hoursAgo <= 24 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    const buckets: Record<string, Record<string, number>> = {}

    data.forEach((row) => {
      const timestamp = new Date(row.timestamp)
      const bucketTime = new Date(Math.floor(timestamp.getTime() / bucketSize) * bucketSize)
      const bucketKey = bucketTime.toISOString()

      if (!buckets[bucketKey]) {
        buckets[bucketKey] = { low: 0, medium: 0, high: 0, critical: 0 }
      }
      buckets[bucketKey][row.severity]++
    })

    return Object.entries(buckets).map(([timestamp, counts]) => ({
      timestamp,
      count: Object.values(counts).reduce((sum, count) => sum + count, 0),
      severity: "all",
    }))
  }

  async getRecentEvents(limit = 50): Promise<SecurityEvent[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from("security_logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching recent events:", error)
        return []
      }
      return data || []
    } catch (error) {
      console.error("Error getting recent events:", error)
      return []
    }
  }

  async getActiveThreatAlerts(): Promise<ThreatAlert[]> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from("threat_alerts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching threat alerts:", error)
        return []
      }
      return data || []
    } catch (error) {
      console.error("Error getting threat alerts:", error)
      return []
    }
  }

  async blockIP(ipAddress: string, reason: string, duration?: number, userId?: string): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const blockedUntil = duration ? new Date(Date.now() + duration * 1000).toISOString() : null

      const { error } = await supabase.from("blocked_ips").insert({
        ip_address: ipAddress,
        reason,
        blocked_until: blockedUntil,
        created_by: userId,
        is_active: true,
      })

      if (error) {
        console.error("Error blocking IP:", error)
        return
      }

      await this.logEvent({
        event_type: "ip_blocked",
        details: { ip_address: ipAddress, reason, duration },
        severity: "medium",
        ip_address: ipAddress,
        user_id: userId,
      })
    } catch (error) {
      console.error("Error blocking IP:", error)
    }
  }

  async isIPBlocked(ipAddress: string): Promise<boolean> {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from("blocked_ips")
        .select("*")
        .eq("ip_address", ipAddress)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        return false
      }

      if (data.blocked_until && new Date(data.blocked_until) < new Date()) {
        await supabase.from("blocked_ips").update({ is_active: false }).eq("id", data.id)
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking IP block status:", error)
      return false
    }
  }

  async resolveThreatAlert(alertId: string, resolution: string, userId?: string): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const { error } = await supabase
        .from("threat_alerts")
        .update({
          status: "resolved",
          resolution_notes: resolution,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId)

      if (error) {
        console.error("Error resolving threat alert:", error)
        return
      }

      await this.logEvent({
        event_type: "threat_alert_resolved",
        details: { alert_id: alertId, resolution },
        severity: "low",
        user_id: userId,
      })
    } catch (error) {
      console.error("Error resolving threat alert:", error)
    }
  }

  async cleanupOldLogs(retentionDays = 90): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase.from("security_logs").delete().lt("timestamp", cutoffDate)

      if (error) {
        console.error("Error cleaning up old logs:", error)
      }
    } catch (error) {
      console.error("Error during log cleanup:", error)
    }
  }
}

export const securityMonitor = SecurityMonitor.getInstance()

export async function logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): Promise<void> {
  await securityMonitor.logEvent(event)
}

export async function logAuthenticationFailure(ipAddress: string, userAgent: string, email?: string): Promise<void> {
  await securityMonitor.logEvent({
    event_type: "authentication_failure",
    details: { email, attempt_type: "login" },
    severity: "medium",
    ip_address: ipAddress,
    user_agent: userAgent,
  })
}

export async function logSuspiciousActivity(
  request: Request,
  activityType: string,
  details: Record<string, any>,
): Promise<void> {
  await securityMonitor.logEvent({
    event_type: activityType,
    details,
    severity: "high",
    ip_address: getClientIP(request),
    user_agent: request.headers.get("user-agent") || undefined,
  })
}

export async function checkIPBlocked(ipAddress: string): Promise<boolean> {
  return await securityMonitor.isIPBlocked(ipAddress)
}
