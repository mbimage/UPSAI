"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Flame, Brain, Trophy, Zap, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"

interface StatCard {
  id: string
  title: string
  value: number
  previousValue: number
  unit: string
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
  trend: "up" | "down" | "stable"
  trendValue: number
}

export function PremiumStatsGrid() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      id: "confidence",
      title: "Confidence Level",
      value: 78,
      previousValue: 73,
      unit: "%",
      icon: <Heart className="h-5 w-5" />,
      color: "text-neon-400",
      gradient: "from-neon-500/20 to-neon-600/10",
      description: "Your self-belief strength",
      trend: "up",
      trendValue: 5,
    },
    {
      id: "streak",
      title: "Growth Streak",
      value: 7,
      previousValue: 6,
      unit: " days",
      icon: <Flame className="h-5 w-5" />,
      color: "text-electric-400",
      gradient: "from-electric-500/20 to-electric-600/10",
      description: "Consecutive active days",
      trend: "up",
      trendValue: 1,
    },
    {
      id: "insights",
      title: "E+R=O Insights",
      value: 12,
      previousValue: 8,
      unit: " entries",
      icon: <Brain className="h-5 w-5" />,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-blue-600/10",
      description: "Reflection moments logged",
      trend: "up",
      trendValue: 4,
    },
    {
      id: "achievement",
      title: "Achievement Score",
      value: 85,
      previousValue: 82,
      unit: "/100",
      icon: <Trophy className="h-5 w-5" />,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-purple-600/10",
      description: "Overall progress rating",
      trend: "up",
      trendValue: 3,
    },
  ])

  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  useEffect(() => {
    // Animate values on mount
    const timer = setTimeout(() => {
      const animated = stats.reduce(
        (acc, stat) => {
          acc[stat.id] = stat.value
          return acc
        },
        {} as Record<string, number>,
      )
      setAnimatedValues(animated)
    }, 100)

    return () => clearTimeout(timer)
  }, [stats])

  const handleStatBoost = (statId: string) => {
    setStats((prev) =>
      prev.map((stat) => {
        if (stat.id === statId) {
          const newValue = Math.min(stat.value + 2, 100)
          return {
            ...stat,
            previousValue: stat.value,
            value: newValue,
            trendValue: newValue - stat.value,
          }
        }
        return stat
      }),
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={stat.id}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border-${stat.color.split("-")[1]}-500/30 backdrop-blur-sm hover:border-${stat.color.split("-")[1]}-400/50 transition-all duration-500 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-${stat.color.split("-")[1]}-500/20`}
          onClick={() => handleStatBoost(stat.id)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent animate-pulse-slow"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          </div>

          {/* Glow Effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
          ></div>

          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {stat.title}
              </CardTitle>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{stat.description}</p>
            </div>
            <div
              className={`p-3 bg-gradient-to-br from-midnight-800/80 to-midnight-700/80 rounded-xl border border-${stat.color.split("-")[1]}-500/20 group-hover:border-${stat.color.split("-")[1]}-400/40 transition-all duration-300 group-hover:scale-110`}
            >
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </CardHeader>

          <CardContent className="relative space-y-4">
            {/* Main Value Display */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {animatedValues[stat.id] || 0}
                </span>
                <span className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors">{stat.unit}</span>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === "up"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : stat.trend === "down"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : stat.trend === "down" ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <MoreHorizontal className="h-3 w-3" />
                  )}
                  {stat.trend === "up" ? "+" : stat.trend === "down" ? "-" : ""}
                  {Math.abs(stat.trendValue)}
                  {stat.unit === "%" ? "%" : ""}
                </div>
                <span className="text-xs text-gray-500">vs last week</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress
                value={stat.value}
                className="h-2 bg-midnight-800/50"
                indicatorClassName={`bg-gradient-to-r from-${stat.color.split("-")[1]}-500 to-${stat.color.split("-")[1]}-400 transition-all duration-1000`}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Previous: {stat.previousValue}
                  {stat.unit}
                </span>
                <span className="text-gray-400">Click to boost</span>
              </div>
            </div>

            {/* Interactive Hint */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`text-xs ${stat.color} font-medium flex items-center gap-1`}>
                <Zap className="h-3 w-3" />
                Tap for +2 boost
              </div>
            </div>
          </CardContent>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shine"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}
