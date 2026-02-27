"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

const OnboardingFlow = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const steps = [
    {
      id: 0,
      title: "Welcome!",
      description: "Let's get you set up with our awesome service.",
      content: (
        <div>
          <p>This is the first step of the onboarding process.</p>
        </div>
      ),
    },
    {
      id: 1,
      title: "Personal Information",
      description: "Tell us a bit about yourself.",
      content: (
        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email address"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Preferences",
      description: "Customize your experience.",
      content: (
        <div>
          <p>Choose your preferences here.</p>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    // Add your validation logic here based on the current step and form data
    if (currentStep === 1) {
      return formData.email && formData.email.includes("@")
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex items-center justify-center p-4 pb-20">
      <Card className="w-full max-w-2xl bg-midnight-900/95 border-neon-500/20 backdrop-blur-sm shadow-2xl mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{steps[currentStep].content}</CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6 pb-6">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-neon-500/10 order-2 sm:order-1"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex gap-3 order-1 sm:order-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="border-neon-500/30 text-white hover:bg-neon-500/20 flex-1 sm:flex-none min-w-[100px]"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-neon-600 hover:bg-neon-700 text-white disabled:opacity-50 flex-1 sm:flex-none min-w-[100px]"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight-900/95 backdrop-blur-sm border-t border-neon-500/20 p-4 sm:hidden">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="border-neon-500/30 text-white hover:bg-neon-500/20 flex-1 h-12"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-neon-600 hover:bg-neon-700 text-white disabled:opacity-50 flex-1 h-12"
          >
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
            {currentStep === steps.length - 1 ? (
              <CheckCircle className="h-4 w-4 ml-2" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </div>

      {/* Spacer for mobile navigation */}
      <div className="h-20 sm:hidden"></div>
    </div>
  )
}

export default OnboardingFlow
