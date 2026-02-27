"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Target,
  Lightbulb,
  ArrowLeft,
  Heart,
  Zap,
  Globe,
  Star,
  Users,
  Award,
  Brain,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl relative z-10">
        {/* Floating Back Button */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="outline"
            className="group border-neon-400/40 bg-neon-500/10 backdrop-blur-sm text-neon-300 hover:bg-neon-500/20 hover:border-neon-400/60 hover:text-neon-200 transition-all duration-300 text-sm md:text-base px-4 md:px-5 py-4 md:py-5 shadow-lg shadow-neon-500/20 hover:shadow-xl hover:shadow-neon-400/30"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </motion.div>

        <motion.section
          className="text-center mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent mb-4 md:mb-6 lg:mb-8 tracking-tight px-2">
            About UpSide AI
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
            Democratizing access to life strategy tools for rural Texans, fostering
            <span className="text-secondary font-medium"> self-efficacy</span>,
            <span className="text-primary font-medium"> emotional intelligence</span>, and
            <span className="text-accent font-medium"> career readiness</span>.
          </p>
        </motion.section>

        <motion.section
          className="mb-16 md:mb-20 lg:mb-24"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-primary to-accent rounded-3xl blur opacity-20" />

            <Card className="relative bg-card/80 border-0 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10 p-6 md:p-8 text-center border-b border-border">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
                    Meet the Founder
                  </h2>
                  <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full" />
                </div>

                <div className="p-6 md:p-8 lg:p-12">
                  <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-center">
                    <div className="lg:col-span-2 flex flex-col items-center">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-secondary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500" />

                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                          <Image
                            src="/founder-marqez-bimage.png"
                            alt="Marqez Bimage, Founder of UpSide AI"
                            width={320}
                            height={320}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                        </div>
                      </div>

                      <div className="text-center mt-6 md:mt-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Marqez Bimage</h3>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Star className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">Founder & Visionary</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4 md:space-y-6">
                      <motion.div
                        className="bg-gradient-to-r from-secondary/5 to-transparent p-4 md:p-6 rounded-xl border border-secondary/10"
                        variants={fadeInUp}
                      >
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg">
                          Marqez Bimage is a fifth-generation Texan and a proud alumnus of the University of Texas at
                          Austin and the University of California, Berkeley. As a Pell Grant recipient, he faced
                          challenges in developing <span className="text-secondary font-medium">self-efficacy</span>,
                          building <span className="text-primary font-medium">emotional intelligence</span>, and
                          preparing for <span className="text-accent font-medium">career readiness</span> throughout his
                          academic, social, and athletic journey. He witnessed his teammates struggle with the same
                          obstacles, driving him to create a transformative digital tool for the next generation of
                          athletes.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-primary/5 to-transparent p-4 md:p-6 rounded-xl border border-primary/10"
                        variants={fadeInUp}
                      >
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          A highly rated recruit from Brenham, Texas, Marqez earned a full scholarship to UT Austin. In
                          2020, during a time of great uncertainty, he made the difficult decision to opt out of the
                          Texas football season, a choice shaped by the stark difference he observed between the athlete
                          experience and that of the broader student body.
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-accent/5 to-transparent p-4 md:p-6 rounded-xl border border-accent/10"
                        variants={fadeInUp}
                      >
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          The following year, he was accepted to graduate school at UC Berkeley, where he walked on to
                          the football team, earned a scholarship, and was honored as the Jonathan and Judy Hoff Scholar
                          Athlete of the Year.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          className="mb-16 md:mb-20 lg:mb-24"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur opacity-20" />

            <Card className="relative bg-card/80 border-0 backdrop-blur-xl rounded-2xl md:rounded-3xl">
              <CardContent className="p-6 md:p-8 lg:p-12">
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                    Our Mission
                  </h2>
                  <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed font-light text-center px-4">
                    UpSide AI was created to close the gap in access to meaningful technology for rural Texas athletes.
                    It's more than just an app. It's a{" "}
                    <span className="text-secondary font-medium">digital teammate</span> offering personalized guidance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center p-4 md:p-6 rounded-xl bg-primary/5 border border-primary/10">
                      <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3" />
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Self-Efficacy</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">Fostering belief in personal abilities</p>
                    </div>

                    <div className="text-center p-4 md:p-6 rounded-xl bg-secondary/5 border border-secondary/10">
                      <Brain className="w-6 h-6 md:w-8 md:h-8 text-secondary mx-auto mb-3" />
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                        Emotional Intelligence
                      </h3>
                      <p className="text-muted-foreground text-xs md:text-sm">Building self-awareness and empathy</p>
                    </div>

                    <div className="text-center p-4 md:p-6 rounded-xl bg-accent/5 border border-accent/10 sm:col-span-2 md:col-span-1">
                      <Target className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-3" />
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Career Readiness</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">Preparing for future opportunities</p>
                    </div>
                  </div>

                  <div className="text-center pt-6 md:pt-8">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl w-full sm:w-auto"
                    >
                      <Link href="/chat">Experience Our Platform</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          className="mb-16 md:mb-20 lg:mb-24"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
              The Challenge
            </h2>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-destructive/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-destructive/20 transition-colors duration-300">
                    <Globe className="w-7 h-7 md:w-8 md:h-8 text-destructive" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-destructive mb-3 md:mb-4">Geographic Isolation</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Rural communities often lack access to advanced coaching resources and networking opportunities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-orange-500/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <Shield className="w-7 h-7 md:w-8 md:h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-orange-400 mb-3 md:mb-4">Resource Gaps</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Fewer guidance counselors, career coaches, and life strategy tools per student.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-yellow-500/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-yellow-500/20 transition-colors duration-300">
                    <Zap className="w-7 h-7 md:w-8 md:h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 md:mb-4">Confidence Barriers</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Self-doubt about competing with peers from better-resourced backgrounds.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16 md:mb-20 lg:mb-24"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4 md:mb-6">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              These principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-500 group hover:transform hover:scale-105">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                    <Shield className="w-7 h-7 md:w-8 md:h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-3 md:mb-4">Access</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Every student athlete deserves the same opportunities, regardless of their ZIP code.
                  </p>
                  <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">Universal Opportunity</Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 group hover:transform hover:scale-105">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Award className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">Excellence</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    We provide world-class AI guidance designed specifically for the unique challenges rural athletes
                    face.
                  </p>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Premium Support</Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                    <Lightbulb className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-accent mb-3 md:mb-4">Innovation</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    We harness cutting-edge AI to solve real problems and create meaningful impact.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-12 md:mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              What Makes UpSide AI Different
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              UpSide AI isn't just another app. It's a movement built specifically for rural scholar-athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300 mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-secondary mb-3">
                    From Cleats to Code: Athlete-Built
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    UpSide AI was designed by Marqez Bimage, who experienced firsthand the challenges rural athletes
                    face. Our platform isn't built from theory alone. It's rooted in real-life experience and a deep
                    understanding of what it means to balance athletics, academics, and personal growth in
                    resource-limited environments.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-3">Research-Backed Approach</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Our AI guidance is informed by established psychological frameworks, including Albert Bandura's
                    self-efficacy theory and Jack Canfield's E+R=O success principles. We blend evidence-based
                    strategies with practical, athlete-friendly advice you can actually use.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-3">Privacy-First Design</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Your conversations, goals, and progress are yours alone. We prioritize data security and use
                    encryption to protect your information. We never share your data with third parties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="group" variants={fadeInUp}>
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300 mb-4">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-accent mb-3">Community-Driven Growth</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Students, coaches, and parents help shape our roadmap through feedback and feature requests. This
                    isn't built in a Silicon Valley bubble. It's built with and for rural communities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16 md:mb-20 lg:mb-24"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-primary to-accent rounded-3xl blur opacity-20" />

            <Card className="relative bg-card/80 border-0 backdrop-blur-xl rounded-2xl md:rounded-3xl">
              <CardContent className="p-6 md:p-8 lg:p-12">
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
                    Our AI Framework
                  </h2>
                  <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full" />
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-4 md:mt-6 max-w-3xl mx-auto px-4">
                    UpSide AI's responses are built on proven psychological frameworks that help athletes develop
                    resilience and emotional intelligence.
                  </p>
                </div>

                <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
                  {/* E+R=O Framework */}
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardContent className="p-6 md:p-8 lg:p-12">
                      <h3 className="text-xl md:text-2xl font-bold text-accent mb-4 flex items-center gap-3">
                        <Target className="w-6 h-6 md:w-8 md:h-8" />
                        <span>The E+R=O Framework</span>
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                        UpSide AI helps you understand that while you can't always control Events, you can control your
                        Response, which determines your Outcome:
                      </p>

                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start gap-3 p-3 md:p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-accent font-bold text-sm md:text-base">E</span>
                          </div>
                          <div>
                            <span className="text-accent font-medium text-base md:text-lg">Event:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2 block mt-1">
                              What happens to you (often outside your control)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center text-xl md:text-2xl text-muted-foreground font-bold">
                          +
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-sm md:text-base">R</span>
                          </div>
                          <div>
                            <span className="text-primary font-medium text-base md:text-lg">Response:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2 block mt-1">
                              How you choose to react (100% in your control)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center text-xl md:text-2xl text-muted-foreground font-bold">
                          =
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary font-bold text-sm md:text-base">O</span>
                          </div>
                          <div>
                            <span className="text-secondary font-medium text-base md:text-lg">Outcome:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2 block mt-1">
                              The result of your choices and actions
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-xs md:text-sm mt-6 italic">
                        Remember: You can't always choose what happens, but you can always choose how you respond.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Maslow's Hierarchy of Needs */}
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardContent className="p-6 md:p-8 lg:p-12">
                      <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                        <span>Maslow's Hierarchy of Needs</span>
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                        UpSide AI recognizes that your needs exist on multiple levels. We meet you where you are and
                        help you build a strong foundation:
                      </p>

                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start gap-3 p-3 md:p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-xs md:text-sm">1</span>
                          </div>
                          <div>
                            <span className="text-primary font-medium text-sm md:text-base">Basic Needs:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2">
                              Food, rest, and physical safety come first
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                          <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary font-bold text-xs md:text-sm">2</span>
                          </div>
                          <div>
                            <span className="text-secondary font-medium text-sm md:text-base">Safety & Security:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2">
                              Stability in school, sports, and relationships
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-accent font-bold text-xs md:text-sm">3</span>
                          </div>
                          <div>
                            <span className="text-accent font-medium text-sm md:text-base">
                              Belonging & Connection:
                            </span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2">
                              Building meaningful relationships with teammates, family, and community
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-xs md:text-sm">4</span>
                          </div>
                          <div>
                            <span className="text-primary font-medium text-sm md:text-base">
                              Self-Esteem & Recognition:
                            </span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2">
                              Building confidence through achievement and validation
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 md:p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                          <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-secondary font-bold text-xs md:text-sm">5</span>
                          </div>
                          <div>
                            <span className="text-secondary font-medium text-sm md:text-base">Self-Actualization:</span>
                            <span className="text-muted-foreground text-xs md:text-sm ml-2">
                              Reaching your full potential and purpose
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
