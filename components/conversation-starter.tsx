"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"

const CONVERSATION_STARTERS = [
  "How can I develop leadership skills when I'm not the team captain?",
  "What strategies help with managing academic pressure during playoff season?",
  "How do I approach conversations about my future with coaches and counselors?",
  "What are effective ways to balance multiple extracurricular commitments?",
  "How can I build confidence when competing against larger schools?",
  "What techniques help with managing pre-competition anxiety?",
  "How do I maintain motivation during the off-season?",
  "What are effective approaches for building team cohesion across diverse backgrounds?",
]

export default function ConversationStarter() {
  const [message, setMessage] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState("")

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt)
    setSelectedPrompt(prompt)
  }

  return (
    <Card className="bg-midnight-800/90 border-neon-500/20 backdrop-blur-sm">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-neon-400 mb-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-medium">Start a conversation with your AI teammate</h3>
          </div>

          <Textarea
            placeholder="Ask about academics, athletics, leadership, or personal growth..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-midnight-900 border-neon-500/20 text-white resize-none"
          />

          <div>
            <p className="text-sm text-gray-400 mb-3">Or try one of these conversation starters:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CONVERSATION_STARTERS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start h-auto py-2 px-3 text-sm text-left border-neon-500/20 hover:bg-neon-500/10 ${
                    selectedPrompt === prompt ? "bg-neon-500/10 border-neon-500/30" : ""
                  }`}
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          <Button
            asChild
            className="w-full bg-gradient-to-r from-neon-600 to-electric-600 hover:from-neon-500 hover:to-electric-500 text-white"
            disabled={!message.trim()}
          >
            <Link href={`/chat?message=${encodeURIComponent(message)}`}>
              Start Conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
