import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, MapPin, Award, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"

export function TexasSpecificResources() {
  return (
    <Card className="border-neon-500/30 bg-neon-500/5 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-neon-400">Texas Resources for Student-Athletes</CardTitle>
        <CardDescription className="text-gray-200">
          Programs and opportunities specifically for Texas student-athletes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-neon-400" />
            Texas UIL Resources
          </div>
          <p className="text-gray-300">
            Information about eligibility, competitions, and scholarships through the University Interscholastic League.
          </p>
          <a
            href="https://www.uiltexas.org/athletics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            Visit UIL Athletics <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-neon-400" />
            Texas Rural Scholarship Programs
          </div>
          <p className="text-gray-300">Scholarships specifically designed for students from rural Texas communities.</p>
          <a
            href="https://www.tshaonline.org/education/students/scholarship-program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            Texas State Historical Association Scholarships <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-neon-400" />
            Rural Texas Career Resources
          </div>
          <p className="text-gray-300">Career development opportunities focused on rural communities in Texas.</p>
          <a
            href="https://ruralhealth.texas.gov/education/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            Rural Health Career Programs <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="bg-midnight-800 p-3 rounded-md">
          <div className="font-semibold text-white flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-neon-400" />
            Texas Regional Training Centers
          </div>
          <p className="text-gray-300">Find athletic training resources in your region of Texas.</p>
          <Link
            href="/resources/texas-training-centers"
            className="text-neon-400 hover:text-neon-300 flex items-center gap-1 mt-1"
          >
            View Training Centers Map <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-gray-400 text-xs">
          These resources are specifically curated for student-athletes in rural Texas communities.
        </p>
      </CardFooter>
    </Card>
  )
}
