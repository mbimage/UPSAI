"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Chat", href: "/chat" },
  { name: "About", href: "/about" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300 cursor-pointer p-2 -m-2 rounded-lg hover:bg-neon-500/10"
          >
            <div className="flex items-center space-x-2">
              {/* UpSide AI text */}
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300">
                Up
                <span className="relative bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300">
                  Side
                  <span
                    aria-hidden="true"
                    className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-gradient-to-r from-neon-400 to-electric-400 group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300"
                  />
                </span>
                {" AI"}
              </span>
              {/* Compact chevron emblem */}
              <div className="relative">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neon-400 group-hover:text-electric-400 transition-all duration-300 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transform group-hover:scale-110"
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
                  <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
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
            <div className="relative group/beta">
              {/* Main badge */}
              <span className="relative px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40">
                <span className="relative z-10 drop-shadow-sm">BETA</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/chat">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden text-gray-300">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 border-slate-700">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300">
                        Up
                        <span className="relative bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300">
                          Side
                          <span
                            aria-hidden="true"
                            className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-gradient-to-r from-neon-400 to-electric-400 group-hover:from-neon-300 group-hover:to-electric-300 transition-all duration-300"
                          />
                        </span>
                        {" AI"}
                      </span>
                      <div className="relative">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 28 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-neon-400 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:text-electric-400 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300"
                        >
                          <circle
                            cx="14"
                            cy="14"
                            r="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity="0.3"
                          />
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
                          <circle
                            cx="14"
                            cy="14"
                            r="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeOpacity="0.2"
                          />
                          <path
                            d="M9 16L14 11L19 16"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
                </div>

                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-300 hover:text-purple-400 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 pb-4">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Link href="/chat" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
