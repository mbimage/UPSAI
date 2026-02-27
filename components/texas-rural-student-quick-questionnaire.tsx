"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, GraduationCap, Target, MessageSquare, ChevronRight, Shield } from "lucide-react"

export interface TexasRuralStudentData {
  name: string
  grade: string
  school: string
  primaryChallenge?: string
}

interface TexasRuralStudentQuickQuestionnaireProps {
  onComplete: (data: TexasRuralStudentData) => void
  onSkip: () => void
}

const TEXAS_RURAL_SCHOOLS = [
  // East Texas
  "Athens High School",
  "Carthage High School",
  "Center High School",
  "Gilmer High School",
  "Henderson High School",
  "Jacksonville High School",
  "Kilgore High School",
  "Lindale High School",
  "Marshall High School",
  "Mineola High School",
  "Mount Pleasant High School",
  "Nacogdoches High School",
  "Palestine High School",
  "Pittsburg High School",
  "Rusk High School",
  "Tatum High School",
  "Tyler High School",
  "Whitehouse High School",
  "Winona High School",

  // Central Texas
  "Bastrop High School",
  "Brenham High School",
  "Bryan High School",
  "Caldwell High School",
  "Cameron High School",
  "College Station High School",
  "Elgin High School",
  "Giddings High School",
  "Gonzales High School",
  "Granger High School",
  "Hearne High School",
  "Hempstead High School",
  "La Grange High School",
  "Lexington High School",
  "Madisonville High School",
  "Navasota High School",
  "Rockdale High School",
  "Rosebud-Lott High School",
  "Schulenburg High School",
  "Sealy High School",
  "Smithville High School",
  "Somerville High School",
  "Taylor High School",
  "Thorndale High School",
  "Weimar High School",

  // South Texas
  "Alice High School",
  "Beeville High School",
  "Bishop High School",
  "Carrizo Springs High School",
  "Crystal City High School",
  "Cuero High School",
  "Devine High School",
  "Dilley High School",
  "Eagle Pass High School",
  "Falfurrias High School",
  "Floresville High School",
  "George West High School",
  "Goliad High School",
  "Hallettsville High School",
  "Hondo High School",
  "Jourdanton High School",
  "Karnes City High School",
  "Kenedy High School",
  "Kingsville High School",
  "La Vernia High School",
  "Lytle High School",
  "Mathis High School",
  "Nixon High School",
  "Pearsall High School",
  "Pleasanton High School",
  "Poteet High School",
  "Premont High School",
  "Robstown High School",
  "Sinton High School",
  "Three Rivers High School",
  "Taft High School",
  "Uvalde High School",
  "Victoria High School",
  "Yoakum High School",

  // West Texas
  "Alpine High School",
  "Andrews High School",
  "Big Spring High School",
  "Brownfield High School",
  "Canyon High School",
  "Childress High School",
  "Clarendon High School",
  "Colorado City High School",
  "Crane High School",
  "Dalhart High School",
  "Denver City High School",
  "Dimmitt High School",
  "Floydada High School",
  "Fort Stockton High School",
  "Friona High School",
  "Hale Center High School",
  "Hereford High School",
  "Idalou High School",
  "Kermit High School",
  "Lamesa High School",
  "Levelland High School",
  "Littlefield High School",
  "Lockney High School",
  "Marfa High School",
  "McCamey High School",
  "Monahans High School",
  "Morton High School",
  "Muleshoe High School",
  "Ozona High School",
  "Pecos High School",
  "Plains High School",
  "Post High School",
  "Presidio High School",
  "Rankin High School",
  "Seminole High School",
  "Slaton High School",
  "Snyder High School",
  "Sonora High School",
  "Stanton High School",
  "Sweetwater High School",
  "Tahoka High School",
  "Tulia High School",
  "Van Horn High School",

  // North Texas
  "Alvord High School",
  "Archer City High School",
  "Azle High School",
  "Bangs High School",
  "Bowie High School",
  "Boyd High School",
  "Bridgeport High School",
  "Brownwood High School",
  "Burkburnett High School",
  "Cisco High School",
  "Clyde High School",
  "Coleman High School",
  "Comanche High School",
  "Cross Plains High School",
  "Decatur High School",
  "Dublin High School",
  "Early High School",
  "Eastland High School",
  "Electra High School",
  "Gainesville High School",
  "Glen Rose High School",
  "Graham High School",
  "Granbury High School",
  "Hamilton High School",
  "Hico High School",
  "Holliday High School",
  "Iowa Park High School",
  "Jacksboro High School",
  "Mineral Wells High School",
  "Nocona High School",
  "Olney High School",
  "Palo Pinto High School",
  "Ranger High School",
  "Rising Star High School",
  "Seymour High School",
  "Springtown High School",
  "Stephenville High School",
  "Vernon High School",
  "Weatherford High School",
  "Wichita Falls High School",
]

