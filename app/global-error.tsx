"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <head>
        <title>Error - UpSide AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0f0f23",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}>
          <h1 style={{ fontSize: "4rem", margin: "0 0 20px 0", color: "#ef4444" }}>Error</h1>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 20px 0" }}>Something went wrong</h2>
          <p style={{ margin: "0 0 30px 0", color: "#9ca3af" }}>An unexpected error occurred. Please try again.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 24px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "transparent",
                color: "white",
                textDecoration: "none",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
