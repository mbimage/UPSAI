import { ImageResponse } from "next/og"

export const alt = "UpSide AI — Your 24/7 Teammate for Scholar-Athletes"
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
const GREEN = "hsl(270, 100%, 70%)"
const BLUE = "hsl(195, 100%, 65%)"

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
          backgroundImage:
            "radial-gradient(circle at 50% 0%, hsla(270, 100%, 60%, 0.30), transparent 55%), radial-gradient(circle at 50% 120%, hsla(195, 100%, 55%, 0.28), transparent 55%)",
          fontFamily: "Inter",
        }}
      >
        {/* Company emblem — the chevron mark, reproduced large with the brand gradient */}
        <div style={{ display: "flex" }}>
          <svg width="300" height="300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={GREEN} />
                <stop offset="100%" stopColor={BLUE} />
              </linearGradient>
            </defs>
            {/* Outer glow ring */}
            <circle cx="14" cy="14" r="13" fill="none" stroke="url(#brandGrad)" strokeWidth="0.6" strokeOpacity="0.35" />
            {/* Main background circle */}
            <circle
              cx="14"
              cy="14"
              r="11"
              fill="url(#brandGrad)"
              fillOpacity="0.14"
              stroke="url(#brandGrad)"
              strokeWidth="1.2"
              strokeOpacity="0.55"
            />
            {/* Inner highlight circle */}
            <circle cx="14" cy="14" r="8" fill="none" stroke="url(#brandGrad)" strokeWidth="0.7" strokeOpacity="0.25" />
            {/* Bold chevron arrow */}
            <path
              d="M9 16L14 11L19 16"
              stroke="url(#brandGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Secondary chevron for depth */}
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

        {/* Wordmark — full brand gradient, matching the site */}
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
            marginTop: 24,
            backgroundImage: `linear-gradient(90deg, ${GREEN}, ${BLUE})`,
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
            color: "hsl(0, 0%, 85%)",
            fontSize: 38,
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          Your 24/7 Teammate for Scholar-Athletes
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