const GRADE_LEVELS = ["9th Grade (Freshman)", "10th Grade (Sophomore)", "11th Grade (Junior)", "12th Grade (Senior)"]

const PRIMARY_CHALLENGES = [
  "Limited resources/opportunities",
  "Transportation issues",
  "College preparation",
  "Academic pressure",
  "Social/peer pressure",
  "Time management",
  "Confidence/self-doubt",
  "Family expectations",
  "Financial concerns",
  "Career planning",
  "Mental health/stress",
  "Other",
]

export function TexasRuralStudentQuickQuestionnaire({ onComplete, onSkip }: TexasRuralStudentQuickQuestionnaireProps) {
  const [formData, setFormData] = useState<TexasRuralStudentData>({
    name: "",
    grade: "",
    school: "",
    primaryChallenge: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredSchools = TEXAS_RURAL_SCHOOLS.filter((school) =>
    school.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.grade || !formData.school) {
      return
    }

    setIsSubmitting(true)

    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    onComplete(formData)
  }

  const isFormValid = formData.name.trim() && formData.grade && formData.school

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Card className="w-full max-w-2xl bg-midnight-900/90 border-neon-500/30 backdrop-blur-sm shadow-2xl shadow-neon-500/10 relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                Welcome to UpSide AI
              </CardTitle>
              <div className="relative">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neon-400 drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                  />
                  <path
                    d="M12 22L20 14L28 22"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 24L20 18L26 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Badge variant="outline" className="border-neon-500/50 text-neon-300">
              Texas Rural Students
            </Badge>
          </div>
          <CardDescription className="text-neon-200/80 text-base leading-relaxed">
            Help us personalize your experience! This quick setup takes less than 2 minutes and helps your AI teammate
            understand your unique situation as a rural Texas student.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-neon-400" />
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              </div>
              <p className="text-sm text-neon-300/70 mb-2">
                Tell us a bit about yourself so we can personalize your experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neon-200 font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="What should we call you?"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-midnight-800/60 border-midnight-700 text-white placeholder-neon-400/50 focus:border-neon-500 focus:ring-neon-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-neon-200 font-medium">
                    Grade Level *
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger className="bg-midnight-800/60 border-midnight-700 text-white focus:border-neon-500 focus:ring-neon-500/20">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-midnight-700">
                      {GRADE_LEVELS.map((grade) => (
                        <SelectItem key={grade} value={grade} className="text-white hover:bg-midnight-700">
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="text-neon-200 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Texas High School *
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Type your school name (e.g., 'Athens High School')"
                      value={formData.school || searchTerm}
                      onChange={(e) => {
                        const value = e.target.value
                        setSearchTerm(value)
                        setFormData((prev) => ({ ...prev, school: value }))
                      }}
                      className="bg-midnight-800/60 border-midnight-700 text-white placeholder-neon-400/50 focus:border-neon-500 focus:ring-neon-500/20 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="w-4 h-4 text-neon-400/60" />
                    </div>
                  </div>

                  {/* Show suggestions only when typing */}
                  {searchTerm && filteredSchools.length > 0 && (
                    <div className="bg-midnight-800/90 border border-midnight-700 rounded-lg max-h-40 overflow-y-auto">
                      <div className="p-2 text-xs text-neon-400/70 border-b border-midnight-700">
                        Suggestions (click to select):
                      </div>
                      {filteredSchools.slice(0, 8).map((school) => (
                        <button
                          key={school}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, school }))
                            setSearchTerm("")
                          }}
                          className="w-full text-left px-3 py-2 text-white hover:bg-midnight-700 transition-colors text-sm"
                        >
                          {school}
                        </button>
                      ))}
                      {filteredSchools.length > 8 && (
                        <div className="p-2 text-xs text-neon-400/70 text-center border-t border-midnight-700">
                          +{filteredSchools.length - 8} more schools... keep typing to narrow down
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-neon-400/70">
                  Just start typing your school name. If it's not in our list, that's okay - type the full name.
                </p>
              </div>
            </div>

            {/* Optional Context Section */}
            <div className="space-y-4 pt-4 border-t border-midnight-700">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-electric-400" />
                <h3 className="text-lg font-semibold text-white">Help Us Help You</h3>
                <Badge variant="secondary" className="text-xs bg-electric-500/20 text-electric-300">
                  Optional
                </Badge>
              </div>
              <p className="text-sm text-electric-300/70 mb-2">
                These details help your AI teammate understand your unique situation and provide better support
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge" className="text-neon-200 font-medium">
                    What's your biggest challenge right now?
                  </Label>
                  <p className="text-xs text-neon-400/60 mb-1">
                    This helps us focus on what matters most to you right now
                  </p>
                  <Select
                    value={formData.primaryChallenge}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryChallenge: value }))}
                  >
                    <SelectTrigger className="bg-midnight-800/60 border-midnight-700 text-white focus:border-neon-500 focus:ring-neon-500/20">
                      <SelectValue placeholder="Choose what you're working on" />
                    </SelectTrigger>
                    <SelectContent className="bg-midnight-800 border-midnight-700">
                      {PRIMARY_CHALLENGES.map((challenge) => (
                        <SelectItem key={challenge} value={challenge} className="text-white hover:bg-midnight-700">
                          {challenge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-midnight-800/40 border border-midnight-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-neon-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-neon-200/80">
                  <p className="font-medium text-neon-200 mb-1">Your Privacy Matters</p>
                  <p>
                    This information stays on your device and helps personalize your UpSide AI experience. We're
                    committed to supporting rural Texas students while protecting your privacy.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              {/* Progress indicator */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <span className="text-sm text-gray-400 ml-2">Step 2 of 3</span>
              </div>

              {/* Enhanced button container */}
              <div className="bg-gradient-to-r from-midnight-800/60 to-midnight-700/60 rounded-2xl p-6 border border-midnight-600/50 backdrop-blur-sm shadow-lg shadow-midnight-900/20">
                <div className="flex flex-col">
                  {/* Primary action */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group mb-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Setting up your profile...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Start My UpSide Journey</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </Button>

                  {/* Secondary action */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onSkip}
                    className="w-full border-2 border-midnight-600 text-neon-300 hover:bg-midnight-800/60 hover:border-neon-500/50 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 bg-midnight-900/30 backdrop-blur-sm"
                  >
                    <span>Skip for now</span>
                  </Button>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-6 pt-2">
                <div className="flex items-center space-x-2 text-sm text-neon-400/80">
                  <Shield className="w-4 h-4 text-electric-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neon-400/80">
                  <div className="w-4 h-4 rounded-full bg-electric-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span>Private</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neon-400/80">
                  <div className="w-4 h-4 text-electric-400">⚡</div>
                  <span>Fast Setup</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
