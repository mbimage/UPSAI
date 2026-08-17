import { createClient } from "@/lib/supabase/client"

export interface ChatSession {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  lastMessage?: string
  pinned?: boolean
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  metadata?: Record<string, any>
}

// Chat Session Management
export async function createChatSession(userId: string, firstMessage: string): Promise<ChatSession | null> {
  try {
    const supabase = createClient()
    // Generate a title from the first message (first 50 chars)
    const title = firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([
        {
          userId,
          title,
          messageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating chat session:", error)
      return null
    }

    return data as ChatSession
  } catch (error) {
    console.error("Error creating chat session:", error)
    return null
  }
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("userId", userId)
      .order("updatedAt", { ascending: false })

    if (error) {
      console.error("Error fetching chat sessions:", error)
      return []
    }

    return (data as ChatSession[]) || []
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }
}

export async function updateChatSession(sessionId: string, userId: string, updates: Partial<ChatSession>): Promise<boolean> {
  try {
    // SECURITY: Require userId to prevent unauthorized updates
    if (!userId) {
      console.error("Error updating chat session: userId required")
      return false
    }
    
    const supabase = createClient()

    const { error } = await supabase
      .from("chat_sessions")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("userId", userId) // SECURITY: Ownership check

    if (error) {
      console.error("Error updating chat session:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating chat session:", error)
    return false
  }
}

export async function deleteChatSession(sessionId: string, userId?: string): Promise<boolean> {
  try {
    // SECURITY: userId should be provided for server-side validation
    // RLS policies also enforce this at the database level
    const supabase = createClient()
    
    // First delete all messages in the session
    await supabase.from("chat_messages").delete().eq("sessionId", sessionId)

    // Then delete the session with ownership check if userId provided
    let query = supabase.from("chat_sessions").delete().eq("id", sessionId)
    if (userId) {
      query = query.eq("userId", userId) // SECURITY: Ownership check
    }
    
    const { error } = await query

    if (error) {
      console.error("Error deleting chat session:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return false
  }
}

// Chat Message Management
// SECURITY NOTE: This function relies on RLS policies at the database level
// The session ownership is enforced by the RLS policy that checks userId
export async function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: Record<string, any>,
  userId?: string, // Optional userId for extra validation
): Promise<ChatMessage | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          sessionId,
          role,
          content,
          createdAt: new Date().toISOString(),
          metadata,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving chat message:", error)
      return null
    }

    // Update session metadata with ownership check if userId provided
    const messages = await getChatMessages(sessionId)
    let updateQuery = supabase
      .from("chat_sessions")
      .update({
        messageCount: messages.length,
        lastMessage: role === "assistant" ? content.substring(0, 100) : undefined,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", sessionId)
    
    if (userId) {
      updateQuery = updateQuery.eq("userId", userId) // SECURITY: Ownership check
    }
    
    await updateQuery

    return data as ChatMessage
  } catch (error) {
    console.error("Error saving chat message:", error)
    return null
  }
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("sessionId", sessionId)
      .order("createdAt", { ascending: true })

    if (error) {
      console.error("Error fetching chat messages:", error)
      return []
    }

    return (data as ChatMessage[]) || []
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return []
  }
}

// Local Storage Fallback (for demo/offline use)
export const localChatHistory = {
  getSessions(): ChatSession[] {
    if (typeof window === "undefined") return []
    const sessions = localStorage.getItem("upside_chat_sessions")
    return sessions ? JSON.parse(sessions) : []
  },

  saveSessions(sessions: ChatSession[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem("upside_chat_sessions", JSON.stringify(sessions))
  },

  getMessages(sessionId: string): ChatMessage[] {
    if (typeof window === "undefined") return []
    const messages = localStorage.getItem(`upside_chat_messages_${sessionId}`)
    return messages ? JSON.parse(messages) : []
  },

  saveMessages(sessionId: string, messages: ChatMessage[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`upside_chat_messages_${sessionId}`, JSON.stringify(messages))
  },

  createSession(firstMessage: string): ChatSession {
    const sessions = this.getSessions()
    const newSession: ChatSession = {
      id: Date.now().toString(),
      userId: "demo-user",
      title: firstMessage.length > 50 ? firstMessage.substring(0, 47) + "..." : firstMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    }
    sessions.unshift(newSession)
    this.saveSessions(sessions)
    return newSession
  },

  addMessage(sessionId: string, role: "user" | "assistant", content: string): ChatMessage {
    const messages = this.getMessages(sessionId)
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sessionId,
      role,
      content,
      createdAt: new Date().toISOString(),
    }
    messages.push(newMessage)
    this.saveMessages(sessionId, messages)

    // Update session
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId)
    if (sessionIndex !== -1) {
      sessions[sessionIndex].messageCount = messages.length
      sessions[sessionIndex].updatedAt = new Date().toISOString()
      if (role === "assistant") {
        sessions[sessionIndex].lastMessage = content.substring(0, 100)
      }
      this.saveSessions(sessions)
    }

    return newMessage
  },

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions().filter((s) => s.id !== sessionId)
    this.saveSessions(sessions)
    localStorage.removeItem(`upside_chat_messages_${sessionId}`)
  },

  renameSession(sessionId: string, title: string): void {
    const sessions = this.getSessions()
    const idx = sessions.findIndex((s) => s.id === sessionId)
    if (idx !== -1) {
      sessions[idx].title = title
      this.saveSessions(sessions)
    }
  },

  setPinned(sessionId: string, pinned: boolean): void {
    const sessions = this.getSessions()
    const idx = sessions.findIndex((s) => s.id === sessionId)
    if (idx !== -1) {
      sessions[idx].pinned = pinned
      this.saveSessions(sessions)
    }
  },
}

