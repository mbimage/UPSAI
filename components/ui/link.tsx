import * as React from "react"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ className, ...props }, ref) => {
  return (
    <a className={cn("text-sm font-medium transition-colors hover:text-foreground", className)} ref={ref} {...props} />
  )
})
Link.displayName = "Link"

export { Link }
