import { createClient } from "@supabase/supabase-js"

// Service-role client for privileged, server-only operations that must bypass RLS:
// assigning college admins and toggling the chat kill switch. NEVER import this
// into client components. The service role key stays on the server.
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase admin client is not configured")
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
