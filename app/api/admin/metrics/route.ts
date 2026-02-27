import { type NextRequest, NextResponse } from "next/server"
import { AdminMetricsService } from "@/lib/admin-metrics-service"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const metricsService = new AdminMetricsService()
    const metrics = await metricsService.getComprehensiveMetrics()

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching admin metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { format } = await request.json()
    const metricsService = new AdminMetricsService()
    const report = await metricsService.exportMetricsReport(format)

    const headers = new Headers()
    if (format === "csv") {
      headers.set("Content-Type", "text/csv")
      headers.set("Content-Disposition", "attachment; filename=upside-ai-metrics.csv")
    } else {
      headers.set("Content-Type", "application/json")
      headers.set("Content-Disposition", "attachment; filename=upside-ai-metrics.json")
    }

    return new NextResponse(report, { headers })
  } catch (error) {
    console.error("Error exporting metrics:", error)
    return NextResponse.json({ error: "Failed to export metrics" }, { status: 500 })
  }
}
