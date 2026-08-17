import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://upsideai.app"),
  title: {
    default: "UpSide AI",
    template: "%s | UpSide AI",
  },
  description:
    "Personalized, on-demand support for college athletes across Texas, helping them navigate academics, relationships, opportunities, careers, and life on campus.",
  applicationName: "UpSide AI",
  generator: "v0.dev",
  manifest: "/manifest.webmanifest",
  keywords: [
    "Texas college athletes",
    "college athlete support",
    "student-athlete success",
    "career readiness",
    "AI teammate",
    "self-efficacy",
    "emotional intelligence",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://upsideai.app",
    siteName: "UpSide AI",
    title: "UpSide AI: Your AI teammate",
    description:
      "Personalized, on-demand support for college athletes across Texas, navigating academics, relationships, opportunities, careers, and life on campus.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpSide AI: Your AI teammate",
    description:
      "Personalized, on-demand support for college athletes across Texas, navigating academics, relationships, opportunities, careers, and life on campus.",
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
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
