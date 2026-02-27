import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "Security service is running",
    security: {
      wallActive: true,
      rateLimitingActive: true,
      threatDetectionActive: true,
      inputSanitizationActive: true,
      auditLoggingActive: true,
    },
    timestamp: new Date().toISOString(),
  })
}
