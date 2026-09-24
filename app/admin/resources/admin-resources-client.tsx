"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, ShieldCheck, Plus, Trash2, Eye, EyeOff, CheckCircle2, Circle, Loader2 } from "lucide-react"

interface AdminCollege {
  collegeId: string
  collegeName: string
  role: string
}
interface Resource {
  id: string
  collegeId: string
  category: string
  name: string
  description: string | null
  contactType: string | null
  contactValue: string | null
  url: string | null
  verified: boolean
  active: boolean
}

const CATEGORIES = ["academics", "athletics", "wellness", "career", "financial", "compliance", "general"]

const EMPTY = {
  category: "academics",
  name: "",
  description: "",
  contactType: "",
  contactValue: "",
  url: "",
}

export default function AdminResourcesClient({ colleges }: { colleges: AdminCollege[] }) {
  const [collegeId, setCollegeId] = useState(colleges[0].collegeId)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  const currentCollege = colleges.find((c) => c.collegeId === collegeId)

  const load = useCallback(async (cid: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/resources?collegeId=${cid}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResources(data.resources || [])
    } catch {
      toast.error("Could not load resources.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(collegeId)
  }, [collegeId, load])

  async function addResource(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Give the resource a name.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, collegeId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Resource added and approved.")
      setForm({ ...EMPTY })
      load(collegeId)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add the resource.")
    } finally {
      setSaving(false)
    }
  }

  async function patchResource(id: string, updates: Partial<Resource>) {
    try {
      const res = await fetch("/api/admin/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) throw new Error()
      setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    } catch {
      toast.error("Could not update the resource.")
    }
  }

  async function deleteResource(id: string) {
    if (!confirm("Delete this resource? Athletes will no longer see it in chat.")) return
    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setResources((prev) => prev.filter((r) => r.id !== id))
      toast.success("Resource deleted.")
    } catch {
      toast.error("Could not delete the resource.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-neon-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to chat
        </Link>

        <header className="mt-6 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-400/30 bg-neon-400/10 px-3 py-1">
            <ShieldCheck className="h-4 w-4 text-neon-400" />
            <span className="text-xs font-medium text-neon-400">College admin</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold md:text-3xl text-balance">Approved resources</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
            These are the only campus-specific resources UpSide is allowed to name for your athletes. Anything you add
            here is treated as verified. If it&apos;s not on this list, the chat will point athletes to a general office
            instead of guessing.
          </p>
        </header>

        {colleges.length > 1 && (
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium">College</label>
            <select
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-neon-400"
            >
              {colleges.map((c) => (
                <option key={c.collegeId} value={c.collegeId}>
                  {c.collegeName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add form */}
        <form onSubmit={addResource} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4 text-neon-400" />
            Add a resource {currentCollege ? `for ${currentCollege.collegeName}` : ""}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c[0].toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Academic Advising Center"
                maxLength={160}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What this resource helps with."
                rows={2}
                maxLength={600}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Contact type</label>
              <input
                value={form.contactType}
                onChange={(e) => setForm((f) => ({ ...f, contactType: e.target.value }))}
                placeholder="email / phone / office"
                maxLength={40}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Contact value</label>
              <input
                value={form.contactValue}
                onChange={(e) => setForm((f) => ({ ...f, contactValue: e.target.value }))}
                placeholder="advising@college.edu"
                maxLength={200}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Link (optional)</label>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://college.edu/advising"
                maxLength={300}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-neon-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neon-400 px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add resource
          </button>
        </form>

        {/* List */}
        <section className="mt-6">
          <h2 className="mb-3 font-semibold">
            Current resources {!loading && <span className="text-muted-foreground">({resources.length})</span>}
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : resources.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
              No resources yet. Add your first one above so UpSide can point athletes to the right place.
            </p>
          ) : (
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neon-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neon-400">
                          {r.category}
                        </span>
                        <span className="font-medium">{r.name}</span>
                        {!r.active && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </div>
                      {r.description && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.description}</p>}
                      {(r.contactValue || r.url) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {r.contactValue ? `${r.contactType || "contact"}: ${r.contactValue}` : ""}
                          {r.contactValue && r.url ? " · " : ""}
                          {r.url ? r.url : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => patchResource(r.id, { active: !r.active })}
                        aria-label={r.active ? "Hide from chat" : "Show in chat"}
                        title={r.active ? "Hide from chat" : "Show in chat"}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {r.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteResource(r.id)}
                        aria-label="Delete resource"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <button
                      onClick={() => patchResource(r.id, { verified: !r.verified })}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        r.verified ? "text-neon-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r.verified ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                      {r.verified ? "Verified (chat can use this)" : "Mark verified"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
