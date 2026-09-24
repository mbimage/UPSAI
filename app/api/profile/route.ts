import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"
import { getOrCreateAthleteProfile } from "@/lib/college-service"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/profile - the signed-in athlete's profile (college link + memory opt-in)
export async function GET() {
  const user = await getUser()
  if (!user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  const profile = await getOrCreateAthleteProfile(user.id)
  return NextResponse.json({ profile }, { status: 200, headers: getSecurityHeaders() })
}

// PATCH /api/profile - update memory opt-in, display name, or (one-time) college.
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
    }

    const supabase = await createServerSupabaseClient()
    // Ensure a row exists before updating.
    await getOrCreateAthleteProfile(user.id)

    const body = await request.json()
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }

    if (body.memoryEnabled !== undefined) {
      if (typeof body.memoryEnabled !== "boolean") {
        return NextResponse.json({ error: "Invalid memoryEnabled" }, { status: 400, headers: getSecurityHeaders() })
      }
      updates.memoryEnabled = body.memoryEnabled
    }

    if (body.displayName !== undefined) {
      if (typeof body.displayName !== "string" || body.displayName.length > 80) {
        return NextResponse.json({ error: "Invalid displayName" }, { status: 400, headers: getSecurityHeaders() })
      }
      updates.displayName = body.displayName.trim() || null
    }

    if (body.collegeId !== undefined) {
      if (typeof body.collegeId !== "string" || !UUID_RE.test(body.collegeId)) {
        return NextResponse.json({ error: "Invalid collegeId" }, { status: 400, headers: getSecurityHeaders() })
      }
      // The DB trigger blocks switching an already-set college; setting it once is allowed.
      updates.collegeId = body.collegeId
    }

    const { data, error } = await supabase
      .from("athlete_profiles")
      .update(updates)
      .eq("id", user.id)
      .select(`id, "collegeId", "displayName", "memoryEnabled"`)
      .maybeSingle()

    if (error) {
      // The college-switch trigger raises a specific exception we surface kindly.
      if (error.message?.includes("college cannot be changed")) {
        return NextResponse.json(
          { error: "Your college is already set and can't be changed here. Contact your college admin if this is wrong." },
          { status: 409, headers: getSecurityHeaders() },
        )
      }
      console.error("[v0] Profile: update failed:", error.message)
      return NextResponse.json({ error: "Could not update your profile." }, { status: 400, headers: getSecurityHeaders() })
    }

    return NextResponse.json({ profile: data }, { status: 200, headers: getSecurityHeaders() })
  } catch (error) {
    console.error("[v0] Profile route crashed:", error)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500, headers: getSecurityHeaders() })
  }
}
