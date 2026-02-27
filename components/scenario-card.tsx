"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Lightbulb, MessageCircle, ThumbsUp } from "lucide-react"
import type { Scenario } from "@/lib/scenario-library"
import { cn } from "@/lib/utils"

interface ScenarioCardProps {
  scenario: Scenario
  onApply?: () => void
  className?: string
  compact?: boolean
}

export function ScenarioCard({ scenario, onApply, className, compact = false }: ScenarioCardProps) {
  const [expanded, setExpanded] = useState(!compact)
  const [helpful, setHelpful] = useState(false)

  return (
    <Card
      className={cn(
        "border-neon-500/20 bg-midnight-800/80 overflow-hidden transition-all duration-300",
        expanded ? "shadow-lg shadow-neon-500/10" : "",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-8 rounded-full bg-neon-500/20 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-neon-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{scenario.title}</CardTitle>
              {!expanded && (
                <CardDescription className="text-gray-400 line-clamp-1">{scenario.situation}</CardDescription>
              )}
            </div>
          </div>
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{expanded ? "Show less" : "Show more"}</span>
            </Button>
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pb-3 text-gray-200">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-neon-400 mb-1">Situation</h4>
              <p>{scenario.situation}</p>
            </div>

            <div>
              <h4 className="font-medium text-neon-400 mb-1">Challenge</h4>
              <p>{scenario.challenge}</p>
            </div>

            <div>
              <h4 className="font-medium text-neon-400 mb-1">Key Considerations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {scenario.considerations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-neon-400 mb-1">Reflection Questions</h4>
              <ul className="list-disc pl-5 space-y-1">
                {scenario.reflectionQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {scenario.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-neon-500/10 text-neon-400 text-xs">
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-between pt-0 pb-3">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn("text-xs h-8", helpful ? "text-neon-400" : "text-gray-400 hover:text-white")}
            onClick={() => setHelpful(!helpful)}
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            {helpful ? "Helpful" : "Mark as helpful"}
          </Button>

          {onApply && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-neon-500/20 hover:bg-neon-500/20 hover:text-white"
              onClick={onApply}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Discuss this scenario
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
