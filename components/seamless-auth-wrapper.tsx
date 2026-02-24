"use client"

import type React from "react"

// This component now simply renders children without authentication
export function SeamlessAuthWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
