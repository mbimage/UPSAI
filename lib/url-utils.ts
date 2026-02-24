import { APP_URL } from "@/lib/env"

/**
 * Returns the application's base URL from environment variables or falls back to window.location.origin
 */
export function getAppUrl(): string {
  return APP_URL || (typeof window !== "undefined" ? window.location.origin : "")
}

/**
 * Constructs a full URL by appending the given path to the application's base URL
 * @param path The path to append to the base URL
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getAppUrl()
  // Ensure path starts with a slash and the URL doesn't have a trailing slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  return `${normalizedBaseUrl}${normalizedPath}`
}
