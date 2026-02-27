import { Suspense } from "react"
import { AdminAnalyticsDashboard } from "./client"

export const metadata = {
  title: "Admin Analytics | UpSide AI",
  description: "Analytics dashboard for tracking user outcomes and platform performance",
}

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Analytics Dashboard</h1>

      <Suspense fallback={<div className="text-white">Loading analytics data...</div>}>
        <AdminAnalyticsDashboard />
      </Suspense>
    </div>
  )
}
