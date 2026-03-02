import type React from "react"
import type { Metadata } from "next"
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
  title: {
    default: "UpSide AI - Your 24/7 AI Teammate for Scholar-Athletes",
    template: "%s | UpSide AI",
  },
  description:
    "UpSide AI is the ultimate AI-powered platform for scholar-athletes. Get personalized guidance, mental performance coaching, and academic support 24/7.",
  keywords: [
    "scholar-athlete",
    "AI coaching",
    "student athlete",
    "mental performance",
    "academic support",
    "sports psychology",
    "athlete wellness",
    "college athlete",
    "high school athlete",
  ],
  authors: [{ name: "UpSide AI" }],
  creator: "UpSide AI",
  publisher: "UpSide AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "UpSide AI",
    title: "UpSide AI - Your 24/7 AI Teammate for Scholar-Athletes",
    description:
      "UpSide AI is the ultimate AI-powered platform for scholar-athletes. Get personalized guidance, mental performance coaching, and academic support 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpSide AI - Your 24/7 AI Teammate for Scholar-Athletes",
    description:
      "UpSide AI is the ultimate AI-powered platform for scholar-athletes. Get personalized guidance, mental performance coaching, and academic support 24/7.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://upsideai.com"),
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
