import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { getAdminColleges } from "@/lib/college-service"
import AdminResourcesClient from "./admin-resources-client"

// Per-college admin workflow to add and approve the resources the chat is
// allowed to name. Only users listed in college_admins can reach it.
export const dynamic = "force-dynamic"

export default async function AdminResourcesPage() {
  const user = await getUser()
  if (!user?.id) {
    redirect("/auth?redirect=/admin/resources")
  }
  const colleges = await getAdminColleges(user.id)
  if (colleges.length === 0) {
    redirect("/chat")
  }

  return <AdminResourcesClient colleges={colleges} />
}
