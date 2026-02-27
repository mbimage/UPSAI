import PageWrapper from "@/components/page-wrapper"
import ContextualBackButton from "@/components/contextual-back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExamplePage() {
  return (
    <PageWrapper title="Example Page with Back Buttons">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Back Button Styles</CardTitle>
              <ContextualBackButton variant="default" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-300">
              This page demonstrates different back button styles and placements. Notice the back button in the header,
              the one in this card, and the floating action button at the bottom right.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <ContextualBackButton variant="default" />
                <span className="text-sm text-gray-400">Default Button Style</span>
              </div>

              <div className="flex items-center gap-4">
                <ContextualBackButton variant="minimal" />
                <span className="text-sm text-gray-400">Minimal Style</span>
              </div>

              <div className="flex items-center gap-4">
                <ContextualBackButton variant="header" />
                <span className="text-sm text-gray-400">Header Style</span>
              </div>

              <div className="flex items-center gap-4">
                <ContextualBackButton variant="default" showLabel={false} />
                <span className="text-sm text-gray-400">Icon Only</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              The back buttons are context-aware and will take you to the most logical previous page. They also support
              browser history, keyboard shortcuts (Alt+←), and touch gestures on mobile.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <ContextualBackButton destination="/dashboard" />
              <ContextualBackButton destination="/resources" />
              <ContextualBackButton destination="/chat" />
              <ContextualBackButton destination="/" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
