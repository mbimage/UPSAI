"use client"

import { useEffect } from "react"

export function MicroInteractions() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      // Add subtle hover effects with CSS
      const addHoverStyles = () => {
        const style = document.createElement("style")
        style.id = "micro-interactions-styles"
        style.textContent = `
          /* Subtle button hover effects */
          button:not(:disabled) {
            transition: all 0.2s ease !important;
          }
          
          button:not(:disabled):hover {
            transform: translateY(-1px) !important;
            filter: brightness(1.05) !important;
          }
          
          button:not(:disabled):active {
            transform: translateY(0px) !important;
            filter: brightness(0.95) !important;
          }
          
          /* Subtle link hover effects */
          a:hover {
            transition: all 0.2s ease !important;
            filter: brightness(1.1) !important;
          }
          
          /* Subtle focus effects */
          *:focus-visible {
            outline: 2px solid rgba(161, 117, 255, 0.5) !important;
            outline-offset: 2px !important;
          }
          
          /* Subtle card hover effects */
          [class*="rounded"]:hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          }
          
          /* Breathing animation for background */
          @keyframes subtle-breathe {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.98; }
          }
          
          .breathe-bg {
            animation: subtle-breathe 8s ease-in-out infinite;
          }
        `

        // Remove existing styles first
        const existing = document.getElementById("micro-interactions-styles")
        if (existing) {
          existing.remove()
        }

        document.head.appendChild(style)
      }

      // Add breathing effect to background
      const addBreathingEffect = () => {
        const backgrounds = document.querySelectorAll('[class*="bg-gradient"], [class*="bg-midnight"]')
        backgrounds.forEach((bg) => {
          bg.classList.add("breathe-bg")
        })
      }

      // Initialize effects
      addHoverStyles()

      // Add breathing effect after a delay
      setTimeout(addBreathingEffect, 1000)

      // Add subtle scroll indicator
      const addScrollIndicator = () => {
        const indicator = document.createElement("div")
        indicator.id = "scroll-indicator"
        indicator.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #a175ff, #48cbff);
          z-index: 9999;
          transition: width 0.1s ease;
          width: 0%;
        `
        document.body.appendChild(indicator)

        const updateScrollIndicator = () => {
          const scrolled = window.pageYOffset
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const scrollPercent = (scrolled / maxScroll) * 100
          indicator.style.width = `${Math.min(scrollPercent, 100)}%`
        }

        window.addEventListener("scroll", updateScrollIndicator, { passive: true })
      }

      addScrollIndicator()
    } catch (error) {
      console.log("Micro-interactions initialization skipped")
    }

    // Cleanup function
    return () => {
      try {
        const style = document.getElementById("micro-interactions-styles")
        if (style) style.remove()

        const indicator = document.getElementById("scroll-indicator")
        if (indicator) indicator.remove()
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }, [])

  return null
}
