"use client"

import { useState } from "react"
import { Heart, Phone, MessageSquare, Users, X, LifeBuoy } from "lucide-react"

/**
 * HumanSupport
 *
 * An always-available, warm path to real human help. Reinforces that UpSide is a
 * starting point, not a replacement for real people. Surfaces trusted adults plus
 * crisis resources (988 / Crisis Text Line / 911).
 */
export function HumanSupport() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9 px-2 md:px-3 rounded-xl border border-electric-400/30 bg-electric-500/10 text-electric-300 hover:bg-electric-500/20 hover:border-electric-400/50 active:bg-electric-500/30 transition-colors touch-manipulation flex-shrink-0"
        aria-label="Talk to a real person"
      >
        <Heart className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-medium">Talk to a human</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="human-support-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[90dvh] overflow-y-auto bg-midnight-900 border border-electric-400/20 rounded-t-3xl sm:rounded-3xl shadow-2xl safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-midnight-900 flex items-center justify-between gap-3 px-5 pt-5 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-electric-500/15 border border-electric-400/30 flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5 text-electric-300" aria-hidden="true" />
                </div>
                <h2 id="human-support-title" className="text-lg font-bold text-foreground">
                  You don&apos;t have to do this alone
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-1 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                UpSide is here for you anytime, but real people in your life can help in ways no app can. Reaching out
                is a sign of strength, not weakness. Here&apos;s where to start.
              </p>

              {/* Trusted adults */}
              <section className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neon-400" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-foreground">People who know you</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A coach, teacher, school counselor, parent, or another adult you trust. Pick one person and tell them
                  one true thing about how you&apos;re doing. That first sentence is the hardest part.
                </p>
              </section>

              {/* Crisis resources */}
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">If things feel like too much right now</h3>

                <a
                  href="tel:988"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-neon-500/10 border border-neon-500/25 hover:bg-neon-500/20 active:bg-neon-500/30 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 rounded-full bg-neon-500/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-neon-300" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">Call or text 988</div>
                    <div className="text-xs text-muted-foreground">Suicide &amp; Crisis Lifeline: free, 24/7, confidential</div>
                  </div>
                </a>

                <a
                  href="sms:741741?&body=HOME"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-electric-500/10 border border-electric-400/25 hover:bg-electric-500/20 active:bg-electric-500/30 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 rounded-full bg-electric-500/15 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-electric-300" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">Text HOME to 741741</div>
                    <div className="text-xs text-muted-foreground">Crisis Text Line: text with a trained counselor</div>
                  </div>
                </a>

                <a
                  href="tel:911"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">Call 911</div>
                    <div className="text-xs text-muted-foreground">If you or someone else is in immediate danger</div>
                  </div>
                </a>
              </section>

              <p className="text-xs leading-relaxed text-muted-foreground/80 text-pretty">
                UpSide is a supportive teammate, not a licensed counselor or emergency service. For anything serious,
                please reach out to a real person who can help.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
