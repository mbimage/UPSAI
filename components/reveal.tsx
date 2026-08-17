"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in ms before the reveal transition starts once in view */
  delay?: number
  /** Element/component to render as. Defaults to a div. */
  as?: ElementType
}

/**
 * Reveals its children with a subtle fade + rise the first time they
 * scroll into view. Respects prefers-reduced-motion by rendering
 * immediately with no transform.
 */
export function Reveal({ children, className, delay = 0, as }: RevealProps) {
  const Component = as ?? "div"
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Component
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[2px]",
        className,
      )}
    >
      {children}
    </Component>
  )
}
