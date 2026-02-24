"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare, BookOpen, BarChart3, Target, Sparkles, ChevronRight, Play } from "lucide-react"

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  gradient: string
  shadowColor: string
  description: string
  badge?: string
  estimatedTime?: string
}

const quickActions: QuickAction[] = [
  {
    id: "daily-action",
    title: "Daily Power-Up",
    subtitle: "Confidence Boost",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-neon-600 to-neon-500",
    shadowColor: "neon-500/30",
    description: "2-minute power pose practice",
    estimatedTime: "2 min",
    badge: "Ready",
  },
  {
    id: "ai-chat",
    title: "AI Teammate",
    subtitle: "Get Guidance",
    icon: <MessageSquare className="h-6 w-6" />,
    gradient: "from-electric-600 to-electric-500",
    shadowColor: "electric-500/30",
    description: "Personalized teammate session",
    estimatedTime: "5-15 min",
  },
  {
    id: "quick-lesson",
    title: "Skill Builder",
    subtitle: "Quick Learning",
    icon: <BookOpen className="h-6 w-6" />,
    gradient: "from-purple-600 to-purple-500",
    shadowColor: "purple-500/30",
    description: "Micro-learning module",
    estimatedTime: "3-5 min",
    badge: "New",
  },
  {
    id: "progress-view",
    title: "Progress Hub",
    subtitle: "View Analytics",
    icon: <BarChart3 className="h-6 w-6" />,
    gradient: "from-blue-600 to-blue-500",
    shadowColor: "blue-500/30",
    description: "Detailed growth insights",
    estimatedTime: "2 min",
  },
]

interface PremiumQuickActionsProps {
  onActionClick?: (actionId: string) => void
}

export function PremiumQuickActions({ onActionClick }: PremiumQuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const handleActionClick = (actionId: string) => {
    onActionClick?.(actionId)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neon-400" />
            Quick Actions
          </h3>
          <p className="text-sm text-gray-400">Jump into your growth journey</p>
        </div>
        <Badge className="bg-neon-600/20 text-neon-300 border-neon-500/30">4 available</Badge>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={action.id}
            className="relative overflow-hidden bg-midnight-900/80 border-neon-500/20 backdrop-blur-sm hover:border-neon-400/40 transition-all duration-500 cursor-pointer group hover:scale-105"
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={() => handleActionClick(action.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div
              className={`absolute inset-0 bg-gradient-to-br from-${action.gradient.split("-")[1]}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>

            <CardContent className="relative p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg shadow-${action.shadowColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{action.icon}</div>
                </div>
                {action.badge && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      action.badge === "Ready"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {action.badge}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{action.subtitle}</p>
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  {action.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                {action.estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Target className="h-3 w-3" />
                    {action.estimatedTime}
                  </div>
                )}
                <div
                  className={`flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-${action.gradient.split("-")[1]}-400`}
                >
                  <Play className="h-3 w-3" />
                  Start
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5`}></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </CardContent>

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shine"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          className="border-neon-500/30 text-neon-300 hover:bg-neon-500/10 hover:border-neon-400/50 transition-all duration-300 bg-transparent"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          View All Actions
        </Button>
      </div>
    </div>
  )
}
