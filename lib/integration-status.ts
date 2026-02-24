export interface IntegrationStatus {
  name: string
  status: "connected" | "missing" | "error"
  message: string
  required: boolean
}

export async function checkIntegrationStatus(): Promise<IntegrationStatus[]> {
  const integrations: IntegrationStatus[] = []

  // OpenAI Integration
  integrations.push({
    name: "OpenAI",
    status: process.env.OPENAI_API_KEY ? "connected" : "missing",
    message: process.env.OPENAI_API_KEY
      ? "OpenAI API key configured"
      : "OpenAI API key missing - AI chat features will not work",
    required: true,
  })

  // Supabase Integration
  const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  integrations.push({
    name: "Supabase",
    status: supabaseConfigured ? "connected" : "missing",
    message: supabaseConfigured
      ? "Supabase configured"
      : "Supabase configuration missing - Database features will not work",
    required: true,
  })

  // Resend Integration (for emails)
  integrations.push({
    name: "Resend",
    status: process.env.RESEND_API_KEY ? "connected" : "missing",
    message: process.env.RESEND_API_KEY
      ? "Resend API key configured"
      : "Resend API key missing - Email features will not work",
    required: false,
  })

  // Analytics
  integrations.push({
    name: "Analytics",
    status: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS ? "connected" : "missing",
    message: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS ? "Analytics enabled" : "Analytics disabled",
    required: false,
  })

  // App URLs
  const appUrlConfigured = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  integrations.push({
    name: "App URLs",
    status: appUrlConfigured ? "connected" : "missing",
    message: appUrlConfigured ? "App URLs configured" : "App URLs missing - Some features may not work correctly",
    required: false,
  })

  // Test Supabase connection
  if (supabaseConfigured) {
    try {
      const { supabase } = await import("@/lib/supabase-client")
      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error && !error.message.includes('relation "profiles" does not exist')) {
        const supabaseIndex = integrations.findIndex((i) => i.name === "Supabase")
        integrations[supabaseIndex] = {
          ...integrations[supabaseIndex],
          status: "error",
          message: `Supabase connection error: ${error.message}`,
        }
      }
    } catch (error) {
      const supabaseIndex = integrations.findIndex((i) => i.name === "Supabase")
      integrations[supabaseIndex] = {
        ...integrations[supabaseIndex],
        status: "error",
        message: `Supabase connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  // Note: Vercel AI Gateway handles AI connections automatically, no separate test needed

  return integrations
}

export function getRequiredMissingIntegrations(integrations: IntegrationStatus[]): IntegrationStatus[] {
  return integrations.filter((i) => i.required && i.status !== "connected")
}

export function hasAllRequiredIntegrations(integrations: IntegrationStatus[]): boolean {
  return getRequiredMissingIntegrations(integrations).length === 0
}
