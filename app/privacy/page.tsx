import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <Card className="bg-midnight-900 border-neon-500/20">
            <CardContent className="p-8 prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg mb-8">Last updated: {new Date().toLocaleDateString()}</p>

              <div className="space-y-8 text-gray-300">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, use our AI
                    chat features, complete assessments, or contact us for support.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, personalize your
                    experience, and communicate with you about your account and our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Conversations</h2>
                  <p>
                    When you sign in, we store your email address and your conversation history &mdash; the messages you
                    send and UpSide&apos;s replies &mdash; so you can revisit past conversations and continue them across
                    your devices. Each conversation is tied to your account and protected by database row-level security,
                    and every request is checked against your signed-in identity on the server. This means no other
                    account can ever read, edit, or delete your chats.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Using UpSide as a Guest</h2>
                  <p>
                    You can use the chat without an account. Guest conversations are ephemeral: they are not saved to any
                    account and disappear when you leave. Sign in whenever you want your history to be saved and synced.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Control &amp; Signing Out</h2>
                  <p>
                    You can rename or delete any conversation at any time from the chat history panel, and deleting a
                    conversation permanently removes its messages. Signing out ends your session and clears your visible
                    conversations from the screen on that device, so the next person using it does not see your personal
                    information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">If You Are in Crisis</h2>
                  <p>
                    UpSide is a supportive thought partner, not a human or a licensed professional, and it is not an
                    emergency service. If you are struggling with thoughts of self-harm or feel unsafe, please reach out
                    to a real person now. In the US you can call or text{" "}
                    <a href="tel:988" className="text-neon-400 hover:text-neon-300">
                      988
                    </a>{" "}
                    (Suicide &amp; Crisis Lifeline) or text HOME to{" "}
                    <a href="sms:741741" className="text-neon-400 hover:text-neon-300">
                      741741
                    </a>{" "}
                    (Crisis Text Line). If you are in immediate danger, call{" "}
                    <a href="tel:911" className="text-neon-400 hover:text-neon-300">
                      911
                    </a>
                    .
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Eligibility &amp; Privacy</h2>
                  <p>
                    UpSide AI is intended for college athletes who are 18 years of age or older. We take your privacy
                    seriously and comply with applicable privacy laws. Your account and conversations are yours, and we
                    never share them with your school, athletic department, or coaches without your explicit consent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at{" "}
                    <Link href="/contact" className="text-neon-400 hover:text-neon-300">
                      privacy@upsideai.com
                    </Link>
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
