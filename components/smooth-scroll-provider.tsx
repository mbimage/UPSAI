"use client"

import type React from "react"

import { useEffect } from "react"
import { SmoothScrollService } from "@/lib/smooth-scroll-service"

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize smooth scrolling on mount
    const smoothScroll = SmoothScrollService.getInstance()
    smoothScroll.init()

    // Add global scroll enhancements
    const addScrollEnhancements = () => {
      // Add smooth scrolling class to body
      document.body.classList.add("smooth-scroll-enabled")

      // Enhance all scroll containers
      const scrollContainers = document.querySelectorAll(".overflow-auto, .overflow-y-auto, .overflow-x-auto")
      scrollContainers.forEach((container) => {
        container.classList.add("scroll-container")
      })

      const mainContent = document.querySelector("main")
      if (mainContent) {
        mainContent.style.scrollPaddingTop = "64px"
      }
    }

    // Run enhancements after a short delay to ensure DOM is ready
    setTimeout(addScrollEnhancements, 100)

    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe elements that should animate on scroll
    setTimeout(() => {
      const animateElements = document.querySelectorAll(".animate-on-scroll")
      animateElements.forEach((el) => observer.observe(el))
    }, 500)

    return () => {
      observer.disconnect()
    }
  }, [])

  return <>{children}</>
}
