import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, MessageSquare, Home } from "lucide-react"

export default function ContactSuccessPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-midnight-900 border-green-500/20 shadow-2xl">
            <CardContent className="p-12">
              <div className="mb-8">
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                  Message Sent Successfully!
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Thank you for reaching out to UpSide AI. We've received your message and will respond within 2-4 hours
                  during business hours.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-green-400 mb-2">What happens next?</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li>• A confirmation email has been sent to your inbox</li>
                  <li>• Our team will review your message personally</li>
                  <li>• We'll provide tailored guidance for your situation</li>
                  <li>• You'll hear back from us soon!</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild className="border-neon-500/20">
                  <Link href="/" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild className="bg-neon-600 hover:bg-neon-700">
                  <Link href="/chat" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with AI Teammate
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
