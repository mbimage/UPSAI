"use client"

import type React from "react"
import { useState } from "react"

interface ChatFeedbackProps {
  onSubmit: (feedback: string) => void
}

const ChatFeedback: React.FC<ChatFeedbackProps> = ({ onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(event.target.value)
  }

  const handleSubmit = () => {
    onSubmit(feedbackText)
    setFeedbackText("")
  }

  return (
    <div className="chat-feedback">
      <h3>Feedback</h3>
      <p>Was this response helpful?</p>
      <div className="feedback-options">
        <button onClick={() => onSubmit("⭐ Helpful")} aria-label="Helpful">
          ⭐ Helpful
        </button>
        <button onClick={() => onSubmit("✨ Great Response")} aria-label="Great Response">
          ✨ Great Response
        </button>
        <button onClick={() => onSubmit("👍 Good")} aria-label="Good">
          👍 Good
        </button>
        <button onClick={() => onSubmit("💪 Encouraging")} aria-label="Encouraging">
          💪 Encouraging
        </button>
        <button onClick={() => onSubmit("🎯 Accurate")} aria-label="Accurate">
          🎯 Accurate
        </button>
      </div>
      <textarea value={feedbackText} onChange={handleInputChange} placeholder="Optional: Provide more details" />
      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  )
}

export default ChatFeedback
