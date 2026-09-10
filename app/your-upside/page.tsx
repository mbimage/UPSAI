import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { generateYourUpside } from "@/lib/interaction-history-service"
import { YourUpsideClient } from "@/components/your-upside-client"

export const metadata = {
  title: "Your UpSide",
  description: "A private look at what's been on your mind, pulled from your own conversations with UpSide.",
}

// Always render fresh for the signed-in athlete; never cache personal data.
export const dynamic = "force-dynamic"

export default async function YourUpsidePage() {
  const user = await getUser()
  if (!user?.id) {
    redirect("/auth?redirect=/your-upside")
  }

  const { sections, hasData, status } = await generateYourUpside(user.id)

  return <YourUpsideClient initialSections={sections} initialHasData={hasData} initialStatus={status} />
}
