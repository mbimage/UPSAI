import { env } from "@/lib/env"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function EnvStatusPage() {
  // Safe environment variable checking
  const envVars = [
    {
      name: "OPENAI_API_KEY",
      value: env.OPENAI_API_KEY || "",
      required: true,
    },
    {
      name: "API_KEY",
      value: env.API_KEY || "",
      required: true,
    },
    {
      name: "SUPABASE_URL",
      value: env.SUPABASE_URL || "",
      required: true,
    },
    {
      name: "SUPABASE_ANON_KEY",
      value: env.SUPABASE_ANON_KEY || "",
      required: true,
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      value: env.NEXT_PUBLIC_SUPABASE_URL || "",
      required: true,
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      required: true,
    },
    {
      name: "NEXT_PUBLIC_APP_URL",
      value: env.NEXT_PUBLIC_APP_URL || "",
      required: false,
    },
    {
      name: "NEXT_PUBLIC_SITE_URL",
      value: env.NEXT_PUBLIC_SITE_URL || "",
      required: false,
    },
    {
      name: "NEXT_PUBLIC_ENABLE_ANALYTICS",
      value: env.NEXT_PUBLIC_ENABLE_ANALYTICS ? "true" : "false",
      required: false,
    },
  ]

  // Calculate if all required vars are present
  const requiredVars = envVars.filter((v) => v.required)
  const missingRequired = requiredVars.filter((v) => !v.value || v.value === "")
  const isValid = missingRequired.length === 0

  const getStatusIcon = (hasValue: boolean, required: boolean) => {
    if (hasValue) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (required) return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusBadge = (hasValue: boolean, required: boolean) => {
    if (hasValue)
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Configured
        </Badge>
      )
    if (required) return <Badge variant="destructive">Missing</Badge>
    return <Badge variant="secondary">Optional</Badge>
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Environment Variables Status</h1>
          <div className="flex items-center gap-2 mb-4">
            {isValid ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-green-700 font-medium">All required environment variables are configured</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-red-700 font-medium">
                  {missingRequired.length} required environment variable{missingRequired.length !== 1 ? "s" : ""}{" "}
                  missing
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {envVars.map((envVar) => {
            const hasValue = !!(envVar.value && envVar.value !== "" && envVar.value !== "false")
            const maskedValue = hasValue
              ? envVar.name.includes("KEY") || envVar.name.includes("SECRET")
                ? `${envVar.value.substring(0, 8)}...`
                : envVar.value
              : "Not set"

            return (
              <Card key={envVar.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{envVar.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(hasValue, envVar.required)}
                      {getStatusBadge(hasValue, envVar.required)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <strong>Value:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{maskedValue}</code>
                  </div>
                  {envVar.required && !hasValue && (
                    <div className="mt-2 text-sm text-red-600">
                      This environment variable is required for the application to function properly.
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">For Local Development:</h4>
              <p className="text-sm text-gray-600 mb-2">
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root and
                configure the required environment variables shown above.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can find the specific variable names and their required values in the table
                  above. Each missing variable will show as "Missing" and needs to be configured.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">For Production Deployment:</h4>
              <p className="text-sm text-gray-600">
                Add these environment variables to your deployment platform (Vercel, Netlify, etc.) through their
                dashboard or CLI. Use the same variable names shown in the status table above.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Getting Your Values:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• OpenAI API keys: Get from your OpenAI dashboard</li>
                <li>• Database credentials: Available in your database provider's dashboard</li>
                <li>• App URLs: Set to your domain for production, localhost for development</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
