import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code } from "@/components/ui/code"
import { Steps, Step } from "@/components/ui/steps"

export function SupabaseSetupGuide() {
  // Get the app URL from environment variable or use placeholder
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.vercel.app"
  const redirectUrl = `${appUrl}/auth/callback`

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Important: Supabase Configuration Required</AlertTitle>
        <AlertDescription>
          To enable passwordless authentication, you need to whitelist your redirect URL in Supabase.
        </AlertDescription>
      </Alert>

      <Steps>
        <Step number={1} title="Log in to your Supabase Dashboard">
          Go to{" "}
          <a
            href="https://app.supabase.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            https://app.supabase.io
          </a>{" "}
          and log in to your account.
        </Step>

        <Step number={2} title="Select your project">
          From the dashboard, select the project you're using for this application.
        </Step>

        <Step number={3} title="Navigate to Authentication settings">
          In the left sidebar, click on "Authentication" and then select the "URL Configuration" tab.
        </Step>

        <Step number={4} title="Add your redirect URL">
          <p className="mb-2">Under "Redirect URLs", add the following URL:</p>
          <Code className="mb-2">{redirectUrl}</Code>
          <p>This is the URL that users will be redirected to after clicking the magic link in their email.</p>
        </Step>

        <Step number={5} title="Save your changes">
          Click the "Save" button to apply your changes.
        </Step>
      </Steps>

      <Alert variant="default">
        <AlertTitle>Testing Locally?</AlertTitle>
        <AlertDescription>
          If you're testing locally, make sure to add <Code>http://localhost:3000/auth/callback</Code> to your redirect
          URLs as well.
        </AlertDescription>
      </Alert>
    </div>
  )
}
