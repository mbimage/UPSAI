"use client"

import type { ReactNode } from "react"
import Header from "./header"
import ContextualBackButton from "./contextual-back-button"
import SmartBreadcrumb from "./smart-breadcrumb" // Added import for SmartBreadcrumb

interface PageWrapperProps {
  children: ReactNode
  title?: string
  showBreadcrumbs?: boolean
  showBackButton?: boolean
}

export function PageWrapper({ children, title, showBreadcrumbs = true, showBackButton = true }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBreadcrumbs && (
          <div className="mb-6">
            <SmartBreadcrumb />
          </div>
        )}

        {title && (
          <div className="mb-8 flex items-center">
            {showBackButton && (
              <div className="mr-4 hidden sm:block">
                <ContextualBackButton variant="minimal" />
              </div>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}

export { PageWrapper as default }
