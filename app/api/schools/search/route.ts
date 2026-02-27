import { type NextRequest, NextResponse } from "next/server"
import { SchoolService } from "@/lib/school-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const prioritizeRural = searchParams.get("prioritize_rural") !== "false"

    const schools = await SchoolService.searchSchools(query, limit, prioritizeRural)

    return NextResponse.json({
      success: true,
      schools,
      count: schools.length,
    })
  } catch (error) {
    console.error("School search API error:", error)
    return NextResponse.json({ success: false, error: "Failed to search schools" }, { status: 500 })
  }
}
