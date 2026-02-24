import { MonthlyDigestViewer } from "@/components/monthly-digest-viewer"
import { PageWrapper } from "@/components/page-wrapper"

export default function ParentDigestPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        <div className="container mx-auto px-4 py-8">
          <MonthlyDigestViewer />
        </div>
      </div>
    </PageWrapper>
  )
}

export const metadata = {
  title: "Monthly Parent Digest | UpSide AI",
  description: "Monthly overview of student engagement, progress, and insights for parents",
}
