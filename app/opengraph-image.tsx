import { ImageResponse } from "next/og"

export const alt = "UpSide AI: Your AI teammate for college athletes across Texas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Load Inter (the app's font) as TTF so the share card matches the site exactly.
async function loadInter(weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (resource) {
    const res = await fetch(resource[1])
    if (res.status === 200) return res.arrayBuffer()
  }
  throw new Error("Failed to load Inter font")
}

// Brand gradient matching the site: neon-400 (purple) -> electric-400 (cyan)
const PURPLE = "hsl(270, 100%, 70%)"
const CYAN = "hsl(195, 100%, 65%)"
const GRAD = `linear-gradient(120deg, ${PURPLE}, ${CYAN})`

// Scattered glowing accent dots that add a sense of motion/energy.
const DOTS: { x: number; y: number; r: number; color: string; opacity: number }[] = [
  { x: 120, y: 90, r: 8, color: PURPLE, opacity: 0.9 },
  { x: 1040, y: 130, r: 10, color: CYAN, opacity: 0.85 },
  { x: 220, y: 470, r: 7, color: CYAN, opacity: 0.7 },
  { x: 970, y: 500, r: 9, color: PURPLE, opacity: 0.8 },
  { x: 1120, y: 320, r: 6, color: PURPLE, opacity: 0.65 },
  { x: 80, y: 300, r: 6, color: CYAN, opacity: 0.6 },
]

// Framework pillar chips.
const CHIPS: { label: string; color: string }[] = [
  { label: "Self-Efficacy", color: PURPLE },
  { label: "Emotional Intelligence", color: CYAN },
  { label: "Career Readiness", color: PURPLE },
]

export default async function OpengraphImage() {
  const [inter800, inter500] = await Promise.all([loadInter(800), loadInter(500)])

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 70,
          backgroundColor: "hsl(220, 26%, 4%)",
          backgroundImage:
            "radial-gradient(circle at 12% 10%, hsla(270, 100%, 62%, 0.6), transparent 40%), radial-gradient(circle at 90% 92%, hsla(195, 100%, 55%, 0.55), transparent 42%), radial-gradient(circle at 92% 6%, hsla(270, 100%, 62%, 0.35), transparent 38%), radial-gradient(circle at 6% 88%, hsla(195, 100%, 60%, 0.3), transparent 40%)",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Dotted texture grid for depth */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "radial-gradient(hsla(0, 0%, 100%, 0.06) 1.5px, transparent 1.5px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Scattered glowing accent dots */}
        {DOTS.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: 999,
              backgroundColor: d.color,
              opacity: d.opacity,
              boxShadow: `0 0 ${d.r * 3}px ${d.r}px ${d.color}`,
            }}
          />
        ))}

        {/* Glow ring behind emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 158,
            height: 158,
            borderRadius: 999,
            backgroundColor: "hsla(270, 100%, 65%, 0.16)",
            border: "2px solid hsla(270, 100%, 80%, 0.4)",
            boxShadow: "0 0 70px 6px hsla(270, 100%, 65%, 0.45)",
          }}
        >
          <svg width="104" height="104" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={PURPLE} />
                <stop offset="100%" stopColor={CYAN} />
              </linearGradient>
            </defs>
            <circle
              cx="14"
              cy="14"
              r="11"
              fill="url(#brandGrad)"
              fillOpacity="0.18"
              stroke="url(#brandGrad)"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            <path
              d="M9 16L14 11L19 16"
              stroke="url(#brandGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 17L14 13L18 17"
              stroke="url(#brandGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.7"
            />
          </svg>
        </div>

        {/* Wordmark with underline under just "Side" */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginTop: 26,
            fontSize: 122,
            fontWeight: 800,
            letterSpacing: -4,
            backgroundImage: GRAD,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <div style={{ display: "flex" }}>Up</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex" }}>Side</div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                width: "100%",
                height: 8,
                borderRadius: 999,
                backgroundImage: GRAD,
              }}
            />
          </div>
          <div style={{ display: "flex", marginLeft: 28 }}>AI</div>
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            textAlign: "center",
            color: "hsl(0, 0%, 88%)",
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.35,
            maxWidth: 940,
          }}
        >
          An on-demand tool helping Texas college athletes navigate life on and off campus with personalized support.
        </div>

        {/* Topic chips */}
        <div
          style={{
            display: "flex",
            marginTop: 34,
            gap: 14,
          }}
        >
          {CHIPS.map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 22,
                paddingRight: 22,
                borderRadius: 999,
                border: `1.5px solid ${c.color}`,
                backgroundColor: "hsla(220, 40%, 12%, 0.6)",
                color: "hsl(0, 0%, 96%)",
                fontSize: 24,
                fontWeight: 500,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter800, weight: 800, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
      ],
    },
  )
}
