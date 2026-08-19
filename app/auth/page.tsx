import { Suspense } from "react"
import type { Metadata } from "next"
import AuthClient from "./auth-client"

export const metadata: Metadata = {
  title: "Sign in · UpSide AI",
  description:
    "Sign in or create a free UpSide AI account to save your conversations privately and pick up where you left off across devices.",
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-midnight-950 text-gray-300">
          Loading…
        </div>
      }
    >
      <AuthClient />
    </Suspense>
  )
}
