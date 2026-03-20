"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname?.startsWith(path)
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Chat", href: "/chat" },
    { name: "About", href: "/about" },
  ]

  return (
    <div className="min-h-screen bg-midnight-950 text-foreground relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>
      <div className="ambient-orb ambient-orb-3"></div>
      <div className="ambient-orb ambient-orb-4"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay"></div>

      {/* Header - No Dead Click Areas */}
      <header className="sticky top-0 z-50 w-full border-b border-neon-500/20 bg-midnight-950/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Always visible */}
            <Link
              href="/"
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-300 cursor-pointer p-2 -m-2 rounded-lg hover:bg-neon-500/10 flex-shrink-0"
              aria-label="UpSide AI Home"
            >
              {/* UpSide Emblem - Matching Footer */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-neon-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:text-electric-400 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300"
                >
                  {/* Outer glow ring */}
                  <circle cx="14" cy="14" r="13" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                  {/* Main background circle */}
                  <circle cx="14" cy="14" r="11" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
                  {/* Inner highlight circle */}
                  <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
                  {/* Bold chevron arrow */}
                  <path d="M9 16L14 11L19 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Secondary chevron for depth */}
                  <path d="M10 17L14 13L18 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent leading-none">
                UpSide AI
              </span>
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-full leading-none">
                BETA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              <div className="flex items-center space-x-1 bg-midnight-900/50 backdrop-blur-md rounded-2xl px-2 py-2 border border-neon-500/20">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group whitespace-nowrap cursor-pointer",
                      isActive(item.href)
                        ? "text-white bg-gradient-to-r from-neon-500/30 to-electric-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-neon-500/10 hover:to-electric-500/10",
                    )}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neon-500/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-neon-400" /> : <Menu className="w-6 h-6 text-neon-400" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-neon-500/20 animate-fadeIn">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                      isActive(item.href)
                        ? "text-white bg-gradient-to-r from-neon-500/30 to-electric-500/30"
                        : "text-gray-300 hover:text-white hover:bg-neon-500/10",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 md:py-0">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-neon-900/20 to-midnight-950"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto pt-12 md:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-neon-500/10 border border-neon-500/20 mb-8 md:mb-10 mt-8 md:mt-4">
            <span className="text-xs md:text-sm font-medium text-neon-400">
              Democratizing AI Access for Rural Texas
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent animate-pulse-slow leading-tight">
            Your 24/7 AI Teammate
          </h1>

          <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            UpSide AI is your personal AI teammate designed specifically for rural Texas student-athletes. Get instant
            support for self-efficacy, emotional intelligence, and career readiness anytime, anywhere. Build the
            confidence and skills you need to succeed on the field and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-12 md:mb-16 px-4">
            <Button
              asChild
              size="lg"
              className="relative group bg-neon-600/20 hover:bg-neon-600/30 border border-neon-500/50 hover:border-neon-400 text-neon-300 hover:text-white px-10 py-5 text-base font-semibold rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] w-full sm:w-auto backdrop-blur-sm"
            >
              <Link href="/chat" className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-400 animate-pulse" />
                <span>Start Chat</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-neon-500/40 text-neon-300 hover:text-white hover:border-neon-500/60 hover:bg-neon-500/10 px-8 md:px-12 py-6 md:py-7 text-lg md:text-xl font-bold transition-all duration-300 w-full sm:w-auto"
            >
              <Link href="/how-to-use-ai" className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60 text-sm text-gray-400">
            <span>24/7 Available</span>
            <span className="hidden sm:inline">•</span>
            <span>100% Private</span>
            <span className="hidden sm:inline">•</span>
            <span>Free for TX Students</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
              How UpSide AI Helps You Grow
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Three core areas designed specifically for rural Texas student-athletes to build confidence and prepare
              for success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Link
              href="/assessments"
              className="bg-neon-900/40 p-8 rounded-xl border border-neon-500/20 text-center animate-breathing-glow hover:bg-neon-900/60 hover:border-neon-500/40 transition-all duration-300 cursor-pointer group"
              aria-label="Build self-efficacy with assessments"
            >
              <div className="w-16 h-16 bg-neon-500/20 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-neon-500/30 transition-colors duration-300">
                <svg
                  className="h-8 w-8 text-neon-400 group-hover:text-neon-300 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-neon-200 transition-colors duration-300">
                Self-Efficacy
              </h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                Build unshakeable confidence in your ability to achieve goals both on and off the field
              </p>

              {/* Stat */}
              <div className="bg-neon-500/10 rounded-lg p-3 border border-neon-500/20">
                <div className="text-2xl font-bold text-neon-400 mb-2 group-hover:text-neon-300 transition-colors duration-300">
                  Strong
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  improvement in goal achievement
                </div>
              </div>
            </Link>

            <Link
              href="/resources/mental-health"
              className="bg-electric-900/40 p-8 rounded-xl border border-electric-500/20 text-center animate-breathing-glow hover:bg-electric-900/60 hover:border-electric-500/40 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: "1s" }}
              aria-label="Develop emotional intelligence"
            >
              <div className="w-16 h-16 bg-electric-500/20 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-electric-500/30 transition-colors duration-300">
                <svg
                  className="h-8 w-8 text-electric-400 group-hover:text-electric-300 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-electric-200 transition-colors duration-300">
                Emotional Intelligence
              </h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                Master your emotions and build stronger relationships with teammates, coaches, and peers
              </p>

              {/* Stat */}
              <div className="bg-electric-500/10 rounded-lg p-3 border border-electric-500/20">
                <div className="text-2xl font-bold text-electric-400 mb-2 group-hover:text-electric-300 transition-colors duration-300">
                  Better
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  stress management skills
                </div>
              </div>
            </Link>

            <Link
              href="/about"
              className="bg-electric-900/40 p-8 rounded-xl border border-electric-500/20 text-center animate-breathing-glow hover:bg-electric-900/60 hover:border-electric-500/40 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: "3s" }}
              aria-label="Prepare for career readiness"
            >
              <div className="w-16 h-16 bg-electric-500/20 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-electric-500/30 transition-colors duration-300">
                <svg
                  className="h-8 w-8 text-electric-400 group-hover:text-electric-300 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-electric-200 transition-colors duration-300">
                About Us
              </h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                Learn more about UpSide AI and our mission to support rural Texas student-athletes
              </p>

              {/* Stat */}
              <div className="bg-electric-500/10 rounded-lg p-3 border border-electric-500/20">
                <div className="text-2xl font-bold text-electric-400 mb-2 group-hover:text-electric-300 transition-colors duration-300">
                  Higher
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  career readiness levels
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-neon-900/30 via-electric-900/20 to-midnight-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-neon-400 via-electric-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Ready to Level Up?
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-12 text-gray-200 font-medium">
            Your AI teammate is waiting to help you grow
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-neon-500 via-electric-500 to-cyan-500 hover:from-neon-400 hover:via-electric-400 hover:to-cyan-400 px-12 py-7 text-xl font-black shadow-[0_0_40px_rgba(34,197,94,0.6),0_0_80px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.8),0_0_120px_rgba(59,130,246,0.6)] transition-all duration-500 transform hover:scale-105 border-2 border-white/30 hover:border-white/50 rounded-2xl overflow-hidden"
            >
              <Link
                href="/chat"
                className="flex items-center gap-3 relative z-10"
                aria-label="Start chatting with your AI teammate now"
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {/* Chat icon with pulse animation */}
                <svg
                  className="w-6 h-6 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>

                <span className="relative">Start Chatting Now</span>

                {/* Arrow icon with slide animation */}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border border-gray-500/20 text-gray-400 hover:text-gray-300 hover:border-gray-400/30 hover:bg-gray-800/20 px-6 py-4 text-base font-medium backdrop-blur-sm transition-all duration-300 bg-transparent cursor-pointer"
            >
              <Link href="/how-to-use-ai" className="flex items-center gap-2" aria-label="Learn how UpSide AI works">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Learn How It Works
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-700/30">
            <p className="text-sm text-gray-400">Trusted by students across Texas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-neon-500/10 bg-midnight-950 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              {/* UpSide AI + prominent chevron emblem for footer - Clickable */}
              <Link
                href="/"
                className="flex items-center space-x-4 mb-4 hover:scale-105 transition-all duration-300 cursor-pointer group w-fit"
                aria-label="UpSide AI Home"
              >
                <div className="flex items-center space-x-4">
                  {/* UpSide AI text */}
                  <span className="text-xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300">
                    UpSide AI
                  </span>
                  {/* Prominent chevron emblem */}
                  <div className="relative">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-neon-400 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:text-electric-400 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300"
                    >
                      {/* Outer glow ring */}
                      <circle
                        cx="14"
                        cy="14"
                        r="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                      />
                      {/* Main background circle */}
                      <circle
                        cx="14"
                        cy="14"
                        r="11"
                        fill="currentColor"
                        fillOpacity="0.15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeOpacity="0.5"
                      />
                      {/* Inner highlight circle */}
                      <circle
                        cx="14"
                        cy="14"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                      />
                      {/* Bold chevron arrow */}
                      <path
                        d="M9 16L14 11L19 16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Secondary chevron for depth */}
                      <path
                        d="M10 17L14 13L18 17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity="0.4"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
              <p className="text-gray-400 mb-4 max-w-md">
                Democratizing access to life strategy tools for scholar-athletes from low-income rural areas.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/chat" className="text-gray-400 hover:text-neon-400 transition-colors duration-300">
                    AI Chat
                  </Link>
                </li>
                {/* Removed Resources link */}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-neon-400 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-neon-400 transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-neon-400 transition-colors duration-300">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-neon-400 transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-to-use-ai"
                    className="text-gray-400 hover:text-neon-400 transition-colors duration-300"
                  >
                    How to Use AI
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neon-500/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} UpSide AI. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-2">
              <span className="text-white font-medium">Our Mission:</span> Fostering self-efficacy, emotional
              intelligence, reading the room, and future-focused thinking about the workforce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
