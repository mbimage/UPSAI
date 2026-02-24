"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Brain, Target, MessageCircle, Lightbulb } from "lucide-react"

interface UserProfile {
  name: string
  level: string
  identity: {
    gender: string
    orientation: string
    belief: string
  }
  sport: string
  age: number
}

interface Situation {
  event: string
  emotional_state: string
}

interface ResponseFramework {
  model: string
  event: string
  response: string
  outcome: string
}

interface MaslowNeed {
  need_level: string
  description: string
}

interface MotivationTheory {
  model: string
  target: string
  application: string
}

interface InclusiveMessaging {
  faith_inclusive: string
  identity_inclusive: string
}

interface CoachingResponse {
  user_profile: UserProfile
  situation: Situation
  response_framework: ResponseFramework
  maslow: MaslowNeed
  motivation_theory: MotivationTheory
  inclusive_messaging: InclusiveMessaging
  response_message: string
  reflection_prompt: string
  follow_up_options?: string[]
}

interface InclusiveCoachingFrameworkProps {
  response: CoachingResponse
  onReflectionSubmit?: (reflection: string) => void
  onFollowUpSelect?: (option: string) => void
}

export function InclusiveCoachingFramework({
  response,
  onReflectionSubmit,
  onFollowUpSelect,
}: InclusiveCoachingFrameworkProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* User Context */}
      <Card className="bg-midnight-800 border-neon-500/20">
        <CardHeader>
          <CardTitle className="text-neon-400 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Personalized Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-medium mb-2">Athlete Profile</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>
                  <span className="text-neon-400">Name:</span> {response.user_profile.name}
                </p>
                <p>
                  <span className="text-neon-400">Sport:</span> {response.user_profile.sport}
                </p>
                <p>
                  <span className="text-neon-400">Level:</span> {response.user_profile.level}
                </p>
                <p>
                  <span className="text-neon-400">Age:</span> {response.user_profile.age}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Identity & Values</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-electric-500/50 text-electric-400">
                  {response.user_profile.identity.orientation}
                </Badge>
                <Badge variant="outline" className="border-electric-500/50 text-electric-400">
                  {response.user_profile.identity.belief}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situation Analysis */}
      <Card className="bg-midnight-800 border-electric-500/20">
        <CardHeader>
          <CardTitle className="text-electric-400 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Situation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">What Happened</h4>
            <p className="text-gray-300">{response.situation.event}</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Emotional State</h4>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {response.situation.emotional_state}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Psychological Framework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-midnight-800 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm">Maslow's Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {response.maslow.need_level}
              </Badge>
              <p className="text-sm text-gray-300">{response.maslow.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-midnight-800 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Motivation Theory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {response.motivation_theory.model}
              </Badge>
              <p className="text-xs text-gray-400">Target: {response.motivation_theory.target}</p>
              <p className="text-sm text-gray-300">{response.motivation_theory.application}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* E+R=O Framework */}
      <Card className="bg-midnight-800 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Target className="h-5 w-5" />
            E+R=O Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Event</h4>
              <p className="text-sm text-gray-300">{response.response_framework.event}</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Response</h4>
              <p className="text-sm text-gray-300">{response.response_framework.response}</p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Outcome</h4>
              <p className="text-sm text-gray-300">{response.response_framework.outcome}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inclusive Messaging */}
      <Card className="bg-gradient-to-r from-neon-900/20 to-electric-900/20 border-neon-500/30">
        <CardHeader>
          <CardTitle className="text-neon-400 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Inclusive Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-neon-400 font-medium mb-2">Identity Affirmation</h4>
            <p className="text-gray-200 italic">{response.inclusive_messaging.identity_inclusive}</p>
          </div>
          <div>
            <h4 className="text-electric-400 font-medium mb-2">Values & Beliefs</h4>
            <p className="text-gray-200 italic">{response.inclusive_messaging.faith_inclusive}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Response */}
      <Card className="bg-gradient-to-r from-midnight-800 to-midnight-700 border-neon-500/40">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-neon-400" />
            Coaching Response
          </CardTitle>
          <div className="text-sm text-gray-400 mt-2">
            Tone: Empathetic, not preachy • "That's real. Let's talk about it."
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-100 leading-relaxed">{response.response_message}</p>

          {/* Example empathetic phrases */}
          <div className="mt-4 p-3 bg-neon-500/10 rounded-lg border border-neon-500/20">
            <p className="text-xs text-neon-400 mb-2">Empathetic Approach Examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
              <div>• "That's real. Let's talk about it."</div>
              <div>• "You're not alone in this."</div>
              <div>• "That's tough, and it makes sense you feel that way."</div>
              <div>• "Let's figure this out together."</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reflection Prompt */}
      <Card className="bg-midnight-800 border-electric-500/20">
        <CardHeader>
          <CardTitle className="text-electric-400 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{response.reflection_prompt}</p>
          <Button
            className="bg-gradient-to-r from-electric-600 to-neon-600 hover:from-electric-500 hover:to-neon-500"
            onClick={() => onReflectionSubmit?.("User clicked to reflect")}
          >
            Start Reflection
          </Button>
        </CardContent>
      </Card>

      {/* Follow-up Options */}
      {response.follow_up_options && (
        <Card className="bg-midnight-800 border-neon-500/20">
          <CardHeader>
            <CardTitle className="text-neon-400">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {response.follow_up_options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-neon-500/30 hover:bg-neon-500/10 text-left justify-start h-auto p-4"
                  onClick={() => onFollowUpSelect?.(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
