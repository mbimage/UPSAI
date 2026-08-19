/**
 * AmbientBackground
 *
 * The "feeling alive" layer: slowly drifting neon/electric orbs plus a subtle
 * grid overlay that give every screen a living, breathing feel.
 *
 * Render it as the FIRST child of a page's root element. That root must be
 * `relative` (and usually `overflow-hidden`) so the absolutely-positioned orbs
 * anchor to it and stay clipped. The orbs sit at z-0, so keep page content at a
 * higher stacking context (e.g. `relative z-10`).
 */
import { cn } from "@/lib/utils"

export function AmbientBackground({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700",
        // Calm at rest; once a conversation begins, fade back so it reads as a near-solid dark surface.
        dimmed ? "opacity-20" : "opacity-60",
      )}
      aria-hidden="true"
    >
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-orb ambient-orb-4" />
      {/* Grid only shows in the calm welcome state, and even then it's subtle. */}
      {!dimmed && <div className="absolute inset-0 grid-overlay" />}
    </div>
  )
}

export default AmbientBackground
