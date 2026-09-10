import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "@/components/contact-form"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Users,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
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

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neon-400 via-electric-400 to-neon-400">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're here to support college athletes across Texas on their journey to success. Reach out anytime - we'd
              love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="outline" className="border-neon-500/30 text-neon-400">
                <Heart className="w-3 h-3 mr-1" />
                Texas Colleges
              </Badge>
              <Badge variant="outline" className="border-electric-500/30 text-electric-400">
                <Users className="w-3 h-3 mr-1" />
                College Athletes
              </Badge>
              <Badge variant="outline" className="border-neon-500/30 text-neon-400">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Support
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-midnight-900 border-neon-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <MessageSquare className="mr-3 h-6 w-6 text-neon-400" />
                    Send us a message
                  </CardTitle>
                  <p className="text-gray-400">
                    Tell us about your goals, challenges, or questions. We typically respond within 2-4 hours.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Primary Contact */}
              <Card className="bg-midnight-900 border-neon-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-neon-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email Support</h3>
                      <a
                        href="mailto:contact.mbimage@gmail.com"
                        className="text-neon-400 hover:text-neon-300 mb-2 inline-block break-all"
                      >
                        contact.mbimage@gmail.com
                      </a>
                      <div className="flex items-center text-sm text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Usually responds in 2-4 hours
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Chat */}
              <Card className="bg-midnight-900 border-electric-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-electric-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">AI Teammate Chat</h3>
                      <p className="text-gray-400 mb-3">Get instant help 24/7</p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-electric-500/30 text-electric-400 hover:bg-electric-500/10 bg-transparent"
                      >
                        <Link href="/chat">Start Chatting</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="bg-midnight-900 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Support Hours</h3>
                      <div className="text-gray-400 space-y-1 text-sm">
                        <p>Monday - Friday: 8 AM - 6 PM CST</p>
                        <p>Saturday: 10 AM - 4 PM CST</p>
                        <p>Sunday: AI Chat Only</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-midnight-900 border-neon-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-neon-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Serving</h3>
                      <p className="text-gray-400 mb-1">Colleges &amp; Universities Across Texas</p>
                      <p className="text-sm text-gray-500">
                        Supporting college athletes throughout the state
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Help Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Need Help Right Away?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-neon-500/10 to-electric-500/10 border-neon-500/30 hover:border-neon-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-12 w-12 text-neon-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Find answers to common questions about our platform and services.
                  </p>
                  <Button variant="outline" size="sm" asChild className="border-neon-500/20 bg-transparent">
                    <Link href="/faq">View FAQ</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-electric-500/10 to-purple-500/10 border-electric-500/30 hover:border-electric-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-electric-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">AI Teammate</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Get instant support and guidance from our AI-powered assistant.
                  </p>
                  <Button size="sm" asChild className="bg-electric-600 hover:bg-electric-700">
                    <Link href="/chat">Chat Now</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-neon-500/10 border-purple-500/30 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    New to UpSide AI? Learn how to make the most of our platform.
                  </p>
                  <Button variant="outline" size="sm" asChild className="border-purple-500/20 bg-transparent">
                    <Link href="/resources/getting-started">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-red-400">Crisis Support</h3>
                  <p className="text-gray-300 mb-4">
                    If you're experiencing a mental health crisis or emergency, please reach out for immediate help:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>National Suicide Prevention Lifeline:</strong> 988
                    </p>
                    <p>
                      <strong>Crisis Text Line:</strong> Text HOME to 741741
                    </p>
                    <p>
                      <strong>Emergency Services:</strong> 911
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
