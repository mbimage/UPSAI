import { type NextRequest, NextResponse } from "next/server"
import { getSecurityHeaders } from "@/lib/security-service"
import { getUser } from "@/lib/supabase/server"
import { forceRegenerateSummary } from "@/lib/chat-memory-service"

/**
 * POST /api/conversations/[id]/summarize
 * 
 * Manually triggers summary regeneration for a conversation.
 * Useful for:
 * - Forcing summary update after bulk message import
 * - Debugging/testing the memory layer
 * - Admin tools
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const user = await getUser()

    // SECURITY: Only authenticated users can trigger summarization
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Ownership is verified inside forceRegenerateSummary via userId check
    const result = await forceRegenerateSummary(conversationId, user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate summary" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        summary: result.summary,
        message: "Summary regenerated successfully"
      },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in summarize endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
