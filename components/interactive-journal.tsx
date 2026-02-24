"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Save, Heart, Target, Zap, Smile, Meh, Frown, Plus, X, MessageSquare } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood: "great" | "good" | "okay" | "tough" | "difficult"
  tags: string[]
  gratitude?: string
  goals?: string
  challenges?: string
  wins?: string
}

interface JournalPrompt {
  id: string
  text: string
  category: "reflection" | "gratitude" | "goals" | "challenges"
}

interface InteractiveJournalProps {
  onEntryUpdate?: (entries: JournalEntry[]) => void
}

const JOURNAL_PROMPTS: JournalPrompt[] = [
  { id: "1", text: "What made you feel proud today?", category: "reflection" },
  { id: "2", text: "What are you grateful for right now?", category: "gratitude" },
  { id: "3", text: "What's one thing you want to accomplish tomorrow?", category: "goals" },
  { id: "4", text: "What challenge did you overcome today?", category: "challenges" },
  { id: "5", text: "How did you grow as a person today?", category: "reflection" },
  { id: "6", text: "Who or what brought you joy today?", category: "gratitude" },
  { id: "7", text: "What skill did you practice or improve?", category: "goals" },
  { id: "8", text: "What would you do differently if you could?", category: "challenges" },
]

export function InteractiveJournal({ onEntryUpdate }: InteractiveJournalProps) {
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: "",
    content: "",
    mood: "good",
    tags: [],
    gratitude: "",
    goals: "",
    challenges: "",
    wins: "",
  })
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null)

  const handlePromptClick = (prompt: JournalPrompt) => {
    setCurrentEntry((prev) => ({
      ...prev,
      content: prev.content ? `${prev.content}\n\n${prompt.text}\n` : `${prompt.text}\n`,
    }))
    setSelectedPrompt(prompt)
  }

  useEffect(() => {
    loadRecentEntries()
    loadTodayEntry()
  }, [])

  useEffect(() => {
    if (onEntryUpdate) {
      onEntryUpdate(recentEntries)
    }
  }, [recentEntries, onEntryUpdate])

  const loadRecentEntries = async () => {
    // In a real app, this would fetch from your database
    const mockEntries: JournalEntry[] = [
      {
        id: "1",
        date: new Date(Date.now() - 86400000).toISOString(),
        title: "Great practice today!",
        content: "Had an amazing basketball practice. My free throws are getting so much better!",
        mood: "great",
        tags: ["basketball", "improvement", "practice"],
        gratitude: "My coach's patience and encouragement",
        wins: "Made 8/10 free throws",
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000).toISOString(),
        title: "Tough day but learned a lot",
        content: "Math test was harder than expected, but I'm proud I didn't give up.",
        mood: "okay",
        tags: ["school", "resilience", "math"],
        challenges: "Time management during the test",
        wins: "Stayed calm under pressure",
      },
    ]
    setRecentEntries(mockEntries)
  }

  const loadTodayEntry = async () => {
    // Check if there's already an entry for today
    const today = new Date().toDateString()
    // In a real app, check database for today's entry
    // For now, start with empty entry
  }

  const handleSave = async () => {
    if (!currentEntry.content?.trim()) return

    setIsSaving(true)
    try {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: currentEntry.title || `Journal Entry - ${new Date().toLocaleDateString()}`,
        content: currentEntry.content.trim(),
        mood: currentEntry.mood || "good",
        tags: currentEntry.tags || [],
        gratitude: currentEntry.gratitude,
        goals: currentEntry.goals,
        challenges: currentEntry.challenges,
        wins: currentEntry.wins,
      }

      // In a real app, this would save to your database
      console.log("Saving journal entry:", newEntry)

      const updatedEntries = [newEntry, ...recentEntries.slice(0, 4)]
      setRecentEntries(updatedEntries)

      // Reset current entry
      setCurrentEntry({
        title: "",
        content: "",
        mood: "good",
        tags: [],
        gratitude: "",
        goals: "",
        challenges: "",
        wins: "",
      })
      setIsExpanded(false)

      // Track this action
      // await trackJourneyStep(user.id, "journal_entry", { mood: newEntry.mood, tags: newEntry.tags })
    } catch (error) {
      console.error("Error saving journal entry:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags?.includes(newTag.trim())) {
      setCurrentEntry((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <Smile className="h-4 w-4 text-green-400" />
      case "good":
        return <Smile className="h-4 w-4 text-blue-400" />
      case "okay":
        return <Meh className="h-4 w-4 text-yellow-400" />
      case "tough":
        return <Frown className="h-4 w-4 text-orange-400" />
      case "difficult":
        return <Frown className="h-4 w-4 text-red-400" />
      default:
        return <Meh className="h-4 w-4 text-gray-400" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "great":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "okay":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "tough":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "difficult":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (!isExpanded) {
    return (
      <div className="space-y-4">
        {/* Quick Entry */}
        <div className="space-y-3">
          <Textarea
            value={currentEntry.content}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="How was your day? What's on your mind?"
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 min-h-[80px] focus:border-blue-500/50"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-slate-300 border-slate-600/50 hover:bg-slate-800/50 bg-transparent"
            >
              <Plus className="h-3 w-3 mr-1" />
              More Options
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-purple-300 border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
            >
              <Link href="/chat" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Chat about this
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !currentEntry.content?.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Save className="h-3 w-3 mr-1" />
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </div>

        {/* Recent Entries Preview */}
        {recentEntries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-200">Recent Entries</h4>
            <div className="space-y-2">
              {recentEntries.slice(0, 2).map((entry) => (
                <div key={entry.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{entry.title}</span>
                    <div className="flex items-center gap-2">
                      {getMoodIcon(entry.mood)}
                      <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{entry.content}</p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600/50 text-slate-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end mt-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-400 hover:text-blue-300 h-6 px-2"
                    >
                      <Link href={`/chat?context=journal&entry=${entry.id}`}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Discuss
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Expanded Journal Entry Form */}
      <div className="space-y-4">
        {/* Title and Mood */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">Entry Title</label>
            <Input
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Give your entry a title..."
              className="bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">How are you feeling?</label>
            <div className="flex gap-2">
              {[
                { value: "great", label: "Great", icon: Smile },
                { value: "good", label: "Good", icon: Smile },
                { value: "okay", label: "Okay", icon: Meh },
                { value: "tough", label: "Tough", icon: Frown },
                { value: "difficult", label: "Difficult", icon: Frown },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={currentEntry.mood === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentEntry((prev) => ({ ...prev, mood: value as any }))}
                  className={
                    currentEntry.mood === value
                      ? getMoodColor(value)
                      : "bg-slate-800/30 border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                  }
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Writing Prompts */}
        <div>
          <label className="text-sm font-medium text-slate-200 mb-2 block">Need inspiration?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {JOURNAL_PROMPTS.slice(0, 4).map((prompt) => (
              <Button
                key={prompt.id}
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick(prompt)}
                className="text-xs text-slate-400 border-slate-700/50 bg-slate-800/30 hover:border-blue-500/50 hover:text-blue-300 hover:bg-slate-700/50"
              >
                {prompt.text.slice(0, 25)}...
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <label className="text-sm font-medium text-slate-200 mb-2 block">Your thoughts</label>
          <Textarea
            value={currentEntry.content}
            onChange={(e) => setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Write about your day, your feelings, your goals, or anything on your mind..."
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 min-h-[120px] focus:border-blue-500/50"
            rows={6}
          />
        </div>

        {/* Structured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-green-300 mb-2 block flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              What I'm grateful for
            </label>
            <Textarea
              value={currentEntry.gratitude}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, gratitude: e.target.value }))}
              placeholder="Something you appreciate today..."
              className="bg-slate-800/50 border-green-500/20 text-slate-200 focus:border-green-500/50"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-300 mb-2 block flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              Today's wins
            </label>
            <Textarea
              value={currentEntry.wins}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, wins: e.target.value }))}
              placeholder="What went well today..."
              className="bg-slate-800/50 border-blue-500/20 text-slate-200 focus:border-blue-500/50"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Goals & plans
            </label>
            <Textarea
              value={currentEntry.goals}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, goals: e.target.value }))}
              placeholder="What you want to work on..."
              className="bg-slate-800/50 border-purple-500/20 text-slate-200 focus:border-purple-500/50"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-orange-300 mb-2 block flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Challenges & lessons
            </label>
            <Textarea
              value={currentEntry.challenges}
              onChange={(e) => setCurrentEntry((prev) => ({ ...prev, challenges: e.target.value }))}
              placeholder="What was difficult and what you learned..."
              className="bg-slate-800/50 border-orange-500/20 text-slate-200 focus:border-orange-500/50"
              rows={2}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-slate-200 mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentEntry.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-blue-300 border-blue-500/30 bg-blue-500/10">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="ml-1 h-3 w-3 p-0 hover:bg-red-500/20"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="bg-slate-800/50 border-slate-700/50 text-slate-200 flex-1 focus:border-blue-500/50"
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <Button
              onClick={addTag}
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-300 bg-transparent hover:bg-blue-500/10"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50"
          >
            Collapse
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-blue-300 border-blue-500/30 hover:bg-blue-500/10 bg-transparent"
          >
            <Link href="/chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Discuss with AI
            </Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !currentEntry.content?.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  )
}
