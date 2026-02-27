import { type NextRequest, NextResponse } from "next/server"
import { HighSchoolReportingService } from "@/lib/high-school-reporting-service"
import { EmailService } from "@/lib/email-service"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role, email").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { adminEmail } = await request.json()
    const emailToUse = adminEmail || profile.email || "admin@upsideai.com"

    // Generate reports for all high schools
    const reportingService = new HighSchoolReportingService()
    const reports = await reportingService.generateAllSchoolReports()

    if (reports.length === 0) {
      return NextResponse.json({
        message: "No schools found or no reports generated",
        reportCount: 0,
      })
    }

    // Send email reports
    const emailService = new EmailService()
    await emailService.sendDailyHighSchoolReports(reports, emailToUse)

    // Log the report generation
    await supabase.from("admin_logs").insert({
      admin_id: session.user.id,
      action: "daily_reports_sent",
      details: {
        reportCount: reports.length,
        emailSentTo: emailToUse,
        schools: reports.map((r) => r.school.name),
      },
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "Daily reports generated and sent successfully",
      reportCount: reports.length,
      schools: reports.map((r) => ({
        name: r.school.name,
        studentCount: r.summary.totalStudents,
        activeStudents: r.summary.activeStudents,
      })),
    })
  } catch (error) {
    console.error("Error generating daily reports:", error)
    return NextResponse.json(
      {
        error: "Failed to generate daily reports",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get recent report history
    const { data: reportHistory } = await supabase
      .from("admin_logs")
      .select("*")
      .eq("action", "daily_reports_sent")
      .order("timestamp", { ascending: false })
      .limit(10)

    return NextResponse.json({
      recentReports: reportHistory || [],
    })
  } catch (error) {
    console.error("Error fetching report history:", error)
    return NextResponse.json({ error: "Failed to fetch report history" }, { status: 500 })
  }
}
