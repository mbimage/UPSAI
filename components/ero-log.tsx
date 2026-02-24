"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, TrendingUp, Target, Lightbulb, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface EROEntry {
  id: string
  date: string
  event: string
  response: string
  outcome: string
  category: "academic" | "athletic" | "social" | "personal"
  mood: "positive" | "neutral" | "challenging"
  lessons?: string
}

export function EROLog() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<EROEntry[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    event: "",
    response: "",
    outcome: "",
    category: "personal" as EROEntry["category"],
    mood: "neutral" as EROEntry["mood"],
    lessons: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [user])

  const loadEntries = async () => {
    // In a real app, this would fetch from your database
    const mockEntries: EROEntry[] = [
      {
        id: "1",
        date: new Date().toISOString(),
        event: "Coach criticized my performance during practice",
        response: "I felt defensive at first, but then asked for specific feedback",
        outcome: "Got helpful tips on my form and improved by the end of practice",
        category: "athletic",
        mood: "positive",
        lessons: "Asking questions instead of getting defensive leads to growth",
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000).toISOString(),
        event: "Failed my math quiz",
        response: "I was disappointed but scheduled time with my teacher",
        outcome: "Understood my mistakes and retook the quiz successfully",
        category: "academic",
        mood: "positive",
        lessons: "Setbacks are opportunities to learn and improve",
      },
      {
        id: "3",
        date: new Date(Date.now() - 172800000).toISOString(),
        event: "Teammate excluded me from group plans",
        response: "I felt hurt but decided to talk to them directly",
        outcome: "Found out it was a misunderstanding, we're good now",
        category: "social",
        mood: "positive",
        lessons: "Direct communication solves most problems",
      },
    ]

    setEntries(mockEntries)
  }

  const handleSubmit = async () => {
    if (!user?.id || !newEntry.event || !newEntry.response || !newEntry.outcome) return

    setIsSubmitting(true)
    try {
      const entry: EROEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...newEntry,
      }

      // In a real app, this would save to your database
      console.log("Saving E+R=O entry:", entry)

      setEntries([entry, ...entries])
      setNewEntry({
        event: "",
        response: "",
        outcome: "",
        category: "personal",
        mood: "neutral",
        lessons: "",
      })
      setShowAddForm(false)

      // Track this action
      // await trackJourneyStep(user.id, "ero_log_entry", { category: entry.category })
    } catch (error) {
      console.error("Error saving E+R=O entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-500/20 text-blue-400"
      case "athletic":
        return "bg-green-500/20 text-green-400"
      case "social":
        return "bg-purple-500/20 text-purple-400"
      default:
        return "bg-neon-500/20 text-neon-400"
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive":
        return "bg-green-500/20 text-green-400"
      case "challenging":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "positive":
        return "😊"
      case "challenging":
        return "😤"
      default:
        return "😐"
    }
  }

  return (
    <Card className="bg-midnight-900 border-neon-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">E+R=O Log</CardTitle>
            <CardDescription>Track how your responses shape your outcomes</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="bg-neon-500 hover:bg-neon-600">
            <Plus className="w-4 h-4 mr-1" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Entries</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {showAddForm && (
              <Card className="bg-midnight-800 border-neon-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">New E+R=O Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {["academic", "athletic", "social", "personal"].map((cat) => (
                          <Button
                            key={cat}
                            variant={newEntry.category === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewEntry({ ...newEntry, category: cat as any })}
                            className={newEntry.category === cat ? "bg-neon-500 hover:bg-neon-600" : ""}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Mood</label>
                      <div className="flex gap-2">
                        {["positive", "neutral", "challenging"].map((mood) => (
                          <Button
                            key={mood}
                            variant={newEntry.mood === mood ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewEntry({ ...newEntry, mood: mood as any })}
                            className={newEntry.mood === mood ? "bg-neon-500 hover:bg-neon-600" : ""}
                          >
                            {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Event <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      value={newEntry.event}
                      onChange={(e) => setNewEntry({ ...newEntry, event: e.target.value })}
                      placeholder="What happened? Describe the situation..."
                      className="bg-midnight-700 border-neon-500/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Response <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      value={newEntry.response}
                      onChange={(e) => setNewEntry({ ...newEntry, response: e.target.value })}
                      placeholder="How did you respond? What did you think, feel, or do?"
                      className="bg-midnight-700 border-neon-500/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Outcome <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      value={newEntry.outcome}
                      onChange={(e) => setNewEntry({ ...newEntry, outcome: e.target.value })}
                      placeholder="What was the result? How did things turn out?"
                      className="bg-midnight-700 border-neon-500/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Lessons Learned (Optional)</label>
                    <Textarea
                      value={newEntry.lessons}
                      onChange={(e) => setNewEntry({ ...newEntry, lessons: e.target.value })}
                      placeholder="What did you learn? How might you respond differently next time?"
                      className="bg-midnight-700 border-neon-500/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !newEntry.event || !newEntry.response || !newEntry.outcome}
                      className="bg-neon-500 hover:bg-neon-600"
                    >
                      {isSubmitting ? "Saving..." : "Save Entry"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="bg-midnight-800 border-neon-500/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(entry.category)}>{entry.category}</Badge>
                        <Badge className={getMoodColor(entry.mood)}>
                          {getMoodEmoji(entry.mood)} {entry.mood}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-neon-400 mb-1">Event</h4>
                        <p className="text-sm text-gray-300">{entry.event}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-electric-400 mb-1">Response</h4>
                        <p className="text-sm text-gray-300">{entry.response}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-1">Outcome</h4>
                        <p className="text-sm text-gray-300">{entry.outcome}</p>
                      </div>
                      {entry.lessons && (
                        <div>
                          <h4 className="text-sm font-medium text-yellow-400 mb-1 flex items-center">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Lessons Learned
                          </h4>
                          <p className="text-sm text-gray-300 italic">{entry.lessons}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-midnight-800 border-neon-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Growth Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Positive Outcomes</span>
                      <span className="text-sm text-green-400 font-medium">
                        {entries.filter((e) => e.mood === "positive").length}/{entries.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Most Common Category</span>
                      <span className="text-sm text-neon-400 font-medium">Athletic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Entries This Week</span>
                      <span className="text-sm text-electric-400 font-medium">{entries.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-midnight-800 border-neon-500/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-neon-400" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-sm text-gray-300">
                        You're great at turning challenges into learning opportunities
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-sm text-gray-300">
                        Direct communication consistently leads to positive outcomes
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-sm text-gray-300">You show strong resilience in athletic situations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
