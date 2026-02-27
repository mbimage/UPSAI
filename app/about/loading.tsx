import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section Loading */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto bg-midnight-800 mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-midnight-800" />
        </div>

        <Card className="bg-midnight-900/80 border-neon-500/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <Skeleton className="h-8 w-48 bg-midnight-800 mb-4" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-midnight-800 mb-6" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-midnight-800 mb-6" />
                <Skeleton className="h-10 w-40 bg-midnight-800" />
              </div>
              <Skeleton className="h-[300px] bg-midnight-800" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Founders Section Loading */}
      <section className="mb-16">
        <Skeleton className="h-10 w-64 mx-auto bg-midnight-800 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-midnight-900/80 border-neon-500/10 overflow-hidden">
              <Skeleton className="h-64 w-full bg-midnight-800" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-32 bg-midnight-800 mb-4" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-midnight-800 mb-4" />
                <Skeleton className="h-20 w-full bg-midnight-800 mb-4" />
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded-full bg-midnight-800" />
                  <Skeleton className="h-5 w-5 rounded-full bg-midnight-800" />
                  <Skeleton className="h-5 w-5 rounded-full bg-midnight-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section Loading */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-48 mx-auto bg-midnight-800 mb-4" />
          <Skeleton className="h-4 w-full max-w-xl mx-auto bg-midnight-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-midnight-900/80 border-neon-500/10">
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-full bg-midnight-800 mb-4" />
                <Skeleton className="h-6 w-32 bg-midnight-800 mb-2" />
                <Skeleton className="h-4 w-full bg-midnight-800 mb-1" />
                <Skeleton className="h-4 w-3/4 bg-midnight-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Join Us Section Loading */}
      <section>
        <Card className="bg-midnight-900 border-neon-500/10">
          <CardContent className="p-8 md:p-12 text-center">
            <Skeleton className="h-8 w-48 mx-auto bg-midnight-800 mb-4" />
            <Skeleton className="h-4 w-full max-w-xl mx-auto bg-midnight-800 mb-2" />
            <Skeleton className="h-4 w-3/4 max-w-xl mx-auto bg-midnight-800 mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-10 w-40 bg-midnight-800" />
              <Skeleton className="h-10 w-40 bg-midnight-800" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
