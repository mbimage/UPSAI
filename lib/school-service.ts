import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface TexasHighSchool {
  id: string
  name: string
  district: string
  city: string
  county: string
  region: number
  classification: string
  enrollment: number
  is_rural: boolean
  latitude?: number
  longitude?: number
}

export class SchoolService {
  private static async getSupabaseClient() {
    const cookieStore = await cookies()

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })
  }

  /**
   * Search Texas high schools with emphasis on rural schools
   * @param query Search term (school name, city, or district)
   * @param limit Maximum number of results (default: 20)
   * @param prioritizeRural Whether to prioritize rural schools in results
   */
  static async searchSchools(query: string, limit = 20, prioritizeRural = true): Promise<TexasHighSchool[]> {
    const supabase = this.getSupabaseClient()

    if (!query.trim()) {
      // Return popular rural schools if no query
      const { data, error } = await supabase
        .from("texas_high_schools")
        .select("*")
        .eq("is_rural", true)
        .order("enrollment", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching schools:", error)
        return []
      }

      return data || []
    }

    // Use full-text search for comprehensive matching
    let queryBuilder = supabase
      .from("texas_high_schools")
      .select("*")
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,district.ilike.%${query}%,county.ilike.%${query}%`)

    // Prioritize rural schools in search results
    if (prioritizeRural) {
      queryBuilder = queryBuilder.order("is_rural", { ascending: false })
    }

    queryBuilder = queryBuilder.order("enrollment", { ascending: false }).limit(limit)

    const { data, error } = await queryBuilder

    if (error) {
      console.error("Error searching schools:", error)
      return []
    }

    return data || []
  }

  /**
   * Get schools by region (UIL regions 1-6)
   */
  static async getSchoolsByRegion(region: number): Promise<TexasHighSchool[]> {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase
      .from("texas_high_schools")
      .select("*")
      .eq("region", region)
      .order("is_rural", { ascending: false })
      .order("name")

    if (error) {
      console.error("Error fetching schools by region:", error)
      return []
    }

    return data || []
  }

  /**
   * Get rural schools specifically
   */
  static async getRuralSchools(limit = 50): Promise<TexasHighSchool[]> {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase
      .from("texas_high_schools")
      .select("*")
      .eq("is_rural", true)
      .order("region")
      .order("name")
      .limit(limit)

    if (error) {
      console.error("Error fetching rural schools:", error)
      return []
    }

    return data || []
  }

  /**
   * Get schools by classification (1A, 2A, etc.)
   */
  static async getSchoolsByClassification(classification: string): Promise<TexasHighSchool[]> {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase
      .from("texas_high_schools")
      .select("*")
      .eq("classification", classification)
      .order("is_rural", { ascending: false })
      .order("name")

    if (error) {
      console.error("Error fetching schools by classification:", error)
      return []
    }

    return data || []
  }

  /**
   * Add a new school (for schools not in database)
   */
  static async addSchool(schoolData: Omit<TexasHighSchool, "id">): Promise<TexasHighSchool | null> {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase.from("texas_high_schools").insert([schoolData]).select().single()

    if (error) {
      console.error("Error adding school:", error)
      return null
    }

    return data
  }

  /**
   * Get comprehensive school statistics
   */
  static async getSchoolStats() {
    const supabase = this.getSupabaseClient()

    const { data, error } = await supabase.from("texas_high_schools").select("region, classification, is_rural")

    if (error) {
      console.error("Error fetching school stats:", error)
      return null
    }

    const stats = {
      total: data.length,
      rural: data.filter((s) => s.is_rural).length,
      byRegion: {} as Record<number, number>,
      byClassification: {} as Record<string, number>,
      ruralByRegion: {} as Record<number, number>,
    }

    data.forEach((school) => {
      stats.byRegion[school.region] = (stats.byRegion[school.region] || 0) + 1
      stats.byClassification[school.classification] = (stats.byClassification[school.classification] || 0) + 1

      if (school.is_rural) {
        stats.ruralByRegion[school.region] = (stats.ruralByRegion[school.region] || 0) + 1
      }
    })

    return stats
  }
}
