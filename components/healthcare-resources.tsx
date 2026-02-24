import { AlertTriangle, Phone, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function HealthcareResources() {
  return (
    <Card className="border-red-500/30 bg-red-500/5 mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-500">Important Health Resources</CardTitle>
        </div>
        <CardDescription className="text-gray-200">
          It sounds like you might be going through something serious. Please consider reaching out to these resources:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-red-400" />
            Emergency Services
          </div>
          <p className="text-gray-300">If you're in immediate danger, call 911 or your local emergency number.</p>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-red-400" />
            988 Suicide & Crisis Lifeline
          </div>
          <p className="text-gray-300">Call or text 988 (24/7) for mental health crisis support.</p>
          <a
            href="https://988lifeline.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            Visit website <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-red-400" />
            Crisis Text Line
          </div>
          <p className="text-gray-300">Text HOME to 741741 (24/7) to connect with a Crisis Counselor.</p>
          <a
            href="https://www.crisistextline.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            Visit website <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-gray-400 text-xs">
          Remember: Your school's counseling services and athletic department may also have resources specifically for
          student athletes.
        </p>
      </CardFooter>
    </Card>
  )
}
