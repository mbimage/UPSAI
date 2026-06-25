import { ImageResponse } from "next/og"

export const alt = "UpSide AI — Your 24/7 Teammate for Scholar-Athletes"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Load Inter (the app's font) as TTF so the share card matches the site exactly.
// The css2 endpoint returns a TTF src when fetched without a modern-browser UA,
// which is the format Satori (next/og) requires.
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
const BRAND_GRADIENT = "linear-gradient(90deg, hsl(270, 100%, 70%), hsl(195, 100%, 65%))"

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
            "radial-gradient(circle at 50% 120%, hsla(270, 100%, 60%, 0.35), transparent 55%), radial-gradient(circle at 50% -20%, hsla(195, 100%, 55%, 0.16), transparent 45%)",
          fontFamily: "Inter",
        }}
      >
        {/* Tagline pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 9999,
            border: "1px solid hsla(270, 100%, 70%, 0.4)",
            backgroundColor: "hsla(270, 100%, 60%, 0.12)",
            color: "hsl(270, 100%, 88%)",
            fontSize: 26,
            fontWeight: 500,
            marginBottom: 48,
          }}
        >
          Democratizing AI Access for Rural Texas
        </div>

        {/* Wordmark — full brand gradient, matching the site */}
        <div
          style={{
            display: "flex",
            fontSize: 156,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            backgroundImage: BRAND_GRADIENT,
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
            fontSize: 42,
            fontWeight: 500,
            marginTop: 28,
          }}
        >
          Your 24/7 Teammate for Scholar-Athletes
        </div>

        {/* Footer domain */}
        <div
          style={{
            display: "flex",
            color: "hsl(0, 0%, 55%)",
            fontSize: 28,
            fontWeight: 500,
            marginTop: 64,
          }}
        >
          upsideai.app
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
