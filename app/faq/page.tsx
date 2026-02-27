import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  MessageSquare,
  Shield,
  Users,
  GraduationCap,
  Heart,
  Smartphone,
  HelpCircle,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | UpSide AI",
  description:
    "Find answers to common questions about UpSide AI's life strategy tools for scholar-athletes from rural communities.",
}

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: GraduationCap,
    color: "bg-blue-500/10 text-blue-600",
    questions: [
      {
        question: "What is UpSide AI and who is it for?",
        answer:
          "UpSide AI is a platform designed specifically for scholar-athletes from low-income rural areas. We provide AI-powered life strategy tools to help develop self-efficacy, emotional intelligence, social awareness, and future-focused thinking about career opportunities.",
      },
      {
        question: "How do I get started with UpSide AI?",
        answer:
          "Simply sign up for a free account and complete our brief onboarding assessment. This helps us understand your background, goals, and current challenges so we can personalize your experience. You'll then have access to our AI teammate, assessments, and resource library.",
      },
      {
        question: "Is UpSide AI really free?",
        answer:
          "Yes! UpSide AI is completely free for students. Our mission is to democratize access to life strategy tools, so we don't charge students for any of our core features including the AI teammate, assessments, or resources.",
      },
      {
        question: "Do I need to be a student-athlete to use UpSide AI?",
        answer:
          "While our platform is designed with scholar-athletes in mind, any student from a rural or low-income background can benefit from our tools. The strategies we teach are valuable for anyone looking to develop life skills and plan for their future.",
      },
    ],
  },
  {
    id: "ai-teammate",
    title: "AI Teammate",
    icon: MessageSquare,
    color: "bg-neon-500/10 text-neon-600",
    questions: [
      {
        question: "How does the AI teammate work?",
        answer:
          "Our AI teammate is trained specifically to understand the unique challenges faced by rural scholar-athletes. It provides personalized guidance on academic planning, athletic development, emotional regulation, social situations, and career exploration. The more you interact with it, the better it understands your specific needs.",
      },
      {
        question: "What kind of questions can I ask the AI teammate?",
        answer:
          "You can ask about anything related to your personal development: managing stress during competition, balancing academics and athletics, dealing with social situations, planning for college or career, setting goals, or working through emotional challenges. The AI is trained to provide supportive, practical advice.",
      },
      {
        question: "Is my conversation with the AI private?",
        answer:
          "Yes, your conversations are private and secure. We use your interactions to improve the AI's responses for you personally, but we never share individual conversations. All data is encrypted and stored securely.",
      },
      {
        question: "Can the AI teammate replace talking to a counselor or coach?",
        answer:
          "No, the AI teammate is a supplement to, not a replacement for, human support. While it can provide valuable guidance and strategies, we always encourage you to also talk with trusted adults like counselors, coaches, teachers, or family members about important decisions.",
      },
    ],
  },
  {
    id: "assessments",
    title: "Assessments & Growth",
    icon: Heart,
    color: "bg-electric-500/10 text-electric-600",
    questions: [
      {
        question: "What assessments are available?",
        answer:
          "We offer assessments for self-efficacy, emotional intelligence, social awareness, stress management, goal-setting, and future planning. Each assessment takes 5-15 minutes and provides personalized insights and recommendations.",
      },
      {
        question: "How often should I take assessments?",
        answer:
          "We recommend taking the initial assessments when you first join, then retaking them every 3-6 months to track your growth. You can also take specific assessments anytime you're working on a particular area of development.",
      },
      {
        question: "What happens after I complete an assessment?",
        answer:
          "You'll receive a detailed report with your results, personalized insights, and specific action steps. The AI teammate will also use these results to provide more targeted guidance, and you'll get recommendations for relevant resources and scenarios to practice.",
      },
      {
        question: "Are the assessments scientifically validated?",
        answer:
          "Yes, our assessments are based on established psychological research and validated instruments. They're adapted specifically for the experiences and challenges of rural scholar-athletes while maintaining scientific rigor.",
      },
    ],
  },
  {
    id: "privacy-safety",
    title: "Privacy & Safety",
    icon: Shield,
    color: "bg-green-500/10 text-green-600",
    questions: [
      {
        question: "How is my personal information protected?",
        answer:
          "We use industry-standard encryption and security measures to protect your data. We collect only the information necessary to provide our services, and we never sell or share your personal information with third parties.",
      },
      {
        question: "Do my parents need to give permission?",
        answer:
          "If you're under 18, yes. We require parental consent for minors to use our platform. This ensures parents are aware of and comfortable with their child's participation in our program.",
      },
      {
        question: "What if I'm having a mental health crisis?",
        answer:
          "If you're experiencing thoughts of self-harm or suicide, please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately. Our AI teammate can provide support for everyday challenges but is not equipped to handle crisis situations.",
      },
      {
        question: "Can my school or coaches see my UpSide AI activity?",
        answer:
          "No, your activity on UpSide AI is private. We don't share information with schools, coaches, or other third parties unless you explicitly choose to share something or in rare cases where we're legally required to do so for safety reasons.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: Smartphone,
    color: "bg-purple-500/10 text-purple-600",
    questions: [
      {
        question: "What devices can I use UpSide AI on?",
        answer:
          "UpSide AI works on any device with a web browser - smartphones, tablets, laptops, or desktop computers. We've optimized the experience for mobile devices since we know many rural students primarily use smartphones.",
      },
      {
        question: "Do I need a fast internet connection?",
        answer:
          "No, UpSide AI is designed to work well even with slower rural internet connections. The platform loads efficiently and most features work with basic connectivity.",
      },
      {
        question: "What if I'm having technical problems?",
        answer:
          "If you're experiencing technical issues, try refreshing your browser first. If problems persist, you can contact our support team through the contact form or email us directly. We typically respond within 24 hours.",
      },
      {
        question: "Is there a mobile app?",
        answer:
          "Currently, UpSide AI is a web-based platform that works great on mobile browsers. We're considering developing a dedicated mobile app based on user feedback and demand.",
      },
    ],
  },
  {
    id: "parents-coaches",
    title: "For Parents & Coaches",
    icon: Users,
    color: "bg-orange-500/10 text-orange-600",
    questions: [
      {
        question: "How can parents support their child's use of UpSide AI?",
        answer:
          "Parents can encourage regular use, ask about what their child is learning, and help them apply the strategies in real life. We also provide resources specifically for parents to understand the platform and support their child's development.",
      },
      {
        question: "Can coaches integrate UpSide AI into their programs?",
        answer:
          "While individual student accounts are private, coaches can encourage their athletes to use UpSide AI and can access our coaching resources to learn about the strategies we teach. We're developing coach-specific tools for team integration.",
      },
      {
        question: "Are there resources for parents who want to learn more?",
        answer:
          "Yes! We have a dedicated section for parents with guides on supporting rural scholar-athletes, understanding the challenges they face, and helping them develop life skills. Check out our 'For Parents' resource section.",
      },
      {
        question: "How do I know if UpSide AI is helping my child?",
        answer:
          "Look for signs like improved confidence, better stress management, clearer goal-setting, and more thoughtful decision-making. Your child can also share their assessment results and progress with you if they choose to.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-500/5 to-electric-500/5" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 border-neon-500/20 text-neon-400">
              <HelpCircle className="w-3 h-3 mr-1" />
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Got Questions?
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-400 to-electric-400">
                We've Got Answers
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to common questions about UpSide AI and how it can help you develop life skills and plan for
              your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-neon-600 hover:bg-neon-700">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Still Have Questions?
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-electric-500/20 text-white hover:bg-electric-500/10"
              >
                <Link href="/chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Try AI Teammate
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="bg-midnight-900/50 border-neon-500/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-gray-400">{category.questions.length} questions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.questions.map((faq, index) => (
                    <div key={index}>
                      <h3 className="text-white font-semibold mb-3 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-neon-400 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed ml-6">{faq.answer}</p>
                      {index < category.questions.length - 1 && <Separator className="mt-6 bg-neon-500/10" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-neon-500/5 to-electric-500/5 border-neon-500/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? We're here to help! Reach out to our support team or explore our
                other resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Button asChild variant="outline" className="border-neon-500/20 text-white hover:bg-neon-500/10">
                  <Link href="/contact" className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-electric-500/20 text-white hover:bg-electric-500/10"
                >
                  <Link href="/resources" className="flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Browse Resources
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500/20 text-white hover:bg-purple-500/10">
                  <Link href="/about" className="flex items-center justify-center">
                    <Users className="w-4 h-4 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Resources */}
      <div className="container mx-auto px-4 pb-16">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Phone className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Crisis Resources</h3>
                <p className="text-gray-300 mb-3">
                  If you're experiencing a mental health crisis or thoughts of self-harm, please reach out for immediate
                  help:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">
                    <strong className="text-white">National Suicide Prevention Lifeline:</strong> 988
                  </div>
                  <div className="text-gray-300">
                    <strong className="text-white">Crisis Text Line:</strong> Text HOME to 741741
                  </div>
                  <div className="text-gray-300">
                    <strong className="text-white">Emergency Services:</strong> 911
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
