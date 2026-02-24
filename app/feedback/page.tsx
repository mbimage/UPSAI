"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { Loader2, ThumbsUp } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const searchParams = useSearchParams()
  const source = searchParams.get("source") || "direct"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback || !rating) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: "friend-feedback",
          conversationId: "external-feedback",
          feedback: {
            text: feedback,
            rating: rating,
            source: source,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        trackEvent("feedback_submitted", { source, rating })
      } else {
        console.error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card className="bg-midnight-900 border-neon-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Feedback Matters!</CardTitle>
          <CardDescription className="text-gray-400">
            Help us improve UpSide AI for student-athletes like you
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-500/20 p-3 mb-4">
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-center text-gray-300">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">How would you rate your experience?</h3>
                <RadioGroup value={rating || ""} onValueChange={setRating} className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`rating-${value}`}
                        className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-neon-500/30 
                        peer-data-[state=checked]:bg-neon-500/20 peer-data-[state=checked]:border-neon-500 
                        hover:bg-midnight-800 cursor-pointer"
                      >
                        <span className="text-lg font-medium">{value}</span>
                        <span className="sr-only">stars</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="feedback" className="text-lg font-medium">
                  What do you think about UpSide AI?
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts, suggestions, or experiences..."
                  className="min-h-[120px] bg-midnight-800 border-neon-500/30 text-white"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting || !feedback || !rating}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
