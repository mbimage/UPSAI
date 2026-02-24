"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Heart, Target, Zap } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ConfidenceEntry {
  id: string
  date: string
  level: number
  note?: string
  category: "academic" | "athletic" | "social" | "overall"
}

export function ConfidenceCheckIn() {
  const { user } = useAuth()
  const [currentLevel, setCurrentLevel] = useState([75])
  const [note, setNote] = useState("")
  const [category, setCategory] = useState<"academic" | "athletic" | "social" | "overall">("overall")
  const [recentEntries, setRecentEntries] = useState<ConfidenceEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [todayEntry, setTodayEntry] = useState<ConfidenceEntry | null>(null)

  useEffect(() => {
    loadRecentEntries()
  }, [user])

  const loadRecentEntries = async () => {
    // In a real app, this would fetch from your database
    const mockEntries: ConfidenceEntry[] = [
      {
        id: "1",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        level: 72,
        category: "athletic",
        note: "Good practice session, felt strong",
      },
      {
        id: "2",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        level: 68,
        category: "academic",
        note: "Math test was challenging but I prepared well",
      },
      {
        id: "3",
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        level: 80,
        category: "overall",
        note: "Great day overall, feeling positive",
      },
    ]

    setRecentEntries(mockEntries)

    // Check if user already checked in today
    const today = new Date().toDateString()
    const todayEntry = mockEntries.find((entry) => new Date(entry.date).toDateString() === today)
    setTodayEntry(todayEntry || null)
  }

  const handleSubmit = async () => {
    if (!user?.id) return

    setIsSubmitting(true)
    try {
      const newEntry: ConfidenceEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        level: currentLevel[0],
        category,
        note: note.trim() || undefined,
      }

      // In a real app, this would save to your database
      console.log("Saving confidence entry:", newEntry)

      setTodayEntry(newEntry)
      setRecentEntries([newEntry, ...recentEntries.slice(0, 6)])
      setNote("")

      // Track this action
      // await trackJourneyStep(user.id, "confidence_checkin", { level: currentLevel[0], category })
    } catch (error) {
      console.error("Error saving confidence entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getConfidenceColor = (level: number) => {
    if (level >= 80) return "text-green-400"
    if (level >= 60) return "text-neon-400"
    if (level >= 40) return "text-yellow-400"
    return "text-red-400"
  }

  const getConfidenceLabel = (level: number) => {
    if (level >= 90) return "Extremely Confident"
    if (level >= 80) return "Very Confident"
    if (level >= 70) return "Confident"
    if (level >= 60) return "Somewhat Confident"
    if (level >= 40) return "Neutral"
    if (level >= 30) return "Low Confidence"
    return "Very Low Confidence"
  }

  const getTrend = () => {
    if (recentEntries.length < 2) return null
    const recent = recentEntries[0]?.level || 0
    const previous = recentEntries[1]?.level || 0
    const diff = recent - previous

    if (diff > 5) return { icon: TrendingUp, color: "text-green-400", text: `+${diff} points` }
    if (diff < -5) return { icon: TrendingDown, color: "text-red-400", text: `${diff} points` }
    return { icon: Minus, color: "text-gray-400", text: "Stable" }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "academic":
        return <Target className="w-4 h-4" />
      case "athletic":
        return <Zap className="w-4 h-4" />
      case "social":
        return <Heart className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const trend = getTrend()

  return (
    <Card className="bg-midnight-900 border-neon-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Confidence Check-In</CardTitle>
            <CardDescription>How confident are you feeling today?</CardDescription>
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trend.color}`}>
              <trend.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{trend.text}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {todayEntry ? (
          <div className="text-center p-6 bg-midnight-800 rounded-lg border border-neon-500/10">
            <div className="mb-4">
              <div className={`text-3xl font-bold ${getConfidenceColor(todayEntry.level)}`}>{todayEntry.level}%</div>
              <p className="text-gray-400">{getConfidenceLabel(todayEntry.level)}</p>
              <Badge variant="outline" className="mt-2">
                {getCategoryIcon(todayEntry.category)}
                <span className="ml-1 capitalize">{todayEntry.category}</span>
              </Badge>
            </div>
            {todayEntry.note && <p className="text-sm text-gray-300 italic">"{todayEntry.note}"</p>}
            <p className="text-xs text-gray-500 mt-2">✓ Checked in today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "overall", label: "Overall", icon: Target },
                  { key: "athletic", label: "Athletic", icon: Zap },
                  { key: "academic", label: "Academic", icon: Target },
                  { key: "social", label: "Social", icon: Heart },
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={category === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(key as any)}
                    className={category === key ? "bg-neon-500 hover:bg-neon-600" : ""}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-white">Confidence Level</label>
                <span className={`text-lg font-bold ${getConfidenceColor(currentLevel[0])}`}>{currentLevel[0]}%</span>
              </div>
              <Slider
                value={currentLevel}
                onValueChange={setCurrentLevel}
                max={100}
                min={0}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Not Confident</span>
                <span className={getConfidenceColor(currentLevel[0])}>{getConfidenceLabel(currentLevel[0])}</span>
                <span>Very Confident</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                What's influencing your confidence? (Optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share what's making you feel this way..."
                className="bg-midnight-800 border-neon-500/20 text-white"
                rows={3}
              />
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-neon-500 hover:bg-neon-600">
              {isSubmitting ? "Saving..." : "Check In"}
            </Button>
          </div>
        )}

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Recent Check-ins</h4>
            <div className="space-y-2">
              {recentEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg border border-neon-500/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-lg font-bold ${getConfidenceColor(entry.level)}`}>{entry.level}%</div>
                    <div>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(entry.category)}
                        <span className="text-sm text-white capitalize">{entry.category}</span>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-400 max-w-32 truncate" title={entry.note}>
                      "{entry.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
