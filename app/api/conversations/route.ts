import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, getUser } from "@/lib/supabase/server"
import { getSecurityHeaders } from "@/lib/security-service"

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only authenticated users can create persistent conversations
    // This prevents guest ID spoofing attacks
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required to create conversations" },
        { status: 401, headers: getSecurityHeaders() }
      )
    }
    
    const userId = user.id
    
    const body = await request.json()
    const { title } = body
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        userId,
        title: title || "New Conversation",
        messageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
    
    return NextResponse.json(
      { conversationId: data.id, conversation: data },
      { status: 201, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in POST /api/conversations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}

// GET /api/conversations - List user's conversations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getUser()
    
    // SECURITY: Only authenticated users can list conversations
    // This prevents enumeration and access to other users' data
    if (!user?.id) {
      return NextResponse.json(
        { conversations: [] },
        { status: 200, headers: getSecurityHeaders() }
      )
    }
    
    const userId = user.id
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("id, title, updatedAt, messageCount, lastMessage, createdAt")
      .eq("userId", userId)
      .order("updatedAt", { ascending: false })
    
    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
    
    return NextResponse.json(
      { conversations: data || [] },
      { status: 200, headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error("Error in GET /api/conversations:", error)
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
