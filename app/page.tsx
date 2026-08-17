"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { AmbientBackground } from "@/components/ambient-background"

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

  const topics = [
    {
      title: "College decisions",
      description: "Weigh offers, fit, playing time, and academics, then think through the questions that actually matter.",
      icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12 12 0 0121 12c0 2.5-4 4.5-9 4.5S3 14.5 3 12a12 12 0 012.84-1.42L12 14z",
    },
    {
      title: "NIL & networking",
      description: "Understand your brand, evaluate deals, and build relationships that last beyond your playing days.",
      icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 10-3-3",
    },
    {
      title: "Emotional intelligence",
      description: "Handle pressure, read the room, and navigate coaches, teammates, and family with more confidence.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
    {
      title: "Career preparation",
      description: "Explore paths on and off the field, build skills, and prepare for a career that fits who you are.",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      title: "Relationships & belonging",
      description: "Talk through the people in your corner, and how to lean on them when things get heavy.",
      icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l3.586-3.586z",
    },
    {
      title: "Life beyond sport",
      description: "Plan for who you are after the game: identity, purpose, and the self-efficacy to get there.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
  ]

  const pillars = [
    {
      title: "Self-Efficacy",
      description:
        "Build the belief and the habits to act, whether that means approaching a professor, prepping for office hours, or thinking through a major change on your own terms.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      title: "Emotional Intelligence",
      description:
        "Read the room and handle the hard conversations, from a teammate conflict to talking honestly with your coach or family.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
    {
      title: "Career Readiness",
      description:
        "Turn connections into opportunities, connect with an alum, land an internship, and prepare for the transition out of sport before it arrives.",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ]

  return (
    <div className="min-h-screen bg-midnight-950 text-foreground relative overflow-hidden">
      {/* Ambient "alive" background */}
      <AmbientBackground />

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
                  className="w-10 h-10 text-neon-400 drop-shadow-[0_0_8px_rgba(153,51,255,0.6)] group-hover:text-electric-400 group-hover:drop-shadow-[0_0_12px_rgba(0,183,255,0.8)] transition-all duration-300"
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
              <span className="font-display text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent leading-none">
                UpSide AI
              </span>
              <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-neon-500/10 border border-neon-500/30 text-neon-300 rounded-full leading-none">
                Beta
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
              className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg hover:bg-neon-500/10 active:bg-neon-500/20 transition-colors touch-manipulation"
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
            <span className="w-2 h-2 rounded-full bg-neon-400 animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-neon-400">
              Built for Texas college athletes · Public & private schools
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-5 md:mb-6 leading-[1.02] tracking-tight text-balance">
            <span className="block bg-gradient-to-r from-neon-400 via-neon-300 to-electric-400 bg-clip-text text-transparent">
              Your 24/7 AI teammate
            </span>
            <span className="block bg-gradient-to-r from-electric-400 via-electric-300 to-neon-300 bg-clip-text text-transparent">
              beyond the game.
            </span>
          </h1>

          {/* Availability marker */}
          <div className="inline-flex items-center gap-2 mb-6 md:mb-8 text-sm text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-400" />
            </span>
            Always on. Answers on demand, day or night.
          </div>

          <p className="text-lg md:text-xl text-gray-300/90 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2 text-pretty">
            UpSide helps college athletes navigate decisions, relationships, education centered around self efficay,
            emotional intelligence and career readiness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-12 md:mb-16 px-4">
            <Button
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 text-white px-10 py-5 text-base font-semibold rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(153,51,255,0.4)] hover:shadow-[0_0_40px_rgba(153,51,255,0.6)] w-full sm:w-auto"
            >
              <Link href="/chat" className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Talk to UpSide</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="relative group bg-neon-500/10 hover:bg-neon-500/20 border border-neon-500/50 hover:border-neon-400/70 text-neon-300 hover:text-neon-200 px-10 py-5 text-base font-semibold rounded-full transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
            >
              <Link href="/about" className="flex items-center justify-center gap-2">
                <span>How it works</span>
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60 text-sm text-gray-400">
            <span>Available 24/7</span>
            <span className="hidden sm:inline">•</span>
            <span>Private by design</span>
            <span className="hidden sm:inline">•</span>
            <span>Learns you as you talk</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight text-white text-balance">
              What you can talk to UpSide about
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 text-pretty leading-relaxed">
              UpSide understands the student-athlete journey. Start a conversation about anything below, or whatever
              is actually on your mind right now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {topics.map((topic) => (
              <Link
                key={topic.title}
                href="/chat"
                className="group flex flex-col bg-midnight-900/50 p-6 rounded-xl border border-neon-500/15 hover:border-neon-500/40 hover:bg-midnight-900/80 transition-all duration-300"
                aria-label={`Talk to UpSide about ${topic.title}`}
              >
                <div className="w-12 h-12 bg-neon-500/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-neon-500/25 transition-colors duration-300">
                  <svg
                    className="h-6 w-6 text-neon-400 group-hover:text-electric-400 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={topic.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 tracking-tight text-white group-hover:text-neon-200 transition-colors duration-300">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars / Foundations Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden border-t border-neon-500/10">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight text-white text-balance">
              A teammate for the whole journey
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4 text-pretty leading-relaxed">
              From your first week on campus to the day you transition out of sport, UpSide grows with you, and three
              things sit underneath every conversation.
            </p>
          </div>

          {/* Journey progression */}
          <div className="mb-12 md:mb-16">
            <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-sm md:text-base">
              {["Campus life", "Relationships", "Opportunities", "Career", "Transition from sport"].map(
                (step, index, arr) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-full bg-midnight-900/60 border border-neon-500/20 text-gray-200 font-medium whitespace-nowrap">
                      {step}
                    </span>
                    {index < arr.length - 1 && (
                      <svg
                        className="w-4 h-4 text-neon-400/60 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </li>
                ),
              )}
            </ol>
          </div>

          {/* The three foundations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col bg-gradient-to-b from-midnight-900/70 to-midnight-900/30 p-6 md:p-8 rounded-2xl border border-neon-500/20"
              >
                <div className="w-12 h-12 bg-neon-500/15 rounded-lg flex items-center justify-center mb-5">
                  <svg
                    className="h-6 w-6 text-neon-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={pillar.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 tracking-tight text-white">{pillar.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
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
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-[1.05] tracking-tight text-white text-balance">
            Your teammate{" "}
            <span className="bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
              beyond the game
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-2xl mb-12 text-gray-300/90 font-medium text-pretty max-w-2xl mx-auto leading-relaxed">
            No forms, no onboarding. Just start talking, and UpSide learns you along the way.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-neon-500 via-neon-400 to-electric-500 hover:from-neon-400 hover:via-neon-300 hover:to-electric-400 px-12 py-7 text-xl font-black shadow-[0_0_40px_rgba(153,51,255,0.55),0_0_80px_rgba(0,183,255,0.35)] hover:shadow-[0_0_60px_rgba(153,51,255,0.75),0_0_120px_rgba(0,183,255,0.5)] transition-all duration-500 transform hover:scale-105 border-2 border-white/30 hover:border-white/50 rounded-2xl overflow-hidden"
            >
              <Link
                href="/chat"
                className="flex items-center gap-3 relative z-10"
                aria-label="Start chatting with your teammate now"
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

                <span className="relative">Talk to UpSide</span>

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
              <Link href="/about" className="flex items-center gap-2" aria-label="Learn more about UpSide AI">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Learn About UpSide
              </Link>
            </Button>
          </div>

          {/* Dual-audience notes */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-midnight-900/50 border border-neon-500/20 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-neon-300 mb-2">For athletes</p>
              <p className="text-sm text-gray-300 leading-relaxed text-pretty">
                UpSide fills the gaps between meetings with your advisors, coaches, and mentors, so you can think
                through the moment while it&apos;s happening.
              </p>
            </div>
            <div className="bg-midnight-900/50 border border-electric-500/20 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-electric-300 mb-2">
                For athletic departments
              </p>
              <p className="text-sm text-gray-300 leading-relaxed text-pretty">
                UpSide extends your student-athlete support infrastructure between human interactions and helps athletes
                take greater advantage of the resources and relationships your institution already provides.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-700/30">
            <p className="text-sm text-gray-400">Built for Texas college athletes, public and private schools</p>
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
                      className="text-neon-400 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(153,51,255,0.6)] group-hover:text-electric-400 group-hover:drop-shadow-[0_0_12px_rgba(0,183,255,0.8)] transition-all duration-300"
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
                Your AI teammate beyond the game, helping student-athletes navigate college, career, and life
                beyond sport.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/chat" className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation">
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
                  <Link href="/privacy" className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-to-use-ai"
                    className="flex items-center min-h-[44px] py-2 text-gray-400 hover:text-neon-400 transition-colors duration-300 touch-manipulation"
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
