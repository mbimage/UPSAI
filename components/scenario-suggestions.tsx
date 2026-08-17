"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScenarioBrowser } from "@/components/scenario-browser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Lightbulb } from "lucide-react"
import type { Scenario } from "@/lib/scenario-library"

// College-athlete scenarios
const TEXAS_SCENARIOS = [
  {
    title: "Game Day Pressure",
    description: "You have a big game coming up and the pressure to perform is starting to feel overwhelming.",
    theme: "performance-anxiety",
  },
  {
    title: "Balancing Classes and Your Sport",
    description: "You're struggling to keep up with your course load while meeting your athletic commitments.",
    theme: "academic-athletic-balance",
  },
  {
    title: "Talking to a Professor",
    description: "You need to ask a professor for an extension after travel for an away game, but you're not sure how.",
    theme: "communication",
  },
  {
    title: "Life After the Last Game",
    description: "You're thinking about your career after college and want to turn connections into opportunities.",
    theme: "career-planning",
  },
]

export function ScenarioSuggestions() {
  const [showBrowser, setShowBrowser] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    // In a real implementation, this would navigate to the scenario or open it
    console.log("Selected scenario:", scenario)
  }

  return (
    <Card className="bg-midnight-900 border-neon-500/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
            <CardTitle>Practice Scenarios</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-neon-400 hover:text-neon-300 hover:bg-neon-500/10"
            onClick={() => setShowBrowser(!showBrowser)}
          >
            {showBrowser ? "Hide Browser" : "Browse All"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Practice handling real-life situations college athletes face</CardDescription>
      </CardHeader>
      <CardContent>
        {showBrowser ? (
          <ScenarioBrowser onSelectScenario={handleSelectScenario} />
        ) : (
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="w-full mb-4 bg-midnight-800">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="texas">Texas Specific</TabsTrigger>
              <TabsTrigger value="popular">Most Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-3">
              {TEXAS_SCENARIOS.slice(0, 2).map((scenario, index) => (
                <ScenarioCard key={index} scenario={scenario} />
              ))}
            </TabsContent>

            <TabsContent value="texas" className="space-y-3">
              {TEXAS_SCENARIOS.map((scenario, index) => (
                <ScenarioCard key={index} scenario={scenario} />
              ))}
            </TabsContent>

            <TabsContent value="popular" className="space-y-3">
              {TEXAS_SCENARIOS.slice(2, 4).map((scenario, index) => (
                <ScenarioCard key={index} scenario={scenario} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

function ScenarioCard({ scenario }) {
  return (
    <div className="bg-midnight-800 p-4 rounded-lg border border-neon-500/10 hover:border-neon-500/30 transition-colors">
      <h3 className="font-medium text-white mb-1">{scenario.title}</h3>
      <p className="text-sm text-gray-300 mb-3">{scenario.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{scenario.theme.replace("-", " ")}</span>
        <Button size="sm" className="bg-neon-600 hover:bg-neon-700 text-white text-xs h-8">
          Try Scenario
        </Button>
      </div>
    </div>
  )
}
