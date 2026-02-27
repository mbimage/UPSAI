export class SafeEffects {
  private static instance: SafeEffects
  private isInitialized = false

  static getInstance(): SafeEffects {
    if (!SafeEffects.instance) {
      SafeEffects.instance = new SafeEffects()
    }
    return SafeEffects.instance
  }

  init() {
    if (typeof window === "undefined" || this.isInitialized) return

    try {
      this.isInitialized = true
      this.addHoverEffects()
      this.addScrollEffects()
    } catch (error) {
      console.log("Effects initialization skipped:", error)
    }
  }

  private addHoverEffects() {
    // Add subtle scale effect on hover
    const style = document.createElement("style")
    style.textContent = `
      .hover-lift {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .hover-lift:hover {
        transform: translateY(-1px);
      }
      
      .hover-glow {
        transition: box-shadow 0.3s ease;
      }
      .hover-glow:hover {
        box-shadow: 0 0 20px rgba(161, 117, 255, 0.1);
      }
    `
    document.head.appendChild(style)

    // Apply effects to buttons and links
    setTimeout(() => {
      const buttons = document.querySelectorAll("button, a[href]")
      buttons.forEach((button) => {
        button.classList.add("hover-lift")
        if (button.tagName === "BUTTON") {
          button.classList.add("hover-glow")
        }
      })
    }, 500)
  }

  private addScrollEffects() {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Add subtle parallax to background elements
          const scrolled = window.pageYOffset
          const backgrounds = document.querySelectorAll('[class*="bg-gradient"]')

          backgrounds.forEach((bg, index) => {
            const speed = 0.1 + index * 0.05
            const yPos = scrolled * speed
            ;(bg as HTMLElement).style.transform = `translateY(${yPos}px)`
          })

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
  }
}
