import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"

// GET /api/conversations/[id] - Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only authenticated users can access conversations
    // This prevents guest ID spoofing attacks
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: getSecurityHeaders() }
      )
    }
    
    const userId = user.id
    
    // SECURITY: Validate UUID format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }
    
    // SECURITY: Verify ownership of the conversation
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", conversationId)
      .eq("userId", userId)
      .single()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404, headers: getSecurityHeaders() }
      )
    }
    
    // Fetch messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id, role, content, createdAt, metadata")
      .eq("sessionId", conversationId)
      .order("createdAt", { ascending: true })
    
    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
    
    return NextResponse.json(
      { 
        conversation: session,
        messages: messages || [] 
      },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in GET /api/conversations/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only authenticated users can delete conversations
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: getSecurityHeaders() }
      )
    }
    
    const userId = user.id
    
    // SECURITY: Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }
    
    // SECURITY: Verify ownership before deletion
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", conversationId)
      .eq("userId", userId)
      .single()
    
    if (!session) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404, headers: getSecurityHeaders() }
      )
    }
    
    // SECURITY: Delete messages for this specific session (RLS also enforces ownership)
    await supabase
      .from("chat_messages")
      .delete()
      .eq("sessionId", conversationId)
    
    // SECURITY: Delete the conversation with ownership check
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", conversationId)
      .eq("userId", userId) // Double-check ownership
    
    if (error) {
      console.error("Error deleting conversation:", error)
      return NextResponse.json(
        { error: "Failed to delete conversation" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in DELETE /api/conversations/[id]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

// PATCH /api/conversations/[id] - Update conversation title
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only authenticated users can update conversations
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: getSecurityHeaders() }
      )
    }
    
    const userId = user.id
    
    // SECURITY: Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }
    
    const body = await request.json()
    const { title } = body
    
    // SECURITY: Validate title input
    if (!title || typeof title !== "string" || title.length > 200) {
      return NextResponse.json(
        { error: "Invalid title" },
        { status: 400, headers: getSecurityHeaders() }
      )
    }
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .update({ 
        title, 
        updatedAt: new Date().toISOString() 
      })
      .eq("id", conversationId)
      .eq("userId", userId)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating conversation:", error)
      return NextResponse.json(
        { error: "Failed to update conversation" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
    
    return NextResponse.json(
      { conversation: data },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in PATCH /api/conversations/[id]:", error)
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
      "Access-Control-Allow-Methods": "GET, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
