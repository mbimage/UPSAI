"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Trophy,
  BookOpen,
  Users,
  Heart,
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: "academic" | "athletic" | "social" | "personal" | "career"
  priority: "high" | "medium" | "low"
  timeframe: "daily" | "weekly" | "monthly" | "semester" | "yearly"
  steps: string[]
  motivation: string
  successMetrics: string
  createdAt: Date
}

const goalTemplates = {
  academic: [
    { title: "Improve my grades in math", steps: ["Study 30 min daily", "Ask teacher for help", "Join study group"] },
    { title: "Read more books this semester", steps: ["Set reading schedule", "Join library", "Track progress"] },
    { title: "Better time management", steps: ["Use planner", "Set priorities", "Avoid distractions"] },
  ],
  athletic: [
    { title: "Make the varsity team", steps: ["Practice daily", "Work with coach", "Improve fitness"] },
    { title: "Improve my performance", steps: ["Set training schedule", "Track progress", "Get feedback"] },
    { title: "Be a better teammate", steps: ["Support others", "Communicate well", "Show up consistently"] },
  ],
  social: [
    { title: "Make new friends", steps: ["Join clubs", "Be more outgoing", "Show genuine interest"] },
    { title: "Improve communication", steps: ["Practice active listening", "Ask questions", "Be authentic"] },
    { title: "Build confidence in groups", steps: ["Start small", "Prepare topics", "Practice speaking up"] },
  ],
  personal: [
    {
      title: "Build self-confidence",
      steps: ["Daily affirmations", "Celebrate small wins", "Challenge negative thoughts"],
    },
    { title: "Manage stress better", steps: ["Learn breathing techniques", "Exercise regularly", "Talk to someone"] },
    { title: "Develop leadership skills", steps: ["Take on responsibilities", "Help others", "Learn from leaders"] },
  ],
  career: [
    { title: "Explore career options", steps: ["Research careers", "Talk to professionals", "Try internships"] },
    { title: "Build job skills", steps: ["Learn new skills", "Practice interviews", "Build resume"] },
    { title: "Plan for college", steps: ["Research schools", "Prepare applications", "Visit campuses"] },
  ],
}

