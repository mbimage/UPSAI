import type React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  children: React.ReactNode
  className?: string
}

export function Steps({ children, className }: StepsProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
  className?: string
}

export function Step({ number, title, children, className }: StepProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {number}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="ml-10">{children}</div>
    </div>
  )
}
