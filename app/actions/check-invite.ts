"use server"

import { isEmailAllowed } from "@/lib/invite-allowlist"

// Lets client signup/login forms check the allowlist without exposing the
// list itself. Security is still enforced server-side at /chat and /api/chat;
// this is purely for a friendly, upfront message.
export async function checkInviteEmail(email: string): Promise<{ allowed: boolean }> {
  return { allowed: isEmailAllowed(email) }
}
