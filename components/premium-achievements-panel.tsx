"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Target, Flame, Brain, Heart, Lock, CheckCircle, ChevronRight } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: "streak" | "confidence" | "learning" | "reflection" | "social"
  progress: number
  maxProgress: number
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  unlockedAt?: Date
}

const achievements: Achievement[] = [
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day growth streak",
    icon: <Flame className="h-5 w-5" />,
    category: "streak",
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    rarity: "rare",
    points: 100,
    unlockedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "reflection-master",
    title: "Reflection Master",
    description: "Complete 10 E+R=O entries",
    icon: <Brain className="h-5 w-5" />,
    category: "reflection",
    progress: 10,
    maxProgress: 10,
    unlocked: true,
    rarity: "epic",
    points: 150,
    unlockedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "confidence-builder",
    title: "Confidence Builder",
    description: "Reach 80% confidence level",
    icon: <Heart className="h-5 w-5" />,
    category: "confidence",
    progress: 78,
    maxProgress: 80,
    unlocked: false,
    rarity: "rare",
    points: 120,
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Complete 5 learning modules",
    icon: <Target className="h-5 w-5" />,
    category: "learning",
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    rarity: "common",
    points: 75,
  },
  {
    id: "streak-legend",
    title: "Streak Legend",
    description: "Maintain a 30-day streak",
    icon: <Trophy className="h-5 w-5" />,
    category: "streak",
    progress: 7,
    maxProgress: 30,
    unlocked: false,
    rarity: "legendary",
    points: 500,
  },
  {
    id: "peak-performer",
    title: "Peak Performer",
    description: "Reach 95% confidence level",
    icon: <Star className="h-5 w-5" />,
    category: "confidence",
    progress: 78,
    maxProgress: 95,
    unlocked: false,
    rarity: "legendary",
    points: 300,
  },
]

const rarityColors = {
  common: {
    bg: "from-gray-500/20 to-gray-600/10",
    border: "border-gray-500/30",
    text: "text-gray-400",
    glow: "shadow-gray-500/20",
  },
  rare: {
    bg: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  epic: {
    bg: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
  legendary: {
    bg: "from-yellow-500/20 to-yellow-600/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/20",
  },
}

export function PremiumAchievementsPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((unlockedAchievements.length / achievements.length) * 100)

  const filteredAchievements =
    selectedCategory === "all" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  return (
    <Card className="bg-midnight-900/80 border-neon-500/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{totalPoints} points</Badge>
            <Badge className="bg-neon-600/20 text-neon-300 border-neon-500/30">{completionRate}% complete</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "streak", "confidence", "learning", "reflection"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-neon-600 to-electric-600 text-white"
                  : "border-neon-500/30 text-neon-300 hover:bg-neon-500/10"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const rarity = rarityColors[achievement.rarity]
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

            return (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden bg-gradient-to-br ${rarity.bg} ${rarity.border} backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked ? `hover:${rarity.glow}` : "opacity-75"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Unlock Animation Background */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse-slow"></div>
                )}

                <CardContent className="relative p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-2 bg-midnight-800/50 rounded-lg ${rarity.border} ${
                        achievement.unlocked ? "animate-pulse-subtle" : ""
                      }`}
                    >
                      <div className={achievement.unlocked ? rarity.text : "text-gray-500"}>
                        {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5" />}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className={`text-xs ${rarity.bg} ${rarity.text} ${rarity.border}`}>
                        {achievement.rarity}
                      </Badge>
                      {achievement.unlocked && <CheckCircle className="h-4 w-4 text-green-400" />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div>
                      <h4 className={`font-medium ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-xs ${achievement.unlocked ? "text-gray-300" : "text-gray-500"}`}>
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={achievement.unlocked ? "text-gray-300" : "text-gray-500"}>Progress</span>
                        <span className={achievement.unlocked ? rarity.text : "text-gray-500"}>
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-1.5 bg-midnight-800/50"
                        indicatorClassName={
                          achievement.unlocked
                            ? `bg-gradient-to-r ${rarity.bg.replace("/20", "/60").replace("/10", "/40")}`
                            : "bg-gray-600"
                        }
                      />
                    </div>

                    {/* Points & Date */}
                    <div className="flex justify-between items-center pt-1">
                      <div className={`text-xs font-medium ${achievement.unlocked ? rarity.text : "text-gray-500"}`}>
                        +{achievement.points} points
                      </div>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-gray-500">{achievement.unlockedAt.toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Shine Effect for Unlocked */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shine"></div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Button
            variant="outline"
            className="border-neon-500/30 text-neon-300 hover:bg-neon-500/10 hover:border-neon-400/50 transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            View All Achievements
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
