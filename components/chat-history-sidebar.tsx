"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Trash2, Search, X, Pin, PinOff, Pencil, MoreVertical, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ChatSession, deleteChatSession, localChatHistory, getChatHistoryService } from "@/lib/chat-history-service"

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const renameInputRef = useRef<HTMLInputElement>(null)

  const isGuest = userId === "demo-user"
  const chatHistoryService = getChatHistoryService()

  const handleSessionSelect = (sessionId: string) => {
    router.push(`/chat/${sessionId}`)
    onSessionSelect?.(sessionId)
  }

  const handleNewChat = () => {
    router.push("/chat")
    onNewChat?.()
  }

  useEffect(() => {
    loadSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    if (renamingId) {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }
  }, [renamingId])

  // Close the action menu when clicking anywhere else
  useEffect(() => {
    if (!openMenuId) return
    const close = () => setOpenMenuId(null)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [openMenuId])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      if (isGuest) {
        setSessions(sortSessions(localChatHistory.getSessions()))
      } else {
        const res = await fetch("/api/conversations")
        if (res.ok) {
          const data = await res.json()
          setSessions(sortSessions(data.conversations || []))
        } else {
          setSessions([])
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(null)

    // Optimistic removal
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))

    if (isGuest) {
      localChatHistory.deleteSession(sessionId)
    } else {
      try {
        const res = await fetch(`/api/conversations/${sessionId}`, { method: "DELETE" })
        if (!res.ok) await deleteChatSession(sessionId, userId)
      } catch {
        await deleteChatSession(sessionId, userId)
      }
    }

    if (sessionId === currentSessionId) {
      handleNewChat()
    }
  }

  const handleTogglePin = async (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(null)
    const nextPinned = !session.pinned

    setSessions((prev) => sortSessions(prev.map((s) => (s.id === session.id ? { ...s, pinned: nextPinned } : s))))

    if (isGuest) {
      localChatHistory.setPinned(session.id, nextPinned)
    } else {
      try {
        await fetch(`/api/conversations/${session.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pinned: nextPinned }),
        })
      } catch (error) {
        console.error("Error toggling pin:", error)
      }
    }
  }

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(null)
    setRenamingId(session.id)
    setRenameValue(session.title || "")
  }

  const commitRename = async (sessionId: string) => {
    const title = renameValue.trim()
    setRenamingId(null)
    if (!title) return

    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)))

    if (isGuest) {
      localChatHistory.renameSession(sessionId, title)
    } else {
      try {
        const res = await fetch(`/api/conversations/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        })
        if (!res.ok) await chatHistoryService.updateSessionTitle(sessionId, title, userId)
      } catch {
        await chatHistoryService.updateSessionTitle(sessionId, title, userId)
      }
    }
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sessionId: string) => {
    // Respect CJK IME composition before submitting
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === "Enter") {
      e.preventDefault()
      commitRename(sessionId)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setRenamingId(null)
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pinned = filteredSessions.filter((s) => s.pinned)
  const unpinned = filteredSessions.filter((s) => !s.pinned)

  // Simple, clean grouping: Today, Previous 7 Days, Earlier
  const groupedSessions: Record<string, ChatSession[]> = {
    today: unpinned.filter((s) => isToday(s.updatedAt)),
    previous7Days: unpinned.filter((s) => !isToday(s.updatedAt) && isWithinLast7Days(s.updatedAt)),
    earlier: unpinned.filter((s) => !isWithinLast7Days(s.updatedAt)),
  }

  const groupLabels: Record<string, string> = {
    today: "Today",
    previous7Days: "Previous 7 Days",
    earlier: "Earlier",
  }

  const renderSessionItem = (session: ChatSession) => {
    const isActive = currentSessionId === session.id
    const isRenaming = renamingId === session.id

    return (
      <div
        key={session.id}
        className={cn(
          "w-full text-left rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-gradient-to-r from-neon-500/20 to-electric-500/20 border border-neon-500/30"
            : "hover:bg-white/5 border border-transparent",
        )}
      >
        <button
          type="button"
          className="w-full text-left px-3 py-2.5 rounded-lg"
          onClick={() => !isRenaming && handleSessionSelect(session.id)}
        >
          <div className="relative flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {session.pinned ? (
                  <Pin className="w-3 h-3 text-electric-400 flex-shrink-0 fill-current" />
                ) : (
                  <MessageSquare className="w-3 h-3 text-neon-400 flex-shrink-0" />
                )}
                {isRenaming ? (
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => handleRenameKeyDown(e, session.id)}
                    onBlur={() => commitRename(session.id)}
                    onClick={(e) => e.stopPropagation()}
                    maxLength={200}
                    className="flex-1 min-w-0 bg-midnight-950 border border-neon-500/40 rounded px-1.5 py-0.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-500/40"
                  />
                ) : (
                  <span className="text-sm font-medium text-white truncate">{session.title || "New conversation"}</span>
                )}
              </div>
              {!isRenaming && session.lastMessage && (
                <p className="text-xs text-white/40 truncate pl-5">{session.lastMessage}</p>
              )}
              {!isRenaming && (
                <div className="text-[10px] text-white/30 mt-1 pl-5">{formatRelativeTime(session.updatedAt)}</div>
              )}
            </div>
          </div>
        </button>

        {/* Actions */}
        {isRenaming ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              commitRename(session.id)
            }}
            className="absolute right-2 top-2.5 p-1 rounded text-neon-300 hover:bg-neon-500/20"
            aria-label="Save name"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-1.5 top-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenMenuId(openMenuId === session.id ? null : session.id)
              }}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity data-[open=true]:opacity-100"
              data-open={openMenuId === session.id}
              aria-label="Conversation options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {openMenuId === session.id && (
              <div
                className="absolute right-0 top-8 z-50 w-36 rounded-lg border border-neon-500/20 bg-midnight-900/95 backdrop-blur-md shadow-xl shadow-black/40 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => handleTogglePin(session, e)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                >
                  {session.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                  {session.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  type="button"
                  onClick={(e) => startRename(session, e)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Rename
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("w-full bg-midnight-950 border-r border-white/5 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 space-y-3">
        <h2 className="text-sm font-semibold text-white/90 px-1">Your Conversations</h2>
        <Button
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 text-white font-medium rounded-full h-10 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-neon-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New conversation
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="relative">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:border-neon-500/50 focus:outline-none focus:ring-1 focus:ring-neon-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Sessions List */}
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
            <p className="text-sm text-white/50">No conversations yet</p>
            <p className="text-xs text-white/30 mt-1">Start talking and it&apos;ll show up here.</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {/* Pinned */}
            {pinned.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-electric-400/70 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-current" />
                  Pinned
                </div>
                <div className="space-y-1">{pinned.map(renderSessionItem)}</div>
              </div>
            )}

            {/* Date groups */}
            {Object.entries(groupedSessions).map(([period, periodSessions]) => {
              if (periodSessions.length === 0) return null
              return (
                <div key={period}>
                  <div className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-2 px-2">
                    {groupLabels[period] ?? period}
                  </div>
                  <div className="space-y-1">{periodSessions.map(renderSessionItem)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[11px] text-white/30">
          <span>
            {sessions.length} {sessions.length === 1 ? "conversation" : "conversations"}
          </span>
        </div>
      </div>
    </div>
  )
}

function sortSessions(list: ChatSession[]): ChatSession[] {
  return [...list].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

// Helper functions
function isToday(date: string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  return checkDate.toDateString() === today.toDateString()
}

function isWithinLast7Days(date: string): boolean {
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
