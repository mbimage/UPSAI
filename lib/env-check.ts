export function checkRequiredEnvVars(): {
  missing: string[]
  isValid: boolean
} {
  // Note: OPENAI_API_KEY is not required when using Vercel AI Gateway
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missing = requiredVars.filter((varName) => {
    const value = process.env[varName]
    return !value || value.length === 0
  })

  return {
    missing,
    isValid: missing.length === 0,
  }
}
