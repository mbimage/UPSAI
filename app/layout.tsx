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
  title: "UpSide AI",
  description: "Your 24/7 AI Teammate for Scholar-Athletes",
  generator: "v0.dev",
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
