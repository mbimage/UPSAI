"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Sparkles, MapPin, GraduationCap } from "lucide-react"

export interface RuralScholarAthleteData {
  // Personal Info
  name: string
  age: string
  grade: string
  pronouns: string

  // Location & Background
  state: string
  townSize: string
  schoolSize: string
  distanceToNearestCity: string
  householdIncome: string
  firstGenCollege: boolean

  // Academic Info
  gpa: string
  favoriteSubjects: string[]
  academicChallenges: string[]
  collegeInterest: string
  careerInterests: string[]

  // Athletic Info
  sport: string
  position: string
  yearsPlaying: string
  competitionLevel: string
  athleticGoals: string[]

  // Life Strategy & Skills
  selfEfficacyLevel: number
  emotionalIntelligenceAreas: string[]
  socialSituationComfort: number
  leadershipExperience: string[]
  futureThinkingSkills: string[]

  // Challenges & Support
  biggestChallenges: string[]
  supportSystem: string[]
  resourceAccess: string[]
  transportationChallenges: boolean
  internetAccess: string

  // Goals & Aspirations
  shortTermGoals: string[]
  longTermGoals: string[]
  dreamJob: string
  collegeAspirations: string
  scholarshipNeeds: boolean

  // Communication & Learning
  communicationStyle: string
  learningPreferences: string[]
  mentorshipInterest: boolean
  peerSupportInterest: boolean

  // Current State
  stressLevel: number
  confidenceLevel: number
  motivationLevel: number
  optimismLevel: number

  // Specific Context
  currentSituation: string
  immediateNeeds: string
  parentGuardianSupport: string
}

interface RuralScholarAthleteQuestionnaireProps {
  onComplete: (data: RuralScholarAthleteData) => void
  onSkip: () => void
}

const stateOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

const sportsOptions = [
  "Baseball",
  "Basketball",
  "Cross Country",
  "Football",
  "Golf",
  "Soccer",
  "Softball",
  "Swimming",
  "Tennis",
  "Track and Field",
  "Volleyball",
  "Wrestling",
  "Cheerleading",
  "Dance Team",
  "Lacrosse",
  "Hockey",
  "Gymnastics",
  "Bowling",
  "Powerlifting",
  "Band/Marching Band",
  "FFA",
  "4-H",
  "Rodeo",
  "Other",
]

const subjectOptions = [
  "Math",
  "Science",
  "English/Literature",
  "History",
  "Social Studies",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Language",
  "Computer Science",
  "Agriculture",
  "Business",
  "Health",
  "Psychology",
  "Environmental Science",
]

const careerOptions = [
  "Healthcare",
  "Education",
  "Engineering",
  "Business",
  "Agriculture",
  "Technology",
  "Law Enforcement",
  "Military",
  "Arts/Entertainment",
  "Sports/Fitness",
  "Social Work",
  "Government",
  "Trades/Skilled Labor",
  "Entrepreneurship",
  "Non-profit",
  "Research",
]

