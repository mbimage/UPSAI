"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react"

export interface QuestionnaireData {
  // Basic Info
  name: string
  age: string
  grade: string
  sport: string
  position: string
  yearsPlaying: string

  // Goals & Challenges
  primaryGoals: string[]
  currentChallenges: string[]
  biggestStruggle: string

  // Current State
  currentMood: number
  energyLevel: number
  confidenceLevel: number
  stressLevel: number
  motivationLevel: number

  // Communication & Learning
  communicationStyle: string
  learningStyle: string
  timeAvailable: string

  // Context
  specificSituation: string
  recentSetback: string
  supportSystem: string

  // Preferences
  preferredTopics: string[]
  wantsParentNotification: boolean
}

interface YouthQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void
  onSkip: () => void
}

const sportsOptions = [
  "Baseball",
  "Basketball",
  "Cross Country",
  "Football",
  "Golf",
  "Soccer",
  "Softball",
  "Swimming",
  "Tennis",
  "Track and Field",
  "Volleyball",
  "Wrestling",
  "Cheerleading",
  "Dance Team",
  "Lacrosse",
  "Hockey",
  "Gymnastics",
  "Bowling",
  "Powerlifting",
  "Band/Marching Band",
  "Debate Team",
  "Academic Decathlon",
  "Other",
]

const goalOptions = [
  "Build confidence",
  "Handle pressure better",
  "Improve focus",
  "Deal with setbacks",
  "Better teamwork",
  "Time management",
  "Academic balance",
  "Leadership skills",
  "Mental toughness",
  "Communication skills",
]

const challengeOptions = [
  "Performance anxiety",
  "Team conflicts",
  "Coach pressure",
  "Academic stress",
  "Time management",
  "Injury recovery",
  "Self-doubt",
  "Family expectations",
  "Social media pressure",
  "Future uncertainty",
]

const topicOptions = [
  "Sports psychology",
  "Study strategies",
  "Social situations",
  "Family relationships",
  "Future planning",
  "Stress management",
  "Building resilience",
  "Leadership development",
]

