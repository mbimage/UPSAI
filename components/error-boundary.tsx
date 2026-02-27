"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg shadow-sm bg-background">
          <div className="bg-yellow-500/10 p-3 rounded-full mb-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Component Error</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            We're sorry, but something went wrong with this component.
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: null })} size="sm">
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Keep the default export for backward compatibility
export default ErrorBoundary
