"use client"

import { motion } from "framer-motion"
import {
  Brain,
  BookOpen,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Lightbulb,
  Users,
  Briefcase,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, type MouseEvent, type TouchEvent } from "react"

const HowToUseAI = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleSectionToggle = (section: string, event: MouseEvent | TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <motion.section
        className="relative py-20 px-4 text-center overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="relative max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8 tracking-tight"
            variants={fadeInUp}
          >
            AI for College Athletes
          </motion.h1>
          <motion.div className="max-w-5xl mx-auto" variants={fadeInUp}>
            <motion.p
              className="text-xl md:text-2xl text-slate-300 text-center leading-relaxed font-light mb-8"
              variants={fadeInUp}
            >
              Build your three essential skills through AI-powered guidance:
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div
                className={`group bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center hover:border-blue-400/40 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  expandedSection === "self-efficacy" ? "ring-2 ring-blue-400/50" : ""
                } touch-manipulation select-none`}
                variants={fadeInUp}
                onClick={(e) => handleSectionToggle("self-efficacy", e)}
                onTouchEnd={(e) => handleSectionToggle("self-efficacy", e)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Self-Efficacy</h3>
                <p className="text-slate-400 text-sm mb-3">(Confidence)</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Build unshakeable belief in your abilities to succeed in academics and athletics
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                    <ChevronDown
                      className={`w-8 h-8 text-blue-400 transition-transform duration-300 ${
                        expandedSection === "self-efficacy" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedSection === "self-efficacy" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-blue-500/20"
                  >
                    <div className="text-left space-y-3">
                      <h4 className="text-blue-400 font-semibold text-sm">How AI Helps Build Self-Efficacy:</h4>
                      <ul className="space-y-2 text-slate-300 text-xs">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Personalized goal setting and achievement tracking
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Confidence-building exercises tailored to your challenges
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Success pattern recognition and reinforcement
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Overcoming imposter syndrome through evidence-based feedback
                        </li>
                      </ul>
                      <div className="bg-blue-500/10 rounded-lg p-3 mt-3">
                        <p className="text-blue-300 text-xs italic">
                          "I believe I can improve my performance through effort and practice"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`group bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-400/40 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  expandedSection === "emotional-intelligence" ? "ring-2 ring-purple-400/50" : ""
                } touch-manipulation select-none`}
                variants={fadeInUp}
                onClick={(e) => handleSectionToggle("emotional-intelligence", e)}
                onTouchEnd={(e) => handleSectionToggle("emotional-intelligence", e)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Emotional Intelligence</h3>
                <p className="text-slate-400 text-sm mb-3">(People Skills)</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Master social awareness and relationship management for team success
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                    <ChevronDown
                      className={`w-8 h-8 text-purple-400 transition-transform duration-300 ${
                        expandedSection === "emotional-intelligence" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedSection === "emotional-intelligence" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-purple-500/20"
                  >
                    <div className="text-left space-y-3">
                      <h4 className="text-purple-400 font-semibold text-sm">How AI Develops Emotional Intelligence:</h4>
                      <ul className="space-y-2 text-slate-300 text-xs">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Social situation analysis and response coaching
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Emotion recognition and regulation techniques
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Team communication and leadership skill building
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Conflict resolution and empathy development
                        </li>
                      </ul>
                      <div className="bg-purple-500/10 rounded-lg p-3 mt-3">
                        <p className="text-purple-300 text-xs italic">
                          "I can read the room and respond appropriately to social cues"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`group bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  expandedSection === "career-readiness" ? "ring-2 ring-cyan-400/50" : ""
                } touch-manipulation select-none`}
                variants={fadeInUp}
                onClick={(e) => handleSectionToggle("career-readiness", e)}
                onTouchEnd={(e) => handleSectionToggle("career-readiness", e)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Briefcase className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Career Readiness</h3>
                <p className="text-slate-400 text-sm mb-3">(Job Skills)</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Develop professional skills and workforce preparation for your future
                </p>

                <div className="mt-4 flex justify-center">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
                    <ChevronDown
                      className={`w-8 h-8 text-cyan-400 transition-transform duration-300 ${
                        expandedSection === "career-readiness" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedSection === "career-readiness" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-cyan-500/20"
                  >
                    <div className="text-left space-y-3">
                      <h4 className="text-cyan-400 font-semibold text-sm">How AI Builds Career Readiness:</h4>
                      <ul className="space-y-2 text-slate-300 text-xs">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Professional communication and networking skills
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Resume building and interview preparation
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Industry insights and career pathway exploration
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          Time management and professional etiquette
                        </li>
                      </ul>
                      <div className="bg-cyan-500/10 rounded-lg p-3 mt-3">
                        <p className="text-cyan-300 text-xs italic">
                          "I'm prepared for the professional world and future opportunities"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="mb-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          variants={fadeInUp}
        >
          How to Get Started
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center cursor-pointer hover:border-green-400/40 transition-all duration-300 ${
                expandedSection === "start-simple" ? "ring-2 ring-green-400/50" : ""
              } touch-manipulation select-none`}
              variants={fadeInUp}
              onClick={(e) => handleSectionToggle("start-simple", e)}
              onTouchEnd={(e) => handleSectionToggle("start-simple", e)}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-3">Start Simple</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ask basic questions like "How can I manage my time better?" or "Help me prepare for my math test."
              </p>

              <div className="mt-4 flex justify-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-all">
                  <ChevronDown
                    className={`w-8 h-8 text-green-400 transition-transform duration-300 ${
                      expandedSection === "start-simple" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedSection === "start-simple" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-green-500/20"
                >
                  <div className="text-left space-y-3">
                    <h4 className="text-green-400 font-semibold text-sm">Simple Starter Questions:</h4>
                    <ul className="space-y-2 text-slate-300 text-xs">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "Help me create a study schedule for this week"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "I'm nervous about my upcoming game, what should I do?"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "How can I stay motivated when training gets tough?"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "What's the best way to take notes in class?"
                      </li>
                    </ul>
                    <div className="bg-green-500/10 rounded-lg p-3 mt-3">
                      <p className="text-green-300 text-xs italic">
                        "Start with everyday challenges - AI understands your world!"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400/40 transition-all duration-300 ${
                expandedSection === "be-specific" ? "ring-2 ring-blue-400/50" : ""
              } touch-manipulation select-none`}
              variants={fadeInUp}
              onClick={(e) => handleSectionToggle("be-specific", e)}
              onTouchEnd={(e) => handleSectionToggle("be-specific", e)}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Be Specific</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                The more details you share, the better help you'll get. Include your sport, grade level, and specific
                challenges.
              </p>

              <div className="mt-4 flex justify-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all">
                  <ChevronDown
                    className={`w-8 h-8 text-blue-400 transition-transform duration-300 ${
                      expandedSection === "be-specific" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedSection === "be-specific" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-blue-500/20"
                >
                  <div className="text-left space-y-3">
                    <h4 className="text-blue-400 font-semibold text-sm">How to Be More Specific:</h4>
                    <ul className="space-y-2 text-slate-300 text-xs">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        Include your grade level and current GPA
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        Mention your sport and position you play
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        Describe your specific challenge or goal
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        Share what you've already tried
                      </li>
                    </ul>
                    <div className="bg-blue-500/10 rounded-lg p-3 mt-3">
                      <p className="text-blue-300 text-xs italic">
                        "I'm a 10th grade basketball player struggling with free throws under pressure"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-400/40 transition-all duration-300 ${
                expandedSection === "keep-going" ? "ring-2 ring-purple-400/50" : ""
              } touch-manipulation select-none`}
              variants={fadeInUp}
              onClick={(e) => handleSectionToggle("keep-going", e)}
              onTouchEnd={(e) => handleSectionToggle("keep-going", e)}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-purple-400 mb-3">Keep Going</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ask follow-up questions, try different approaches, and build on previous conversations.
              </p>

              <div className="mt-4 flex justify-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-all">
                  <ChevronDown
                    className={`w-8 h-8 text-purple-400 transition-transform duration-300 ${
                      expandedSection === "keep-going" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expandedSection === "keep-going" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-purple-500/20"
                >
                  <div className="text-left space-y-3">
                    <h4 className="text-purple-400 font-semibold text-sm">Ways to Continue the Conversation:</h4>
                    <ul className="space-y-2 text-slate-300 text-xs">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "Can you give me more examples of that?"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "What if that doesn't work for me?"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "How do I track my progress with this?"
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        "Can you adapt this for my specific situation?"
                      </li>
                    </ul>
                    <div className="bg-purple-500/10 rounded-lg p-3 mt-3">
                      <p className="text-purple-300 text-xs italic">
                        "The best conversations happen when you keep asking questions!"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="mt-8 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-2 border-cyan-500/40 rounded-2xl p-8 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/60 hover:shadow-cyan-500/20 transition-all duration-300"
            variants={fadeInUp}
          >
            <h4 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Quick Start Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div className="space-y-3">
                <p className="text-slate-100 leading-relaxed">
                  <span className="text-green-400 font-semibold">Academic:</span> "I have a history test tomorrow and
                  I'm stressed about memorizing dates"
                </p>
                <p className="text-slate-100 leading-relaxed">
                  <span className="text-blue-400 font-semibold">Athletic:</span> "I keep getting nervous before
                  basketball games. How can I stay calm?"
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-slate-100 leading-relaxed">
                  <span className="text-purple-400 font-semibold">Social:</span> "I want to be more confident when
                  talking to new people"
                </p>
                <p className="text-slate-100 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Goals:</span> "Help me create a plan to improve my
                  grades this semester"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.section
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Academic Excellence
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 ml-3">Research & Writing</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Find research papers, summarize articles, and generate essay outlines instantly.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  AI-powered search for quick information
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Grammar and style improvement tools
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Overcome writer's block with idea generation
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400 ml-3">Smart Studying</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Personalized learning that adapts to your strengths and schedule.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Adaptive flashcards for memorization
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Personalized tutoring for tough subjects
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Custom practice questions and quizzes
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Athletic Performance
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors duration-300">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 ml-3">Training Optimization</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Analyze performance data and optimize your training routines.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Creating a summer workout plan
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Personalized coaching recommendations
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Real-time technique feedback
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400 ml-3">Injury Prevention</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Stay healthy with AI-powered movement analysis and recovery guidance.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Movement tracking and analysis
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Guided recovery programs
                </li>
                <li className="flex items-start">
                  <Zap className="w-3 h-3 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                  Posture and balance optimization
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Real Scenarios
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400 ml-3">Time Management</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-blue-400 font-semibold">Challenge:</span> Balancing studies with training
                schedules.
                <br />
                <span className="text-cyan-400 font-semibold">Solution:</span> AI creates personalized study plans that
                fit around practices, optimizing both academic and athletic performance.
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400 ml-3">Skill Development</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="text-purple-400 font-semibold">Challenge:</span> Improving specific athletic skills.
                <br />
                <span className="text-cyan-400 font-semibold">Solution:</span> AI analyzes technique, identifies
                weaknesses, and provides targeted training recommendations with progress tracking.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Level Up?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              AI gives college athletes the competitive edge needed to excel in academics, athletics, and life.
            </p>

            {/* Chat Link */}
            <div className="max-w-md mx-auto">
              <Link href="/chat">
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm">Try asking: "I need a teammate to help me with my goals"</p>
                    </div>
                    <div className="text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default HowToUseAI
