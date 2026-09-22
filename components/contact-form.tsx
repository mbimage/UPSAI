"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm, type ContactFormState } from "@/app/actions/submit-contact-form"

const initialState: ContactFormState = { status: "idle" }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-300">
            First Name *
          </label>
          <Input
            id="firstName"
            name="firstName"
            className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
            placeholder="Your first name"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-300">
            Last Name *
          </label>
          <Input
            id="lastName"
            name="lastName"
            className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
            placeholder="Your last name"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2 text-gray-300">
          I am a... *
        </label>
        <select
          id="role"
          name="role"
          className="w-full h-10 px-3 py-2 bg-midnight-800 border border-neon-500/20 rounded-md text-white focus:border-neon-500/50 focus:outline-none"
          required
        >
          <option value="">Select your role</option>
          <option value="college-athlete">College Athlete</option>
          <option value="coach">Coach</option>
          <option value="athletic-staff">Athletic Department Staff</option>
          <option value="academic-advisor">Academic Advisor</option>
          <option value="career-services">Career Services</option>
          <option value="administrator">Administrator</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
          Subject *
        </label>
        <Input
          id="subject"
          name="subject"
          className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
          placeholder="What can we help you with?"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          className="bg-midnight-800 border-neon-500/20 focus:border-neon-500/50"
          placeholder="Tell us more about your situation, goals, or questions..."
          required
        />
      </div>

      <div className="flex items-start space-x-2">
        <input type="checkbox" id="consent" name="consent" className="mt-1" required />
        <label htmlFor="consent" className="text-sm text-gray-400">
          I agree to receive communications from UpSide AI and understand that my information will be handled according
          to the{" "}
          <Link href="/privacy" className="text-neon-400 hover:text-neon-300 underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      {state.status === "success" && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
        >
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-700 hover:to-electric-700 text-white font-semibold py-3 shadow-lg disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}

export default ContactForm
