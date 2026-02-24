export class AmbientSounds {
  private static instance: AmbientSounds
  private audioContext: AudioContext | null = null
  private isEnabled = false

  static getInstance(): AmbientSounds {
    if (!AmbientSounds.instance) {
      AmbientSounds.instance = new AmbientSounds()
    }
    return AmbientSounds.instance
  }

  async init() {
    if (typeof window === "undefined") return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.isEnabled = true
    } catch (error) {
      console.log("Audio context not supported")
    }
  }

  // Subtle typing sound
  playTypingSound() {
    if (!this.isEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, this.audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // Subtle success sound
  playSuccessSound() {
    if (!this.isEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2) // G5

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // Subtle notification sound
  playNotificationSound() {
    if (!this.isEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.015, this.audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }
}
