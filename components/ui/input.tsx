import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "transition-all duration-300 ease-out",
          "focus-visible:outline-none focus-visible:border-neon-500/50 focus-visible:ring-2 focus-visible:ring-neon-500/20 focus-visible:ring-offset-0",
          "focus-visible:shadow-[0_0_15px_rgba(34,197,94,0.15),0_0_30px_rgba(34,197,94,0.1),inset_0_0_10px_rgba(34,197,94,0.05)]",
          "hover:border-neon-500/30 hover:shadow-[0_0_10px_rgba(34,197,94,0.08)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
