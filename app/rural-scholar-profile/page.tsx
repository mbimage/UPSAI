"use client"

import { useState } from "react"
import {
  RuralScholarAthleteQuestionnaire,
  type RuralScholarAthleteData,
} from "@/components/rural-scholar-athlete-questionnaire"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle, MapPin, GraduationCap, Target } from "lucide-react"

export default function RuralScholarProfilePage() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [profileData, setProfileData] = useState<RuralScholarAthleteData | null>(null)
  const router = useRouter()

  const handleQuestionnaireComplete = (data: RuralScholarAthleteData) => {
    // Save questionnaire data
    localStorage.setItem("upside_rural_scholar_data", JSON.stringify(data))
    localStorage.setItem("upside_rural_scholar_completed", "true")
    setProfileData(data)
    setIsCompleted(true)
  }

  const handleSkipQuestionnaire = () => {
    localStorage.setItem("upside_rural_scholar_completed", "true")
    router.push("/chat")
  }

  const handleGoToChat = () => {
    router.push("/chat")
  }

  if (isCompleted && profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-midnight-800/80 border-midnight-700 shadow-2xl shadow-neon-500/10">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-neon-400 animate-pulse-slow" />
            </div>
            <CardTitle className="text-2xl text-white mb-2">Profile Complete! 🎉</CardTitle>
            <p className="text-neon-200">
              Thanks for sharing your story, {profileData.name}! Your profile will help us provide personalized guidance
              that understands your unique rural scholar-athlete journey.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-midnight-700/50 rounded-lg border border-midnight-600">
                <MapPin className="w-8 h-8 text-neon-400" />
                <div>
                  <p className="text-sm text-neon-300">Location</p>
                  <p className="text-white font-medium">{profileData.state}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-midnight-700/50 rounded-lg border border-midnight-600">
                <GraduationCap className="w-8 h-8 text-neon-400" />
                <div>
                  <p className="text-sm text-neon-300">Grade</p>
                  <p className="text-white font-medium">{profileData.grade}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-midnight-700/50 rounded-lg border border-midnight-600">
                <Target className="w-8 h-8 text-neon-400" />
                <div>
                  <p className="text-sm text-neon-300">Sport</p>
                  <p className="text-white font-medium">{profileData.sport}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGoToChat}
                className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white shadow-lg shadow-neon-500/30 px-8 py-3"
              >
                Start Chatting with Your AI Teammate
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-neon-400">
                Your profile is saved locally and will be used to personalize your UpSide AI experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <RuralScholarAthleteQuestionnaire onComplete={handleQuestionnaireComplete} onSkip={handleSkipQuestionnaire} />
}
