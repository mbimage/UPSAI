"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Target, Heart, Brain, Zap, Trophy, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionnaireData {
  name: string
  age: string
  sport: string
  position: string
  experience: string
  primaryGoals: string[]
  currentChallenges: string[]
  currentMood: number
  energyLevel: number
  confidenceLevel: number
  stressLevel: number
  motivationLevel: number
  preferredCommunicationStyle: string
  timeAvailable: string
  specificSituation: string
  previousSetbacks: string
  supportSystem: string
  learningStyle: string
}

interface PreChatQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void
  onSkip: () => void
}

const sports = [
  "Basketball",
  "Football",
  "Soccer",
  "Baseball",
  "Softball",
  "Track & Field",
  "Cross Country",
  "Swimming",
  "Tennis",
  "Golf",
  "Wrestling",
  "Volleyball",
  "Gymnastics",
  "Cheerleading",
  "Dance",
  "Other",
]

const goals = [
  "Improve performance under pressure",
  "Build mental toughness",
  "Overcome recent setbacks",
  "Increase confidence",
  "Better team communication",
  "Academic-athletic balance",
  "Injury recovery mindset",
  "Leadership development",
  "Recruitment preparation",
  "Future planning",
]

const challenges = [
  "Performance anxiety",
  "Team conflicts",
  "Academic pressure",
  "Time management",
  "Injury concerns",
  "Coach relationships",
  "Family expectations",
  "Financial stress",
  "Social pressures",
  "Future uncertainty",
]

const communicationStyles = [
  { value: "direct", label: "Direct & Straightforward", description: "Get to the point quickly" },
  { value: "supportive", label: "Supportive & Encouraging", description: "Gentle guidance and motivation" },
  { value: "analytical", label: "Analytical & Detailed", description: "Break down strategies step-by-step" },
  { value: "conversational", label: "Conversational & Friendly", description: "Like talking to a teammate" },
]

const learningStyles = [
  { value: "visual", label: "Visual", description: "Examples, scenarios, and clear steps" },
  { value: "practical", label: "Practical", description: "Real-world applications and action items" },
  { value: "reflective", label: "Reflective", description: "Deep thinking and self-discovery" },
  { value: "interactive", label: "Interactive", description: "Back-and-forth conversation" },
]

