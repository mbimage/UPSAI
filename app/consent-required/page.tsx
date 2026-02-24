import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ConsentRequiredPage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-center">Parental Consent Required</CardTitle>
          <CardDescription className="text-center">We need your parent or guardian's permission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-sm text-amber-700">
              Since you are under 18, we need your parent or guardian's consent before you can access this part of the
              platform.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">What happens next?</h3>
            <p className="text-sm text-gray-600 mb-2">
              We've sent an email to your parent/guardian with a consent link. Once they approve:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Your account will be fully activated</li>
              <li>You'll receive an email confirmation</li>
              <li>You can then access all features of the platform</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
          <p className="text-sm text-center text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
