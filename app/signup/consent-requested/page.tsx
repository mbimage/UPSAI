import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConsentRequestedPage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Parental Consent Requested</CardTitle>
          <CardDescription>We've sent an email to your parent/guardian</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">What happens next?</h3>
            <p className="text-sm text-amber-700">1. Your parent/guardian will receive an email with a consent link</p>
            <p className="text-sm text-amber-700">2. Once they approve, your account will be activated</p>
            <p className="text-sm text-amber-700">3. You'll receive an email confirmation when your account is ready</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Important Information</h3>
            <p className="text-sm text-gray-600 mb-2">
              The consent link will expire in 7 days. If your parent/guardian doesn't receive the email, please check:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Spam or junk mail folders</li>
              <li>That you entered their email address correctly</li>
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
