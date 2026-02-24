"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle, Brain, Target, TrendingUp } from "lucide-react"

export function EROFrameworkGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">The E+R=O Formula</h1>
        <p className="text-xl text-neon-200 mb-2">Event + Response = Outcome</p>
        <p className="text-neon-300">The champion's formula for turning setbacks into comebacks</p>
      </div>

      {/* Formula Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-midnight-800/60 border-midnight-700">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-xl font-semibold text-white">EVENT</h3>
          </div>
          <p className="text-neon-200 mb-4">What happened to you</p>
          <ul className="text-sm text-neon-300 space-y-2">
            <li>• Lost the game</li>
            <li>• Failed a test</li>
            <li>• Got injured</li>
            <li>• Didn't make the team</li>
            <li>• Scholarship rejection</li>
          </ul>
          <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-200 font-medium">You CAN'T control this</p>
          </div>
        </Card>

        <Card className="p-6 bg-midnight-800/60 border-midnight-700">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-neon-400" />
            <h3 className="text-xl font-semibold text-white">RESPONSE</h3>
          </div>
          <p className="text-neon-200 mb-4">How you choose to react</p>
          <ul className="text-sm text-neon-300 space-y-2">
            <li>• Your thoughts</li>
            <li>• Your emotions</li>
            <li>• Your actions</li>
            <li>• Your attitude</li>
            <li>• Your effort</li>
          </ul>
          <div className="mt-4 p-3 bg-neon-900/20 rounded-lg">
            <p className="text-sm text-neon-200 font-medium">You control 100% of this</p>
          </div>
        </Card>

        <Card className="p-6 bg-midnight-800/60 border-midnight-700">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-semibold text-white">OUTCOME</h3>
          </div>
          <p className="text-neon-200 mb-4">The result you get</p>
          <ul className="text-sm text-neon-300 space-y-2">
            <li>• Stronger mindset</li>
            <li>• Better performance</li>
            <li>• New opportunities</li>
            <li>• Personal growth</li>
            <li>• Future success</li>
          </ul>
          <div className="mt-4 p-3 bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-200 font-medium">This depends on your response</p>
          </div>
        </Card>
      </div>

      {/* Key Principles */}
      <Card className="p-8 bg-gradient-to-br from-neon-900/80 to-neon-950/80 border-neon-800/50">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-neon-400" />
          Champion Mindset Principles
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-midnight-800/60 rounded-lg">
              <h4 className="font-semibold text-neon-300 mb-2">1. Focus on What You Control</h4>
              <p className="text-sm text-neon-200">
                You can't control the event, but you control 100% of your response.
              </p>
            </div>
            <div className="p-4 bg-midnight-800/60 rounded-lg">
              <h4 className="font-semibold text-neon-300 mb-2">2. Setbacks = Setups</h4>
              <p className="text-sm text-neon-200">Every setback is a setup for a comeback if you respond right.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-midnight-800/60 rounded-lg">
              <h4 className="font-semibold text-neon-300 mb-2">3. Champions Respond Different</h4>
              <p className="text-sm text-neon-200">
                Champions aren't made by avoiding setbacks - they're made by how they respond.
              </p>
            </div>
            <div className="p-4 bg-midnight-800/60 rounded-lg">
              <h4 className="font-semibold text-neon-300 mb-2">4. Next 24 Hours Matter Most</h4>
              <p className="text-sm text-neon-200">
                Your response in the next 24 hours matters more than the event itself.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Scenario */}
      <Card className="p-8 bg-midnight-800/60 border-midnight-700">
        <h3 className="text-xl font-semibold text-white mb-6">Example: Lost Championship Game</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-red-400 mb-3">EVENT</h4>
            <p className="text-sm text-neon-200">Lost the championship game by 3 points. Season is over.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neon-400 mb-3">RESPONSE OPTIONS</h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-red-900/20 rounded text-red-200">❌ Blame teammates, quit, give up</div>
              <div className="p-2 bg-green-900/20 rounded text-green-200">
                ✅ Analyze what to improve, train harder, lead team
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-3">OUTCOME</h4>
            <p className="text-sm text-neon-200">Stronger player, better leader, championship next year.</p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <Button className="bg-neon-600 hover:bg-neon-500 text-white px-8 py-3 text-lg">
          Practice E+R=O with AI Coach
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
