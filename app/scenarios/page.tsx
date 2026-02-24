import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Interactive Scenarios | UpSide AI",
  description: "Practice real-world situations with our interactive scenarios",
}

export default function ScenariosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to Home Button */}
      <Button asChild variant="ghost" className="text-gray-400 hover:text-neon-400 transition-colors mb-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-400 to-electric-500 bg-clip-text text-transparent">
            Interactive Scenarios
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Practice handling real-world situations in a safe environment. Our interactive scenarios help you develop
            skills for sports, school, and life.
          </p>
        </div>

        {/* Scenario Categories */}
        <Tabs defaultValue="all" className="w-full mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="team">Team Dynamics</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="career">Career Prep</TabsTrigger>
              <TabsTrigger value="stress">Stress Management</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Scenario */}
              <Card className="col-span-full bg-gradient-to-br from-midnight-900 to-midnight-800 border-neon-500/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="/coach-athlete-feedback.png"
                      alt="Coach giving feedback"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <Badge className="w-fit mb-4 bg-neon-500/20 text-neon-400 hover:bg-neon-500/30">Featured</Badge>
                    <h3 className="text-2xl font-bold mb-2">Receiving Constructive Criticism</h3>
                    <p className="text-gray-300 mb-6">
                      Practice receiving tough feedback from your coach after a disappointing game performance. Learn to
                      separate emotion from feedback and use criticism constructively.
                    </p>
                    <Button asChild className="w-fit bg-neon-600 hover:bg-neon-700">
                      <Link href="/scenarios/receiving-criticism">Start Scenario</Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Regular Scenarios */}
              <ScenarioCard
                title="Team Conflict Resolution"
                description="Navigate a disagreement between teammates and help find a resolution that strengthens team bonds."
                image="/placeholder.svg?height=200&width=300&query=team conflict resolution sports"
                category="Team Dynamics"
                difficulty="Intermediate"
                slug="team-conflict"
              />

              <ScenarioCard
                title="Captain's Challenge"
                description="You've been named team captain. Handle your first leadership challenge with a teammate who's struggling."
                image="/placeholder.svg?height=200&width=300&query=team captain leadership"
                category="Leadership"
                difficulty="Advanced"
                slug="captains-challenge"
              />

              <ScenarioCard
                title="College Recruiting Conversation"
                description="Practice a conversation with a college recruiter who's interested in your athletic and academic abilities."
                image="/placeholder.svg?height=200&width=300&query=college sports recruiting"
                category="Career Prep"
                difficulty="Intermediate"
                slug="college-recruiting"
              />

              <ScenarioCard
                title="Pre-Championship Anxiety"
                description="It's the night before the championship game and you can't sleep. Work through anxiety and prepare mentally."
                image="/placeholder.svg?height=200&width=300&query=athlete anxiety before game"
                category="Stress Management"
                difficulty="Beginner"
                slug="pre-championship"
              />

              <ScenarioCard
                title="Balancing Academics and Athletics"
                description="You're falling behind in a class due to your sports schedule. Navigate a conversation with your teacher."
                image="/placeholder.svg?height=200&width=300&query=student athlete studying"
                category="Stress Management"
                difficulty="Intermediate"
                slug="academic-balance"
              />
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScenarioCard
                title="Team Conflict Resolution"
                description="Navigate a disagreement between teammates and help find a resolution that strengthens team bonds."
                image="/placeholder.svg?height=200&width=300&query=team conflict resolution sports"
                category="Team Dynamics"
                difficulty="Intermediate"
                slug="team-conflict"
              />

              <ScenarioCard
                title="New Teammate Integration"
                description="Help integrate a new player who's struggling to fit in with the team culture and dynamics."
                image="/placeholder.svg?height=200&width=300&query=new team member sports"
                category="Team Dynamics"
                difficulty="Beginner"
                slug="new-teammate"
              />

              <ScenarioCard
                title="Team Communication Breakdown"
                description="Address a communication breakdown during a crucial game and rebuild trust among teammates."
                image="/placeholder.svg?height=200&width=300&query=team huddle sports"
                category="Team Dynamics"
                difficulty="Advanced"
                slug="communication-breakdown"
              />
            </div>
          </TabsContent>

          {/* Other tabs would follow the same pattern */}
        </Tabs>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Scenario Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-midnight-900 border-neon-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto bg-neon-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neon-400"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <CardTitle>Safe Practice Environment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-200">
                  Practice difficult conversations and situations without real-world consequences, allowing you to learn
                  from mistakes.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-midnight-900 border-neon-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto bg-electric-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-electric-400"
                  >
                    <path d="M12 2v4" />
                    <path d="m4.93 10.93 2.83-2.83" />
                    <path d="M2 18h4" />
                    <path d="m19.07 10.93-2.83-2.83" />
                    <path d="M18 18h4" />
                    <path d="m14.83 14.83 2.83 2.83" />
                    <path d="M12 18v4" />
                    <path d="m9.17 14.83-2.83 2.83" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <CardTitle>Personalized Feedback</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-200">
                  Receive immediate, personalized feedback on your approach and learn alternative strategies you could
                  try.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-midnight-900 border-neon-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle>Skill Transfer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-200">
                  Build confidence and skills that transfer directly to real-world situations in sports, school, and
                  future careers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to practice?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Start with a beginner scenario or jump right into an advanced challenge. Your skills will improve with each
            practice session.
          </p>
          <Button asChild size="lg" className="bg-neon-600 hover:bg-neon-700">
            <Link href="/scenarios/receiving-criticism">Try Featured Scenario</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper component for scenario cards
function ScenarioCard({ title, description, image, category, difficulty, slug }) {
  // Map difficulty to color
  const difficultyColor = {
    Beginner: "text-green-400 bg-green-500/10",
    Intermediate: "text-yellow-400 bg-yellow-500/10",
    Advanced: "text-red-400 bg-red-500/10",
  }[difficulty]

  return (
    <Card className="bg-midnight-900 border-neon-500/10 overflow-hidden flex flex-col h-full">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="bg-neon-500/20 text-neon-400 hover:bg-neon-500/30">{category}</Badge>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-300">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-neon-600 hover:bg-neon-700">
          <Link href={`/scenarios/${slug}`}>Start Scenario</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
