// Security Service - Browser-compatible security utilities
// Provides rate limiting, input validation, and threat detection

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

interface SecurityEvent {
  timestamp: Date
  type: string
  severity: "low" | "medium" | "high"
  details: string
  ip?: string
  userAgent?: string
}

interface ThreatDetectionResult {
  isBlocked: boolean
  reason?: string
  severity: "low" | "medium" | "high"
  action: "allow" | "warn" | "block"
}

// In-memory storage for rate limiting (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitEntry>()
const securityEvents: SecurityEvent[] = []

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10000, // Increased from 100 to 10000 for unlimited questions
  blockDuration: 60 * 60 * 1000, // 1 hour block
}

// Security headers configuration
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://*.supabase.co;",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// Extract client IP from request headers
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return "unknown"
}

// Generate secure token using browser-compatible methods
export function generateSecureToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// Simple hash function for browser compatibility
export function hashData(data: string): string {
  let hash = 0
  if (data.length === 0) return hash.toString()

  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

// Check rate limit for IP address
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `rate_limit:${ip}`

  let entry = rateLimitStore.get(key)

  // Initialize or reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
      blocked: false,
    }
  }

  // Check if IP is blocked
  if (entry.blocked && now < entry.resetTime) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment counter
  entry.count++

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_CONFIG.maxRequests) {
    entry.blocked = true
    entry.resetTime = now + RATE_LIMIT_CONFIG.blockDuration

    // Log security event
    logSecurityEvent({
      type: "rate_limit_exceeded",
      severity: "medium",
      details: `IP ${ip} exceeded rate limit`,
      ip,
    })

    rateLimitStore.set(key, entry)

    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/data:(?!image\/)/gi, "") // Remove data: protocol except images
    .replace(/vbscript:/gi, "") // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .replace(/\0/g, "") // Remove null bytes
    .trim()
    .substring(0, 2000) // Limit length
}

// Enhanced HTML sanitization for rich content
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return ""

  // Allow only safe HTML tags and attributes
  const allowedTags = ["p", "br", "strong", "em", "u", "ol", "ul", "li", "h1", "h2", "h3", "h4", "h5", "h6"]
  const allowedAttributes = ["class", "id"]

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/<(?!\/?(?:p|br|strong|em|u|ol|ul|li|h[1-6])\b)[^>]*>/gi, "") // Remove non-allowed tags
    .trim()
    .substring(0, 10000) // Limit length for rich content
}

