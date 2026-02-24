"use client"

import { InclusiveCoachingFramework } from "@/components/inclusive-coaching-framework"
import { PageWrapper } from "@/components/page-wrapper"

const sampleResponse = {
  user_profile: {
    name: "Student Athlete",
    level: "High School",
    identity: {
      gender: "Male",
      orientation: "LGBTQIA+",
      belief: "Agnostic",
    },
    sport: "Football",
    age: 17,
  },
  situation: {
    event: "Felt ignored during team meeting despite speaking up",
    emotional_state: "Frustrated and unseen",
  },
  response_framework: {
    model: "E+R=O",
    event: "Coach didn't acknowledge your input",
    response:
      "You chose to stay composed and true to yourself. That response builds trust and power - even if it goes unseen today.",
    outcome: "Long-term respect and leadership recognition",
  },
  maslow: {
    need_level: "Esteem",
    description: "Need for recognition, respect, confidence, and contribution",
  },
  motivation_theory: {
    model: "Self-Determination Theory",
    target: "Relatedness and Autonomy",
    application: "Let the athlete feel connected, but also in control of how they grow",
  },
  inclusive_messaging: {
    faith_inclusive:
      "Whether you seek meaning through faith or values, know that your growth matters. Every experience shapes who you're becoming.",
    identity_inclusive:
      "As an LGBTQIA+ athlete, your voice matters. You belong in this space. Keep showing up - authentically and courageously.",
  },
  response_message:
    "Not every win is loud. Being overlooked hurts - especially when you speak up. But your courage to use your voice is already a step toward real leadership. Stay grounded. Keep building your story.",
  reflection_prompt: "What's one small way you can lead by example today, even without recognition?",
  follow_up_options: [
    "Explore strategies for being heard in team settings",
    "Learn about building confidence as an LGBTQIA+ athlete",
    "Practice self-advocacy techniques",
    "Connect with other athletes who've faced similar challenges",
  ],
}

export default function InclusiveCoachingPage() {
  const handleReflectionSubmit = (reflection: string) => {
    console.log("Reflection submitted:", reflection)
    // Here you would typically save the reflection or navigate to a reflection form
  }

  const handleFollowUpSelect = (option: string) => {
    console.log("Follow-up selected:", option)
    // Here you would typically navigate to the relevant resource or start a new conversation
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent mb-4">
              Inclusive Coaching Framework
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Personalized, identity-aware support that meets athletes where they are, using proven psychological
              frameworks and inclusive messaging.
            </p>
          </div>

          <InclusiveCoachingFramework
            response={sampleResponse}
            onReflectionSubmit={handleReflectionSubmit}
            onFollowUpSelect={handleFollowUpSelect}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
