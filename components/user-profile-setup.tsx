"use client"

import { useState, useEffect } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface UserProfile {
  name: string
  sport?: string
  grade?: string
  school?: string
  position?: string
  yearsPlaying?: string
  biggestChallenge?: string
  confidenceSource?: string
  pressureHandling?: string
  biggestDream?: string
  supportSystem?: string
  motivation?: string
  celebrationStyle?: string
  improvementArea?: string
}

interface UserProfileSetupProps {
  onComplete: (profile: UserProfile) => void
  onSkip: () => void
}

export function UserProfileSetup({ onComplete, onSkip }: UserProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    sport: "",
    grade: "",
    school: "",
    position: "",
    yearsPlaying: "",
    biggestChallenge: "",
    confidenceSource: "",
    pressureHandling: "",
    biggestDream: "",
    supportSystem: "",
    motivation: "",
    celebrationStyle: "",
    improvementArea: "",
  })
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [visibleSports, setVisibleSports] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const sports = [
    "Football",
    "Basketball",
    "Baseball",
    "Softball",
    "Soccer",
    "Track & Field",
    "Cross Country",
    "Tennis",
    "Golf",
    "Swimming",
    "Wrestling",
    "Volleyball",
    "Cheerleading",
    "Dance Team",
    "Gymnastics",
    "Lacrosse",
    "Field Hockey",
    "Water Polo",
    "Bowling",
    "Powerlifting",
    "Rodeo",
    "Equestrian",
    "Martial Arts",
    "Esports",
    "Band/Marching Band",
    "Academic Decathlon",
    "Debate Team",
    "Other",
  ]

  const grades = ["9th Grade", "10th Grade", "11th Grade", "12th Grade", "College"]

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(profile)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Filter sports based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = sports.filter((sport) => sport.toLowerCase().includes(searchTerm.toLowerCase()))
      setVisibleSports(filtered)
    } else {
      setVisibleSports(sports)
    }
  }, [searchTerm])

  return (
    <div className="fixed inset-0 bg-midnight-950/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-midnight-900/90 border border-neon-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-neon-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-neon-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Let's personalize your experience</h2>
          <p className="text-gray-400 text-sm">Help me get to know you better so I can provide more relevant support</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1 bg-neon-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-neon-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Step {step} of 4</p>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 mb-6">
          {/* Step Content */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">What should I call you?</h3>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your first name"
                className="w-full p-4 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">What sport do you play?</h3>

              {/* Search input for sports */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sports..."
                  className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {visibleSports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setProfile({ ...profile, sport })}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      profile.sport === sport
                        ? "border-neon-500 bg-neon-500/20 text-white"
                        : "border-neon-500/20 bg-midnight-800/80 text-gray-300 hover:bg-neon-500/10"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>

              {visibleSports.length === 0 && (
                <p className="text-center text-gray-400 my-4">No sports match your search</p>
              )}

              {profile.sport && (
                <>
                  <h3 className="text-lg font-medium text-white mt-4 mb-2">Tell me more about your sport</h3>
                  <input
                    type="text"
                    value={profile.school || ""}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    placeholder="School"
                    className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
                  />
                  <input
                    type="text"
                    value={profile.position || ""}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    placeholder="Position/Role"
                    className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
                  />
                  <input
                    type="text"
                    value={profile.yearsPlaying || ""}
                    onChange={(e) => setProfile({ ...profile, yearsPlaying: e.target.value })}
                    placeholder="Years Playing"
                    className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent"
                  />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Let's get personal</h3>
              <input
                type="text"
                value={profile.biggestChallenge || ""}
                onChange={(e) => setProfile({ ...profile, biggestChallenge: e.target.value })}
                placeholder="What's your biggest challenge right now?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.confidenceSource || ""}
                onChange={(e) => setProfile({ ...profile, confidenceSource: e.target.value })}
                placeholder="What makes you feel most confident?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.pressureHandling || ""}
                onChange={(e) => setProfile({ ...profile, pressureHandling: e.target.value })}
                placeholder="How do you usually handle pressure?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.biggestDream || ""}
                onChange={(e) => setProfile({ ...profile, biggestDream: e.target.value })}
                placeholder="What's your biggest dream or aspiration?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Deeper Connection</h3>
              <input
                type="text"
                value={profile.supportSystem || ""}
                onChange={(e) => setProfile({ ...profile, supportSystem: e.target.value })}
                placeholder="What's your support system like? (Family, friends, coaches)"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.motivation || ""}
                onChange={(e) => setProfile({ ...profile, motivation: e.target.value })}
                placeholder="What motivates you when things get tough?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.celebrationStyle || ""}
                onChange={(e) => setProfile({ ...profile, celebrationStyle: e.target.value })}
                placeholder="How do you like to celebrate wins?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent mb-2"
              />
              <input
                type="text"
                value={profile.improvementArea || ""}
                onChange={(e) => setProfile({ ...profile, improvementArea: e.target.value })}
                placeholder="What's something you're working on improving?"
                className="w-full p-3 rounded-lg border border-neon-500/20 bg-midnight-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-500/50 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Fixed Actions at Bottom */}
        <div className="border-t border-neon-500/20 pt-4 flex justify-between items-center">
          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-neon-500/20 text-gray-400 hover:bg-neon-500/10 transition-colors text-sm"
              >
                Back
              </button>
            )}
            <button
              onClick={onSkip}
              className="px-4 py-2 rounded-lg border border-neon-500/20 text-gray-400 hover:bg-neon-500/10 transition-colors text-sm"
            >
              Skip
            </button>
          </div>
          <button
            onClick={handleNext}
            disabled={step === 1 && !profile.name.trim()}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${
              step === 1 && !profile.name.trim()
                ? "bg-neon-500/30 text-gray-400 cursor-not-allowed"
                : "bg-neon-600 hover:bg-neon-700 text-white shadow-lg shadow-neon-500/30"
            }`}
          >
            {step === 4 ? "Start Chatting" : "Next"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
