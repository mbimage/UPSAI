"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { verifyParentalConsent } from "@/app/actions/request-parental-consent"

export default function VerifyConsentPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [verificationState, setVerificationState] = useState<{
    isLoading: boolean
    isVerified: boolean
    studentName: string
    error: string | null
  }>({
    isLoading: true,
    isVerified: false,
    studentName: "",
    error: null,
  })

  useEffect(() => {
    async function verifyConsent() {
      try {
        const result = await verifyParentalConsent(params.token)

        if (result.success) {
          setVerificationState({
            isLoading: false,
            isVerified: true,
            studentName: result.studentName,
            error: null,
          })
        } else {
          setVerificationState({
            isLoading: false,
            isVerified: false,
            studentName: "",
            error: result.error || "Verification failed",
          })
        }
      } catch (error) {
        setVerificationState({
          isLoading: false,
          isVerified: false,
          studentName: "",
          error: "An unexpected error occurred",
        })
      }
    }

    verifyConsent()
  }, [params.token])

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Parental Consent Verification</CardTitle>
          <CardDescription>Verifying your consent for your child's account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationState.isLoading ? (
            <div className="text-center py-8">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Verifying consent...</p>
            </div>
          ) : verificationState.isVerified ? (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Consent Successfully Verified</h3>
              <p className="text-sm text-green-700">
                Thank you for providing consent for {verificationState.studentName}'s account. Their account has been
                activated and they can now log in.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Verification Failed</h3>
              <p className="text-sm text-red-700">
                {verificationState.error || "We could not verify your consent. The link may be invalid or expired."}
              </p>
            </div>
          )}

          {!verificationState.isLoading && (
            <div>
              <h3 className="font-medium mb-2">What happens next?</h3>
              {verificationState.isVerified ? (
                <p className="text-sm text-gray-600">
                  Your child will receive an email notification that their account is now active. They can log in using
                  the email and password they provided during registration.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  If you believe this is an error, please contact our support team for assistance. A new verification
                  link can be sent if needed.
                </p>
              )}
            </div>
          )}
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
