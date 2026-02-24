"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  Search,
  Filter,
  Clock,
  Award,
  Brain,
  Users,
  Briefcase,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronDown,
  Sparkles,
  BarChart,
  Target,
  Lightbulb,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Sample assessment data
  const assessments = [
    {
      id: 1,
      title: "Leadership Style Assessment",
      description: "Discover your natural leadership approach and how to leverage your strengths.",
      category: "leadership",
      duration: "15 min",
      questions: 25,
      completionRate: 78,
      isPopular: true,
      isNew: false,
      isTexasSpecific: false,
      progress: 0,
      benefits: ["Identify your leadership strengths", "Learn how to adapt your style", "Build team management skills"],
    },
    {
      id: 2,
      title: "Emotional Intelligence Evaluation",
      description: "Measure your ability to understand and manage emotions in yourself and others.",
      category: "emotional-intelligence",
      duration: "20 min",
      questions: 30,
      completionRate: 65,
      isPopular: true,
      isNew: false,
      isTexasSpecific: false,
      progress: 35,
      benefits: ["Improve self-awareness", "Develop empathy", "Better manage stress and emotions"],
    },
    {
      id: 3,
      title: "Game Pressure Response",
      description: "Analyze how you respond to high-pressure situations during competitions.",
      category: "performance",
      duration: "12 min",
      questions: 18,
      completionRate: 82,
      isPopular: false,
      isNew: true,
      isTexasSpecific: false,
      progress: 0,
      benefits: ["Identify stress triggers", "Learn calming techniques", "Improve focus under pressure"],
    },
    {
      id: 4,
      title: "Team Dynamics Analyzer",
      description: "Understand your role within a team and how you interact with teammates.",
      category: "teamwork",
      duration: "18 min",
      questions: 24,
      completionRate: 70,
      isPopular: false,
      isNew: false,
      isTexasSpecific: false,
      progress: 100,
      benefits: ["Discover your team role", "Improve collaboration skills", "Resolve team conflicts effectively"],
    },
    {
      id: 5,
      title: "Career Interest Inventory",
      description: "Explore potential career paths that align with your strengths and interests.",
      category: "career",
      duration: "25 min",
      questions: 40,
      completionRate: 60,
      isPopular: false,
      isNew: false,
      isTexasSpecific: false,
      progress: 75,
      benefits: ["Identify career matches", "Explore education pathways", "Connect interests to professions"],
    },
    {
      id: 6,
      title: "Texas Sports Scholarship Readiness",
      description: "Evaluate your preparedness for sports scholarship opportunities in Texas.",
      category: "career",
      duration: "22 min",
      questions: 35,
      completionRate: 55,
      isPopular: false,
      isNew: true,
      isTexasSpecific: true,
      progress: 0,
      benefits: ["Assess scholarship readiness", "Identify improvement areas", "Learn about Texas requirements"],
    },
    {
      id: 7,
      title: "Mental Toughness Evaluation",
      description: "Measure your resilience and ability to overcome challenges in sports and life.",
      category: "performance",
      duration: "15 min",
      questions: 20,
      completionRate: 85,
      isPopular: true,
      isNew: false,
      isTexasSpecific: false,
      progress: 0,
      benefits: ["Build resilience", "Develop growth mindset", "Overcome setbacks effectively"],
    },
    {
      id: 8,
      title: "Communication Style Analysis",
      description: "Identify your communication preferences and learn how to adapt to others.",
      category: "emotional-intelligence",
      duration: "16 min",
      questions: 22,
      completionRate: 72,
      isPopular: false,
      isNew: false,
      isTexasSpecific: false,
      progress: 50,
      benefits: ["Improve team communication", "Adapt to different styles", "Resolve misunderstandings"],
    },
  ]

  // Filter assessments based on search query and selected category
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || assessment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group assessments by progress status
  const inProgressAssessments = filteredAssessments.filter((a) => a.progress > 0 && a.progress < 100)
  const completedAssessments = filteredAssessments.filter((a) => a.progress === 100)
  const notStartedAssessments = filteredAssessments.filter((a) => a.progress === 0)

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "leadership":
        return <Award className="h-4 w-4 text-neon-400" />
      case "emotional-intelligence":
        return <Brain className="h-4 w-4 text-neon-400" />
      case "performance":
        return <Zap className="h-4 w-4 text-accent" />
      case "teamwork":
        return <Users className="h-4 w-4 text-secondary" />
      case "career":
        return <Briefcase className="h-4 w-4 text-primary" />
      default:
        return <Star className="h-4 w-4 text-electric-400" />
    }
  }

  // Get category label
  const getCategoryLabel = (category) => {
    switch (category) {
      case "leadership":
        return "Leadership"
      case "emotional-intelligence":
        return "Emotional IQ"
      case "performance":
        return "Performance"
      case "teamwork":
        return "Teamwork"
      case "career":
        return "Career"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-white relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>
      <div className="ambient-orb ambient-orb-3"></div>
      <div className="ambient-orb ambient-orb-4"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay"></div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Back to Home Button */}
        <Button
          asChild
          variant="outline"
          className="text-neon-300 hover:text-neon-200 border-neon-400/40 bg-neon-500/10 hover:bg-neon-500/20 hover:border-neon-400/60 transition-all duration-300 text-base px-5 py-2.5 shadow-lg shadow-neon-500/20 hover:shadow-xl hover:shadow-neon-400/30 mb-6"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </Button>

        {/* Hero Section - Updated to match home page hero styling */}
        <section className="relative min-h-[60vh] flex items-center justify-center px-4 mb-12">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-neon-900/20 to-midnight-950 rounded-2xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-neon-500/20 rounded-full border border-neon-500/30 mb-6 animate-breathing-glow">
              <span className="text-sm font-medium text-white">Research-Backed Assessments</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent animate-pulse-slow">
              Discover Your Strengths
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our research-backed assessments help you understand yourself better and develop the skills you need to
              succeed both on and off the field.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <CheckCircle className="h-4 w-4 text-neon-400 mr-1.5" />
                <span>Personalized Insights</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <Clock className="h-4 w-4 text-electric-400 mr-1.5" />
                <span>Quick Completion</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-1.5" />
                <span>Actionable Results</span>
              </div>
            </div>

            {/* Stats - Added stats section matching home page style */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-neon-900/40 p-4 rounded-xl border border-neon-500/20 animate-breathing-glow">
                <div className="text-2xl font-bold text-neon-400 mb-1">{completedAssessments.length}</div>
                <div className="text-sm text-gray-300">Completed</div>
              </div>
              <div
                className="bg-electric-900/40 p-4 rounded-xl border border-electric-500/20 animate-breathing-glow"
                style={{ animationDelay: "2s" }}
              >
                <div className="text-2xl font-bold text-electric-400 mb-1">{inProgressAssessments.length}</div>
                <div className="text-sm text-gray-300">In Progress</div>
              </div>
              <div
                className="bg-neon-900/40 p-4 rounded-xl border border-neon-500/20 animate-breathing-glow"
                style={{ animationDelay: "4s" }}
              >
                <div className="text-2xl font-bold text-neon-400 mb-1">{assessments.length}</div>
                <div className="text-sm text-gray-300">Available</div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Assessments</h2>
            <p className="text-gray-300 mt-1">
              Discover your strengths and growth areas through our research-backed assessments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-midnight-800/50 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
              <CheckCircle className="h-4 w-4 text-neon-400 mr-1.5" />
              <span>{completedAssessments.length} Completed</span>
            </div>
            <div className="bg-midnight-800/50 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
              <Clock className="h-4 w-4 text-electric-400 mr-1.5" />
              <span>{inProgressAssessments.length} In Progress</span>
            </div>
          </div>
        </div>

        {/* Featured Assessments */}
        {!loading && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4">Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments
                .filter((a) => a.isPopular)
                .slice(0, 2)
                .map((assessment) => (
                  <FeaturedAssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assessments..."
              className="pl-10 bg-midnight-800 border-neon-500/20 text-white focus-visible:ring-neon-500/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Category
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-midnight-900 border-neon-500/20 text-white">
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "all" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                <Star className="h-4 w-4 mr-2 text-electric-400" />
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "leadership" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("leadership")}
              >
                <Award className="h-4 w-4 mr-2 text-neon-400" />
                Leadership
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "emotional-intelligence" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("emotional-intelligence")}
              >
                <Brain className="h-4 w-4 mr-2 text-neon-400" />
                Emotional Intelligence
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "performance" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("performance")}
              >
                <Zap className="h-4 w-4 mr-2 text-accent" />
                Performance
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "teamwork" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("teamwork")}
              >
                <Users className="h-4 w-4 mr-2 text-secondary" />
                Teamwork
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`hover:bg-neon-500/10 focus:bg-neon-500/10 ${
                  selectedCategory === "career" ? "bg-neon-500/20 text-neon-400" : ""
                }`}
                onClick={() => setSelectedCategory("career")}
              >
                <Briefcase className="h-4 w-4 mr-2 text-primary" />
                Career
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Assessments Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 bg-midnight-800 text-gray-400">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 data-[state=active]:bg-neon-500/20 data-[state=active]:text-neon-400"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <AssessmentCardSkeleton key={i} />
                  ))}
              </div>
            ) : filteredAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
              </div>
            ) : (
              <EmptyState query={searchQuery} category={selectedCategory} />
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <AssessmentCardSkeleton key={i} />
                  ))}
              </div>
            ) : inProgressAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You don't have any assessments in progress." />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <AssessmentCardSkeleton key={i} />
                  ))}
              </div>
            ) : completedAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't completed any assessments yet." />
            )}
          </TabsContent>
        </Tabs>

        {/* Assessment Categories */}
        {!loading && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-white mb-6">Browse by Skill Area</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <CategoryCard
                icon={<Award className="h-6 w-6 text-neon-400" />}
                title="Leadership"
                count={assessments.filter((a) => a.category === "leadership").length}
                color="border-neon-500 hover:bg-neon-500/5"
                onClick={() => setSelectedCategory("leadership")}
              />
              <CategoryCard
                icon={<Brain className="h-6 w-6 text-neon-400" />}
                title="Emotional Intelligence"
                count={assessments.filter((a) => a.category === "emotional-intelligence").length}
                color="border-neon-500 hover:bg-neon-500/5"
                onClick={() => setSelectedCategory("emotional-intelligence")}
              />
              <CategoryCard
                icon={<Zap className="h-6 w-6 text-accent" />}
                title="Performance"
                count={assessments.filter((a) => a.category === "performance").length}
                color="border-accent hover:bg-accent/5"
                onClick={() => setSelectedCategory("performance")}
              />
              <CategoryCard
                icon={<Users className="h-6 w-6 text-secondary" />}
                title="Teamwork"
                count={assessments.filter((a) => a.category === "teamwork").length}
                color="border-secondary hover:bg-secondary/5"
                onClick={() => setSelectedCategory("teamwork")}
              />
              <CategoryCard
                icon={<Briefcase className="h-6 w-6 text-primary" />}
                title="Career"
                count={assessments.filter((a) => a.category === "career").length}
                color="border-primary hover:bg-primary/5"
                onClick={() => setSelectedCategory("career")}
              />
            </div>
          </div>
        )}

        {/* Benefits Section - Updated styling to match home page CTA section */}
        {!loading && (
          <div className="mt-16 bg-gradient-to-br from-neon-900/30 via-electric-900/20 to-midnight-900 rounded-xl p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            <div className="text-center mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Why Take Our Assessments?</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our assessments are designed to help you develop the skills you need to succeed both on and off the
                field.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <BenefitCard
                icon={<Target className="h-6 w-6 text-neon-400" />}
                title="Personalized Insights"
                description="Receive tailored feedback based on your unique responses and situation."
              />
              <BenefitCard
                icon={<Lightbulb className="h-6 w-6 text-electric-400" />}
                title="Actionable Recommendations"
                description="Get practical suggestions you can implement immediately to improve your skills."
              />
              <BenefitCard
                icon={<BarChart className="h-6 w-6 text-primary" />}
                title="Track Your Progress"
                description="See how you're growing over time with detailed progress tracking and reports."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Assessment Card Component
function AssessmentCard({ assessment, getCategoryIcon, getCategoryLabel }) {
  const getButtonText = () => {
    if (assessment.progress === 0) return "Start Assessment"
    if (assessment.progress === 100) return "View Results"
    return "Continue Assessment"
  }

  const getButtonStyle = () => {
    if (assessment.progress === 0) return "bg-neon-600 hover:bg-neon-700"
    if (assessment.progress === 100) return "bg-electric-600 hover:bg-electric-700"
    return "bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-700 hover:to-electric-700"
  }

  return (
    <Card className="bg-midnight-900 border-neon-500/10 text-white hover:shadow-lg transition-shadow relative h-full flex flex-col">
      {assessment.isTexasSpecific && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Texas
        </div>
      )}
      {assessment.isNew && (
        <div className="absolute -top-2 -right-2 bg-electric-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          New
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-midnight-800 mr-3">{getCategoryIcon(assessment.category)}</div>
            <span className="text-xs font-medium text-gray-400">{getCategoryLabel(assessment.category)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {assessment.duration}
          </div>
        </div>
        <CardTitle className="text-xl mt-3">{assessment.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-300 mb-4">{assessment.description}</p>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{assessment.questions} questions</span>
          <span>{assessment.completionRate}% completion rate</span>
        </div>
        {assessment.progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Your progress</span>
              <span className="text-neon-400 font-medium">{assessment.progress}%</span>
            </div>
            <Progress
              value={assessment.progress}
              className="h-1.5 bg-midnight-800"
              indicatorClassName={
                assessment.progress === 100 ? "bg-electric-500" : "bg-gradient-to-r from-neon-500 to-electric-500"
              }
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className={`w-full text-white ${getButtonStyle()}`}>
          <Link href={`/assessments/${assessment.id}`}>
            {getButtonText()}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function FeaturedAssessmentCard({ assessment, getCategoryIcon, getCategoryLabel }) {
  return (
    <Card className="bg-gradient-to-br from-midnight-900 to-midnight-800 border-neon-500/20 text-white hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-electric-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-midnight-800/80 mr-3">{getCategoryIcon(assessment.category)}</div>
            <Badge variant="outline" className="bg-midnight-800/50 text-white border-neon-500/30">
              {getCategoryLabel(assessment.category)}
            </Badge>
          </div>
          <Badge className="bg-neon-600">Recommended</Badge>
        </div>
        <CardTitle className="text-2xl mt-3">{assessment.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 relative z-10">
        <p className="text-gray-300 mb-4">{assessment.description}</p>

        <div className="space-y-2 mb-4">
          {assessment.benefits.slice(0, 3).map((benefit, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-4 w-4 text-neon-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {assessment.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {assessment.completionRate}% completion rate
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
        >
          <Link href={`/assessments/${assessment.id}`}>
            Start Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function CategoryCard({ icon, title, count, color, onClick }) {
  return (
    <Card className={`bg-midnight-900 border ${color} hover:shadow-md transition-all cursor-pointer`} onClick={onClick}>
      <CardContent className="p-4 flex items-center">
        <div className="p-2 rounded-full bg-midnight-800 mr-3">{icon}</div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-xs text-gray-400">{count} assessments</p>
        </div>
      </CardContent>
    </Card>
  )
}

function BenefitCard({ icon, title, description }) {
  return (
    <Card className="bg-midnight-800/50 border-neon-500/10 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-midnight-700/50 rounded-full mb-4">{icon}</div>
          <h3 className="font-medium text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State Component
function EmptyState({ message, query, category }) {
  let displayMessage = message

  if (!displayMessage) {
    if (query && category !== "all") {
      displayMessage = `No assessments found for "${query}" in the ${getCategoryReadableName(category)} category.`
    } else if (query) {
      displayMessage = `No assessments found for "${query}".`
    } else if (category !== "all") {
      displayMessage = `No assessments found in the ${getCategoryReadableName(category)} category.`
    } else {
      displayMessage = "No assessments found."
    }
  }

  function getCategoryReadableName(category) {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="text-center py-12">
      <div className="bg-midnight-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">No Assessments Found</h3>
      <p className="text-gray-400 max-w-md mx-auto">{displayMessage}</p>
      {(query || category !== "all") && (
        <Button
          variant="outline"
          className="mt-4 border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
          onClick={() => {
            // This would reset filters in a real implementation
            window.location.href = "/assessments"
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

function AssessmentCardSkeleton() {
  return (
    <Card className="bg-midnight-900 border-neon-500/10 text-white relative h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-7 w-3/4 mt-3" />
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <div className="flex justify-between mb-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
