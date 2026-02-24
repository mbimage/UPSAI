import { UserPreferences } from "@/components/user-preferences"

export const metadata = {
  title: "Personalization Settings - UpSide AI",
  description: "Customize your UpSide AI experience with personalization settings",
}

export default function PersonalizationSettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-midnight-950 to-midnight-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Personalization Settings</h1>
        <p className="text-gray-400 mb-8">
          Customize how UpSide AI interacts with you to get the most out of your experience.
        </p>

        <div className="mb-12">
          <UserPreferences />
        </div>

        <div className="bg-midnight-800 rounded-lg p-6 border border-neon-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">About Personalization</h2>
          <p className="text-gray-300 mb-4">
            UpSide AI learns from your interactions to provide more relevant guidance and support. The more you use the
            platform, the more personalized your experience becomes.
          </p>
          <h3 className="text-lg font-medium text-white mt-6 mb-2">How it works:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>We track the topics you discuss most frequently</li>
            <li>We analyze which resources and scenarios you find most helpful</li>
            <li>We adapt our communication style to match your preferences</li>
            <li>We connect insights from your assessments to provide targeted guidance</li>
          </ul>
          <p className="text-gray-300 mt-6">
            Your data is always kept private and secure. You can request to delete your personalization data at any
            time.
          </p>
        </div>
      </div>
    </main>
  )
}
