export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Page Not Found</title>
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
          <h1 style={{ fontSize: "4rem", margin: "0 0 20px 0", color: "#a175ff" }}>404</h1>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 20px 0" }}>Page Not Found</h2>
          <p style={{ margin: "0 0 30px 0", color: "#9ca3af" }}>The page you're looking for doesn't exist.</p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#a175ff",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            Return Home
          </a>
        </div>
      </body>
    </html>
  )
}
