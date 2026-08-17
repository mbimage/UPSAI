import { ImageResponse } from "next/og"

export const alt = "UpSide AI: Someone in your corner, 24/7, for Texas college students"
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

function Badge({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 999,
        border: "1px solid hsla(270, 100%, 80%, 0.35)",
        backgroundColor: "hsla(270, 100%, 70%, 0.08)",
        color: "hsl(0, 0%, 92%)",
        fontSize: 24,
        fontWeight: 500,
      }}
    >
      {label}
    </div>
  )
}

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
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "hsl(220, 26%, 4%)",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, hsla(270, 100%, 60%, 0.38), transparent 45%), radial-gradient(circle at 100% 100%, hsla(195, 100%, 55%, 0.32), transparent 50%)",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 10,
            backgroundImage: GRAD,
          }}
        />

        {/* Brand lockup: emblem + wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="92" height="92" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              fillOpacity="0.16"
              stroke="url(#brandGrad)"
              strokeWidth="1.2"
              strokeOpacity="0.6"
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
          <div
            style={{
              display: "flex",
              marginLeft: 22,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1,
              backgroundImage: GRAD,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            UpSide AI
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Audience eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              marginBottom: 18,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 22,
              paddingRight: 22,
              borderRadius: 999,
              border: "1px solid hsla(195, 100%, 70%, 0.4)",
              backgroundColor: "hsla(195, 100%, 60%, 0.1)",
              color: "hsl(195, 100%, 82%)",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Built for Texas college students
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 94,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.0,
            }}
          >
            <div style={{ display: "flex", color: "hsl(0, 0%, 98%)" }}>Someone in</div>
            <div
              style={{
                display: "flex",
                backgroundImage: GRAD,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              your corner, 24/7
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              color: "hsl(0, 0%, 78%)",
              fontSize: 30,
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            On-demand support that helps Texas college students turn opportunity into action.
          </div>
        </div>

        {/* Competency badge row: the three pillars of the SEC Framework */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              color: "hsl(0, 0%, 60%)",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            The SEC Framework
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Badge label="Self-Efficacy" />
            <Badge label="Emotional Intelligence" />
            <Badge label="Career Readiness" />
          </div>
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
