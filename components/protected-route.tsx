"use client"

import type React from "react"

// This component now simply renders children without protection
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
