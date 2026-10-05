"use client"

import { useEffect, useRef } from "react"

type Puff = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  grow: number
  life: number
  maxLife: number
  hue: number
  seed: number
}

const MAX_PUFFS = 160
// Rendering at half resolution is cheaper and the CSS upscale softens the smoke for free.
const RENDER_SCALE = 0.5
const PEAK_ALPHA = 0.09

export function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!hasFinePointer || prefersReducedMotion) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    const resize = () => {
      width = canvas.width = Math.ceil(window.innerWidth * RENDER_SCALE)
      height = canvas.height = Math.ceil(window.innerHeight * RENDER_SCALE)
    }
    resize()

    const puffs: Puff[] = []
    let lastPoint: { x: number; y: number } | null = null
    let frameId = 0
    let running = false
    let lastTime = 0

    const spawn = (x: number, y: number, vx: number, vy: number, now: number) => {
      if (puffs.length >= MAX_PUFFS) puffs.shift()
      puffs.push({
        x,
        y,
        vx: vx + (Math.random() - 0.5) * 0.6,
        vy: vy + (Math.random() - 0.5) * 0.6,
        r: 6 + Math.random() * 6,
        grow: 0.35 + Math.random() * 0.3,
        life: 0,
        maxLife: 70 + Math.random() * 40,
        // Drift between brand neon purple (270) and electric cyan (195) over time.
        hue: 232 + 38 * Math.sin(now * 0.0004),
        seed: Math.random() * 1000,
      })
    }

    const tick = (now: number) => {
      const step = lastTime ? Math.min((now - lastTime) / 16.67, 3) : 1
      lastTime = now

      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = "lighter"

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i]
        p.life += step
        if (p.life >= p.maxLife) {
          puffs.splice(i, 1)
          continue
        }

        // A slow, per-puff rotation of the velocity gives the trail its curling, wispy motion.
        const curl = Math.sin(now * 0.0012 + p.seed) * 0.06 * step
        const cos = Math.cos(curl)
        const sin = Math.sin(curl)
        const vx = p.vx * cos - p.vy * sin
        const vy = p.vx * sin + p.vy * cos
        const drag = Math.pow(0.96, step)
        p.vx = vx * drag
        p.vy = vy * drag - 0.02 * step
        p.x += p.vx * step
        p.y += p.vy * step
        p.r += p.grow * step

        const alpha = Math.sin(Math.PI * (p.life / p.maxLife)) * PEAK_ALPHA
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 68%, ${alpha})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (puffs.length > 0) {
        frameId = requestAnimationFrame(tick)
      } else {
        running = false
        lastTime = 0
        ctx.clearRect(0, 0, width, height)
      }
    }

    const start = () => {
      if (running || document.hidden) return
      running = true
      frameId = requestAnimationFrame(tick)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      const x = event.clientX * RENDER_SCALE
      const y = event.clientY * RENDER_SCALE
      if (!lastPoint) {
        lastPoint = { x, y }
        return
      }
      const dx = x - lastPoint.x
      const dy = y - lastPoint.y
      const steps = Math.min(4, Math.floor(Math.hypot(dx, dy) / 6))
      const now = performance.now()
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        spawn(lastPoint.x + dx * t, lastPoint.y + dy * t, dx * 0.06, dy * 0.06, now)
      }
      if (steps > 0) lastPoint = { x, y }
      start()
    }

    const resetTrail = () => {
      lastPoint = null
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId)
        running = false
        lastTime = 0
      } else if (puffs.length > 0) {
        start()
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("resize", resize)
    document.documentElement.addEventListener("pointerleave", resetTrail)
    window.addEventListener("blur", resetTrail)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("resize", resize)
      document.documentElement.removeEventListener("pointerleave", resetTrail)
      window.removeEventListener("blur", resetTrail)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full mix-blend-screen"
    />
  )
}

export default SmokeCursor
