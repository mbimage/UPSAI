// College multi-tenancy service for UpSide.
//
// Every athlete is linked to exactly one college through athlete_profiles.
// The chat API may use ONLY the verified, active resources belonging to that
// athlete's college. College separation is enforced in the database (RLS +
// security-definer helpers) AND here in server code; the college is always
// derived from the authenticated user's profile, never from a browser request.

import { createServerSupabaseClient } from "@/lib/supabase/server"

export interface AthleteProfile {
  id: string
  collegeId: string | null
  displayName: string | null
  memoryEnabled: boolean
  collegeName?: string | null
  collegeType?: string | null
}

export interface CollegeResource {
  id: string
  collegeId: string
  category: string
  name: string
  description: string | null
  contactType: string | null
  contactValue: string | null
  url: string | null
  verified: boolean
  active: boolean
}

/**
 * Load the athlete's profile (college link + memory opt-in). Owner-scoped by RLS.
 * Creates a bare profile row on first access so every signed-in athlete has one.
 */
export async function getOrCreateAthleteProfile(userId: string): Promise<AthleteProfile | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("athlete_profiles")
    .select(`id, "collegeId", "displayName", "memoryEnabled", colleges:"collegeId" (name, type)`)
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("[v0] College: failed to load profile:", error.message)
  }

  if (data) {
    const college = (data as any).colleges
    return {
      id: data.id,
      collegeId: (data as any).collegeId,
      displayName: (data as any).displayName,
      memoryEnabled: (data as any).memoryEnabled,
      collegeName: college?.name ?? null,
      collegeType: college?.type ?? null,
    }
  }

  // No profile yet: create a bare one (college chosen later, memory off by default).
  const { data: created, error: createError } = await supabase
    .from("athlete_profiles")
    .insert({ id: userId })
    .select(`id, "collegeId", "displayName", "memoryEnabled"`)
    .maybeSingle()

  if (createError) {
    console.error("[v0] College: failed to create profile:", createError.message)
    return null
  }

  return created
    ? {
        id: created.id,
        collegeId: (created as any).collegeId,
        displayName: (created as any).displayName,
        memoryEnabled: (created as any).memoryEnabled,
      }
    : null
}

/**
 * Fetch the verified, active, college-approved resources for a given college.
 * RLS independently guarantees a user can only read their own college's rows;
 * we also filter explicitly here as defense in depth.
 */
export async function getApprovedResourcesForCollege(collegeId: string | null): Promise<CollegeResource[]> {
  if (!collegeId) return []
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("college_resources")
    .select(`id, "collegeId", category, name, description, "contactType", "contactValue", url, verified, active`)
    .eq("collegeId", collegeId)
    .eq("verified", true)
    .eq("active", true)
    .order("category", { ascending: true })

  if (error) {
    console.error("[v0] College: failed to load resources:", error.message)
    return []
  }
  return (data || []) as CollegeResource[]
}

/**
 * Build the college-approved resources block that gets appended to the universal
 * system prompt. This is the ONLY place campus-specific facts may enter the chat.
 */
export function buildCollegeResourceBlock(
  collegeName: string | null | undefined,
  resources: CollegeResource[],
): string {
  if (!collegeName) {
    return `\n\nCOLLEGE-APPROVED RESOURCES: This athlete is not yet linked to a college, so you have NO verified campus resources. Do not name any specific campus service, office, staff member, link, phone number, policy, or availability. When a real person would help, suggest only a general type of person or office (an advisor, a coach, career services, a counselor) and encourage the athlete to confirm the specifics with their school.`
  }

  if (resources.length === 0) {
    return `\n\nCOLLEGE-APPROVED RESOURCES for ${collegeName}: none have been verified yet. Do not name any specific campus service, office, staff member, link, phone number, policy, or availability for this college. Suggest only a general type of person or office and encourage the athlete to confirm the specifics with their school.`
  }

  const lines = resources
    .map((r) => {
      const contact = r.contactValue ? ` (${r.contactType ?? "contact"}: ${r.contactValue})` : ""
      const link = r.url ? ` [${r.url}]` : ""
      const desc = r.description ? ` — ${r.description}` : ""
      return `- [${r.category}] ${r.name}${desc}${contact}${link}`
    })
    .join("\n")

  return `\n\nCOLLEGE-APPROVED RESOURCES for ${collegeName} (these are the ONLY campus-specific resources you may name):\n${lines}\n\nYou may reference the resources above by name when they genuinely help. For anything NOT in this list, do not invent a specific campus service, office name, link, phone number, policy, or availability. Instead suggest a general type of person or office and encourage the athlete to confirm the details with their school.`
}

export interface AdminCollege {
  collegeId: string
  collegeName: string
  role: string
}

/**
 * Return the colleges the signed-in user administers. Owner-scoped by RLS on
 * college_admins (a user can only read their own admin rows).
 */
export async function getAdminColleges(userId: string): Promise<AdminCollege[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("college_admins")
    .select(`"collegeId", role, colleges:"collegeId" (name)`)
    .eq("userId", userId)

  if (error) {
    console.error("[v0] College: failed to load admin colleges:", error.message)
    return []
  }
  return (data || []).map((row: any) => ({
    collegeId: row.collegeId,
    collegeName: row.colleges?.name ?? "Your college",
    role: row.role,
  }))
}

/**
 * Is the chat globally enabled? Reads the app_flags kill switch. Fails OPEN only
 * for read errors (so a transient DB hiccup doesn't take down chat), but an
 * explicit disabled flag is always honored.
 */
export async function isChatEnabled(): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("app_flags")
    .select("enabled")
    .eq("key", "chat_enabled")
    .maybeSingle()

  if (error) {
    console.error("[v0] College: failed to read chat flag, defaulting to enabled:", error.message)
    return true
  }
  return data ? data.enabled : true
}
