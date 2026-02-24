"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Download, BookOpen, Video, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type ResourceType = "article" | "video" | "worksheet" | "guide" | "assessment" | "infographic"
export type ResourceCategory =
  | "self-efficacy"
  | "emotional-intelligence"
  | "social-awareness"
  | "career-readiness"
  | "leadership"
  | "mental-health"
  | "situational-awareness"
  | "general"

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  category: ResourceCategory
  thumbnail: string
  url: string
  duration: string
  author: string
  datePublished: string
  downloadable: boolean
  featured?: boolean
  new?: boolean
  premium?: boolean
}

interface ResourceCardProps {
  resource: Resource
  compact?: boolean
}

export function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const getIcon = () => {
    switch (resource.type) {
      case "article":
        return BookOpen
      case "video":
        return Video
      case "worksheet":
      case "guide":
      case "assessment":
        return FileText
      default:
        return Calendar
    }
  }

  const Icon = getIcon()

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${compact ? "h-full" : ""}`}>
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={resource.thumbnail || "/placeholder.svg"}
            alt={resource.title}
            width={600}
            height={340}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          {resource.new && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              New
            </Badge>
          )}
          {resource.premium && (
            <Badge variant="outline" className="border-amber-500 text-amber-500">
              Premium
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground capitalize">{resource.type}</span>
        </div>
        <CardTitle className={`line-clamp-1 ${compact ? "text-base" : "text-lg"}`}>{resource.title}</CardTitle>
        <CardDescription className={`line-clamp-2 ${compact ? "text-xs" : "text-sm"}`}>
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{resource.duration}</span>
          </div>
          {resource.downloadable && (
            <div className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>Downloadable</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-3">
        <Button asChild variant="secondary" className="w-full" size={compact ? "sm" : "default"}>
          <Link href={resource.url}>View Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])

  // This is a placeholder component - the actual implementation would fetch and display resources
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.length > 0 ? (
        resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No resources found</p>
        </div>
      )}
    </div>
  )
}
