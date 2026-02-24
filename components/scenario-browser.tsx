"use client"

import { useState, useEffect } from "react"
import { ScenarioCard } from "@/components/scenario-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getAllThemes,
  getRandomScenario,
  findRelevantScenarios,
  scenarios,
  type Scenario,
} from "@/lib/scenario-library"
import { Search, RefreshCw } from "lucide-react"

interface ScenarioBrowserProps {
  onSelectScenario?: (scenario: Scenario) => void
  initialTheme?: string
  className?: string
}

export function ScenarioBrowser({ onSelectScenario, initialTheme, className }: ScenarioBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTheme, setActiveTheme] = useState(initialTheme || "all")
  const [themes, setThemes] = useState<string[]>([])
  const [displayedScenarios, setDisplayedScenarios] = useState<Scenario[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize themes and scenarios
  useEffect(() => {
    const allThemes = getAllThemes()
    setThemes(allThemes)

    // Load initial scenarios
    loadScenariosForTheme(activeTheme)
    setIsLoading(false)
  }, [activeTheme, initialTheme])

  // Function to load scenarios for a theme
  const loadScenariosForTheme = (theme: string) => {
    let scenariosList: Scenario[] = []

    if (theme === "all") {
      // Get a sample from each theme
      getAllThemes().forEach((themeName) => {
        const scenario = getRandomScenario(themeName as keyof typeof scenarios)
        if (scenario) scenariosList.push(scenario)
      })
    } else {
      // Get all scenarios from the selected theme
      const themeScenarios = scenarios[theme as keyof typeof scenarios] || []
      scenariosList = [...themeScenarios]
    }

    setDisplayedScenarios(scenariosList)
  }

  // Function to handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadScenariosForTheme(activeTheme)
      return
    }

    const keywords = searchQuery.toLowerCase().split(/\s+/)
    const results = findRelevantScenarios(keywords)
    setDisplayedScenarios(results)
  }

  // Function to refresh scenarios
  const refreshScenarios = () => {
    setIsLoading(true)
    setTimeout(() => {
      loadScenariosForTheme(activeTheme)
      setIsLoading(false)
    }, 300)
  }

  // Function to handle theme change
  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme)
    setSearchQuery("")
    loadScenariosForTheme(theme)
  }

  // Function to handle scenario selection
  const handleSelectScenario = (scenario: Scenario) => {
    if (onSelectScenario) {
      onSelectScenario(scenario)
    }
  }

  // Format theme name for display
  const formatThemeName = (theme: string) => {
    return theme
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className={className}>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-midnight-900 border-neon-500/20 text-white"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <Tabs defaultValue={activeTheme} onValueChange={handleThemeChange}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Browse by Theme</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshScenarios}
              className="h-8 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <TabsList className="bg-midnight-900 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-neon-500/20 data-[state=active]:text-white">
              All Themes
            </TabsTrigger>

            {themes.map((theme) => (
              <TabsTrigger
                key={theme}
                value={theme}
                className="data-[state=active]:bg-neon-500/20 data-[state=active]:text-white"
              >
                {formatThemeName(theme)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTheme} className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-neon-400" />
              </div>
            ) : displayedScenarios.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {displayedScenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    compact={true}
                    onApply={() => handleSelectScenario(scenario)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No scenarios found. Try a different theme or search term.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
