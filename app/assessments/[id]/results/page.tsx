"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Download,
  Share2,
  ArrowLeft,
  Users,
  Zap,
  Brain,
  Lightbulb,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { getAssessmentResult } from "@/app/actions/submit-assessment"
import ErrorBoundary from "@/components/error-boundary"

export default function AssessmentResults() {
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")
  const [resultsData, setResultsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch results data
  useEffect(() => {
    async function fetchResults() {
      try {
        setIsLoading(true)
        setError(null)
        const result = await getAssessmentResult(assessmentId)

        if (result) {
          setResultsData(result)
        } else {
          // If no results found, use sample data
          setResultsData({
            assessmentId: assessmentId,
            assessmentTitle: "Leadership Style Assessment",
            completedDate: new Date().toLocaleDateString(),
            timeSpent: "8:42",
            overallScore: 85,
            primaryStyle: "Collaborative Leader",
            secondaryStyle: "Visionary Leader",
            strengths: [
              "Building consensus and fostering teamwork",
              "Creating an inclusive environment where all voices are heard",
              "Balancing team needs with organizational goals",
              "Adapting leadership approach based on the situation",
            ],
            growthAreas: [
              "Making quick decisions under pressure",
              "Providing direct feedback when necessary",
              "Delegating responsibilities more effectively",
            ],
            dimensionScores: [
              { name: "Team Building", score: 92, category: "teamwork" },
              { name: "Decision Making", score: 78, category: "performance" },
              { name: "Communication", score: 88, category: "emotional-intelligence" },
              { name: "Vision & Strategy", score: 85, category: "leadership" },
              { name: "Execution", score: 75, category: "performance" },
              { name: "Adaptability", score: 90, category: "emotional-intelligence" },
            ],
            peerComparison: {
              overall: { user: 85, peers: 72 },
              dimensions: [
                { name: "Team Building", user: 92, peers: 80 },
                { name: "Decision Making", user: 78, peers: 75 },
                { name: "Communication", user: 88, peers: 82 },
                { name: "Vision & Strategy", user: 85, peers: 70 },
                { name: "Execution", user: 75, peers: 78 },
                { name: "Adaptability", user: 90, peers: 68 },
              ],
            },
          })
        }
      } catch (error) {
        console.error("Error fetching assessment results:", error)
        setError("Failed to load assessment results. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [assessmentId])

  // Get category icon
  const getDimensionIcon = (category: string) => {
    switch (category) {
      case "leadership":
        return <Award className="h-4 w-4 text-purple-400" />
      case "emotional-intelligence":
        return <Brain className="h-4 w-4 text-neon-400" />
      case "performance":
        return <Zap className="h-4 w-4 text-yellow-400" />
      case "teamwork":
        return <Users className="h-4 w-4 text-blue-400" />
      default:
        return <Lightbulb className="h-4 w-4 text-electric-400" />
    }
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-green-600"
    if (score >= 80) return "from-neon-500 to-electric-500"
    if (score >= 70) return "from-blue-500 to-blue-600"
    if (score >= 60) return "from-yellow-500 to-yellow-600"
    return "from-red-500 to-red-600"
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-neon-400 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-white">Loading your results...</h2>
        <p className="text-gray-400">Please wait while we analyze your assessment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="bg-midnight-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button className="bg-neon-600 hover:bg-neon-700 text-white" onClick={() => router.push("/assessments")}>
            Back to Assessments
          </Button>
        </div>
      </div>
    )
  }

  if (!resultsData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="bg-midnight-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find the results for this assessment.</p>
          <Button className="bg-neon-600 hover:bg-neon-700 text-white" onClick={() => router.push("/assessments")}>
            Back to Assessments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={<div className="p-4 text-red-500">Something went wrong displaying the assessment results.</div>}
    >
      {/* Ambient Background Orbs and Grid Overlay */}
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
          {/* Header with back button */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-white hover:bg-neon-500/10"
              onClick={() => router.push("/assessments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Results header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{resultsData.assessmentTitle} Results</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-neon-400 mr-1.5" />
                Completed on {resultsData.completedDate}
              </div>
              <div>Time spent: {resultsData.timeSpent}</div>
            </div>
          </div>

          {/* Results tabs */}
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-6 bg-midnight-800 text-gray-400">
              <TabsTrigger
                value="overview"
                className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
              >
                Detailed Results
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
              >
                Next Steps
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Primary Leadership Style */}
                <Card className="bg-midnight-900 border-neon-500/10 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Award className="h-5 w-5 text-neon-400 mr-2" />
                      Your Leadership Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-2xl font-bold text-neon-400 mb-1">{resultsData.primaryStyle}</div>
                      <div className="text-sm text-gray-400 mb-4">Secondary: {resultsData.secondaryStyle}</div>
                      <div className="w-full max-w-xs h-2 bg-midnight-700 rounded-full overflow-hidden mb-6">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(resultsData.overallScore)}`}
                          style={{ width: `${resultsData.overallScore}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400">Overall Score</div>
                      <div className="text-3xl font-bold">{resultsData.overallScore}/100</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="bg-midnight-900 border-neon-500/10 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 py-2">
                      {resultsData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-neon-400 mr-2 mt-1 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Dimension Scores */}
              <Card className="bg-midnight-900 border-neon-500/10 text-white mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Dimension Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {resultsData.dimensionScores.map((dimension, index) => (
                      <div key={index} className="bg-midnight-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {getDimensionIcon(dimension.category)}
                            <span className="ml-2 font-medium">{dimension.name}</span>
                          </div>
                          <span className="font-bold">{dimension.score}</span>
                        </div>
                        <div className="w-full h-1.5 bg-midnight-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(dimension.score)}`}
                            style={{ width: `${dimension.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Areas */}
              <Card className="bg-midnight-900 border-neon-500/10 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Lightbulb className="h-5 w-5 text-electric-400 mr-2" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 py-2">
                    {resultsData.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-electric-500/20 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                          <Lightbulb className="h-3.5 w-3.5 text-electric-400" />
                        </div>
                        <div>
                          <p>{area}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detailed Results Tab */}
            <TabsContent value="details" className="mt-0">
              <Card className="bg-midnight-900 border-neon-500/10 text-white mb-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    Peer Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-400">Overall Score</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-neon-400 rounded-full mr-2"></div>
                          <span className="text-sm">You: {resultsData.peerComparison.overall.user}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                          <span className="text-sm">Peers: {resultsData.peerComparison.overall.peers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-midnight-700 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full rounded-full bg-neon-400"
                        style={{ width: `${resultsData.peerComparison.overall.user}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {resultsData.peerComparison.dimensions.map((dimension, index) => (
                      <div key={index} className="bg-midnight-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            {getDimensionIcon(resultsData.dimensionScores[index]?.category || "default")}
                            <span className="ml-2 font-medium">{dimension.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-neon-400">{dimension.user}</span>
                            <span className="text-sm text-gray-400">{dimension.peers}</span>
                          </div>
                        </div>
                        <div className="relative w-full h-2 bg-midnight-700 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full rounded-full bg-gray-400"
                            style={{ width: `${dimension.peers}%` }}
                          ></div>
                          <div
                            className="absolute h-full rounded-full bg-neon-400"
                            style={{ width: `${dimension.user}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="mt-0">
              <Card className="bg-midnight-900 border-neon-500/10 text-white mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-midnight-800 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Brain className="h-5 w-5 text-neon-400 mr-2" />
                        Skill Development
                      </h3>
                      <p className="text-gray-400 mb-3">
                        Based on your results, we recommend focusing on these skills:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-neon-400 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Decision-making under pressure</p>
                            <p className="text-sm text-gray-400">
                              Practice making decisions with limited information and time constraints.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-neon-400 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Effective delegation</p>
                            <p className="text-sm text-gray-400">
                              Learn to identify team members' strengths and delegate accordingly.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-midnight-800 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Lightbulb className="h-5 w-5 text-electric-400 mr-2" />
                        Recommended Resources
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="bg-electric-500/20 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                            <Lightbulb className="h-3.5 w-3.5 text-electric-400" />
                          </div>
                          <div>
                            <p className="font-medium">Leadership Under Pressure</p>
                            <p className="text-sm text-gray-400">
                              A guide to maintaining composure and making effective decisions in high-pressure
                              situations.
                            </p>
                            <Button
                              variant="link"
                              className="text-neon-400 p-0 h-auto mt-1"
                              onClick={() => router.push("/resources/library/leadership-pressure")}
                            >
                              View Resource
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-electric-500/20 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                            <Lightbulb className="h-3.5 w-3.5 text-electric-400" />
                          </div>
                          <div>
                            <p className="font-medium">The Art of Delegation</p>
                            <p className="text-sm text-gray-400">
                              Learn how to effectively delegate tasks and empower your team members.
                            </p>
                            <Button
                              variant="link"
                              className="text-neon-400 p-0 h-auto mt-1"
                              onClick={() => router.push("/resources/library/delegation-guide")}
                            >
                              View Resource
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-midnight-800 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Users className="h-5 w-5 text-blue-400 mr-2" />
                        Recommended Scenarios
                      </h3>
                      <p className="text-gray-400 mb-3">Practice these scenarios to improve your leadership skills:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="justify-start border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
                          onClick={() => router.push("/scenarios?category=decision-making")}
                        >
                          <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                          Decision-Making Scenarios
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
                          onClick={() => router.push("/scenarios?category=team-management")}
                        >
                          <Users className="h-4 w-4 text-blue-400 mr-2" />
                          Team Management Scenarios
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  )
}
