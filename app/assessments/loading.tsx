import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function AssessmentsLoading() {
  return (
    <div className="min-h-screen bg-midnight-950 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-10 w-48 bg-midnight-800" />
            <Skeleton className="h-5 w-96 bg-midnight-800 mt-2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32 bg-midnight-800 rounded-full" />
            <Skeleton className="h-8 w-32 bg-midnight-800 rounded-full" />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 flex-grow bg-midnight-800" />
          <Skeleton className="h-10 w-48 bg-midnight-800" />
        </div>

        {/* Tabs */}
        <Skeleton className="h-10 w-96 mx-auto bg-midnight-800 mb-6" />

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="bg-midnight-900 border-neon-500/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 bg-midnight-800 rounded-full mr-3" />
                      <Skeleton className="h-4 w-20 bg-midnight-800" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-midnight-800" />
                  </div>
                  <Skeleton className="h-7 w-full bg-midnight-800 mt-3" />
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                  <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-midnight-800 mb-4" />
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-3 w-24 bg-midnight-800" />
                    <Skeleton className="h-3 w-24 bg-midnight-800" />
                  </div>
                  <Skeleton className="h-2 w-full bg-midnight-800 mt-3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full bg-midnight-800" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
