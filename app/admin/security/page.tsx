import { SecurityDashboard } from "@/components/security-dashboard"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Security Administration</h1>
          <p className="text-lg text-gray-600">Monitor and manage security features for the UpSide AI platform</p>
        </div>

        <SecurityDashboard />
      </div>
    </div>
  )
}