export function PreChatQuestionnaire({ onComplete, onSkip }: PreChatQuestionnaireProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<QuestionnaireData>({
    name: "",
    age: "",
    sport: "",
    position: "",
    experience: "",
    primaryGoals: [],
    currentChallenges: [],
    currentMood: 5,
    energyLevel: 5,
    confidenceLevel: 5,
    stressLevel: 5,
    motivationLevel: 5,
    preferredCommunicationStyle: "",
    timeAvailable: "",
    specificSituation: "",
    previousSetbacks: "",
    supportSystem: "",
    learningStyle: "",
  })

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  const updateData = (field: keyof QuestionnaireData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "primaryGoals" | "currentChallenges", item: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.name.trim() && data.age && data.sport
      case 2:
        return data.primaryGoals.length > 0
      case 3:
        return data.currentChallenges.length > 0
      case 4:
        return true // Sliders always have values
      case 5:
        return data.preferredCommunicationStyle && data.learningStyle
      case 6:
        return true // Optional final step
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Let's get to know you</h2>
              <p className="text-neon-200">Help me understand your background so I can provide the best support</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-neon-200">
                  What's your name?
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-midnight-800 border-midnight-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-neon-200">
                  How old are you?
                </Label>
                <Select value={data.age} onValueChange={(value) => updateData("age", value)}>
                  <SelectTrigger className="bg-midnight-800 border-midnight-700 text-white">
                    <SelectValue placeholder="Select your age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 13).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years old
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sport" className="text-neon-200">
                  What sport do you play?
                </Label>
                <Select value={data.sport} onValueChange={(value) => updateData("sport", value)}>
                  <SelectTrigger className="bg-midnight-800 border-midnight-700 text-white">
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {data.sport && data.sport !== "Other" && (
                <div>
                  <Label htmlFor="position" className="text-neon-200">
                    Position/Event (optional)
                  </Label>
                  <Input
                    id="position"
                    value={data.position}
                    onChange={(e) => updateData("position", e.target.value)}
                    placeholder="e.g., Point Guard, Quarterback, 100m"
                    className="bg-midnight-800 border-midnight-700 text-white"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="experience" className="text-neon-200">
                  How long have you been playing?
                </Label>
                <Select value={data.experience} onValueChange={(value) => updateData("experience", value)}>
                  <SelectTrigger className="bg-midnight-800 border-midnight-700 text-white">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Less than 1 year</SelectItem>
                    <SelectItem value="intermediate">1-3 years</SelectItem>
                    <SelectItem value="experienced">4-6 years</SelectItem>
                    <SelectItem value="advanced">7+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">What are your goals?</h2>
              <p className="text-neon-200">Select the areas where you'd like to grow (choose all that apply)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem("primaryGoals", goal)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all duration-200",
                    data.primaryGoals.includes(goal)
                      ? "bg-neon-900/50 border-neon-600 text-neon-100"
                      : "bg-midnight-800/50 border-midnight-700 text-neon-200 hover:border-midnight-600",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal}</span>
                    {data.primaryGoals.includes(goal) && <CheckCircle className="w-5 h-5 text-neon-400" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <Badge variant="outline" className="text-neon-300 border-neon-600">
                {data.primaryGoals.length} selected
              </Badge>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Current challenges</h2>
              <p className="text-neon-200">What's been on your mind lately? (select all that apply)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challenges.map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => toggleArrayItem("currentChallenges", challenge)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all duration-200",
                    data.currentChallenges.includes(challenge)
                      ? "bg-neon-900/50 border-neon-600 text-neon-100"
                      : "bg-midnight-800/50 border-midnight-700 text-neon-200 hover:border-midnight-600",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{challenge}</span>
                    {data.currentChallenges.includes(challenge) && <CheckCircle className="w-5 h-5 text-neon-400" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <Badge variant="outline" className="text-neon-300 border-neon-600">
                {data.currentChallenges.length} selected
              </Badge>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">How are you feeling right now?</h2>
              <p className="text-neon-200">Help me understand your current state so I can match your energy</p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-neon-200 font-medium">Current Mood</Label>
                  <Badge variant="outline" className="text-neon-300 border-neon-600">
                    {data.currentMood}/10
                  </Badge>
                </div>
                <Slider
                  value={[data.currentMood]}
                  onValueChange={(value) => updateData("currentMood", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neon-400 mt-2">
                  <span>Struggling</span>
                  <span>Great</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-neon-200 font-medium">Energy Level</Label>
                  <Badge variant="outline" className="text-neon-300 border-neon-600">
                    {data.energyLevel}/10
                  </Badge>
                </div>
                <Slider
                  value={[data.energyLevel]}
                  onValueChange={(value) => updateData("energyLevel", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neon-400 mt-2">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-neon-200 font-medium">Confidence Level</Label>
                  <Badge variant="outline" className="text-neon-300 border-neon-600">
                    {data.confidenceLevel}/10
                  </Badge>
                </div>
                <Slider
                  value={[data.confidenceLevel]}
                  onValueChange={(value) => updateData("confidenceLevel", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neon-400 mt-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-neon-200 font-medium">Stress Level</Label>
                  <Badge variant="outline" className="text-neon-300 border-neon-600">
                    {data.stressLevel}/10
                  </Badge>
                </div>
                <Slider
                  value={[data.stressLevel]}
                  onValueChange={(value) => updateData("stressLevel", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neon-400 mt-2">
                  <span>Relaxed</span>
                  <span>Stressed</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-neon-200 font-medium">Motivation Level</Label>
                  <Badge variant="outline" className="text-neon-300 border-neon-600">
                    {data.motivationLevel}/10
                  </Badge>
                </div>
                <Slider
                  value={[data.motivationLevel]}
                  onValueChange={(value) => updateData("motivationLevel", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neon-400 mt-2">
                  <span>Unmotivated</span>
                  <span>Fired Up</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Communication preferences</h2>
              <p className="text-neon-200">How do you like to receive coaching and feedback?</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-neon-200 font-medium mb-4 block">Preferred Communication Style</Label>
                <div className="space-y-3">
                  {communicationStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updateData("preferredCommunicationStyle", style.value)}
                      className={cn(
                        "w-full p-4 rounded-lg border text-left transition-all duration-200",
                        data.preferredCommunicationStyle === style.value
                          ? "bg-neon-900/50 border-neon-600 text-neon-100"
                          : "bg-midnight-800/50 border-midnight-700 text-neon-200 hover:border-midnight-600",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{style.label}</span>
                        {data.preferredCommunicationStyle === style.value && (
                          <CheckCircle className="w-5 h-5 text-neon-400" />
                        )}
                      </div>
                      <p className="text-sm text-neon-300">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-neon-200 font-medium mb-4 block">Learning Style</Label>
                <div className="space-y-3">
                  {learningStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updateData("learningStyle", style.value)}
                      className={cn(
                        "w-full p-4 rounded-lg border text-left transition-all duration-200",
                        data.learningStyle === style.value
                          ? "bg-neon-900/50 border-neon-600 text-neon-100"
                          : "bg-midnight-800/50 border-midnight-700 text-neon-200 hover:border-midnight-600",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{style.label}</span>
                        {data.learningStyle === style.value && <CheckCircle className="w-5 h-5 text-neon-400" />}
                      </div>
                      <p className="text-sm text-neon-300">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-neon-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Final details</h2>
              <p className="text-neon-200">Help me provide the most relevant support (optional)</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timeAvailable" className="text-neon-200">
                  How much time do you have today?
                </Label>
                <Select value={data.timeAvailable} onValueChange={(value) => updateData("timeAvailable", value)}>
                  <SelectTrigger className="bg-midnight-800 border-midnight-700 text-white">
                    <SelectValue placeholder="Select time available" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Just a few minutes (quick advice)</SelectItem>
                    <SelectItem value="moderate">10-15 minutes (focused conversation)</SelectItem>
                    <SelectItem value="extended">20+ minutes (deep dive session)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specificSituation" className="text-neon-200">
                  Anything specific you want to talk about today?
                </Label>
                <Textarea
                  id="specificSituation"
                  value={data.specificSituation}
                  onChange={(e) => updateData("specificSituation", e.target.value)}
                  placeholder="e.g., 'Lost our game last night and feeling down' or 'Big game coming up and nervous'"
                  className="bg-midnight-800 border-midnight-700 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="previousSetbacks" className="text-neon-200">
                  Any recent setbacks or challenges?
                </Label>
                <Textarea
                  id="previousSetbacks"
                  value={data.previousSetbacks}
                  onChange={(e) => updateData("previousSetbacks", e.target.value)}
                  placeholder="e.g., injury, poor performance, team issues, academic struggles"
                  className="bg-midnight-800 border-midnight-700 text-white"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="supportSystem" className="text-neon-200">
                  Who's in your support system?
                </Label>
                <Input
                  id="supportSystem"
                  value={data.supportSystem}
                  onChange={(e) => updateData("supportSystem", e.target.value)}
                  placeholder="e.g., parents, coach, teammates, friends"
                  className="bg-midnight-800 border-midnight-700 text-white"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-midnight-900/80 border-midnight-800 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-400" />
              <span className="text-neon-300 font-medium">UpSide AI Setup</span>
            </div>
            <Button variant="ghost" onClick={onSkip} className="text-neon-400 hover:text-neon-300">
              Skip for now
            </Button>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-neon-400">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-midnight-700 text-neon-200 hover:bg-midnight-800 bg-transparent"
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
            >
              {step === totalSteps ? (
                <>
                  Start Chatting
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
