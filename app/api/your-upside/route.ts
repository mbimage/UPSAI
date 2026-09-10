import { NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"
import { generateYourUpside } from "@/lib/interaction-history-service"

export async function GET() {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json(
        { error: "auth_required" },
        { status: 401, headers: getSecurityHeaders() },
      )
    }

    const { sections, hasData, status } = await generateYourUpside(user.id)

    return NextResponse.json(
      { sections, hasData, status, updatedAt: new Date().toISOString() },
      { status: 200, headers: getSecurityHeaders() },
    )
  } catch (error) {
    console.error("[v0] Your UpSide: route error:", error)
    return NextResponse.json(
      { error: "server_error" },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
