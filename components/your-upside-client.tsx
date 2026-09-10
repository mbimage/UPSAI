"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Flag,
  Compass,
  History,
  Telescope,
  Lock,
} from "lucide-react"
import { AmbientBackground } from "@/components/ambient-background"
import { Button } from "@/components/ui/button"
import type { YourUpsideSections } from "@/lib/interaction-history-service"

type YourUpsideStatus = "empty" | "ok" | "error"

interface YourUpsideClientProps {
  initialSections: YourUpsideSections
  initialHasData: boolean
  initialStatus: YourUpsideStatus
}

const SECTION_ORDER = [
  { key: "lately", label: "Lately", icon: Sparkles },
  { key: "nextUp", label: "Next Up", icon: Flag },
  { key: "onYourRadar", label: "On Your Radar", icon: Compass },
  { key: "lookingBack", label: "Looking Back", icon: History },
  { key: "lookingAhead", label: "Looking Ahead", icon: Telescope },
] as const

export function YourUpsideClient({
  initialSections,
  initialHasData,
  initialStatus,
}: YourUpsideClientProps) {
  const [sections, setSections] = useState<YourUpsideSections>(initialSections)
  const [hasData, setHasData] = useState(initialHasData)
  const [status, setStatus] = useState<YourUpsideStatus>(initialStatus)
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await fetch("/api/your-upside", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data?.sections) {
          setSections(data.sections)
          setHasData(Boolean(data.hasData))
          if (data.status) setStatus(data.status as YourUpsideStatus)
        }
      }
    } catch {
      // Keep the current view if refresh fails; it's non-critical.
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight-950 relative overflow-hidden">
      <AmbientBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 max-w-3xl relative z-10">
        {/* Back + refresh */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="group border-neon-400/40 bg-neon-500/10 backdrop-blur-sm text-neon-300 hover:bg-neon-500/20 hover:border-neon-400/60 hover:text-neon-200 transition-all duration-300"
          >
            <Link href="/chat" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to chat</span>
            </Link>
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-neon-500/10 border border-neon-500/20 hover:border-neon-500/40"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="ml-1.5">{refreshing ? "Updating" : "Refresh"}</span>
          </Button>
        </div>

        {/* Header */}
        <motion.header
          className="mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white text-balance mb-3">
            Your UpSide
          </h1>
          <p className="text-base md:text-lg text-gray-300/90 leading-relaxed text-pretty max-w-xl">
            A quiet look at what&apos;s been on your mind, pulled from your own chats. This is just for you.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Private to you. No coach, school, or admin can see this.</span>
          </div>
        </motion.header>

        {status === "empty" && (
          <motion.div
            className="mb-8 rounded-2xl border border-electric-500/20 bg-electric-500/5 backdrop-blur-sm p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm text-gray-200 leading-relaxed text-pretty">
              You haven&apos;t talked with UpSide much yet, so this is mostly empty. Start a chat and check
              back. It fills in as you go.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            className="mb-8 rounded-2xl border border-electric-500/20 bg-electric-500/5 backdrop-blur-sm p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm text-gray-200 leading-relaxed text-pretty">
              We couldn&apos;t pull this together just now. Your chats are safe. Give it a few seconds and tap
              Refresh.
            </p>
          </motion.div>
        )}

        {/* Sections (hidden while we couldn't build them, so we don't fake an empty life) */}
        {status !== "error" && (
        <div className="space-y-4">
          {SECTION_ORDER.map((section, i) => {
            const Icon = section.icon
            const content = sections[section.key]
            if (!content?.text) return null
            return (
              <motion.section
                key={section.key}
                className="rounded-2xl border border-neon-500/15 bg-midnight-900/60 backdrop-blur-sm p-5 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-500/20 to-electric-500/20 border border-neon-500/30 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-neon-300" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-white">{section.label}</h2>
                </div>
                <p className="text-gray-200/90 text-[15px] leading-relaxed text-pretty mb-4">
                  {content.text}
                </p>
                <Link
                  href={`/chat?q=${encodeURIComponent(content.talkPrompt)}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-electric-300 hover:text-electric-200 transition-colors"
                >
                  <span>Talk about this</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              </motion.section>
            )
          })}
        </div>
        )}

        <p className="mt-10 text-center text-xs text-gray-500 text-pretty">
          UpSide remembers what matters so you can spot chances, get ready, and talk to the real people in
          your corner.
        </p>
      </div>
    </div>
  )
}
