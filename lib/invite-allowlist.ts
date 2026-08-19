// Invite-only access control.
//
// The chat is in private beta and locked to an allowlist of emails/domains
// stored in the INVITE_ALLOWLIST environment variable (comma, space, or
// newline separated). Examples:
//
//   INVITE_ALLOWLIST="you@upside.ai, coach@school.edu, @longhorns.utexas.edu"
//
// Entries containing "@" in the middle are treated as exact email matches.
// Entries that are a bare domain ("school.edu") or start with "@"
// ("@school.edu") allow any email at that domain.
//
// This module is server-only. Never expose the raw list to the client.

function parseAllowlist(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

const ALLOWLIST = parseAllowlist(process.env.INVITE_ALLOWLIST ?? "")

/** Whether an allowlist has been configured at all. */
export function isAllowlistConfigured(): boolean {
  return ALLOWLIST.length > 0
}

/**
 * Returns true only when the email is explicitly invited.
 * Fails closed: if no allowlist is configured, nobody is allowed in.
 */
export function isEmailAllowed(email?: string | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  if (!normalized || !normalized.includes("@")) return false
  if (ALLOWLIST.length === 0) return false // locked until configured

  const domain = normalized.split("@")[1]

  return ALLOWLIST.some((entry) => {
    // Bare domain or "@domain" entry -> match anyone at that domain.
    if (entry.startsWith("@")) return domain === entry.slice(1)
    if (!entry.includes("@")) return domain === entry
    // Otherwise it's a full email -> exact match.
    return entry === normalized
  })
}
