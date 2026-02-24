"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { setUserPreference } from "@/lib/user-history-service"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"

interface UserPreferencesProps {
  onComplete?: () => void
}

export function UserPreferences({ onComplete }: UserPreferencesProps) {
  const { user } = useAuth()
  const [communicationStyle, setCommunicationStyle] = useState<string>("balanced")
  const [topicPreferences, setTopicPreferences] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const topics = [
    { id: "self-confidence", label: "Self-confidence" },
    { id: "emotional-intelligence", label: "Emotional intelligence" },
    { id: "team-dynamics", label: "Team dynamics" },
    { id: "time-management", label: "Time management" },
    { id: "career-planning", label: "Career planning" },
    { id: "academic-success", label: "Academic success" },
    { id: "stress-management", label: "Stress management" },
    { id: "leadership", label: "Leadership" },
  ]

  // Load existing preferences when component mounts
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return

      try {
        // Fetch preferences from Supabase
        const { data: commStyleData } = await supabase
          .from("user_preferences")
          .select("value")
          .eq("user_id", user.id)
          .eq("key", "communicationStyle")
          .single()

        if (commStyleData) {
          setCommunicationStyle(commStyleData.value)
        }

        const { data: topicsData } = await supabase
          .from("user_preferences")
          .select("value")
          .eq("user_id", user.id)
          .eq("key", "topicPreferences")
          .single()

        if (topicsData && Array.isArray(topicsData.value)) {
          setTopicPreferences(topicsData.value)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }

    loadPreferences()
  }, [user])

  const handleSavePreferences = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Save communication style preference
      await setUserPreference(user.id, "communicationStyle", communicationStyle)

      // Save topic preferences
      await setUserPreference(user.id, "topicPreferences", topicPreferences)

      toast({
        title: "Preferences saved",
        description: "Your personalization preferences have been updated.",
      })

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-midnight-900 border-neon-500/20 text-white">
      <CardHeader>
        <CardTitle className="text-xl text-neon-500">Personalization Preferences</CardTitle>
        <CardDescription className="text-gray-400">
          Customize how the AI communicates with you for a more personalized experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-200">Communication Style</h3>
          <RadioGroup
            value={communicationStyle}
            onValueChange={setCommunicationStyle}
            className="grid grid-cols-1 gap-2"
          >
            <div className="flex items-center space-x-2 rounded-md border border-midnight-700 p-3 hover:bg-midnight-800">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="flex-1 cursor-pointer">
                <div className="font-medium">Direct & Concise</div>
                <div className="text-xs text-gray-400">Straightforward information with minimal explanation</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-midnight-700 p-3 hover:bg-midnight-800">
              <RadioGroupItem value="supportive" id="supportive" />
              <Label htmlFor="supportive" className="flex-1 cursor-pointer">
                <div className="font-medium">Supportive & Encouraging</div>
                <div className="text-xs text-gray-400">Extra encouragement and positive reinforcement</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-midnight-700 p-3 hover:bg-midnight-800">
              <RadioGroupItem value="analytical" id="analytical" />
              <Label htmlFor="analytical" className="flex-1 cursor-pointer">
                <div className="font-medium">Analytical & Detailed</div>
                <div className="text-xs text-gray-400">In-depth explanations with data and reasoning</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-midnight-700 p-3 hover:bg-midnight-800">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                <div className="font-medium">Balanced</div>
                <div className="text-xs text-gray-400">A mix of approaches based on the context</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-200">Topics of Interest</h3>
          <p className="text-xs text-gray-400">Select topics you'd like to focus on</p>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-2">
                <Checkbox
                  id={topic.id}
                  checked={topicPreferences.includes(topic.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTopicPreferences([...topicPreferences, topic.id])
                    } else {
                      setTopicPreferences(topicPreferences.filter((id) => id !== topic.id))
                    }
                  }}
                />
                <Label htmlFor={topic.id} className="text-sm cursor-pointer">
                  {topic.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
