import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Eye, Keyboard, Volume2, MousePointer } from "lucide-react"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="outline"
          asChild
          className="mb-8 border-neon-400/40 bg-neon-500/10 hover:bg-neon-500/20 hover:border-neon-400/60 text-neon-300 hover:text-neon-200 transition-all duration-300 text-base px-5 py-2.5 shadow-lg shadow-neon-500/20 hover:shadow-xl hover:shadow-neon-400/30"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-400 to-electric-400">
            Accessibility
          </h1>

          <div className="mb-8">
            <p className="text-xl text-gray-300">
              We're committed to making UpSide AI accessible to everyone, including people with disabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-midnight-900 border-neon-500/20">
              <CardContent className="p-6">
                <Eye className="h-8 w-8 text-neon-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visual Accessibility</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• High contrast color schemes</li>
                  <li>• Screen reader compatibility</li>
                  <li>• Scalable fonts and interface elements</li>
                  <li>• Alternative text for images</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-midnight-900 border-neon-500/20">
              <CardContent className="p-6">
                <Keyboard className="h-8 w-8 text-electric-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Full keyboard navigation support</li>
                  <li>• Logical tab order</li>
                  <li>• Visible focus indicators</li>
                  <li>• Keyboard shortcuts available</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-midnight-900 border-neon-500/20">
              <CardContent className="p-6">
                <Volume2 className="h-8 w-8 text-neon-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Audio Features</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Text-to-speech compatibility</li>
                  <li>• Audio descriptions where applicable</li>
                  <li>• Adjustable playback speeds</li>
                  <li>• Visual alternatives to audio cues</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-midnight-900 border-neon-500/20">
              <CardContent className="p-6">
                <MousePointer className="h-8 w-8 text-electric-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Motor Accessibility</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Large click targets</li>
                  <li>• Drag and drop alternatives</li>
                  <li>• Extended timeout options</li>
                  <li>• Single-handed operation support</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-midnight-900 border-neon-500/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  UpSide AI strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                  standards. We regularly audit our platform and work to address any accessibility barriers.
                </p>
                <p>
                  We believe that accessibility benefits everyone, and we're continuously working to improve the user
                  experience for all of our users.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-neon-500/10 to-electric-500/10 border-neon-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Need Help or Have Feedback?</h3>
              <p className="text-gray-300 mb-4">
                If you encounter any accessibility barriers or have suggestions for improvement, we'd love to hear from
                you.
              </p>
              <div className="flex gap-4">
                <Button asChild className="bg-neon-600 hover:bg-neon-700">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-neon-500/20 text-white hover:bg-neon-500/10 bg-transparent"
                >
                  <Link href="mailto:accessibility@upsideai.com">Email Accessibility Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
