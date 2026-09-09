"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, MessageCircle, Brain, ArrowRight } from "lucide-react"
import { AmbientBackground } from "@/components/ambient-background"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const steps = [
  {
    icon: MessageCircle,
    label: "Ask",
    text: "Type whatever's on your mind — a class, a coach, a deal, a bad week. No forms, no setup. Just talk like you'd text a teammate.",
  },
  {
    icon: Brain,
    label: "Think",
    text: "UpSide talks it through with you, asks the right questions, and helps you see the situation clearly — without telling you what to feel.",
  },
  {
    icon: ArrowRight,
    label: "Move",
    text: "You leave with a next move you can actually take today. Small, real, and yours.",
  },
]

const questionGroups = [
  {
    title: "School & Time",
    questions: [
      "How do I balance a full class load with practice and travel?",
      "I'm behind in a class and the season just started. What do I do?",
      "How can I study smarter when I only have an hour between things?",
    ],
  },
  {
    title: "NIL & Money",
    questions: [
      "I got my first NIL offer. What should I check before I say yes?",
      "How do I handle taxes on NIL money as a student in Texas?",
      "How do I build a personal brand without looking fake?",
    ],
  },
  {
    title: "Relationships",
    questions: [
      "How do I talk to my coach about my playing time without it going bad?",
      "There's tension with a teammate. How do I handle it?",
      "My family has big expectations for me. How do I deal with that pressure?",
    ],
  },
  {
    title: "Life After Sport",
    questions: [
      "I don't know what I want to do after college. Where do I start?",
      "How do I find an internship that works around my schedule?",
      "What if my sport doesn't turn pro — what's my plan B?",
    ],
  },
  {
    title: "The Mental Game",
    questions: [
      "I freeze up under pressure. How do I get my confidence back?",
      "I think I'm burning out. Is that normal and what do I do?",
      "How do I bounce back after a bad game or an injury?",
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-midnight-950 relative overflow-hidden">
      <AmbientBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 max-w-4xl relative z-10">
        {/* Back button */}
        <motion.div className="mb-8 md:mb-12" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Button
            asChild
            variant="outline"
            className="group border-neon-400/40 bg-neon-500/10 backdrop-blur-sm text-neon-300 hover:bg-neon-500/20 hover:border-neon-400/60 hover:text-neon-200 transition-all duration-300 text-sm md:text-base px-4 md:px-5 py-4 md:py-5"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </motion.div>

        {/* Hero */}
        <motion.header className="text-center mb-14 md:mb-20" initial="initial" animate="animate" variants={fadeInUp}>
          <span className="inline-block px-3 py-1.5 rounded-full bg-neon-500/10 border border-neon-500/20 text-xs md:text-sm font-medium text-neon-400 mb-5">
            For Texas college athletes
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white text-balance mb-5">
            How UpSide works
          </h1>
          <p className="text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed text-pretty">
            It&apos;s a conversation, not a course. Three steps, whenever you need it.
          </p>
        </motion.header>

        {/* Three steps */}
        <section className="mb-16 md:mb-24" aria-label="How it works in three steps">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.label}
                  className="rounded-2xl border border-neon-500/15 bg-midnight-900/60 backdrop-blur-sm p-6 md:p-7"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-500/20 to-electric-500/20 border border-neon-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-300" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-electric-300">
                      Step {i + 1}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">{step.label}</h2>
                  <p className="text-gray-300/85 text-sm leading-relaxed text-pretty">{step.text}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Suggested questions */}
        <section aria-label="Questions worth asking">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 text-balance">
              Not sure what to ask?
            </h2>
            <p className="text-gray-300/85 max-w-xl mx-auto text-pretty">
              Tap any question below to start the conversation. These are the real ones athletes bring to UpSide.
            </p>
          </motion.div>

          <div className="space-y-8">
            {questionGroups.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.05 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-electric-300 mb-3">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.questions.map((q) => (
                    <Link
                      key={q}
                      href={`/chat?q=${encodeURIComponent(q)}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-neon-500/15 bg-midnight-900/50 hover:bg-neon-500/10 hover:border-neon-400/40 backdrop-blur-sm px-4 py-3.5 text-left transition-all duration-300"
                    >
                      <span className="text-sm text-gray-200 leading-snug text-pretty">{q}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-neon-400/70 group-hover:text-neon-300 group-hover:translate-x-0.5 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-300/85 mb-6 text-pretty">Got your own question? That&apos;s the best place to start.</p>
          <Button
            asChild
            size="lg"
            className="relative group bg-gradient-to-r from-neon-500 to-electric-500 hover:from-neon-400 hover:to-electric-400 text-white px-10 py-5 text-base font-semibold rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(153,51,255,0.4)] hover:shadow-[0_0_40px_rgba(153,51,255,0.6)]"
          >
            <Link href="/chat" className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Talk to UpSide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
