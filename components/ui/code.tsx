import type React from "react"
import { cn } from "@/lib/utils"

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
}

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <pre className={cn("bg-muted px-4 py-3 rounded-md font-mono text-sm overflow-x-auto", className)} {...props}>
      <code>{children}</code>
    </pre>
  )
}
