import { type NextRequest, NextResponse } from "next/server"
import { generateMonthlyDigest } from "@/lib/monthly-digest-service"

export async function POST(request: NextRequest) {
  try {
    const { month, year } = await request.json()

    if (!month || !year) {
      return NextResponse.json({ error: "Month and year are required" }, { status: 400 })
    }

    const digest = await generateMonthlyDigest(month, year)

    if (!digest) {
      return NextResponse.json({ error: "Failed to generate digest" }, { status: 500 })
    }

    return NextResponse.json({ digest })
  } catch (error) {
    console.error("Error generating digest:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
