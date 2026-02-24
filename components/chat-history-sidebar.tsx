"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Trash2, Search, X, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type ChatSession,
  getChatSessions,
  deleteChatSession,
  localChatHistory,
} from "@/lib/chat-history-service"

interface ChatHistorySidebarProps {
  currentSessionId?: string
  onSessionSelect?: (sessionId: string) => void
  onNewChat?: () => void
  userId?: string
  className?: string
}

export function ChatHistorySidebar({
  currentSessionId,
  onSessionSelect,
  onNewChat,
  userId = "demo-user",
  className,
}: ChatHistorySidebarProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const handleSessionSelect = (sessionId: string) => {
    // Navigate to the conversation route
    router.push(`/chat/${sessionId}`)
    // Also call the callback if provided (for closing mobile sidebar, etc.)
    onSessionSelect?.(sessionId)
  }

  const handleNewChat = () => {
    // Navigate to /chat for new conversation
    router.push("/chat")
    // Also call the callback if provided
    onNewChat?.()
  }

  useEffect(() => {
    loadSessions()
  }, [userId])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      if (userId === "demo-user") {
        const localSessions = localChatHistory.getSessions()
        setSessions(localSessions)
      } else {
        const userSessions = await getChatSessions(userId)
        setSessions(userSessions)
      }
    } catch (error) {
      console.error("Error loading sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (userId === "demo-user") {
      localChatHistory.deleteSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } else {
      const success = await deleteChatSession(sessionId)
      if (success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      }
    }

    if (sessionId === currentSessionId) {
      handleNewChat()
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedSessions = {
    today: filteredSessions.filter((s) => isToday(s.updatedAt)),
    yesterday: filteredSessions.filter((s) => isYesterday(s.updatedAt)),
    thisWeek: filteredSessions.filter(
      (s) => isThisWeek(s.updatedAt) && !isToday(s.updatedAt) && !isYesterday(s.updatedAt),
    ),
    older: filteredSessions.filter((s) => !isThisWeek(s.updatedAt)),
  }

  return (
    <div className={cn("w-72 bg-midnight-950 border-r border-white/5 flex flex-col", className)}>
      {/* Minimal Header */}
      <div className="p-4 border-b border-white/5">
        <Button
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 text-white font-medium rounded-full h-10 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-neon-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Minimal Search */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="relative">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:border-neon-500/50 focus:outline-none focus:ring-1 focus:ring-neon-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Sessions List - Minimal & Clean */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-sm text-white/50">No conversations</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {Object.entries(groupedSessions).map(([period, periodSessions]) => {
              if (periodSessions.length === 0) return null

              return (
                <div key={period}>
                  {/* Minimal Period Label */}
                  <div className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-2 px-2">
                    {period === "thisWeek" ? "This Week" : period}
                  </div>

                  {/* Clean Session Items */}
                  <div className="space-y-1">
                    {periodSessions.map((session) => (
                      <button
                        key={session.id}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                          currentSessionId === session.id
                            ? "bg-gradient-to-r from-neon-500/20 to-electric-500/20 border border-neon-500/30"
                            : "hover:bg-white/5 border border-transparent",
                        )}
                        onClick={() => handleSessionSelect(session.id)}
                      >
                        {/* Glow effect on active */}
                        {currentSessionId === session.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-neon-500/10 to-electric-500/10 blur-sm" />
                        )}

                        <div className="relative flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-neon-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-white truncate">
                                {session.title || "New chat"}
                              </span>
                            </div>
                            {session.lastMessage && (
                              <p className="text-xs text-white/40 truncate pl-5">{session.lastMessage}</p>
                            )}
                          </div>

                          {/* Delete button - only show on hover */}
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[10px] text-white/30 mt-1 pl-5">
                          {formatRelativeTime(session.updatedAt)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px] text-white/30">
          <span>{sessions.length} conversations</span>
          <ChevronUp className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}

// Helper functions
function isToday(date: string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  return checkDate.toDateString() === today.toDateString()
}

function isYesterday(date: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const checkDate = new Date(date)
  return checkDate.toDateString() === yesterday.toDateString()
}

function isThisWeek(date: string): boolean {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const checkDate = new Date(date)
  return checkDate >= weekAgo && checkDate <= now
}

function formatRelativeTime(date: string): string {
  const now = new Date()
  const checkDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - checkDate.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return checkDate.toLocaleDateString()
}
