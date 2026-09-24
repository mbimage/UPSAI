import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"

// GET /api/colleges - list active colleges (used on the sign-up screen).
// Only non-sensitive fields are returned. RLS additionally restricts to active rows.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from("colleges")
      .select("id, name, type")
      .eq("active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("[v0] Colleges: list failed:", error.message)
      return NextResponse.json({ colleges: [] }, { status: 200, headers: getSecurityHeaders() })
    }
    return NextResponse.json({ colleges: data || [] }, { status: 200, headers: getSecurityHeaders() })
  } catch (error) {
    console.error("[v0] Colleges route crashed:", error)
    return NextResponse.json({ colleges: [] }, { status: 200, headers: getSecurityHeaders() })
  }
}
