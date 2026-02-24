import { GoalCreationWizard } from "@/components/goal-creation-wizard"
import { ContextualBackButton } from "@/components/contextual-back-button"

export default function CreateGoalPage() {
  return (
    <div className="min-h-screen bg-midnight-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <ContextualBackButton variant="minimal" customDestination="/dashboard" className="mb-6" />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-400 via-electric-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Create Your Goal
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's build a goal that's meaningful, achievable, and perfectly tailored to your journey
          </p>
        </div>

        <GoalCreationWizard />
      </div>
    </div>
  )
}
