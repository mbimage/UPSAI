"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-neon-500/20 bg-midnight-900/90 backdrop-blur-sm text-slate-100 shadow-lg shadow-neon-500/10",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6 border-b border-neon-500/10 text-center justify-center items-center",
        className,
      )}
      {...props}
    />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight text-neon-300", className)}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm text-slate-400", className)} {...props} />,
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    clickable?: boolean
    href?: string
  }
>(({ className, clickable, href, onClick, ...props }, ref) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0 text-pretty leading-relaxed space-y-6 text-slate-200 [&_[role=combobox]]:bg-midnight-700/80 [&_[role=combobox]]:border-neon-500/40 [&_[role=combobox]]:text-white [&_[role=combobox]]:placeholder-neon-400/60 [&_.grid]:gap-8 [&_.space-y-2]:space-y-3",
        clickable && "cursor-pointer hover:bg-neon-500/5 transition-colors duration-200",
        className,
      )}
      onClick={clickable ? handleClick : onClick}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