// Add this array of Texas rural high schools at the top of the file, after the existing arrays
const texasRuralHighSchools = [
  // Region 1 - Panhandle/West Texas
  "Abernathy High School",
  "Adrian High School",
  "Amarillo High School",
  "Booker High School",
  "Boys Ranch High School",
  "Canadian High School",
  "Canyon High School",
  "Clarendon High School",
  "Dalhart High School",
  "Dimmitt High School",
  "Dumas High School",
  "Farwell High School",
  "Floydada High School",
  "Friona High School",
  "Gruver High School",
  "Hale Center High School",
  "Happy High School",
  "Hart High School",
  "Hereford High School",
  "Idalou High School",
  "Kress High School",
  "Lazbuddie High School",
  "Levelland High School",
  "Littlefield High School",
  "Lorenzo High School",
  "Memphis High School",
  "Muleshoe High School",
  "Nazareth High School",
  "New Deal High School",
  "Olton High School",
  "Panhandle High School",
  "Perryton High School",
  "Petersburg High School",
  "Plainview High School",
  "Post High School",
  "Quitaque High School",
  "Ralls High School",
  "Shamrock High School",
  "Silverton High School",
  "Slaton High School",
  "Spearman High School",
  "Springlake-Earth High School",
  "Stratford High School",
  "Sudan High School",
  "Sundown High School",
  "Tahoka High School",
  "Tulia High School",
  "Turkey High School",
  "Vega High School",
  "Wellington High School",
  "Wheeler High School",
  "White Deer High School",
  "Whiteface High School",
  "Wilson High School",

  // Region 2 - North Texas Rural
  "Albany High School",
  "Alvord High School",
  "Anson High School",
  "Archer City High School",
  "Aspermont High School",
  "Baird High School",
  "Bangs High School",
  "Blanket High School",
  "Bowie High School",
  "Breckenridge High School",
  "Bridgeport High School",
  "Brownwood High School",
  "Bryson High School",
  "Burkburnett High School",
  "Callisburg High School",
  "Chico High School",
  "Cisco High School",
  "Clyde High School",
  "Coleman High School",
  "Comanche High School",
  "Cross Plains High School",
  "De Leon High School",
  "Decatur High School",
  "Dublin High School",
  "Early High School",
  "Eastland High School",
  "Electra High School",
  "Era High School",
  "Eula High School",
  "Forestburg High School",
  "Gainesville High School",
  "Goldthwaite High School",
  "Gordon High School",
  "Graham High School",
  "Graford High School",
  "Hamlin High School",
  "Haskell High School",
  "Hawley High School",
  "Henrietta High School",
  "Holliday High School",
  "Iowa Park High School",
  "Jacksboro High School",
  "Jim Ned High School",
  "Knox City High School",
  "Lindsay High School",
  "Lometa High School",
  "Merkel High School",
  "Millsap High School",
  "Mineral Wells High School",
  "Muenster High School",
  "Munday High School",
  "Newcastle High School",
  "Nocona High School",
  "Olney High School",
  "Palo Pinto High School",
  "Paradise High School",
  "Perrin-Whitt High School",
  "Petrolia High School",
  "Poolville High School",
  "Ranger High School",
  "Rising Star High School",
  "Roby High School",
  "Roscoe High School",
  "Rule High School",
  "Saint Jo High School",
  "Seymour High School",
  "Stamford High School",
  "Strawn High School",
  "Throckmorton High School",
  "Tolar High School",
  "Valley View High School",
  "Vernon High School",
  "Weatherford High School",
  "Windthorst High School",

  // Region 3 - East Texas
  "Alto High School",
  "Arp High School",
  "Athens High School",
  "Avinger High School",
  "Beckville High School",
  "Big Sandy High School",
  "Brownsboro High School",
  "Bullard High School",
  "Canton High School",
  "Carthage High School",
  "Center High School",
  "Chandler High School",
  "Chapel Hill High School",
  "Chireno High School",
  "Cushing High School",
  "Daingerfield High School",
  "Diboll High School",
  "East Chambers High School",
  "Edom High School",
  "Elysian Fields High School",
  "Eustace High School",
  "Frankston High School",
  "Garrison High School",
  "Gary High School",
  "Gilmer High School",
  "Gladewater High School",
  "Grand Saline High School",
  "Hallsville High School",
  "Harleton High School",
  "Henderson High School",
  "Hemphill High School",
  "Hughes Springs High School",
  "Huntington High School",
  "Joaquin High School",
  "Karnack High School",
  "Kilgore High School",
  "Laneville High School",
  "Leveretts Chapel High School",
  "Lindale High School",
  "Linden-Kildare High School",
  "Lone Oak High School",
  "Longview High School",
  "Lovelady High School",
  "Lufkin High School",
  "Marshall High School",
  "Martinsville High School",
  "Mineola High School",
  "Mount Enterprise High School",
  "Mount Pleasant High School",
  "Nacogdoches High School",
  "New London High School",
  "New Summerfield High School",
  "Ore City High School",
  "Overton High School",
  "Palestine High School",
  "Panola College High School",
  "Pine Tree High School",
  "Pittsburg High School",
  "Quitman High School",
  "Rusk High School",
  "Sabine High School",
  "San Augustine High School",
  "Shelbyville High School",
  "Spring Hill High School",
  "Tatum High School",
  "Tenaha High School",
  "Timpson High School",
  "Troup High School",
  "Tyler High School",
  "Union Grove High School",
  "Van High School",
  "Waskom High School",
  "West Rusk High School",
  "White Oak High School",
  "Whitehouse High School",
  "Wills Point High School",
  "Winnsboro High School",
  "Winona High School",
  "Yantis High School",

  // Region 4 - Central Texas Rural
  "Academy High School",
  "Axtell High School",
  "Bartlett High School",
  "Belton High School",
  "Blooming Grove High School",
  "Bosqueville High School",
  "Brenham High School",
  "Bremond High School",
  "Bruceville-Eddy High School",
  "Buffalo High School",
  "Burnet High School",
  "Burton High School",
  "Caldwell High School",
  "Cameron High School",
  "Centerville High School",
  "China Spring High School",
  "Clifton High School",
  "Coolidge High School",
  "Copperas Cove High School",
  "Crawford High School",
  "Dawson High School",
  "Dripping Springs High School",
  "Elgin High School",
  "Fairfield High School",
  "Florence High School",
  "Franklin High School",
  "Frost High School",
  "Gatesville High School",
  "Giddings High School",
  "Granger High School",
  "Groesbeck High School",
  "Hamilton High School",
  "Hearne High School",
  "Hico High School",
  "Holland High School",
  "Hubbard High School",
  "Iredell High School",
  "Italy High School",
  "Jarrell High School",
  "Johnson City High School",
  "Jonesboro High School",
  "Kerens High School",
  "Killeen High School",
  "Lampasas High School",
  "Lexington High School",
  "Liberty Hill High School",
  "Llano High School",
  "Lorena High School",
  "Madisonville High School",
  "Marble Falls High School",
  "Mart High School",
  "Marlin High School",
  "McGregor High School",
  "Mexia High School",
  "Moody High School",
  "Mount Calm High School",
  "Navasota High School",
  "Normangee High School",
  "Oakwood High School",
  "Oglesby High School",
  "Richards High School",
  "Riesel High School",
  "Robinson High School",
  "Rogers High School",
  "Rosebud-Lott High School",
  "Salado High School",
  "Sealy High School",
  "Somerville High School",
  "Teague High School",
  "Temple High School",
  "Thorndale High School",
  "Troy High School",
  "Valley Mills High School",
  "Waco High School",
  "West High School",
  "Westphalia High School",
  "Wortham High School",

  // Region 5 - South Texas
  "Agua Dulce High School",
  "Alice High School",
  "Aransas Pass High School",
  "Banquete High School",
  "Beeville High School",
  "Ben Bolt High School",
  "Bishop High School",
  "Calallen High School",
  "Corpus Christi High School",
  "Cuero High School",
  "Driscoll High School",
  "Falfurrias High School",
  "Flour Bluff High School",
  "George West High School",
  "Goliad High School",
  "Gregory-Portland High School",
  "Hallettsville High School",
  "Ingleside High School",
  "Karnes City High School",
  "Kenedy High School",
  "King High School",
  "Kingsville High School",
  "La Vernia High School",
  "Mathis High School",
  "Moody High School",
  "Nixon-Smiley High School",
  "Orange Grove High School",
  "Odem-Edroy High School",
  "Pettus High School",
  "Pleasanton High School",
  "Premont High School",
  "Refugio High School",
  "Riviera High School",
  "Robstown High School",
  "Rockport-Fulton High School",
  "Runge High School",
  "Shiner High School",
  "Sinton High School",
  "Skidmore-Tynan High School",
  "Three Rivers High School",
  "Taft High School",
  "Tuloso-Midway High School",
  "Victoria High School",
  "Welder High School",
  "Woodsboro High School",
  "Yoakum High School",

  // Region 6 - Southeast Texas
  "Anahuac High School",
  "Barbers Hill High School",
  "Buna High School",
  "Coldspring High School",
  "Corrigan-Camden High School",
  "Crockett High School",
  "Dayton High School",
  "Deweyville High School",
  "East Chambers High School",
  "Grapeland High School",
  "Hardin High School",
  "Hull-Daisetta High School",
  "Huntsville High School",
  "Jasper High School",
  "Kountze High School",
  "Liberty High School",
  "Livingston High School",
  "Lumberton High School",
  "Madisonville High School",
  "New Waverly High School",
  "Newton High School",
  "Orangefield High School",
  "Shepherd High School",
  "Silsbee High School",
  "Splendora High School",
  "Trinity High School",
  "Vidor High School",
  "Warren High School",
  "West Orange-Stark High School",
  "Woodville High School",

  // Region 7 - Hill Country/Southwest
  "Bandera High School",
  "Boerne High School",
  "Brackenridge High School",
  "Comfort High School",
  "Crystal City High School",
  "Devine High School",
  "Fredericksburg High School",
  "Harper High School",
  "Hondo High School",
  "Hunt High School",
  "Ingram High School",
  "Junction High School",
  "Kerrville High School",
  "Mason High School",
  "Medina Valley High School",
  "Natalia High School",
  "Pearsall High School",
  "Poteet High School",
  "Sabinal High School",
  "Uvalde High School",

  "Other - Not Listed",
].sort()

