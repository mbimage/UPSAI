import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { getAdminColleges } from "@/lib/college-service"
import { getSecurityHeaders } from "@/lib/security-service"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CATEGORIES = ["academics", "athletics", "wellness", "career", "financial", "compliance", "general"]

// Authorize: the caller must be an admin of the given college. Returns the
// admin-college list so callers can validate a specific collegeId.
async function requireAdmin(collegeId: string | null) {
  const user = await getUser()
  if (!user?.id) return { error: "auth", userId: null as string | null, colleges: [] }
  const colleges = await getAdminColleges(user.id)
  if (colleges.length === 0) return { error: "forbidden", userId: user.id, colleges }
  if (collegeId && !colleges.some((c) => c.collegeId === collegeId)) {
    return { error: "forbidden", userId: user.id, colleges }
  }
  return { error: null, userId: user.id, colleges }
}

// GET /api/admin/resources?collegeId=... - list ALL resources for the admin's college
// (including unverified/inactive), so admins can review and approve them.
export async function GET(request: NextRequest) {
  const collegeId = new URL(request.url).searchParams.get("collegeId")
  const auth = await requireAdmin(collegeId)
  if (auth.error === "auth") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  if (auth.error === "forbidden") {
    return NextResponse.json({ error: "You are not an admin for this college." }, { status: 403, headers: getSecurityHeaders() })
  }

  // Default to the admin's first college if none specified.
  const targetCollege = collegeId || auth.colleges[0].collegeId
  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("college_resources")
    .select(`id, "collegeId", category, name, description, "contactType", "contactValue", url, verified, active, "createdAt"`)
    .eq("collegeId", targetCollege)
    .order("createdAt", { ascending: false })

  if (error) {
    console.error("[v0] Admin resources: list failed:", error.message)
    return NextResponse.json({ error: "Could not load resources." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json(
    { colleges: auth.colleges, collegeId: targetCollege, resources: data || [] },
    { status: 200, headers: getSecurityHeaders() },
  )
}

// POST /api/admin/resources - create a new resource for the admin's college.
export async function POST(request: NextRequest) {
  const body = await request.json()
  const collegeId = typeof body.collegeId === "string" ? body.collegeId : null
  const auth = await requireAdmin(collegeId)
  if (auth.error === "auth") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  if (auth.error === "forbidden" || !collegeId) {
    return NextResponse.json({ error: "You are not an admin for this college." }, { status: 403, headers: getSecurityHeaders() })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const category = typeof body.category === "string" ? body.category : ""
  if (!name || name.length > 160) {
    return NextResponse.json({ error: "A resource name is required." }, { status: 400, headers: getSecurityHeaders() })
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400, headers: getSecurityHeaders() })
  }

  const admin = createAdminSupabaseClient()
  const { data, error } = await admin
    .from("college_resources")
    .insert({
      collegeId,
      category,
      name,
      description: typeof body.description === "string" ? body.description.trim().slice(0, 600) : null,
      contactType: typeof body.contactType === "string" ? body.contactType.trim().slice(0, 40) : null,
      contactValue: typeof body.contactValue === "string" ? body.contactValue.trim().slice(0, 200) : null,
      url: typeof body.url === "string" ? body.url.trim().slice(0, 300) : null,
      // An admin creating a resource is the approval step, so it starts verified+active.
      verified: true,
      active: true,
      createdBy: auth.userId,
    })
    .select("id")
    .maybeSingle()

  if (error || !data) {
    console.error("[v0] Admin resources: create failed:", error?.message)
    return NextResponse.json({ error: "Could not create the resource." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json({ id: data.id }, { status: 201, headers: getSecurityHeaders() })
}

// PATCH /api/admin/resources - update / verify / activate a resource.
export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const id = typeof body.id === "string" ? body.id : ""
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid resource id" }, { status: 400, headers: getSecurityHeaders() })
  }

  const admin = createAdminSupabaseClient()
  // Look up the resource's college so we can authorize against it.
  const { data: existing } = await admin.from("college_resources").select(`"collegeId"`).eq("id", id).maybeSingle()
  if (!existing) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404, headers: getSecurityHeaders() })
  }
  const auth = await requireAdmin((existing as any).collegeId)
  if (auth.error === "auth") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  if (auth.error === "forbidden") {
    return NextResponse.json({ error: "You are not an admin for this college." }, { status: 403, headers: getSecurityHeaders() })
  }

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim().slice(0, 160)
  if (typeof body.category === "string" && CATEGORIES.includes(body.category)) updates.category = body.category
  if (body.description !== undefined) updates.description = typeof body.description === "string" ? body.description.trim().slice(0, 600) : null
  if (body.contactType !== undefined) updates.contactType = typeof body.contactType === "string" ? body.contactType.trim().slice(0, 40) : null
  if (body.contactValue !== undefined) updates.contactValue = typeof body.contactValue === "string" ? body.contactValue.trim().slice(0, 200) : null
  if (body.url !== undefined) updates.url = typeof body.url === "string" ? body.url.trim().slice(0, 300) : null
  if (typeof body.verified === "boolean") updates.verified = body.verified
  if (typeof body.active === "boolean") updates.active = body.active

  const { error } = await admin.from("college_resources").update(updates).eq("id", id)
  if (error) {
    console.error("[v0] Admin resources: update failed:", error.message)
    return NextResponse.json({ error: "Could not update the resource." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
}

// DELETE /api/admin/resources?id=... - remove a resource.
export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id") || ""
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid resource id" }, { status: 400, headers: getSecurityHeaders() })
  }
  const admin = createAdminSupabaseClient()
  const { data: existing } = await admin.from("college_resources").select(`"collegeId"`).eq("id", id).maybeSingle()
  if (!existing) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404, headers: getSecurityHeaders() })
  }
  const auth = await requireAdmin((existing as any).collegeId)
  if (auth.error === "auth") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: getSecurityHeaders() })
  }
  if (auth.error === "forbidden") {
    return NextResponse.json({ error: "You are not an admin for this college." }, { status: 403, headers: getSecurityHeaders() })
  }

  const { error } = await admin.from("college_resources").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: "Could not delete the resource." }, { status: 400, headers: getSecurityHeaders() })
  }
  return NextResponse.json({ success: true }, { status: 200, headers: getSecurityHeaders() })
}
