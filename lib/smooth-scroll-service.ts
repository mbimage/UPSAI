export class SmoothScrollService {
  private static instance: SmoothScrollService
  private isInitialized = false

  static getInstance(): SmoothScrollService {
    if (!SmoothScrollService.instance) {
      SmoothScrollService.instance = new SmoothScrollService()
    }
    return SmoothScrollService.instance
  }

  init() {
    if (typeof window === "undefined" || this.isInitialized) return

    this.isInitialized = true
    this.enableSmoothScrolling()
    this.optimizeScrollPerformance()
    this.addMobileScrollOptimizations()
  }

  private enableSmoothScrolling() {
    // Add smooth scrolling CSS
    const style = document.createElement("style")
    style.textContent = `
      /* Global smooth scrolling */
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Enhanced scrolling for all containers */
      * {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Smooth momentum scrolling for iOS */
      body, .scroll-container {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      /* Custom scrollbar styling */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        transition: background 0.2s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }

      /* Dark mode scrollbar */
      .dark ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      .dark ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
      }

      .dark ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Smooth transitions for all interactive elements */
      button, a, input, textarea, select {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Enhanced mobile scrolling */
      @media (max-width: 768px) {
        body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
          scroll-padding-top: 80px;
        }
        
        /* Prevent bounce scrolling on iOS */
        .no-bounce {
          overscroll-behavior: none;
        }
      }

      /* Smooth page transitions */
      .page-transition {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      }

      /* Optimized chat scrolling */
      .chat-container {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      /* Enhanced form scrolling */
      .form-container {
        scroll-padding: 20px;
      }
    `
    document.head.appendChild(style)
  }

  private optimizeScrollPerformance() {
    // Throttle scroll events for better performance
    let ticking = false

    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add scroll-based optimizations
          const scrollTop = window.pageYOffset

          // Optimize images based on scroll position
          this.optimizeImagesOnScroll(scrollTop)

          // Update scroll indicators
          this.updateScrollIndicators(scrollTop)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", optimizeScroll, { passive: true })
  }

  private addMobileScrollOptimizations() {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // Add mobile-specific optimizations
      document.body.classList.add("mobile-optimized")

      // Prevent zoom on input focus (iOS)
      const viewport = document.querySelector("meta[name=viewport]")
      if (viewport) {
        viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
      }

      // Optimize touch scrolling
      document.addEventListener("touchstart", () => {}, { passive: true })
      document.addEventListener("touchmove", () => {}, { passive: true })
    }
  }

  private optimizeImagesOnScroll(scrollTop: number) {
    // Lazy load images that come into view
    const images = document.querySelectorAll("img[data-src]")
    const windowHeight = window.innerHeight

    images.forEach((img) => {
      const rect = img.getBoundingClientRect()
      if (rect.top < windowHeight + 100) {
        const src = img.getAttribute("data-src")
        if (src) {
          img.setAttribute("src", src)
          img.removeAttribute("data-src")
        }
      }
    })
  }

  private updateScrollIndicators(scrollTop: number) {
    // Update any scroll progress indicators
    const indicators = document.querySelectorAll(".scroll-indicator")
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / documentHeight) * 100

    indicators.forEach((indicator) => {
      ;(indicator as HTMLElement).style.width = `${scrollPercent}%`
    })
  }

  // Smooth scroll to element
  scrollToElement(elementId: string, offset = 0) {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Smooth scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Smooth scroll to bottom
  scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }
}