export function YouthQuestionnaire({ onComplete, onSkip }: YouthQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<QuestionnaireData>({
    name: "",
    age: "",
    grade: "",
    sport: "",
    position: "",
    yearsPlaying: "",
    primaryGoals: [],
    currentChallenges: [],
    biggestStruggle: "",
    currentMood: 5,
    energyLevel: 5,
    confidenceLevel: 5,
    stressLevel: 5,
    motivationLevel: 5,
    communicationStyle: "",
    learningStyle: "",
    timeAvailable: "",
    specificSituation: "",
    recentSetback: "",
    supportSystem: "",
    preferredTopics: [],
    wantsParentNotification: false,
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((item) => item !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.grade
      case 2:
        return formData.sport
      case 3:
        return formData.primaryGoals.length > 0
      case 4:
        return true // Mood sliders are optional
      case 5:
        return true // Final step is optional
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-midnight-800/80 border-midnight-700 shadow-2xl shadow-neon-500/10">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-neon-400 animate-pulse-slow" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">Let's Get to Know You!</CardTitle>
          <p className="text-neon-200 text-sm">
            This helps me provide better, more personalized support for your journey.
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-neon-400 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-neon-200">
                  What's your first name?
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your first name"
                  className="bg-midnight-700 border-midnight-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-neon-200">
                    Age
                  </Label>
                  <Select value={formData.age} onValueChange={(value) => handleInputChange("age", value)}>
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="17">17</SelectItem>
                      <SelectItem value="18">18</SelectItem>
                      <SelectItem value="19">19</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-neon-200">
                    Grade
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th Grade (Freshman)</SelectItem>
                      <SelectItem value="10th">10th Grade (Sophomore)</SelectItem>
                      <SelectItem value="11th">11th Grade (Junior)</SelectItem>
                      <SelectItem value="12th">12th Grade (Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Sports Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">Your Sport/Activity</h3>

              <div className="space-y-2">
                <Label htmlFor="sport" className="text-neon-200">
                  What sport or activity do you participate in?
                </Label>
                <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                  <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                    <SelectValue placeholder="Select your sport/activity" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {sportsOptions.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.sport === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-sport" className="text-neon-200">
                    Please specify your sport/activity
                  </Label>
                  <Input
                    id="custom-sport"
                    value={formData.position} // Using position field temporarily for custom sport
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="Enter your sport/activity"
                    className="bg-midnight-700 border-midnight-600 text-white"
                  />
                </div>
              )}

              {formData.sport && formData.sport !== "Other" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-neon-200">
                      Position/Role (optional)
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      placeholder="Your position or role"
                      className="bg-midnight-700 border-midnight-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years" className="text-neon-200">
                      Years participating
                    </Label>
                    <Select
                      value={formData.yearsPlaying}
                      onValueChange={(value) => handleInputChange("yearsPlaying", value)}
                    >
                      <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Less than 1 year</SelectItem>
                        <SelectItem value="2">1-2 years</SelectItem>
                        <SelectItem value="3">3-4 years</SelectItem>
                        <SelectItem value="4">5-6 years</SelectItem>
                        <SelectItem value="5">7+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Goals & Challenges */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">What You Want to Work On</h3>

              <div className="space-y-3">
                <Label className="text-neon-200">What are your main goals? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.primaryGoals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle("primaryGoals", goal)}
                        className="border-midnight-600"
                      />
                      <Label htmlFor={goal} className="text-sm text-neon-200 cursor-pointer">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-neon-200">Current challenges? (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {challengeOptions.map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.currentChallenges.includes(challenge)}
                        onCheckedChange={() => handleArrayToggle("currentChallenges", challenge)}
                        className="border-midnight-600"
                      />
                      <Label htmlFor={challenge} className="text-sm text-neon-200 cursor-pointer">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Current State */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-neon-300 mb-4">How Are You Feeling Right Now?</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-neon-200">Overall mood (1 = rough day, 10 = great day)</Label>
                  <Slider
                    value={[formData.currentMood]}
                    onValueChange={(value) => handleInputChange("currentMood", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neon-400">
                    <span>Rough day</span>
                    <span className="text-neon-300 font-medium">{formData.currentMood}</span>
                    <span>Great day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-neon-200">Energy level</Label>
                  <Slider
                    value={[formData.energyLevel]}
                    onValueChange={(value) => handleInputChange("energyLevel", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neon-400">
                    <span>Drained</span>
                    <span className="text-neon-300 font-medium">{formData.energyLevel}</span>
                    <span>Energized</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-neon-200">Confidence level</Label>
                  <Slider
                    value={[formData.confidenceLevel]}
                    onValueChange={(value) => handleInputChange("confidenceLevel", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neon-400">
                    <span>Low confidence</span>
                    <span className="text-neon-300 font-medium">{formData.confidenceLevel}</span>
                    <span>Very confident</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Communication & Context */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">Final Questions</h3>

              <div className="space-y-2">
                <Label className="text-neon-200">How do you prefer to communicate?</Label>
                <Select
                  value={formData.communicationStyle}
                  onValueChange={(value) => handleInputChange("communicationStyle", value)}
                >
                  <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                    <SelectValue placeholder="Choose your style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct and to-the-point</SelectItem>
                    <SelectItem value="supportive">Supportive and encouraging</SelectItem>
                    <SelectItem value="analytical">Detailed explanations</SelectItem>
                    <SelectItem value="casual">Casual and friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situation" className="text-neon-200">
                  Anything specific you want to talk about today? (Optional)
                </Label>
                <Textarea
                  id="situation"
                  value={formData.specificSituation}
                  onChange={(e) => handleInputChange("specificSituation", e.target.value)}
                  placeholder="e.g., 'Lost our big game last night' or 'Stressed about college applications'"
                  className="bg-midnight-700 border-midnight-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parent-notification"
                  checked={formData.wantsParentNotification}
                  onCheckedChange={(checked) => handleInputChange("wantsParentNotification", checked)}
                  className="border-midnight-600"
                />
                <Label htmlFor="parent-notification" className="text-sm text-neon-200">
                  I'd like my parent/guardian to know I'm using UpSide AI for support
                </Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-midnight-600 text-neon-300 hover:bg-midnight-700 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}

              <Button variant="ghost" onClick={onSkip} className="text-neon-400 hover:text-neon-300">
                Skip for now
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white shadow-lg shadow-neon-500/30"
            >
              {currentStep === totalSteps ? "Start Chatting" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
