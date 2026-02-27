import { Phone, ExternalLink, MapPin, Clock, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function MentalHealthResources() {
  return (
    <Card className="border-blue-500/30 bg-blue-500/5 mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-blue-400">Mental Health Support</CardTitle>
        </div>
        <CardDescription className="text-gray-200">
          It takes courage to reach out. Here are some resources that can provide professional support:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-blue-400" />
            Crisis Support (24/7)
          </div>
          <p className="text-gray-300 mb-2">If you're in crisis or having thoughts of self-harm:</p>
          <div className="space-y-1">
            <p className="text-gray-300">
              • Call or text <strong className="text-blue-400">988</strong> - Suicide & Crisis Lifeline
            </p>
            <p className="text-gray-300">
              • Text <strong className="text-blue-400">HOME to 741741</strong> - Crisis Text Line
            </p>
            <p className="text-gray-300">
              • Call <strong className="text-red-400">911</strong> for immediate emergency
            </p>
          </div>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-green-400" />
            Local Mental Health Resources
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-gray-300 font-medium">School Counseling Services</p>
              <p className="text-gray-400 text-xs">Start with your school counselor or athletic department</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium">Community Health Centers</p>
              <p className="text-gray-400 text-xs">Search: "community mental health center near me"</p>
            </div>
            <div>
              <p className="text-gray-300 font-medium">Rural Health Clinics</p>
              <p className="text-gray-400 text-xs">Many offer sliding scale fees based on income</p>
            </div>
          </div>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-400" />
            Online & Telehealth Options
          </div>
          <div className="space-y-1">
            <a
              href="https://www.betterhelp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-400 hover:text-neon-300 flex items-center gap-1"
            >
              BetterHelp - Online Therapy <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://www.talkspace.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-400 hover:text-neon-300 flex items-center gap-1"
            >
              Talkspace - Text & Video Therapy <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://www.psychologytoday.com/us/therapists"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-400 hover:text-neon-300 flex items-center gap-1"
            >
              Psychology Today - Find Local Therapists <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-pink-400" />
            Athlete-Specific Resources
          </div>
          <div className="space-y-1">
            <a
              href="https://www.athletesforcare.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-400 hover:text-neon-300 flex items-center gap-1"
            >
              Athletes for Care <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://www.nami.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-400 hover:text-neon-300 flex items-center gap-1"
            >
              NAMI - Mental Health Support <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-gray-400 text-xs">
          <strong>Remember:</strong> Seeking help is a sign of strength, not weakness. Professional support can make a
          huge difference in your mental health and athletic performance.
        </p>
      </CardFooter>
    </Card>
  )
}
