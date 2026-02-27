"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { Fragment } from "react"

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

export default function SmartBreadcrumb() {
  const pathname = usePathname()

  // Don't show on home page
  if (pathname === "/") return null

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    // Define custom labels for common paths
    const pathLabels: Record<string, string> = {
      dashboard: "Dashboard",
      chat: "AI Chat",
      assessments: "Assessments",
      resources: "Resources",
      feedback: "Feedback",
      settings: "Settings",
      about: "About",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      faq: "FAQ",
      mission: "Our Mission",
      "how-to-use-ai": "How to Use AI",
      "inclusive-coaching": "Inclusive Coaching",
      "ero-guide": "ERO Framework",
      admin: "Admin",
      analytics: "Analytics",
      learning: "Learning",
      setup: "Setup",
      library: "Library",
      "for-parents": "For Parents",
      "for-coaches": "For Coaches",
      "getting-started": "Getting Started",
      "mental-health": "Mental Health",
      onboarding: "Onboarding",
      login: "Login",
      signup: "Sign Up",
      "consent-required": "Consent Required",
      "verify-consent": "Verify Consent",
    }

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      breadcrumbs.push({
        label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isActive: isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show if only home + current page
  if (breadcrumbs.length <= 2) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-4 py-2 bg-midnight-900/80 backdrop-blur-sm rounded-lg border border-neon-500/20 shadow-lg shadow-neon-500/10"
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.href}>
            <li className="flex items-center">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-400 hover:text-neon-400 transition-colors duration-200"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ) : item.isActive ? (
                <span className="text-white font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="text-gray-400 hover:text-neon-400 transition-colors duration-200">
                  {item.label}
                </Link>
              )}
            </li>
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-gray-600" />}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
