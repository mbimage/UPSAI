import { ImageResponse } from "next/og"

export const alt = "UpSide AI — Your 24/7 Teammate for Scholar-Athletes"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
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
            "radial-gradient(circle at 50% 115%, hsla(270, 100%, 60%, 0.45), transparent 55%), radial-gradient(circle at 50% -15%, hsla(195, 100%, 55%, 0.18), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Tagline pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 26px",
            borderRadius: 9999,
            border: "1px solid hsla(270, 100%, 70%, 0.4)",
            backgroundColor: "hsla(270, 100%, 60%, 0.12)",
            color: "hsl(270, 100%, 85%)",
            fontSize: 26,
            fontWeight: 500,
            marginBottom: 40,
          }}
        >
          Democratizing AI Access for Rural Texas
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 150, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ color: "white" }}>UpSide</span>
          <span style={{ color: "hsl(270, 100%, 72%)", marginLeft: 24 }}>AI</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            color: "hsl(0, 0%, 82%)",
            fontSize: 40,
            fontWeight: 400,
            marginTop: 20,
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
            marginTop: 60,
          }}
        >
          upsideai.app
        </div>
      </div>
    ),
    { ...size },
  )
}
