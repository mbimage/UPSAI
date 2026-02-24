"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, BookOpen, Target, Brain, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ResourceGuide() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="bg-midnight-900 border-neon-600/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-neon-500" />
            Resource Guide
          </CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isExpanded ? "Collapse guide" : "Expand guide"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <CardDescription>Find the resources you need to develop essential life skills</CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResourceCategory
              icon={<Target className="h-5 w-5 text-neon-500" />}
              title="Self-Efficacy"
              description="Resources to help you build confidence and belief in your abilities to succeed."
            />
            <ResourceCategory
              icon={<Brain className="h-5 w-5 text-neon-500" />}
              title="Emotional Intelligence"
              description="Learn to understand and manage your emotions and recognize them in others."
            />
            <ResourceCategory
              icon={<Lightbulb className="h-5 w-5 text-neon-500" />}
              title="Career Readiness"
              description="Prepare for your future with resources on career planning and workforce skills."
            />
          </div>

          <div className="mt-6 pt-6 border-t border-midnight-800">
            <h4 className="font-medium mb-2">How to use these resources:</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Browse by category or type using the tabs below</li>
              <li>Click on any resource to view detailed information</li>
              <li>Save resources to your dashboard for quick access</li>
              <li>Track your progress as you complete assessments and guides</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function ResourceCategory({ icon, title, description }) {
  return (
    <div className="bg-midnight-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  )
}
