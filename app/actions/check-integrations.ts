"use server"

export interface IntegrationStatus {
  name: string
  status: "connected" | "missing" | "error"
  message: string
  required: boolean
}

export async function checkIntegrationStatusServer(): Promise<IntegrationStatus[]> {
  const integrations: IntegrationStatus[] = []

  // OpenAI Integration - server-side check
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  integrations.push({
    name: "OpenAI",
    status: hasOpenAI ? "connected" : "missing",
    message: hasOpenAI
      ? "OpenAI API key configured"
      : "OpenAI API key missing - AI chat features will not work",
    required: true,
  })

  // Supabase Integration
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseConfigured = hasSupabaseUrl && hasSupabaseKey
  integrations.push({
    name: "Supabase",
    status: supabaseConfigured ? "connected" : "missing",
    message: supabaseConfigured
      ? "Supabase configured"
      : "Supabase configuration missing - Database features will not work",
    required: true,
  })

  // Resend Integration (for emails) - server-side check
  const hasResend = !!process.env.RESEND_API_KEY
  integrations.push({
    name: "Resend",
    status: hasResend ? "connected" : "missing",
    message: hasResend
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

  return integrations
}

export async function getRequiredMissingIntegrations(integrations: IntegrationStatus[]): Promise<IntegrationStatus[]> {
  return integrations.filter((i) => i.required && i.status !== "connected")
}

export async function hasAllRequiredIntegrations(integrations: IntegrationStatus[]): Promise<boolean> {
  const missing = await getRequiredMissingIntegrations(integrations)
  return missing.length === 0
}
