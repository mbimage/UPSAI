export class BreathingBackground {
  private static instance: BreathingBackground
  private isActive = false
  private animationId: number | null = null

  static getInstance(): BreathingBackground {
    if (!BreathingBackground.instance) {
      BreathingBackground.instance = new BreathingBackground()
    }
    return BreathingBackground.instance
  }

  start() {
    if (typeof window === "undefined" || this.isActive) return

    this.isActive = true
    this.animate()
  }

  private animate() {
    const startTime = Date.now()

    const breathe = () => {
      if (!this.isActive) return

      const elapsed = Date.now() - startTime
      const cycle = (elapsed / 4000) % 1 // 4 second cycle
      const intensity = (Math.sin(cycle * Math.PI * 2) + 1) / 2 // 0 to 1

      // Very subtle background brightness change
      const brightness = 0.98 + intensity * 0.04 // 98% to 102%

      document.documentElement.style.filter = `brightness(${brightness})`

      this.animationId = requestAnimationFrame(breathe)
    }

    breathe()
  }

  stop() {
    this.isActive = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    document.documentElement.style.filter = ""
  }
}
