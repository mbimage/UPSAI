"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Save,
  Flag,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { submitAssessment } from "@/app/actions/submit-assessment"
import { ThumbFriendlyNav } from "@/components/thumb-friendly-nav"
import { MobileThumbButton } from "@/components/mobile-thumb-button"

// Sample assessment data - in a real app, this would be fetched from an API
const assessmentData = {
  id: "leadership-style",
  title: "Leadership Style Assessment",
  description:
    "Discover your natural leadership approach and how to leverage your strengths as a team leader and athlete.",
  category: "leadership",
  estimatedTime: "15 min",
  totalQuestions: 10,
  questions: [
    {
      id: 1,
      text: "When faced with a team conflict, I typically:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Step in immediately to resolve the issue" },
        { id: "b", text: "Listen to all sides before suggesting a solution" },
        { id: "c", text: "Encourage team members to work it out themselves" },
        { id: "d", text: "Establish a structured process for resolution" },
      ],
    },
    {
      id: 2,
      text: "I feel most confident as a leader when:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "I have a clear plan that everyone follows" },
        { id: "b", text: "The team is collaborating well together" },
        { id: "c", text: "I'm inspiring others to reach their potential" },
        { id: "d", text: "We're achieving measurable results" },
      ],
    },
    {
      id: 3,
      text: "How comfortable are you making difficult decisions that might be unpopular with teammates?",
      type: "scale",
      min: 1,
      max: 5,
      minLabel: "Very uncomfortable",
      maxLabel: "Very comfortable",
    },
    {
      id: 4,
      text: "When the team is under pressure, my first priority is:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Maintaining team morale and motivation" },
        { id: "b", text: "Focusing on the most critical tasks" },
        { id: "c", text: "Ensuring everyone understands their role" },
        { id: "d", text: "Adapting our strategy based on the situation" },
      ],
    },
    {
      id: 5,
      text: "Describe a time when you successfully led a group or team. What approach did you take and why was it effective?",
      type: "open-ended",
    },
    {
      id: 6,
      text: "When receiving feedback about my leadership, I typically:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Implement changes immediately" },
        { id: "b", text: "Reflect on it carefully before deciding how to respond" },
        { id: "c", text: "Discuss it with trusted teammates" },
        { id: "d", text: "Compare it with my own self-assessment" },
      ],
    },
    {
      id: 7,
      text: "How important is it to you that team members see you as approachable?",
      type: "scale",
      min: 1,
      max: 5,
      minLabel: "Not important",
      maxLabel: "Very important",
    },
    {
      id: 8,
      text: "When setting goals for the team, I prefer to:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Set ambitious targets to push everyone" },
        { id: "b", text: "Involve the team in the goal-setting process" },
        { id: "c", text: "Focus on individual growth alongside team goals" },
        { id: "d", text: "Establish clear metrics to track progress" },
      ],
    },
    {
      id: 9,
      text: "What do you believe is your greatest strength as a leader?",
      type: "open-ended",
    },
    {
      id: 10,
      text: "In high-pressure situations, I am most likely to:",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Take charge and give clear directions" },
        { id: "b", text: "Remain calm and help others stay focused" },
        { id: "c", text: "Adapt quickly to changing circumstances" },
        { id: "d", text: "Rally the team around our shared purpose" },
      ],
    },
  ],
}