// SQL injection prevention
export function sanitizeSqlInput(input: string): string {
  if (typeof input !== "string") return ""

  return input
    .replace(/['";\\]/g, "") // Remove SQL special characters
    .replace(/--/g, "") // Remove SQL comments
    .replace(/\/\*/g, "") // Remove SQL block comments start
    .replace(/\*\//g, "") // Remove SQL block comments end
    .replace(/\bUNION\b/gi, "") // Remove UNION keyword
    .replace(/\bSELECT\b/gi, "") // Remove SELECT keyword
    .replace(/\bINSERT\b/gi, "") // Remove INSERT keyword
    .replace(/\bUPDATE\b/gi, "") // Remove UPDATE keyword
    .replace(/\bDELETE\b/gi, "") // Remove DELETE keyword
    .replace(/\bDROP\b/gi, "") // Remove DROP keyword
    .trim()
    .substring(0, 1000)
}

// File upload validation
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

  if (file.size > maxSize) {
    return { isValid: false, error: "File size too large (max 5MB)" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Invalid file type" }
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
  if (!allowedExtensions.includes(extension)) {
    return { isValid: false, error: "Invalid file extension" }
  }

  // Check for suspicious file names
  const suspiciousPatterns = [/\.php$/i, /\.asp$/i, /\.jsp$/i, /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return { isValid: false, error: "Suspicious file type detected" }
    }
  }

  return { isValid: true }
}

// Enhanced threat detection with scoring
export function calculateThreatScore(request: Request): number {
  let score = 0
  const url = new URL(request.url)
  const userAgent = request.headers.get("user-agent") || ""
  const referer = request.headers.get("referer") || ""
  const pathAndQuery = url.pathname + url.search

  // Check for various threat indicators
  const threatPatterns = [
    { pattern: /\.\./g, score: 5, name: "Directory traversal" },
    { pattern: /<script/gi, score: 8, name: "Script injection" },
    { pattern: /union.*select/gi, score: 9, name: "SQL injection" },
    { pattern: /javascript:/gi, score: 6, name: "JavaScript protocol" },
    { pattern: /vbscript:/gi, score: 6, name: "VBScript protocol" },
    { pattern: /data:text\/html/gi, score: 7, name: "Data URI XSS" },
    { pattern: /eval\(/gi, score: 8, name: "Code evaluation" },
    { pattern: /exec\(/gi, score: 8, name: "Code execution" },
    { pattern: /system\(/gi, score: 9, name: "System command" },
    { pattern: /\bor\s+1\s*=\s*1/gi, score: 9, name: "SQL injection" },
    { pattern: /\bdrop\s+table/gi, score: 10, name: "SQL drop table" },
    { pattern: /\bdelete\s+from/gi, score: 8, name: "SQL delete" },
  ]

  // Check patterns in URL, user agent, and referer
  const checkString = `${pathAndQuery} ${userAgent} ${referer}`

  for (const { pattern, score: patternScore, name } of threatPatterns) {
    if (pattern.test(checkString)) {
      score += patternScore
      logSecurityEvent({
        type: "threat_pattern_detected",
        severity: patternScore > 7 ? "high" : patternScore > 4 ? "medium" : "low",
        details: `${name} pattern detected in request`,
        ip: getClientIP(request),
        userAgent,
      })
    }
  }

  // Check for suspicious user agents
  const suspiciousUAPatterns = [/sqlmap/gi, /nikto/gi, /nessus/gi, /burp/gi, /zap/gi, /w3af/gi]

  for (const pattern of suspiciousUAPatterns) {
    if (pattern.test(userAgent)) {
      score += 10
      logSecurityEvent({
        type: "suspicious_user_agent",
        severity: "high",
        details: `Suspicious user agent detected: ${userAgent}`,
        ip: getClientIP(request),
        userAgent,
      })
    }
  }

  // Check for rapid requests (basic bot detection)
  const ip = getClientIP(request)
  const entry = rateLimitStore.get(`rate_limit:${ip}`)
  if (entry && entry.count > 20) {
    score += 5
  }

  return Math.min(score, 100) // Cap at 100
}

// Enhanced request validation with threat scoring
export function validateRequest(request: Request): ThreatDetectionResult {
  const threatScore = calculateThreatScore(request)

  if (threatScore >= 15) {
    return {
      isBlocked: true,
      reason: `High threat score: ${threatScore}`,
      severity: "high",
      action: "block",
    }
  }

  if (threatScore >= 8) {
    return {
      isBlocked: false,
      reason: `Medium threat score: ${threatScore}`,
      severity: "medium",
      action: "warn",
    }
  }

  return {
    isBlocked: false,
    reason: `Low threat score: ${threatScore}`,
    severity: "low",
    action: "allow",
  }
}

// Detect potential threats
export function detectThreats(request: Request): ThreatDetectionResult[] {
  const threats: ThreatDetectionResult[] = []
  const ip = getClientIP(request)

  // Check rate limiting
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    threats.push({
      isBlocked: true,
      reason: "Rate limit exceeded",
      severity: "medium",
      action: "block",
    })
  }

  // Validate request
  const validation = validateRequest(request)
  if (validation.isBlocked) {
    threats.push(validation)
  }

  return threats
}

// Log security events
export function logSecurityEvent(event: Omit<SecurityEvent, "timestamp">): void {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date(),
  }

  securityEvents.push(securityEvent)

  // Keep only last 1000 events to prevent memory issues
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000)
  }

  // In production, you would send this to a logging service
  console.log("Security Event:", securityEvent)
}

// Get security headers
export function getSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS }
}

// Alternative export name for compatibility
export const createSecurityHeaders = getSecurityHeaders

// Get recent security events
export function getSecurityEvents(limit = 100): SecurityEvent[] {
  return securityEvents.slice(-limit)
}

// Get security statistics
export function getSecurityStats(): {
  totalEvents: number
  eventsByType: Record<string, number>
  eventsBySeverity: Record<string, number>
  recentThreats: number
} {
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000

  const eventsByType: Record<string, number> = {}
  const eventsBySeverity: Record<string, number> = {}
  let recentThreats = 0

  for (const event of securityEvents) {
    // Count by type
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1

    // Count by severity
    eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1

    // Count recent threats
    if (event.timestamp.getTime() > oneHourAgo && event.severity !== "low") {
      recentThreats++
    }
  }

  return {
    totalEvents: securityEvents.length,
    eventsByType,
    eventsBySeverity,
    recentThreats,
  }
}

// Clear old rate limit entries (cleanup function)
export function cleanupRateLimit(): void {
  const now = Date.now()

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime && !entry.blocked) {
      rateLimitStore.delete(key)
    }
  }
}

// Export types
export type { RateLimitEntry, SecurityEvent, ThreatDetectionResult }
