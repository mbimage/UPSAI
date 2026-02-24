"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LearningDashboardClientProps {
  stats: any
  negativeTags: any[]
  improvedTopics: any[]
}

export function LearningDashboardClient({ stats, negativeTags, improvedTopics }: LearningDashboardClientProps) {
  const [isRunningBatchLearning, setIsRunningBatchLearning] = useState(false)
  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false)
  const { toast } = useToast()

  const runBatchLearning = async () => {
    setIsRunningBatchLearning(true)

    try {
      const response = await fetch("/api/admin/batch-learn", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to run batch learning")
      }

      const data = await response.json()

      toast({
        title: "Batch Learning Complete",
        description: `Processed ${data.processedCount} feedback entries and generated ${data.improvedCount} improvements.`,
      })
    } catch (error) {
      console.error("Error running batch learning:", error)
      toast({
        title: "Error",
        description: "Failed to run batch learning. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunningBatchLearning(false)
    }
  }

  const analyzeFeedbackPatterns = async () => {
    setIsAnalyzingFeedback(true)

    try {
      const response = await fetch("/api/admin/analyze-feedback", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to analyze feedback patterns")
      }

      const data = await response.json()

      toast({
        title: "Feedback Analysis Complete",
        description: "Analysis has been updated with the latest patterns.",
      })
    } catch (error) {
      console.error("Error analyzing feedback patterns:", error)
      toast({
        title: "Error",
        description: "Failed to analyze feedback patterns. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingFeedback(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Batch Learning</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Process all collected feedback to generate improved responses. This may take several minutes.
            </p>
            <Button onClick={runBatchLearning} disabled={isRunningBatchLearning} className="w-full sm:w-auto">
              {isRunningBatchLearning ? "Processing..." : "Run Batch Learning"}
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Feedback Pattern Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze all feedback to identify patterns and areas for improvement.
            </p>
            <Button
              onClick={analyzeFeedbackPatterns}
              disabled={isAnalyzingFeedback}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isAnalyzingFeedback ? "Analyzing..." : "Analyze Feedback Patterns"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
