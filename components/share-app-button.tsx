"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check, Copy, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getAppUrl } from "@/lib/url-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackButtonClick } from "@/lib/analytics"

export function ShareAppButton() {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("share")

  const appUrl = getAppUrl()
  const feedbackUrl = `${appUrl}/feedback?source=friend-share`

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    trackButtonClick("copy_share_link", { type: activeTab })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out UpSide AI",
          text: "I've been using this awesome app for student-athletes. Try it out and let me know what you think!",
          url: appUrl,
        })
        trackButtonClick("native_share")
      } catch (error) {
        console.error("Error sharing:", error)
        setOpen(true)
      }
    } else {
      setOpen(true)
      trackButtonClick("open_share_dialog")
    }
  }

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className="gap-2 bg-midnight-900 border-neon-500/20 text-white hover:bg-neon-500/10"
      >
        <Share2 className="h-4 w-4" />
        Share with Friends
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-midnight-900 border-neon-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Share UpSide AI</DialogTitle>
            <DialogDescription className="text-gray-400">Share with friends and get their feedback</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="share">Share App</TabsTrigger>
              <TabsTrigger value="feedback">Request Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="share" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={appUrl} readOnly className="bg-midnight-800 border-neon-500/20 text-white" />
                <Button onClick={() => handleCopy(appUrl)} size="sm" className="gap-1">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="text-sm text-gray-400">Your friends can try the app instantly with the demo mode!</div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="text-sm text-gray-300 mb-2">
                Share this special link to request feedback from your friends:
              </div>
              <div className="flex items-center space-x-2">
                <Input value={feedbackUrl} readOnly className="bg-midnight-800 border-neon-500/20 text-white" />
                <Button onClick={() => handleCopy(feedbackUrl)} size="sm" className="gap-1">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="flex items-center mt-2 p-3 bg-midnight-800 rounded-md border border-neon-500/30">
                <MessageSquare className="h-5 w-5 text-neon-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  This link will prompt your friends to provide feedback after they try the app
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