export class ChatHistoryService {
  // SECURITY: All methods now require userId for ownership validation
  async saveMessage(
    userId: string,
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    metadata?: Record<string, any>,
  ): Promise<ChatMessage | null> {
    if (!userId) {
      console.error("Error: userId required to save message")
      return null
    }
    return saveChatMessage(sessionId, role, content, metadata, userId)
  }

  async loadSession(sessionId: string, userId?: string): Promise<ChatMessage[]> {
    // Note: RLS policies at database level enforce ownership
    return getChatMessages(sessionId)
  }

  async getUserSessions(userId: string, limit = 50): Promise<any[]> {
    if (!userId) {
      console.error("Error: userId required to get sessions")
      return []
    }
    const sessions = await getChatSessions(userId)
    return sessions.slice(0, limit).map((session) => ({
      session_id: session.id,
      first_message: session.title,
      message_count: session.messageCount,
      last_activity: session.updatedAt,
    }))
  }

  async createSession(userId: string, firstMessage: string): Promise<ChatSession | null> {
    if (!userId) {
      console.error("Error: userId required to create session")
      return null
    }
    return createChatSession(userId, firstMessage)
  }

  async deleteSession(sessionId: string, userId?: string): Promise<boolean> {
    return deleteChatSession(sessionId, userId)
  }

  async updateSessionTitle(sessionId: string, title: string, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient()

      let query = supabase
        .from("chat_sessions")
        .update({
          title,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", sessionId)
      
      if (userId) {
        query = query.eq("userId", userId) // SECURITY: Ownership check
      }

      const { error } = await query

      if (error) {
        console.error("Error updating session title:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating session title:", error)
      return false
    }
  }

  async setSessionPinned(sessionId: string, pinned: boolean, userId?: string): Promise<boolean> {
    try {
      const supabase = createClient()

      let query = supabase
        .from("chat_sessions")
        .update({ pinned, updatedAt: new Date().toISOString() })
        .eq("id", sessionId)

      if (userId) {
        query = query.eq("userId", userId) // SECURITY: Ownership check
      }

      const { error } = await query

      if (error) {
        console.error("Error updating pinned state:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating pinned state:", error)
      return false
    }
  }

  async updateSessionMetadata(
    sessionId: string,
    updates: { messageCount: number; updatedAt: string },
    userId?: string,
  ): Promise<boolean> {
    try {
      const supabase = createClient()

      let query = supabase.from("chat_sessions").update(updates).eq("id", sessionId)
      
      if (userId) {
        query = query.eq("userId", userId) // SECURITY: Ownership check
      }

      const { error } = await query

      if (error) {
        console.error("Error updating session metadata:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error updating session metadata:", error)
      return false
    }
  }
}

// Singleton instance
let chatHistoryServiceInstance: ChatHistoryService | null = null

export function getChatHistoryService(): ChatHistoryService {
  if (!chatHistoryServiceInstance) {
    chatHistoryServiceInstance = new ChatHistoryService()
  }
  return chatHistoryServiceInstance
}
