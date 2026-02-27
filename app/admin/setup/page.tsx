import { SupabaseSetupGuide } from "@/components/supabase-setup-guide"

export default function SetupPage() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Setup Guide</h1>
      <p className="text-muted-foreground mb-8">
        Follow these steps to configure your Supabase project for passwordless authentication.
      </p>

      <SupabaseSetupGuide />
    </div>
  )
}
