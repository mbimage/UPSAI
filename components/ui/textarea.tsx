"use client"

import * as React from "react"
import { ChevronDown, Lightbulb, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
  showDefaultChallenges?: boolean
}

const DEFAULT_CHALLENGE_SUGGESTIONS = [
  "How can I balance homework and practice time better?",
  "What's the best way to manage my busy schedule?",
  "I get nervous before games - how can I stay calm?",
  "How do I build more confidence in my abilities?",
  "Dealing with pressure from coaches, parents, or myself",
  "Coming back strong after getting injured",
  "Staying motivated when things get tough",
  "Handling drama or conflicts with teammates",
  "Managing stress when everything feels overwhelming",
  "Getting ready for college sports or scholarships",
  "Dealing with social media and online pressure",
  "How to stay focused during long practices",
  "Overcoming fear of messing up or failing",
  "Managing what everyone expects from me",
  "Finding people who understand what I'm going through",
  "Making time for friends while staying committed to sports",
  "Avoiding burnout and staying passionate",
  "Learning from criticism and tough feedback",
  "Managing costs for equipment, camps, and travel",
  "Getting mentally prepared for big competitions",
  "Not comparing myself to other players",
  "Handling family pressure and expectations",
  "Staying disciplined with training and goals",
  "Bouncing back after disappointing losses",
  "Becoming a better leader and teammate",
]

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, suggestions, onSuggestionSelect, showDefaultChallenges = false, ...props }, ref) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    const [textareaRef, setTextareaRef] = React.useState<HTMLTextAreaElement | null>(null)

    const activeSuggestions = showDefaultChallenges ? DEFAULT_CHALLENGE_SUGGESTIONS : suggestions || []

    const handleSuggestionClick = (suggestion: string) => {
      if (textareaRef) {
        textareaRef.value = suggestion
        textareaRef.focus()
      }
      onSuggestionSelect?.(suggestion)
      setShowSuggestions(false)
    }

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            activeSuggestions && "pr-12",
            className,
          )}
          ref={(node) => {
            setTextareaRef(node)
            if (typeof ref === "function") {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          {...props}
        />

        {activeSuggestions && activeSuggestions.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={cn(
                "absolute right-2 top-2 p-2 rounded-lg transition-all duration-200 group",
                "bg-gradient-to-r from-neon-500/20 to-electric-500/20 hover:from-neon-500/30 hover:to-electric-500/30",
                "border border-neon-500/30 hover:border-neon-500/50",
                "shadow-lg shadow-neon-500/20 hover:shadow-neon-500/30",
                showSuggestions && "from-neon-500/40 to-electric-500/40 border-neon-500/60",
              )}
              aria-label="Show suggested questions"
            >
              <div className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-neon-400 group-hover:text-neon-300" />
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-neon-400 group-hover:text-neon-300 transition-transform duration-200",
                    showSuggestions && "rotate-180",
                  )}
                />
              </div>
            </button>

            {showSuggestions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
                <div className="bg-gradient-to-b from-midnight-800/95 to-midnight-900/95 backdrop-blur-xl border border-neon-500/30 rounded-lg shadow-2xl shadow-neon-500/20 max-h-64 overflow-hidden">
                  {/* Header */}
                  <div className="p-3 border-b border-neon-500/20 bg-gradient-to-r from-neon-500/10 to-electric-500/10">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-neon-400" />
                      <span className="text-sm font-semibold text-neon-300">Quick Suggestions</span>
                    </div>
                    <p className="text-xs text-neon-400/80 mt-1">Click any option to use it</p>
                  </div>

                  {/* Suggestions List */}
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {activeSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={cn(
                            "w-full text-left p-3 text-sm rounded-md transition-all duration-200 group",
                            "hover:bg-gradient-to-r hover:from-neon-500/20 hover:to-electric-500/20",
                            "hover:border-l-2 hover:border-neon-500",
                            "text-white/90 hover:text-white",
                            "hover:shadow-lg hover:shadow-neon-500/10",
                            "hover:translate-x-1",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-500/60 mt-2 group-hover:bg-neon-400 transition-colors" />
                            <span className="leading-relaxed">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-2 border-t border-neon-500/20 bg-gradient-to-r from-neon-500/5 to-electric-500/5">
                    <p className="text-xs text-neon-400/60 text-center">Or type your own response above</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #06b6d4, #3b82f6);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #0891b2, #2563eb);
          }
        `}</style>
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
