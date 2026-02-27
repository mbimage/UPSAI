export class CursorEffects {
  private static instance: CursorEffects
  private trail: HTMLElement[] = []
  private isActive = false

  static getInstance(): CursorEffects {
    if (!CursorEffects.instance) {
      CursorEffects.instance = new CursorEffects()
    }
    return CursorEffects.instance
  }

  init() {
    if (typeof window === "undefined" || this.isActive) return

    this.isActive = true
    this.createTrail()
    this.bindEvents()
  }

  private createTrail() {
    // Create 8 trail dots
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("div")
      dot.className = "cursor-trail-dot"
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(59, 130, 246, ${0.8 - i * 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        opacity: 0;
      `
      document.body.appendChild(dot)
      this.trail.push(dot)
    }
  }

  private bindEvents() {
    let mouseX = 0
    let mouseY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Update trail with delay
      this.trail.forEach((dot, index) => {
        setTimeout(() => {
          dot.style.left = mouseX + "px"
          dot.style.top = mouseY + "px"
          dot.style.opacity = "1"
        }, index * 20)
      })
    })

    document.addEventListener("mouseleave", () => {
      this.trail.forEach((dot) => {
        dot.style.opacity = "0"
      })
    })
  }

  destroy() {
    this.trail.forEach((dot) => {
      if (dot.parentNode) {
        dot.parentNode.removeChild(dot)
      }
    })
    this.trail = []
    this.isActive = false
  }
}
