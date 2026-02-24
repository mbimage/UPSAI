import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center">Account Created Successfully</CardTitle>
          <CardDescription className="text-center">Welcome to UpSide AI!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-sm text-green-700">
              Your account has been created successfully. You can now log in and start exploring the platform.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Getting Started</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
              <li>Complete your profile to get personalized recommendations</li>
              <li>Take an assessment to understand your strengths</li>
              <li>Explore resources in the resource lobby</li>
              <li>Chat with our AI assistant for guidance</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
