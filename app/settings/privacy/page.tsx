import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { getOrCreateAthleteProfile } from "@/lib/college-service"
import PrivacyClient from "./privacy-client"

// Athlete privacy & memory controls. Server component gates on auth, then hands
// the current profile state to the client for interactive management.
export const dynamic = "force-dynamic"

export default async function PrivacySettingsPage() {
  const user = await getUser()
  if (!user?.id) {
    redirect("/auth?redirect=/settings/privacy")
  }
  const profile = await getOrCreateAthleteProfile(user.id)

  return (
    <PrivacyClient
      initialMemoryEnabled={profile?.memoryEnabled ?? false}
      collegeName={profile?.collegeName ?? null}
    />
  )
}
