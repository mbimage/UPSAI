import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    environment: process.env.NODE_ENV || "development",
    services: {
      api: "operational",
      security: "operational",
      chat: "operational",
    },
    version: "1.0.0",
  }

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
