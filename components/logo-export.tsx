"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, Check } from "lucide-react"

export default function LogoExport() {
  const [copied, setCopied] = useState<string | null>(null)

  // Your logo as a standalone SVG - UpSide + chevron + I
  const logoSVG = `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- UpSide Text -->
  <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#textGradient)">UpSide</text>
  
  <!-- Chevron (replacing the "A" in AI) -->
  <path d="M115 32L125 22L135 32" stroke="url(#textGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow)"/>
  
  <!-- I Text (the "I" from AI) -->
  <text x="145" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#textGradient)">I</text>
</svg>`

  // Simplified version without gradients (for compatibility)
  const logoSVGSimple = `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- UpSide Text -->
  <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#22c55e">UpSide</text>
  
  <!-- Chevron (replacing the "A" in AI) -->
  <path d="M115 32L125 22L135 32" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  
  <!-- I Text (the "I" from AI) -->
  <text x="145" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="#22c55e">I</text>
</svg>`

  // React component version
  const logoComponent = `export function UpsideChevronILogo({ width = 200, height = 60, className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:"#22c55e", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#3b82f6", stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* UpSide Text */}
      <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#textGradient)">UpSide</text>
      
      {/* Chevron (replacing the "A" in AI) */}
      <path d="M115 32L125 22L135 32" stroke="url(#textGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      
      {/* I Text (the "I" from AI) */}
      <text x="145" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#textGradient)">I</text>
    </svg>
  )
}`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const downloadSVG = (svgContent: string, filename: string) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
            UpSide ⌃ I Logo Export
          </h1>
          <p className="text-gray-300">Copy your logo for pitch decks, presentations, and marketing materials</p>
          <p className="text-sm text-gray-400 mt-2">
            The chevron (⌃) cleverly replaces the "A" in "AI" - so it reads as "UpSide AI" but with visual flair!
          </p>
        </div>

        {/* Logo Preview */}
        <Card className="mb-8 bg-midnight-900/50 border-neon-500/20">
          <CardHeader>
            <CardTitle className="text-white">Logo Preview</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white p-8 rounded-lg inline-block mb-4 mr-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">UpSide</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600"
                >
                  <path
                    d="M7 14L12 9L17 14"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-2xl font-bold text-green-600">I</span>
              </div>
            </div>
            <div className="bg-midnight-950 p-8 rounded-lg inline-block">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                  UpSide
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neon-400 drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                >
                  <path
                    d="M7 14L12 9L17 14"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                  I
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Left: Light background version | Right: Dark background version
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SVG with Gradients */}
          <Card className="bg-midnight-900/50 border-neon-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
                SVG with Gradients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">Best for web and modern presentations</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(logoSVG, "gradient")}
                  className="flex-1 bg-neon-600 hover:bg-neon-700"
                >
                  {copied === "gradient" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied === "gradient" ? "Copied!" : "Copy SVG"}
                </Button>
                <Button
                  onClick={() => downloadSVG(logoSVG, "upside-chevron-i-logo-gradient.svg")}
                  variant="outline"
                  className="border-neon-500/20 text-white hover:bg-neon-500/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simple SVG */}
          <Card className="bg-midnight-900/50 border-electric-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Simple SVG
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">Maximum compatibility for all platforms</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(logoSVGSimple, "simple")}
                  className="flex-1 bg-electric-600 hover:bg-electric-700"
                >
                  {copied === "simple" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied === "simple" ? "Copied!" : "Copy SVG"}
                </Button>
                <Button
                  onClick={() => downloadSVG(logoSVGSimple, "upside-chevron-i-logo-simple.svg")}
                  variant="outline"
                  className="border-electric-500/20 text-white hover:bg-electric-500/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* React Component */}
          <Card className="bg-midnight-900/50 border-cyan-500/20 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                React Component
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">For developers - reusable React component</p>
              <Button
                onClick={() => copyToClipboard(logoComponent, "component")}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {copied === "component" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === "component" ? "Copied!" : "Copy React Component"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Brand Story */}
        <Card className="mt-8 bg-gradient-to-r from-neon-900/20 to-electric-900/20 border-neon-500/20">
          <CardHeader>
            <CardTitle className="text-white">The Story Behind the Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300">
                The <strong className="text-neon-400">UpSide ⌃ I</strong> logo is more than just a design - it's a
                clever visual metaphor:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside ml-4">
                <li>
                  <strong className="text-white">"UpSide"</strong> - Represents looking at the positive potential in
                  every situation
                </li>
                <li>
                  <strong className="text-neon-400">Chevron (⌃)</strong> - Replaces the "A" in "AI", symbolizing upward
                  movement and growth
                </li>
                <li>
                  <strong className="text-electric-400">"I"</strong> - Represents the individual student-athlete and
                  their personal journey
                </li>
              </ul>
              <p className="text-gray-300">
                Together, it reads as "UpSide AI" while visually emphasizing the <em>upward trajectory</em> that your
                platform provides to rural student-athletes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8 bg-midnight-900/50 border-neon-500/20">
          <CardHeader>
            <CardTitle className="text-white">Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neon-400 mb-2">For Pitch Decks (PowerPoint/Keynote)</h3>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Copy the Simple SVG code</li>
                  <li>Save as "upside-logo.svg"</li>
                  <li>Insert → Pictures → From File</li>
                  <li>Select your .svg file</li>
                  <li>Resize as needed (scales perfectly!)</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-electric-400 mb-2">For Web/Digital Use</h3>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Copy the Gradient SVG code</li>
                  <li>Paste directly into HTML</li>
                  <li>Or save as .svg file</li>
                  <li>Use in img tags or CSS</li>
                  <li>Scales infinitely without pixelation</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-neon-900/20 rounded-lg border border-neon-500/20">
              <h4 className="text-white font-semibold mb-2">💡 Pro Tips:</h4>
              <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                <li>The chevron creates a memorable visual that stands out from typical "AI" logos</li>
                <li>Works perfectly on both light and dark backgrounds</li>
                <li>The upward-pointing chevron reinforces your "upside" messaging</li>
                <li>SVG format ensures crisp quality at any size - from business cards to billboards</li>
                <li>The gradient version adds premium feel for digital presentations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
