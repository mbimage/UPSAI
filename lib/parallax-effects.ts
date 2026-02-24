export class ParallaxEffects {
  private static instance: ParallaxEffects
  private isActive = false

  static getInstance(): ParallaxEffects {
    if (!ParallaxEffects.instance) {
      ParallaxEffects.instance = new ParallaxEffects()
    }
    return ParallaxEffects.instance
  }

  init() {
    if (typeof window === "undefined" || this.isActive) return

    this.isActive = true
    this.bindScrollEvents()
  }

  private bindScrollEvents() {
    let ticking = false

    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll("[data-parallax]")

      parallaxElements.forEach((element) => {
        const speed = Number.parseFloat((element as HTMLElement).dataset.parallax || "0.5")
        const yPos = -(scrolled * speed)
        ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
      })

      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true })
  }
}
