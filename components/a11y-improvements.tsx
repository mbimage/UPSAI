"use client"

import { useEffect } from "react"

export function A11yImprovements() {
  useEffect(() => {
    // Add skip to content link
    const skipLink = document.createElement("a")
    skipLink.href = "#main-content"
    skipLink.className =
      "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:ring-2 focus:ring-primary"
    skipLink.textContent = "Skip to main content"
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Add role="main" to main content area if not present
    const mainContent = document.querySelector("main")
    if (mainContent && !mainContent.getAttribute("role")) {
      mainContent.setAttribute("role", "main")
      mainContent.id = "main-content"
    }

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll("div[onclick], span[onclick]")
    interactiveElements.forEach((el) => {
      if (!el.getAttribute("tabindex")) {
        el.setAttribute("tabindex", "0")
      }
      if (!el.getAttribute("role")) {
        el.setAttribute("role", "button")
      }
    })
  }, [])

  return null
}
