"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, CheckCircle, Clock, Users, Target } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description: string
  category: "confidence" | "focus" | "communication" | "resilience" | "leadership"
  duration: string
  difficulty: "easy" | "medium" | "advanced"
  type: "lesson" | "drill" | "exercise"
  steps: string[]
  completed: boolean
  participants: "individual" | "team" | "partner"
}

export function ShortLessonsDrills() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Confidence Building Drill",
      description: "A quick exercise to boost self-confidence before important moments",
      category: "confidence",
      duration: "5 min",
      difficulty: "easy",
      type: "drill",
      participants: "individual",
      completed: false,
      steps: [
        "Stand tall with your feet shoulder-width apart",
        "Take 3 deep breaths, feeling your chest expand",
        "Recall a recent success or achievement",
        "Say out loud: 'I am capable and prepared'",
        "Visualize yourself succeeding in your next challenge",
      ],
    },
    {
      id: "2",
      title: "Focus Reset Technique",
      description: "Regain concentration when your mind starts to wander",
      category: "focus",
      duration: "3 min",
      difficulty: "easy",
      type: "exercise",
      participants: "individual",
      completed: false,
      steps: [
        "Notice that your mind has wandered (no judgment)",
        "Take one deep breath and close your eyes",
        "Count backwards from 10 to 1 slowly",
        "Open your eyes and state your current goal",
        "Begin working with renewed focus",
      ],
    },
    {
      id: "3",
      title: "Team Communication Practice",
      description: "Improve how you communicate with teammates under pressure",
      category: "communication",
      duration: "10 min",
      difficulty: "medium",
      type: "drill",
      participants: "team",
      completed: false,
      steps: [
        "Form pairs or small groups of 3-4 people",
        "One person describes a challenge they're facing",
        "Others practice active listening (no interrupting)",
        "Listeners reflect back what they heard",
        "Original speaker confirms understanding",
        "Switch roles and repeat",
      ],
    },
    {
      id: "4",
      title: "Resilience Mindset Lesson",
      description: "Learn to bounce back stronger from setbacks",
      category: "resilience",
      duration: "8 min",
      difficulty: "medium",
      type: "lesson",
      participants: "individual",
      completed: false,
      steps: [
        "Think of a recent setback or disappointment",
        "Write down 3 things you learned from it",
        "Identify 1 skill you developed through the challenge",
        "Reframe the experience as training for future success",
        "Create an action plan for similar future situations",
      ],
    },
    {
      id: "5",
      title: "Leadership Presence Exercise",
      description: "Develop the confidence to lead by example",
      category: "leadership",
      duration: "7 min",
      difficulty: "advanced",
      type: "exercise",
      participants: "individual",
      completed: false,
      steps: [
        "Stand in front of a mirror or record yourself",
        "Practice introducing yourself with confidence",
        "Share a goal you're working toward",
        "Explain how you plan to help others succeed",
        "End with a call to action for your team",
      ],
    },
  ]

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (selectedLesson && currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const completeLesson = () => {
    if (selectedLesson) {
      setSelectedLesson({ ...selectedLesson, completed: true })
      // In a real app, you'd save this to state/database
    }
    setSelectedLesson(null)
    setCurrentStep(0)
  }

  const categoryColors = {
    confidence: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    focus: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    communication: "bg-green-500/20 text-green-400 border-green-500/30",
    resilience: "bg-red-500/20 text-red-400 border-red-500/30",
    leadership: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  }

  const difficultyColors = {
    easy: "text-green-400",
    medium: "text-yellow-400",
    advanced: "text-red-400",
  }

  const typeIcons = {
    lesson: BookOpen,
    drill: Target,
    exercise: Play,
  }

  if (selectedLesson) {
    const progress = ((currentStep + 1) / selectedLesson.steps.length) * 100
    const IconComponent = typeIcons[selectedLesson.type]

    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-blue-500" />
                {selectedLesson.title}
              </CardTitle>
              <CardDescription>{selectedLesson.description}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>
              Exit
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Step {currentStep + 1} of {selectedLesson.steps.length}
              </span>
              <span className="text-gray-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-white font-medium mb-2">Current Step:</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{selectedLesson.steps[currentStep]}</p>
          </div>

          <div className="flex gap-2">
            {currentStep < selectedLesson.steps.length - 1 ? (
              <Button onClick={nextStep} className="flex-1">
                Next Step
              </Button>
            ) : (
              <Button onClick={completeLesson} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Lesson
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-500" />
          Quick Lessons & Drills
        </CardTitle>
        <CardDescription>Bite-sized learning for immediate growth</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            const IconComponent = typeIcons[lesson.type]
            return (
              <div
                key={lesson.id}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-4 w-4 text-gray-400" />
                      <h3 className="font-medium text-white">{lesson.title}</h3>
                      {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{lesson.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={categoryColors[lesson.category]}>{lesson.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {lesson.participants}
                      </div>
                      <div className={`text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
                        {lesson.difficulty}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => startLesson(lesson)} className="ml-4">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