export function RuralScholarAthleteQuestionnaire({ onComplete, onSkip }: RuralScholarAthleteQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RuralScholarAthleteData>({
    name: "",
    age: "",
    grade: "",
    pronouns: "",
    state: "",
    townSize: "",
    schoolSize: "",
    distanceToNearestCity: "",
    householdIncome: "",
    firstGenCollege: false,
    gpa: "",
    favoriteSubjects: [],
    academicChallenges: [],
    collegeInterest: "",
    careerInterests: [],
    sport: "",
    position: "",
    yearsPlaying: "",
    competitionLevel: "",
    athleticGoals: [],
    selfEfficacyLevel: 5,
    emotionalIntelligenceAreas: [],
    socialSituationComfort: 5,
    leadershipExperience: [],
    futureThinkingSkills: [],
    biggestChallenges: [],
    supportSystem: [],
    resourceAccess: [],
    transportationChallenges: false,
    internetAccess: "",
    shortTermGoals: [],
    longTermGoals: [],
    dreamJob: "",
    collegeAspirations: "",
    scholarshipNeeds: false,
    communicationStyle: "",
    learningPreferences: [],
    mentorshipInterest: false,
    peerSupportInterest: false,
    stressLevel: 5,
    confidenceLevel: 5,
    motivationLevel: 5,
    optimismLevel: 5,
    currentSituation: "",
    immediateNeeds: "",
    parentGuardianSupport: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof RuralScholarAthleteData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: keyof RuralScholarAthleteData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((item) => item !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.grade && formData.state
      case 2:
        return formData.sport && formData.favoriteSubjects.length > 0
      case 3:
        return formData.shortTermGoals.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-midnight-800/80 border-midnight-700 shadow-2xl shadow-neon-500/10">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-neon-400" />
              <Sparkles className="w-8 h-8 text-neon-400 animate-pulse-slow" />
              <GraduationCap className="w-6 h-6 text-neon-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white mb-2">Rural Scholar-Athlete Profile</CardTitle>
          <p className="text-neon-200 text-sm">
            Help us understand your unique journey and create a personalized experience that supports your goals.
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-neon-400 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal & School Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">About You & Your School</h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-neon-200">
                  What's your first name?
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your first name"
                  className="bg-midnight-700 border-midnight-600 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-neon-200">
                    Age
                  </Label>
                  <Select value={formData.age} onValueChange={(value) => handleInputChange("age", value)}>
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Age" />
                    </SelectTrigger>
                    <SelectContent>
                      {[14, 15, 16, 17, 18, 19].map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-neon-200">
                    Grade
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9th">9th (Freshman)</SelectItem>
                      <SelectItem value="10th">10th (Sophomore)</SelectItem>
                      <SelectItem value="11th">11th (Junior)</SelectItem>
                      <SelectItem value="12th">12th (Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pronouns" className="text-neon-200">
                    Pronouns (optional)
                  </Label>
                  <Select value={formData.pronouns} onValueChange={(value) => handleInputChange("pronouns", value)}>
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he/him">he/him</SelectItem>
                      <SelectItem value="she/her">she/her</SelectItem>
                      <SelectItem value="they/them">they/them</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="texas-school" className="text-neon-200">
                  Select your Texas rural high school
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                    <SelectValue placeholder="Search and select your school..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {texasRuralHighSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-neon-400">
                  Can't find your school? Type to search or select "Other - Not Listed"
                </p>
              </div>

              {formData.state === "Other - Not Listed" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-school" className="text-neon-200">
                    Enter your school name
                  </Label>
                  <Input
                    id="custom-school"
                    value={formData.townSize}
                    onChange={(e) => handleInputChange("townSize", e.target.value)}
                    placeholder="Your school name"
                    className="bg-midnight-700 border-midnight-600 text-white"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first-gen"
                    checked={formData.firstGenCollege}
                    onCheckedChange={(checked) => handleInputChange("firstGenCollege", checked)}
                    className="border-midnight-600"
                  />
                  <Label htmlFor="first-gen" className="text-sm text-neon-200">
                    I would be the first in my family to attend college
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic & Athletic Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">Your Academic & Athletic Journey</h3>

              <div className="space-y-2">
                <Label htmlFor="sport" className="text-neon-200">
                  Primary Sport/Activity
                </Label>
                <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                  <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                    <SelectValue placeholder="Select your sport/activity" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {sportsOptions.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-neon-200">
                    Position/Role
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="Your position"
                    className="bg-midnight-700 border-midnight-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-interest" className="text-neon-200">
                    College Interest
                  </Label>
                  <Select
                    value={formData.collegeInterest}
                    onValueChange={(value) => handleInputChange("collegeInterest", value)}
                  >
                    <SelectTrigger className="bg-midnight-700 border-midnight-600 text-white">
                      <SelectValue placeholder="Select interest level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-interested">Very interested</SelectItem>
                      <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                      <SelectItem value="not-interested">Not interested</SelectItem>
                      <SelectItem value="trade-school">Interested in trade school</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-neon-200">Favorite subjects (select all that apply)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {subjectOptions.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.favoriteSubjects.includes(subject)}
                        onCheckedChange={() => handleArrayToggle("favoriteSubjects", subject)}
                        className="border-midnight-600"
                      />
                      <Label htmlFor={subject} className="text-xs text-neon-200 cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-neon-200">
                    Self-Confidence: How confident are you in your ability to achieve your goals?
                  </Label>
                  <Slider
                    value={[formData.selfEfficacyLevel]}
                    onValueChange={(value) => handleInputChange("selfEfficacyLevel", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neon-400">
                    <span>Not confident</span>
                    <span className="text-neon-300 font-medium">{formData.selfEfficacyLevel}</span>
                    <span>Very confident</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Current Situation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neon-300 mb-4">Your Goals & Current Situation</h3>

              <div className="space-y-3">
                <Label className="text-neon-200">Short-term goals (next 1-2 years)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Improve grades",
                    "Athletic achievement",
                    "Leadership role",
                    "College preparation",
                    "Scholarship opportunities",
                    "Build confidence",
                    "Develop skills",
                    "Make new friends",
                    "Help my community",
                    "Learn new things",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.shortTermGoals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle("shortTermGoals", goal)}
                        className="border-midnight-600"
                      />
                      <Label htmlFor={goal} className="text-sm text-neon-200 cursor-pointer">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-neon-200">
                  What are your biggest challenges right now? (select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Limited resources/opportunities",
                    "Transportation issues",
                    "College preparation",
                    "Financial concerns",
                    "Academic pressure",
                    "Athletic pressure",
                    "Time management",
                    "Future uncertainty",
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={formData.biggestChallenges.includes(challenge)}
                        onCheckedChange={() => handleArrayToggle("biggestChallenges", challenge)}
                        className="border-midnight-600"
                      />
                      <Label htmlFor={challenge} className="text-sm text-neon-200 cursor-pointer">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-neon-200">Current stress level</Label>
                  <Slider
                    value={[formData.stressLevel]}
                    onValueChange={(value) => handleInputChange("stressLevel", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neon-400">
                    <span>Very relaxed</span>
                    <span className="text-neon-300 font-medium">{formData.stressLevel}</span>
                    <span>Very stressed</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-situation" className="text-neon-200">
                  Anything specific you're dealing with right now? (optional)
                </Label>
                <Textarea
                  id="current-situation"
                  value={formData.currentSituation}
                  onChange={(e) => handleInputChange("currentSituation", e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="bg-midnight-700 border-midnight-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scholarship-needs"
                  checked={formData.scholarshipNeeds}
                  onCheckedChange={(checked) => handleInputChange("scholarshipNeeds", checked)}
                  className="border-midnight-600"
                />
                <Label htmlFor="scholarship-needs" className="text-sm text-neon-200">
                  I will need scholarships or financial aid for college
                </Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-midnight-600 text-neon-300 hover:bg-midnight-700 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}

              <Button variant="ghost" onClick={onSkip} className="text-neon-400 hover:text-neon-300">
                Skip for now
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white shadow-lg shadow-neon-500/30"
            >
              {currentStep === totalSteps ? "Complete Profile" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
