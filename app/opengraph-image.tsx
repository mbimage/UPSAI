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
          backgroundColor: "hsl(220, 26%, 4%)",
          fontFamily: "Inter",
        }}
      >
        {/* Brand emblem */}
        <svg width="128" height="128" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            backgroundImage: GRAD,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          UpSide AI
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 12,
            color: "hsl(0, 0%, 72%)",
            fontSize: 34,
            fontWeight: 500,
          }}
        >
          Your AI teammate
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
