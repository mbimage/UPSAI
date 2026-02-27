"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Trophy, ExternalLink } from "lucide-react"

export function TexasSportsCalendar() {
  // Sample data - in a real app, this would come from an API or database
  const events = [
    {
      id: 1,
      title: "Regional Football Championship",
      date: "May 15, 2025",
      time: "7:00 PM",
      location: "Austin Memorial Stadium",
      type: "competition",
    },
    {
      id: 2,
      title: "Basketball Training Camp",
      date: "May 20, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Houston Sports Center",
      type: "training",
    },
    {
      id: 3,
      title: "College Recruitment Fair",
      date: "May 25, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Dallas Convention Center",
      type: "recruitment",
    },
  ]

  const openGoogleMaps = (location) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, "_blank")
  }

  return (
    <Card className="bg-midnight-900 border-neon-500/10 text-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-neon-400 mr-2" />
            <h3 className="font-medium">Upcoming Texas Sports Events</h3>
          </div>
          <span className="text-xs text-gray-400">May 2025</span>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border ${
                event.type === "competition"
                  ? "border-neon-500/20 bg-neon-500/5"
                  : event.type === "training"
                    ? "border-electric-500/20 bg-electric-500/5"
                    : "border-purple-500/20 bg-purple-500/5"
              } hover:bg-midnight-800/50 transition-colors cursor-pointer relative group`}
              onClick={() => openGoogleMaps(event.location)}
            >
              {/* Map indicator in top right corner */}
              <div className="absolute top-2 right-2 bg-electric-500/20 text-electric-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3 w-3" />
              </div>

              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{event.title}</h4>
                {event.type === "competition" ? (
                  <Trophy className="h-4 w-4 text-neon-400" />
                ) : event.type === "training" ? (
                  <Clock className="h-4 w-4 text-electric-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-purple-400" />
                )}
              </div>
              <div className="text-sm text-gray-300 flex items-center mb-1">
                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                {event.date}
              </div>
              <div className="text-sm text-gray-300 flex items-center mb-1">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                {event.time}
              </div>
              <div className="text-sm text-gray-300 flex items-center group-hover:text-electric-400 transition-colors">
                <MapPin className="h-3 w-3 mr-1 text-gray-400 group-hover:text-electric-400 transition-colors" />
                {event.location}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Also export as default for backward compatibility
export default TexasSportsCalendar
