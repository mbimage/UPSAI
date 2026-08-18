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
            "radial-gradient(circle at 15% 12%, hsla(270, 100%, 62%, 0.55), transparent 42%), radial-gradient(circle at 88% 90%, hsla(195, 100%, 55%, 0.5), transparent 45%), radial-gradient(circle at 90% 8%, hsla(320, 100%, 62%, 0.28), transparent 40%)",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Glow ring behind emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 168,
            height: 168,
            borderRadius: 999,
            backgroundColor: "hsla(270, 100%, 65%, 0.14)",
            border: "2px solid hsla(270, 100%, 80%, 0.35)",
          }}
        >
          <svg width="110" height="110" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -4,
            backgroundImage: GRAD,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          UpSide AI
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            marginTop: 22,
            textAlign: "center",
            color: "hsl(0, 0%, 86%)",
            fontSize: 33,
            fontWeight: 500,
            lineHeight: 1.35,
            maxWidth: 1000,
          }}
        >
          An on-demand tool that helps Texas college athletes navigate academics, relationships, opportunities,
          careers, and life on campus with personalized support.
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
