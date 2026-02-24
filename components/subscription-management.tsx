"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to open subscription portal")
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (error) {
      console.error("Error opening subscription portal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to open subscription portal",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-midnight-900 border-neon-500/20 text-white">
      <CardHeader>
        <CardTitle className="text-xl text-neon-500 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage your subscription, billing information, and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Click the button below to access your subscription portal where you can:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 ml-2">
            <li>Update your payment method</li>
            <li>View billing history and invoices</li>
            <li>Change or cancel your subscription</li>
            <li>Update billing information</li>
          </ul>
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500"
          >
            {isLoading ? (
              "Opening Portal..."
            ) : (
              <>
                Manage Subscription
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
