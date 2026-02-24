"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface ReportHistory {
  id: string
  timestamp: string
  details: {
    reportCount: number
    emailSentTo: string
    schools: string[]
  }
}

interface SchoolSummary {
  name: string
  studentCount: number
  activeStudents: number
}

export default function DailyReportsPage() {
  const [adminEmail, setAdminEmail] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastReport, setLastReport] = useState<{
    reportCount: number
    schools: SchoolSummary[]
  } | null>(null)
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchReportHistory()
  }, [])

  const fetchReportHistory = async () => {
    try {
      const response = await fetch("/api/admin/daily-reports")
      if (response.ok) {
        const data = await response.json()
        setReportHistory(data.recentReports)
      }
    } catch (error) {
      console.error("Error fetching report history:", error)
    }
  }

  const generateDailyReports = async () => {
    if (!adminEmail.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" })
      return
    }

    setIsGenerating(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/daily-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminEmail: adminEmail.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setLastReport({
          reportCount: data.reportCount,
          schools: data.schools,
        })
        setMessage({
          type: "success",
          text: `Successfully generated and sent ${data.reportCount} school reports to ${adminEmail}`,
        })
        fetchReportHistory()
      } else {
        setMessage({ type: "error", text: data.error || "Failed to generate reports" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error - please try again" })
    } finally {
      setIsGenerating(false)
    }
  }

  const setupAutomation = () => {
    setMessage({
      type: "success",
      text: "Automation setup would be configured here - this would set up daily cron jobs",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Daily High School Reports</h1>
        <p className="text-gray-600">Generate and send personalized daily reports to high school administrators</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Generate Daily Reports
              </CardTitle>
              <CardDescription>
                Create personalized reports for each high school and send them via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Your Email Address</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@school.edu"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="max-w-md"
                />
                <p className="text-sm text-gray-500">Reports will be sent to you and each school's administrators</p>
              </div>

              <Button
                onClick={generateDailyReports}
                disabled={isGenerating || !adminEmail.trim()}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Reports...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Generate & Send Reports
                  </>
                )}
              </Button>

              {message && (
                <Alert
                  className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                >
                  <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {lastReport && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Last Report Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{lastReport.reportCount}</div>
                        <div className="text-sm text-green-700">Schools Reported</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {lastReport.schools.reduce((sum, school) => sum + school.studentCount, 0)}
                        </div>
                        <div className="text-sm text-green-700">Total Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {lastReport.schools.reduce((sum, school) => sum + school.activeStudents, 0)}
                        </div>
                        <div className="text-sm text-green-700">Active Students</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-800">Schools Included:</h4>
                      <div className="flex flex-wrap gap-2">
                        {lastReport.schools.map((school, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                            {school.name} ({school.activeStudents}/{school.studentCount})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Report History
              </CardTitle>
              <CardDescription>View recent daily report generations</CardDescription>
            </CardHeader>
            <CardContent>
              {reportHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports generated yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportHistory.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{report.details.reportCount} School Reports</div>
                          <div className="text-sm text-gray-500">Sent to: {report.details.emailSentTo}</div>
                        </div>
                        <Badge variant="outline">{new Date(report.timestamp).toLocaleDateString()}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {report.details.schools.map((school, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {school}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Automation Setup
              </CardTitle>
              <CardDescription>Configure automatic daily report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Automation features require additional server configuration for cron jobs or scheduled tasks.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Reports will be generated and sent every day at 8:00 AM local time
                    </p>
                    <Button onClick={setupAutomation} variant="outline" className="w-full bg-transparent">
                      Enable Daily Automation
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Configure default recipients and email templates</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Configure Email Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What's Included in Daily Reports:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Student engagement metrics and activity levels</li>
                  <li>• Self-efficacy and emotional intelligence scores</li>
                  <li>• Goal completion rates and progress tracking</li>
                  <li>• Top performers and students needing attention</li>
                  <li>• Resource usage and recommendations</li>
                  <li>• Trends, insights, and actionable alerts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
