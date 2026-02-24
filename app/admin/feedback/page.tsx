"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from your database
const MOCK_FEEDBACK = [
  {
    id: "1",
    text: "This app has been incredibly helpful for my time management as a student athlete!",
    rating: "5",
    source: "friend-share",
    timestamp: "2023-05-15T14:23:10.000Z",
  },
  {
    id: "2",
    text: "I like the resources, but wish there were more specific to my sport (basketball).",
    rating: "4",
    source: "direct",
    timestamp: "2023-05-14T09:45:22.000Z",
  },
  {
    id: "3",
    text: "The chat feature sometimes gives generic advice. Could be more personalized.",
    rating: "3",
    source: "friend-share",
    timestamp: "2023-05-13T16:12:05.000Z",
  },
  {
    id: "4",
    text: "Great app overall! The assessments really helped me understand my strengths.",
    rating: "5",
    source: "direct",
    timestamp: "2023-05-12T11:33:45.000Z",
  },
  {
    id: "5",
    text: "Would love to see more content about dealing with injuries and recovery.",
    rating: "4",
    source: "friend-share",
    timestamp: "2023-05-11T08:19:30.000Z",
  },
]

type Feedback = {
  id: string
  text: string
  rating: string
  source: string
  timestamp: string
}

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch this from your API
    setFeedback(MOCK_FEEDBACK)
  }, [])

  const filteredFeedback = activeTab === "all" ? feedback : feedback.filter((item) => item.source === activeTab)

  const averageRating =
    feedback.length > 0
      ? (feedback.reduce((sum, item) => sum + Number.parseInt(item.rating), 0) / feedback.length).toFixed(1)
      : "0.0"

  const getFeedbackByRating = (rating: string) => {
    return feedback.filter((item) => item.rating === rating).length
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Feedback Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-midnight-900 border-neon-500/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-neon-500">{averageRating}</span>
              <span className="text-lg text-gray-400 ml-2">/ 5.0</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-900 border-neon-500/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{feedback.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-900 border-neon-500/20 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex flex-col items-center">
                  <span className="text-lg font-medium">{rating}★</span>
                  <span className="text-sm text-gray-400">{getFeedbackByRating(rating.toString())}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-midnight-900 border-neon-500/20 text-white">
        <CardHeader>
          <CardTitle>Feedback Responses</CardTitle>
          <CardDescription className="text-gray-400">Review feedback from users and friends</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="direct">Direct Users</TabsTrigger>
              <TabsTrigger value="friend-share">Friend Referrals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((item) => (
                    <div key={item.id} className="p-4 border border-neon-500/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-neon-500 font-medium mr-2">{item.rating} ★</span>
                          <Badge variant="outline" className="text-xs">
                            {item.source === "friend-share" ? "Friend Referral" : "Direct User"}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300">{item.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No feedback found in this category</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
