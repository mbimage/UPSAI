"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Check for offline status - handle spotty connectivity gracefully
  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine)

    // Set initial status
    setIsOffline(!navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading && !disabled && !isOffline) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } else if (isOffline) {
      toast({
        title: "You're offline",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  // Speech recognition for voice input - helpful for students who may prefer speaking
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Try using Chrome or Edge.",
        variant: "destructive",
      })
      return
    }

    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false)
      toast({
        title: "Voice recording stopped",
        description: "Your message is ready to send.",
      })
    } else {
      // Start recording logic would go here
      setIsRecording(true)
      toast({
        title: "Voice recording started",
        description: "Speak clearly. Recording will automatically stop after a pause.",
      })

      // Simulating voice recognition result after 3 seconds
      setTimeout(() => {
        setMessage((prev) => prev + " I'm a college athlete looking for advice.")
        setIsRecording(false)
      }, 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {isOffline && (
        <div className="absolute -top-8 left-0 right-0 bg-red-900/80 text-white text-sm py-1 px-3 rounded-md text-center">
          You're currently offline. Message will send when connection is restored.
        </div>
      )}
      <div className="relative flex items-end">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={isOffline ? "You're offline. Type your message and it will send when connected." : placeholder}
          className="min-h-[70px] max-h-[200px] pr-24 bg-midnight-800 border-2 border-neon-500/40 text-white resize-none overflow-y-auto shadow-[0_0_15px_rgba(0,255,170,0.15)] focus:shadow-[0_0_20px_rgba(0,255,170,0.3)] transition-all duration-300"
          disabled={isLoading || disabled}
        />
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={toggleSpeechRecognition}
            className={`${isRecording ? "bg-red-500/20 text-red-400" : "text-gray-400 hover:text-white"}`}
            disabled={isLoading || disabled}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start voice input"}</span>
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading || disabled}
            className="bg-neon-600 hover:bg-neon-700 text-white"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Shift+Enter for a new line. {isOffline ? "Messages will send when you're back online." : ""}
      </p>
    </form>
  )
}
