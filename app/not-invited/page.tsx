import Link from "next/link"
import { Lock } from "lucide-react"
import { SignOutButton } from "./sign-out-button"

export const metadata = {
  title: "Private beta — UpSide",
  description: "UpSide is currently in a private, invite-only beta.",
}

export default function NotInvitedPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-midnight-950 p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neon-500/20 bg-midnight-900/70 p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neon-500/10 border border-neon-500/20">
          <Lock className="h-6 w-6 text-neon-400" aria-hidden="true" />
        </div>
        <h1 className="text-balance text-2xl font-bold">UpSide is in private beta</h1>
        <p className="mt-3 text-pretty leading-relaxed text-gray-300">
          Access is invite-only right now while we work with a small group of athletes. This account isn&apos;t on the
          invite list yet.
        </p>
        <p className="mt-3 text-pretty leading-relaxed text-gray-400">
          If you think you should have access, reach out to the person who told you about UpSide and ask them to add your
          email.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <SignOutButton />
          <Link
            href="/"
            className="text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
