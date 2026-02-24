"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Calendar, TrendingUp, BookOpen, Brain } from "lucide-react"

interface TabConfig {
  value: string
  label: string
  icon: React.ReactNode
  gradient: string
  badge?: string
  description: string
}

const tabConfigs: TabConfig[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <BarChart3 className="h-4 w-4" />,
    gradient: "from-blue-600 to-blue-500",
    description: "Your complete dashboard",
  },
  {
    value: "daily",
    label: "Daily Focus",
    icon: <Calendar className="h-4 w-4" />,
    gradient: "from-green-600 to-green-500",
    badge: "3",
    description: "Today's actions & goals",
  },
  {
    value: "growth",
    label: "Growth",
    icon: <TrendingUp className="h-4 w-4" />,
    gradient: "from-purple-600 to-purple-500",
    badge: "New",
    description: "Track your development",
  },
  {
    value: "learning",
    label: "Learning",
    icon: <BookOpen className="h-4 w-4" />,
    gradient: "from-orange-600 to-orange-500",
    description: "Skills & knowledge",
  },
  {
    value: "reflection",
    label: "Reflection",
    icon: <Brain className="h-4 w-4" />,
    gradient: "from-pink-600 to-pink-500",
    description: "E+R=O insights",
  },
]

interface PremiumNavigationTabsProps {
  children: React.ReactNode
  defaultValue?: string
}

export function PremiumNavigationTabs({ children, defaultValue = "overview" }: PremiumNavigationTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Premium Tab Navigation */}
      <div className="relative mb-8">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-600/10 via-electric-500/10 to-purple-600/10 rounded-3xl blur-xl"></div>

        <TabsList className="relative grid w-full grid-cols-5 bg-midnight-800/80 backdrop-blur-xl border border-neon-500/20 p-2 rounded-3xl shadow-2xl shadow-midnight-900/50">
          {tabConfigs.map((tab, index) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`
                relative group data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} 
                data-[state=active]:text-white data-[state=active]:shadow-2xl 
                data-[state=active]:shadow-${tab.gradient.split("-")[1]}-500/30 
                rounded-2xl transition-all duration-500 hover:scale-105
                data-[state=active]:scale-105 overflow-hidden
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Tab Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-white/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              </div>

              <div className="relative flex flex-col items-center gap-2 py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="group-data-[state=active]:animate-pulse-subtle">{tab.icon}</div>
                  {tab.badge && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-300 border-red-500/30 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white group-data-[state=active]:border-white/30"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                  <div className="text-xs opacity-70 group-data-[state=active]:opacity-90 transition-opacity hidden lg:block">
                    {tab.description}
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Active Tab Indicator */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-gradient-to-r from-neon-400 to-electric-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {children}
    </Tabs>
  )
}
