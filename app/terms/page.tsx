import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8 text-gray-400 hover:text-white">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-400 to-electric-400">
            Terms of Service
          </h1>

          <Card className="bg-midnight-900 border-neon-500/20">
            <CardContent className="p-8 prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg mb-8">Last updated: {new Date().toLocaleDateString()}</p>

              <div className="space-y-8 text-gray-300">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                  <p>
                    By accessing and using UpSide AI, you accept and agree to be bound by the terms and provision of
                    this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
                  <p>
                    Permission is granted to temporarily access UpSide AI for personal, non-commercial educational use
                    only. This is the grant of a license, not a transfer of title.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
                  <p>
                    Users are responsible for maintaining the confidentiality of their account information and for all
                    activities that occur under their account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Educational Purpose</h2>
                  <p>
                    UpSide AI is designed for educational and personal development purposes. Our AI guidance should not
                    replace professional counseling or medical advice when needed.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  <p>
                    Questions about the Terms of Service should be sent to us at{" "}
                    <a href="mailto:contact.mbimage@gmail.com" className="text-neon-400 hover:text-neon-300">
                      contact.mbimage@gmail.com
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
