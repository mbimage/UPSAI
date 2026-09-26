"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Shield, Brain, Trash2, Pencil, Check, X, History, Loader2 } from "lucide-react"

interface Memory {
  id: string
  category: string
  content: string
  createdAt: string
}
interface Conversation {
  id: string
  title: string | null
  messageCount: number | null
  updatedAt: string
}

export default function PrivacyClient({
  initialMemoryEnabled,
  collegeName,
}: {
  initialMemoryEnabled: boolean
  collegeName: string | null
}) {
  const [memoryEnabled, setMemoryEnabled] = useState(initialMemoryEnabled)
  const [savingToggle, setSavingToggle] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [mem, acct] = await Promise.all([
        fetch("/api/memory").then((r) => r.json()),
        fetch("/api/account/data").then((r) => r.json()),
      ])
      setMemories(mem.memories || [])
      setConversations(acct.conversations || [])
    } catch {
      toast.error("Could not load your data. Please refresh.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function toggleMemory() {
    const next = !memoryEnabled
    setSavingToggle(true)
    setMemoryEnabled(next) // optimistic
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryEnabled: next }),
      })
      if (!res.ok) throw new Error()
      toast.success(next ? "Long-term memory is on." : "Long-term memory is off.")
    } catch {
      setMemoryEnabled(!next) // revert
      toast.error("Could not update that setting.")
    } finally {
      setSavingToggle(false)
    }
  }

  async function saveEdit(id: string) {
    const content = editText.trim()
    if (!content) return
    try {
      const res = await fetch("/api/memory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content }),
      })
      if (!res.ok) throw new Error()
      setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)))
      setEditingId(null)
      toast.success("Memory updated.")
    } catch {
      toast.error("Could not update that memory.")
    }
  }

  async function deleteMemory(id: string) {
    try {
      const res = await fetch(`/api/memory?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setMemories((prev) => prev.filter((m) => m.id !== id))
      toast.success("Memory deleted.")
    } catch {
      toast.error("Could not delete that memory.")
    }
  }

  async function clearAllMemories() {
    if (!confirm("Delete all saved memories? This can't be undone.")) return
    try {
      const res = await fetch("/api/memory?all=1", { method: "DELETE" })
      if (!res.ok) throw new Error()
      setMemories([])
      toast.success("All memories cleared.")
    } catch {
      toast.error("Could not clear memories.")
    }
  }

  async function deleteHistory(scope: "history" | "all") {
    const msg =
      scope === "all"
        ? "Delete ALL your conversations and everything UpSide remembers? This can't be undone."
        : "Delete all your conversations and activity history? Saved memories will be kept. This can't be undone."
    if (!confirm(msg)) return
    try {
      const res = await fetch(`/api/account/data?scope=${scope}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setConversations([])
      if (scope === "all") setMemories([])
      toast.success("Your data was deleted.")
    } catch {
      toast.error("Could not delete your data.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-neon-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to chat
        </Link>

        <header className="mt-6 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-400/30 bg-neon-400/10 px-3 py-1">
            <Shield className="h-4 w-4 text-neon-400" />
            <span className="text-xs font-medium text-neon-400">Privacy &amp; memory</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold md:text-3xl text-balance">Your data, your call</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            You decide what UpSide keeps. Turn long-term memory on or off, review what it remembers, and delete anything
            any time.
          </p>
        </header>

        {/* Long-term memory opt-in */}
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-neon-400/10 p-2">
                <Brain className="h-5 w-5 text-neon-400" />
              </div>
              <div>
                <h2 className="font-semibold">Long-term memory</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  When this is on, UpSide can remember durable facts you share (like your goals or your position) to give
                  better guidance over time. When it&apos;s off, UpSide won&apos;t save new long-term memories. This is
                  off until you turn it on.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={memoryEnabled}
              aria-label="Toggle long-term memory"
              disabled={savingToggle}
              onClick={toggleMemory}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                memoryEnabled ? "bg-neon-400" : "bg-muted"
              } disabled:opacity-60`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-transform ${
                  memoryEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Saved memories */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">What UpSide remembers</h2>
            {memories.length > 0 && (
              <button
                type="button"
                onClick={clearAllMemories}
                className="text-xs text-muted-foreground transition-colors hover:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : memories.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Nothing saved yet. {memoryEnabled ? "As you chat, durable facts you share can show up here." : "Turn on long-term memory above if you want UpSide to remember things between chats."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {memories.map((m) => (
                <li key={m.id} className="rounded-xl border border-border bg-background/50 p-3">
                  {editingId === m.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon-400"
                        maxLength={500}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(m.id)} aria-label="Save" className="rounded-lg bg-neon-400/10 p-2 text-neon-400 hover:bg-neon-400/20">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} aria-label="Cancel" className="rounded-lg bg-muted p-2 text-muted-foreground hover:bg-muted/70">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full bg-neon-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neon-400">
                          {m.category}
                        </span>
                        <p className="mt-1.5 text-sm leading-relaxed">{m.content}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => {
                            setEditingId(m.id)
                            setEditText(m.content)
                          }}
                          aria-label="Edit memory"
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMemory(m.id)}
                          aria-label="Delete memory"
                          className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Conversation history */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-neon-400/10 p-2">
              <History className="h-5 w-5 text-neon-400" />
            </div>
            <h2 className="font-semibold">Conversation history</h2>
          </div>
          {loading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You have {conversations.length} saved conversation{conversations.length === 1 ? "" : "s"}. You can delete
              your history any time. Deleting your history keeps your saved memories unless you choose to delete
              everything.
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => deleteHistory("history")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-400/50 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Delete conversation history
            </button>
            <button
              type="button"
              onClick={() => deleteHistory("all")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete everything
            </button>
          </div>
        </section>

        {collegeName && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            You&apos;re connected to {collegeName}. Your chats are private to you and are never shared with your college.
          </p>
        )}
      </div>
    </div>
  )
}
