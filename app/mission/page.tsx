import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Target, Heart, Lightbulb } from "lucide-react"

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-8 text-gray-400 hover:text-white">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-400 to-electric-400">
            Our Mission
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            To help Texas college athletes confidently navigate the moments that shape who they become and what comes
            next.
          </p>
        </div>

        {/* SEC Framework — the philosophy guiding UpSide conversations */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-midnight-900 border-neon-500/20">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-neon-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Self-Efficacy</h3>
              <p className="text-gray-400 text-sm">
                Building confidence in your ability to achieve goals and overcome challenges.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-midnight-900 border-neon-500/20">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-electric-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Emotional Intelligence</h3>
              <p className="text-gray-400 text-sm">Developing skills to understand and manage emotions effectively.</p>
            </CardContent>
          </Card>

          <Card className="bg-midnight-900 border-neon-500/20">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-neon-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Career Readiness</h3>
              <p className="text-gray-400 text-sm">Preparing for opportunities and life after college.</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed mission */}
        <Card className="bg-midnight-900 border-neon-500/20 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Why We Exist</h2>
            <div className="space-y-6 text-gray-300">
              <p>
                College athletes juggle demands that most students never face: the pressure of competition, packed
                schedules, and constant decisions about academics, relationships, and their future. Support from
                coaches, advisors, and counselors is invaluable, but it isn't always available the moment a question or
                situation comes up.
              </p>
              <p>
                At UpSide AI, we believe that every college athlete deserves access to the tools and guidance needed to
                develop crucial life skills. Our AI-powered platform serves as a personalized teammate and mentor,
                available 24/7 to help athletes build the emotional intelligence, self-efficacy, and career readiness
                they need to succeed both on and off the field.
              </p>
              <p>
                We're not just building technology - we're building bridges to opportunity, creating pathways to
                success, and making sure talent and potential aren't limited by who happens to be available.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 mb-6">
            Join the college athletes across Texas who are already using UpSide AI to unlock their potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-neon-600 hover:bg-neon-700">
              <Link href="/signup">Get Started Today</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
