"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

const ONBOARDING_STEPS = [
  { id: "basic", title: "Basic Info", description: "Tell us about yourself" },
  { id: "athletics", title: "Athletics", description: "Your sports background" },
  { id: "goals", title: "Goals & Challenges", description: "What you want to achieve" },
  { id: "preferences", title: "Preferences", description: "How you like to learn" },
]

const SPORTS_OPTIONS = [
  "Basketball",
  "Football",
  "Soccer",
  "Baseball",
  "Softball",
  "Track & Field",
  "Cross Country",
  "Tennis",
  "Golf",
  "Swimming",
  "Wrestling",
  "Volleyball",
  "Cheerleading",
  "Band",
  "Other",
]

const GRADE_OPTIONS = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]

const GOAL_OPTIONS = [
  "Improve confidence",
  "Better leadership skills",
  "Manage anxiety",
  "Team communication",
  "College preparation",
  "Career planning",
  "Time management",
  "Stress management",
  "Social skills",
  "Academic performance",
  "Athletic performance",
  "Personal growth",
]

const CHALLENGE_OPTIONS = [
  "Pre-game anxiety",
  "Team conflicts",
  "Academic pressure",
  "Time management",
  "Social situations",
  "Leadership challenges",
  "Performance pressure",
  "Future planning",
  "Family expectations",
  "Financial concerns",
  "Injury recovery",
  "Motivation",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade: "",
    school: "",
    sport: "",
    position: "",
    goals: [] as string[],
    challenges: [] as string[],
    communication_style: "balanced" as "direct" | "supportive" | "analytical" | "balanced",
  })

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "goals" | "challenges", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-lg">First Name</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => updateFormData("first_name", e.target.value)}
                placeholder="Your first name"
                className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2"
              />
            </div>
            <div>
              <Label className="text-white text-lg">Last Name</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => updateFormData("last_name", e.target.value)}
                placeholder="Your last name"
                className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2"
              />
            </div>
            <div>
              <Label className="text-white text-lg">Grade Level</Label>
              <Select value={formData.grade} onValueChange={(value) => updateFormData("grade", value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2">
                  <SelectValue placeholder="Select your grade level" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white text-lg">School</Label>
              <Input
                value={formData.school}
                onChange={(e) => updateFormData("school", e.target.value)}
                placeholder="Your school name"
                className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-lg">Primary Sport/Activity</Label>
              <Select value={formData.sport} onValueChange={(value) => updateFormData("sport", value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2">
                  <SelectValue placeholder="Select your sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS_OPTIONS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white text-lg">Position (Optional)</Label>
              <Input
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
                placeholder="Your position or role"
                className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white text-lg font-medium mb-4 block">What are your goals?</Label>
              <div className="space-y-3 max-h-40 overflow-y-auto bg-white/5 p-4 rounded-lg">
                {GOAL_OPTIONS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-3">
                    <Checkbox
                      id={`goal-${goal}`}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={() => toggleArrayItem("goals", goal)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={`goal-${goal}`} className="text-white cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-white text-lg font-medium mb-4 block">What challenges do you face?</Label>
              <div className="space-y-3 max-h-40 overflow-y-auto bg-white/5 p-4 rounded-lg">
                {CHALLENGE_OPTIONS.map((challenge) => (
                  <div key={challenge} className="flex items-center space-x-3">
                    <Checkbox
                      id={`challenge-${challenge}`}
                      checked={formData.challenges.includes(challenge)}
                      onCheckedChange={() => toggleArrayItem("challenges", challenge)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={`challenge-${challenge}`} className="text-white cursor-pointer">
                      {challenge}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white text-lg">How do you prefer to receive feedback?</Label>
              <Select
                value={formData.communication_style}
                onValueChange={(value: any) => updateFormData("communication_style", value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-14 text-lg mt-2">
                  <SelectValue placeholder="Select your preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct and straightforward</SelectItem>
                  <SelectItem value="supportive">Supportive and encouraging</SelectItem>
                  <SelectItem value="analytical">Data-driven and detailed</SelectItem>
                  <SelectItem value="balanced">Balanced approach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-white text-2xl font-bold">{ONBOARDING_STEPS[currentStep].title}</h1>
          <p className="text-gray-400 mt-1">{ONBOARDING_STEPS[currentStep].description}</p>
          <div className="flex items-center justify-between mt-4">
            <Progress value={progress} className="flex-1 h-3 bg-white/10" />
            <span className="text-gray-400 ml-4 text-sm">
              {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area - Fixed Height */}
      <div className="flex-1 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">{renderStep()}</div>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION - ALWAYS VISIBLE */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-md border-t border-white/20 p-4 z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-16 text-lg font-medium border-white/30 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          )}

          <Button
            onClick={handleNext}
            className="flex-1 h-16 bg-neon-600 hover:bg-neon-700 text-white font-bold text-lg"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="h-6 w-6 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-6 w-6 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
