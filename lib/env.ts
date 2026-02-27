// Environment variable validation and access
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
const API_KEY = process.env.API_KEY || ""
const SUPABASE_URL = process.env.SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ""
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || ""
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || ""
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""
const NEXT_PUBLIC_ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true"
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""

// Calculate APP_URL with proper fallbacks
const APP_URL = (() => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
})()

// Export individual variables
export {
  OPENAI_API_KEY,
  API_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ENABLE_ANALYTICS,
  RESEND_API_KEY,
  APP_URL,
}

// Export consolidated env object
export const env = {
  OPENAI_API_KEY,
  API_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ENABLE_ANALYTICS,
  RESEND_API_KEY,
  APP_URL,
}

// Validate required environment variables
export function validateEnv(): { isValid: boolean; missing: string[]; warnings: string[] } {
  const required = [
    { key: "OPENAI_API_KEY", value: process.env.OPENAI_API_KEY, critical: true },
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL, critical: true },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, critical: true },
  ]

  const optional = [
    { key: "RESEND_API_KEY", value: process.env.RESEND_API_KEY },
    { key: "NEXT_PUBLIC_APP_URL", value: process.env.NEXT_PUBLIC_APP_URL },
    { key: "API_KEY", value: process.env.API_KEY },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: process.env.SUPABASE_SERVICE_ROLE_KEY },
  ]

  const missing = required
    .filter(({ value, critical }) => critical && (!value || value.length === 0))
    .map(({ key }) => key)
  const warnings = optional.filter(({ value }) => !value || value.length === 0).map(({ key }) => key)

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  }
}

// Get API key for different services
export function getApiKey(service: "openai" | "supabase" | "resend"): string {
  switch (service) {
    case "openai":
      if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key not configured")
      return process.env.OPENAI_API_KEY
    case "supabase":
      if (!process.env.SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        throw new Error("Supabase API key not configured")
      return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    case "resend":
      if (!process.env.RESEND_API_KEY) throw new Error("Resend API key not configured")
      return process.env.RESEND_API_KEY
    default:
      throw new Error(`Unknown service: ${service}`)
  }
}

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === "development"

// Check if we're in production mode
export const isProduction = process.env.NODE_ENV === "production"

// Get the base URL for the application
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Browser should use relative URL
    return ""
  }

  return APP_URL
}

// Environment-specific configurations
export const config = {
  api: {
    timeout: isDevelopment ? 30000 : 10000, // 30s in dev, 10s in prod
    retries: isDevelopment ? 1 : 3,
  },
  features: {
    analytics: isProduction && NEXT_PUBLIC_ENABLE_ANALYTICS,
    debugMode: isDevelopment,
    emailEnabled: !!process.env.RESEND_API_KEY,
    chatEnabled: !!process.env.OPENAI_API_KEY,
    databaseEnabled: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
  integrations: {
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      maxTokens: 300,
      temperature: 0.8,
    },
    supabase: {
      enabled: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      url: NEXT_PUBLIC_SUPABASE_URL,
      anonKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    resend: {
      enabled: !!process.env.RESEND_API_KEY,
      fromEmail: "noreply@upsideai.app",
    },
  },
}

// Log environment status on startup (development only)
if (isDevelopment) {
  const validation = validateEnv()
  console.log("🔧 Environment Status:", {
    valid: validation.isValid,
    missing: validation.missing,
    warnings: validation.warnings,
    features: config.features,
  })
}
