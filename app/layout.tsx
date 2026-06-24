import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SeamlessAuthProvider } from "@/contexts/seamless-auth-context"
import { PublicUserProvider } from "@/contexts/public-user-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://upsideai.app"),
  title: {
    default: "UpSide AI",
    template: "%s | UpSide AI",
  },
  description: "Your 24/7 Teammate for Scholar-Athletes",
  applicationName: "UpSide AI",
  generator: "v0.dev",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://upsideai.app",
    siteName: "UpSide AI",
    title: "UpSide AI",
    description: "Your 24/7 Teammate for Scholar-Athletes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UpSide AI — Your 24/7 Teammate for Scholar-Athletes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UpSide AI",
    description: "Your 24/7 Teammate for Scholar-Athletes",
    images: ["/og-image.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${inter.className} font-inter antialiased`}
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, -apple-system, sans-serif" }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SeamlessAuthProvider>
            <PublicUserProvider>
              <div className="relative z-10">
                {children}
              </div>
            </PublicUserProvider>
          </SeamlessAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