export default function AssessmentSession() {
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string

  // State for the current assessment
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Current question
  const currentQuestion = assessmentData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / assessmentData.totalQuestions) * 100

  // Format time spent
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Handle answer changes
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  // Navigation functions
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Flag question for review later
  const toggleFlagQuestion = () => {
    const questionId = currentQuestion.id
    if (flaggedQuestions.includes(questionId)) {
      setFlaggedQuestions(flaggedQuestions.filter((id) => id !== questionId))
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionId])
    }
  }

  // Submit assessment
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Create form data for submission
      const formData = new FormData()
      formData.append("assessmentId", assessmentId)

      // Add all answers
      Object.entries(answers).forEach(([questionId, answer]) => {
        formData.append(`question_${questionId}`, answer.toString())
      })

      // Submit using server action
      const result = await submitAssessment(formData)

      if (result.success) {
        // Navigate to results page
        router.push(`/assessments/${assessmentId}/results`)
      } else {
        // Handle error
        console.error("Failed to submit assessment:", result.error)
        setIsSubmitting(false)
        // Show error message to user
        alert("Failed to submit assessment. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
      setIsSubmitting(false)
      alert("An error occurred. Please try again.")
    }
  }

  // Check if all questions are answered
  const allQuestionsAnswered = assessmentData.questions.every((q) => answers[q.id] !== undefined)

  // Render question based on type
  const renderQuestion = () => {
    const question = currentQuestion

    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange} className="space-y-3 mt-4">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem
                  value={option.id}
                  id={`option-${option.id}`}
                  className="border-neon-500/30 text-neon-400"
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-white font-normal leading-relaxed cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "open-ended":
        return (
          <Textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="mt-4 bg-midnight-800 border-neon-500/20 text-white focus-visible:ring-neon-500/30 min-h-[150px]"
          />
        )

      case "scale":
        return (
          <div className="mt-6 px-2">
            <Slider
              value={answers[question.id] !== undefined ? [answers[question.id]] : [3]}
              min={question.min}
              max={question.max}
              step={1}
              onValueChange={(value) => handleAnswerChange(value[0])}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
          </div>
        )

      default:
        return <p className="text-red-400">Unknown question type</p>
    }
  }

  return (
    <div className="min-h-screen bg-midnight-950 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header with back button, exit button and timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-neon-400/40 bg-neon-500/10 hover:bg-neon-500/20 hover:border-neon-400/60 text-neon-300 hover:text-neon-200 transition-all duration-300 px-4 py-2 shadow-lg shadow-neon-500/20 hover:shadow-xl hover:shadow-neon-400/30"
              onClick={() => router.push("/assessments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>

            <Button
              variant="ghost"
              className="text-gray-400 hover:bg-red-500/10 hover:text-red-400"
              onClick={() => setShowExitDialog(true)}
            >
              Exit Assessment
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-neon-400" />
              Time: {formatTime(timeSpent)}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-neon-500/10"
                    onClick={() => setShowHelpDialog(true)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need help?</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Assessment title and progress */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{assessmentData.title}</h1>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {assessmentData.totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-midnight-800"
            indicatorClassName="bg-gradient-to-r from-neon-500 to-electric-500"
          />
        </div>

        {/* Question card */}
        <Card className="bg-midnight-900 border-neon-500/10 text-white mb-6">
          <CardHeader className="pb-3 relative">
            <div className="absolute right-6 top-6">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${
                  flaggedQuestions.includes(currentQuestion.id)
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleFlagQuestion}
              >
                <Flag className="h-5 w-5" />
                <span className="sr-only">
                  {flaggedQuestions.includes(currentQuestion.id) ? "Unflag question" : "Flag question for review"}
                </span>
              </Button>
            </div>
            <CardTitle className="text-xl">
              <span className="text-neon-400 mr-2">{currentQuestionIndex + 1}.</span> {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderQuestion()}</CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            {/* Main navigation buttons */}
            <div className="flex justify-between items-center w-full">
              <Button
                variant="outline"
                className="border-neon-500/20 text-white hover:bg-neon-500/20 hover:border-neon-500/40 transition-all duration-200 focus:ring-neon-500/30 min-w-[120px] h-12 bg-transparent"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-5 w-5 mr-2" /> Previous
              </Button>

              {currentQuestionIndex < assessmentData.questions.length - 1 ? (
                <Button
                  className="bg-neon-600 hover:bg-neon-700 text-white transition-all duration-200 hover:shadow-lg hover:shadow-neon-500/30 min-w-[120px] h-12 text-lg font-semibold"
                  onClick={goToNextQuestion}
                >
                  Next <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-electric-600 hover:bg-electric-700 text-white transition-all duration-200 hover:shadow-lg hover:shadow-electric-500/30 min-w-[180px] h-12 text-lg font-semibold"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="flex space-x-1 mr-2">
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Assessment <CheckCircle className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Large, prominent Next button for mobile */}
            <div className="block md:hidden w-full">
              {currentQuestionIndex < assessmentData.questions.length - 1 ? (
                <Button
                  className="w-full bg-neon-600 hover:bg-neon-700 text-white h-14 text-xl font-bold shadow-lg hover:shadow-neon-500/30 transition-all duration-200"
                  onClick={goToNextQuestion}
                >
                  Continue <ChevronRight className="h-6 w-6 ml-2" />
                </Button>
              ) : (
                <Button
                  className="w-full bg-electric-600 hover:bg-electric-700 text-white h-14 text-xl font-bold shadow-lg hover:shadow-electric-500/30 transition-all duration-200"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Assessment"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Question navigation */}
        <Card className="bg-midnight-900 border-neon-500/10 text-white">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {assessmentData.questions.map((question, index) => (
                <Button
                  key={question.id}
                  variant="outline"
                  size="icon"
                  className={`h-10 w-full transition-all duration-200 ${
                    currentQuestionIndex === index
                      ? "bg-neon-500/20 border-neon-500/50 text-neon-400 hover:bg-neon-500/30"
                      : answers[question.id] !== undefined
                        ? "bg-midnight-800/50 border-electric-500/30 text-white hover:bg-electric-500/20 hover:border-electric-500/50"
                        : "bg-midnight-800/30 border-neon-500/20 text-gray-400 hover:bg-midnight-800/50 hover:text-white"
                  } ${flaggedQuestions.includes(question.id) ? "ring-1 ring-yellow-500" : ""}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  aria-label={`Question ${index + 1}`}
                >
                  {flaggedQuestions.includes(question.id) ? (
                    <Flag className="h-3 w-3 absolute top-1 right-1 text-yellow-400" />
                  ) : null}
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-4">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-neon-500/20 border border-neon-500/50 mr-2"></div>
                  <span className="text-xs text-gray-400">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-midnight-800/50 border border-electric-500/30 mr-2"></div>
                  <span className="text-xs text-gray-400">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-midnight-800/30 border border-neon-500/20 mr-2"></div>
                  <span className="text-xs text-gray-400">Unanswered</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-electric-500/20 text-white hover:bg-electric-500/10 bg-transparent"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
              >
                <Save className="h-3 w-3 mr-1" />
                {isSubmitting ? "Submitting..." : "Submit All"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Thumb-friendly navigation */}
        <ThumbFriendlyNav
          onPrevious={goToPreviousQuestion}
          onNext={goToNextQuestion}
          onSubmit={handleSubmit}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={currentQuestionIndex < assessmentData.questions.length - 1}
          isLastQuestion={currentQuestionIndex === assessmentData.questions.length - 1}
          isSubmitting={isSubmitting}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={assessmentData.totalQuestions}
        />

        {/* Mobile thumb button for extra accessibility */}
        <MobileThumbButton
          onNext={goToNextQuestion}
          onSubmit={handleSubmit}
          isLastQuestion={currentQuestionIndex === assessmentData.questions.length - 1}
          isSubmitting={isSubmitting}
          disabled={currentQuestionIndex === assessmentData.questions.length - 1 && !allQuestionsAnswered}
          position="right"
        />

        {/* Exit confirmation dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="bg-midnight-900 border-neon-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Exit Assessment?</DialogTitle>
              <DialogDescription className="text-gray-400">
                Your progress will be saved, but you'll need to start from the beginning next time.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center text-yellow-500 my-2">
              <AlertCircle className="h-12 w-12" />
            </div>
            <DialogFooter className="flex sm:justify-between gap-2">
              <Button
                variant="outline"
                className="border-neon-500/20 text-white hover:bg-neon-500/10 sm:flex-1 bg-transparent"
                onClick={() => setShowExitDialog(false)}
              >
                Continue Assessment
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white sm:flex-1"
                onClick={() => router.push("/assessments")}
              >
                Exit Assessment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Help dialog */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="bg-midnight-900 border-neon-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Assessment Help</DialogTitle>
              <DialogDescription className="text-gray-400">
                Here are some tips to help you complete this assessment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-1">Navigation</h3>
                <p className="text-sm text-gray-300">
                  Use the Previous and Next buttons to move between questions, or click on question numbers in the
                  navigator.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Flagging Questions</h3>
                <p className="text-sm text-gray-300">
                  Click the flag icon to mark questions you want to review later. Flagged questions will be highlighted
                  in the navigator.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Saving Progress</h3>
                <p className="text-sm text-gray-300">
                  Your answers are automatically saved as you progress. You can exit and return later to continue.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Submitting</h3>
                <p className="text-sm text-gray-300">
                  Once you've answered all questions, click "Submit Assessment" to see your results.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-neon-600 hover:bg-neon-700 text-white w-full"
                onClick={() => setShowHelpDialog(false)}
              >
                Got It
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
