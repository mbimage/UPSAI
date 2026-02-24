import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFeedbackStats, getCommonNegativeFeedbackTags, getMostImprovedTopics } from "@/lib/feedback-service"

export const metadata: Metadata = {
  title: "AI Learning Dashboard | UpSide AI",
  description: "Monitor and manage the AI learning system",
}

export default async function LearningDashboardPage() {
  // Get feedback statistics
  const stats = await getFeedbackStats()

  // Get common negative feedback tags
  const negativeTags = await getCommonNegativeFeedbackTags(10)

  // Get most improved topics
  const improvedTopics = await getMostImprovedTopics(10)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Learning Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="learning">Learning Process</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalFeedback || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Helpful Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.helpfulCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.helpfulPercentage ? stats.helpfulPercentage.toFixed(1) + "%" : "0%"} of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">
                  {(stats.notHelpfulCount || 0) + (stats.partiallyHelpfulCount || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalFeedback
                    ? (
                        (((stats.notHelpfulCount || 0) + (stats.partiallyHelpfulCount || 0)) / stats.totalFeedback) *
                        100
                      ).toFixed(1) + "%"
                    : "0%"}{" "}
                  of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Improved Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{improvedTopics.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
                <CardDescription>Most frequent tags in negative feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {negativeTags.length > 0 ? (
                  <ul className="space-y-2">
                    {negativeTags.map((tag, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span className="text-sm">{tag.tag}</span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {tag.count} mentions
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No negative feedback collected yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Improved Topics</CardTitle>
                <CardDescription>Topics with the highest improvement rate</CardDescription>
              </CardHeader>
              <CardContent>
                {improvedTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {improvedTopics.map((topic, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span className="text-sm">{topic.tag}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {(topic.improvement * 100).toFixed(1)}% better
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No improvements measured yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analysis</CardTitle>
              <CardDescription>Patterns and insights from user feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The system automatically analyzes feedback patterns to identify areas for improvement. As more feedback
                is collected, this analysis will become more accurate and insightful.
              </p>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Key Insights</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Users most frequently request more specific examples in responses</li>
                  <li>Sports-specific terminology is highly appreciated by users</li>
                  <li>Responses that include actionable steps receive more positive feedback</li>
                  <li>Shorter, more concise responses are preferred for quick questions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Improvements</CardTitle>
              <CardDescription>How the system has improved based on feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Example Improvement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-1">Original Response</h4>
                      <p className="text-sm">Confidence is important for athletes. Try to believe in yourself more.</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-green-800 mb-1">Improved Response</h4>
                      <p className="text-sm">
                        Building confidence as an athlete requires specific actions: 1) Identify your strengths through
                        video analysis, 2) Practice visualization before games, 3) Create a pre-game routine that puts
                        you in a confident mindset. Remember how you performed in your best game against Central High
                        last season - that same athlete is still you.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Improvement Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Specificity</h4>
                      <p className="text-lg font-bold">+64%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Relevance</h4>
                      <p className="text-lg font-bold">+42%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Actionability</h4>
                      <p className="text-lg font-bold">+78%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">User Satisfaction</h4>
                      <p className="text-lg font-bold">+53%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Process</CardTitle>
              <CardDescription>How the AI learns and improves over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Learning Cycle</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>
                      <strong>Collect Feedback:</strong> Users provide thumbs up/down and optional comments on AI
                      responses
                    </li>
                    <li>
                      <strong>Analyze Patterns:</strong> System identifies common issues and areas for improvement
                    </li>
                    <li>
                      <strong>Generate Improvements:</strong> AI creates improved versions of problematic responses
                    </li>
                    <li>
                      <strong>Test Improvements:</strong> New responses are tested with users to measure effectiveness
                    </li>
                    <li>
                      <strong>Incorporate Successful Changes:</strong> Effective improvements become part of the system
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Current Learning Focus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Sports-Specific Context</h4>
                      <p className="text-xs text-gray-600">
                        Improving responses with relevant sports terminology and examples
                      </p>
                    </div>
                    <div className="border p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Rural Considerations</h4>
                      <p className="text-xs text-gray-600">
                        Adapting advice for limited resources in rural communities
                      </p>
                    </div>
                    <div className="border p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Actionable Guidance</h4>
                      <p className="text-xs text-gray-600">
                        Providing specific, implementable steps rather than general advice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