export function GoalCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [customGoal, setCustomGoal] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    timeframe: "monthly",
    steps: [],
    motivation: "",
    successMetrics: "",
  })
  const [newStep, setNewStep] = useState("")

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const categoryIcons = {
    academic: BookOpen,
    athletic: Trophy,
    social: Users,
    personal: Heart,
    career: Target,
  }

  const addStep = () => {
    if (newStep.trim()) {
      setCustomGoal((prev) => ({
        ...prev,
        steps: [...(prev.steps || []), newStep.trim()],
      }))
      setNewStep("")
    }
  }

  const removeStep = (index: number) => {
    setCustomGoal((prev) => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleTemplateSelect = (template: any, category: string) => {
    setSelectedTemplate(template)
    setCustomGoal((prev) => ({
      ...prev,
      title: template.title,
      category: category as any,
      steps: [...template.steps],
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const createGoal = () => {
    // Here you would save the goal to your database
    console.log("Creating goal:", customGoal)
    // Reset wizard or redirect to goals page
  }

  return (
    <Card className="max-w-4xl mx-auto bg-midnight-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-neon-400" />
              Create Your Goal
            </CardTitle>
            <CardDescription>Let's build a goal that's perfect for you!</CardDescription>
          </div>
          <Badge variant="outline" className="text-neon-300 border-neon-500/30">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Choose Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">What area do you want to grow in?</h3>
              <p className="text-gray-400">Choose the category that matters most to you right now</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryIcons).map(([category, Icon]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category
                      ? "border-neon-500 bg-neon-500/10"
                      : "border-gray-600 hover:border-gray-500 bg-midnight-800/50"
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedCategory === category ? "text-neon-400" : "text-gray-400"
                    }`}
                  />
                  <div className="text-white font-medium capitalize">{category}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Template or Custom */}
        {currentStep === 2 && selectedCategory && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Pick a starting point</h3>
              <p className="text-gray-400">Choose a template or start from scratch</p>
            </div>

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-midnight-800/50">
                <TabsTrigger value="templates">Popular Goals</TabsTrigger>
                <TabsTrigger value="custom">Start Fresh</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-4 mt-6">
                {goalTemplates[selectedCategory as keyof typeof goalTemplates]?.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => handleTemplateSelect(template, selectedCategory)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate?.title === template.title
                        ? "border-neon-500 bg-neon-500/10"
                        : "border-gray-600 hover:border-gray-500 bg-midnight-800/50"
                    }`}
                  >
                    <h4 className="text-white font-medium mb-2">{template.title}</h4>
                    <div className="text-sm text-gray-400">
                      <strong>Steps:</strong> {template.steps.join(" • ")}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Goal Title
                    </Label>
                    <Input
                      id="title"
                      value={customGoal.title}
                      onChange={(e) => setCustomGoal((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="What do you want to achieve?"
                      className="mt-1 bg-midnight-800/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={customGoal.description}
                      onChange={(e) => setCustomGoal((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us more about this goal..."
                      className="mt-1 bg-midnight-800/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step 3: Plan Your Steps */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Break it down into steps</h3>
              <p className="text-gray-400">What specific actions will help you reach this goal?</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Add a step (e.g., 'Study for 30 minutes daily')"
                  className="bg-midnight-800/50 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && addStep()}
                />
                <Button onClick={addStep} className="bg-neon-600 hover:bg-neon-700">
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {customGoal.steps?.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-midnight-800/50 rounded-lg border border-gray-600"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-white flex-1">{step}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {customGoal.steps?.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add some steps to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Final Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Final touches</h3>
              <p className="text-gray-400">Let's make this goal personal and motivating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Priority Level</Label>
                  <div className="flex gap-2 mt-2">
                    {["low", "medium", "high"].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setCustomGoal((prev) => ({ ...prev, priority: priority as any }))}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          customGoal.priority === priority
                            ? "bg-neon-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white">Timeframe</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["daily", "weekly", "monthly", "semester", "yearly"].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setCustomGoal((prev) => ({ ...prev, timeframe: timeframe as any }))}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          customGoal.timeframe === timeframe
                            ? "bg-electric-600 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="motivation" className="text-white">
                    Why is this important to you?
                  </Label>
                  <Textarea
                    id="motivation"
                    value={customGoal.motivation}
                    onChange={(e) => setCustomGoal((prev) => ({ ...prev, motivation: e.target.value }))}
                    placeholder="This will help me because..."
                    className="mt-1 bg-midnight-800/50 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="success" className="text-white">
                    How will you know you succeeded?
                  </Label>
                  <Input
                    id="success"
                    value={customGoal.successMetrics}
                    onChange={(e) => setCustomGoal((prev) => ({ ...prev, successMetrics: e.target.value }))}
                    placeholder="I'll know I succeeded when..."
                    className="mt-1 bg-midnight-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Goal Preview */}
            <Card className="bg-midnight-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Goal Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-neon-400">{customGoal.title}</h4>
                  {customGoal.description && <p className="text-gray-300">{customGoal.description}</p>}
                  <div className="flex gap-2">
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                      {customGoal.category}
                    </Badge>
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {customGoal.priority} priority
                    </Badge>
                    <Badge className="bg-green-600/20 text-green-300 border-green-500/30">{customGoal.timeframe}</Badge>
                  </div>
                  {customGoal.steps && customGoal.steps.length > 0 && (
                    <div>
                      <p className="text-white font-medium mb-2">Steps:</p>
                      <ul className="space-y-1">
                        {customGoal.steps.map((step, index) => (
                          <li key={index} className="text-gray-300 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-600 text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedCategory) ||
                (currentStep === 2 && !customGoal.title) ||
                (currentStep === 3 && (!customGoal.steps || customGoal.steps.length === 0))
              }
              className="bg-neon-600 hover:bg-neon-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={createGoal} className="bg-green-600 hover:bg-green-700">
              <Star className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
