import type { HighSchoolReport } from "./high-school-reporting-service"

export interface EmailConfig {
  to: string[]
  subject: string
  htmlContent: string
  attachments?: Array<{
    filename: string
    content: string
    type: string
  }>
}

export class EmailService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ""
  }

  async sendEmail(config: EmailConfig): Promise<boolean> {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UpSide AI <reports@upsideai.com>",
          to: config.to,
          subject: config.subject,
          html: config.htmlContent,
          attachments: config.attachments,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  generateHighSchoolReportEmail(report: HighSchoolReport): string {
    const { school, summary, insights } = report
    const reportDate = new Date(report.reportDate).toLocaleDateString()

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Daily UpSide AI Report - ${school.name}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .school-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .report-date { font-size: 16px; opacity: 0.9; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
        .metric-value { font-size: 32px; font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .metric-label { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
        .student-list { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .student-item { padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .student-item:last-child { border-bottom: none; }
        .student-name { font-weight: bold; color: #333; }
        .student-details { font-size: 14px; color: #666; margin-top: 5px; }
        .alert { padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .alert-success { background: #d4edda; border-left: 4px solid #28a745; color: #155724; }
        .alert-warning { background: #fff3cd; border-left: 4px solid #ffc107; color: #856404; }
        .alert-danger { background: #f8d7da; border-left: 4px solid #dc3545; color: #721c24; }
        .insights-list { list-style: none; padding: 0; }
        .insights-list li { padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; color: #666; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">${school.name}</div>
        <div class="report-date">Daily Report - ${reportDate}</div>
        <div style="margin-top: 10px; font-size: 14px;">${school.city}, ${school.state} • ${school.district}</div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${summary.totalStudents}</div>
          <div class="metric-label">Total Students</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${summary.activeStudents}</div>
          <div class="metric-label">Active This Week</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${Math.round(summary.averageEngagement)}%</div>
          <div class="metric-label">Engagement Rate</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${summary.averageSelfEfficacy}</div>
          <div class="metric-label">Avg Self-Efficacy</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${summary.averageEmotionalIntelligence}</div>
          <div class="metric-label">Avg Emotional Intelligence</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${Math.round(summary.goalCompletionRate)}%</div>
          <div class="metric-label">Goal Completion</div>
        </div>
      </div>

      ${
        insights.alerts.length > 0
          ? `
      <div class="section">
        <div class="section-title">🚨 Alerts & Attention Needed</div>
        ${insights.alerts
          .map(
            (alert) => `
          <div class="alert alert-danger">${alert}</div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      ${
        summary.topPerformers.length > 0
          ? `
      <div class="section">
        <div class="section-title">🌟 Top Performers</div>
        <div class="student-list">
          ${summary.topPerformers
            .map(
              (student) => `
            <div class="student-item">
              <div class="student-name">${student.name}</div>
              <div class="student-details">
                Grade ${student.grade} • ${student.sport} • 
                Self-Efficacy: ${student.selfEfficacyScore} • 
                EI: ${student.emotionalIntelligenceScore} • 
                Goals: ${student.goalsCompleted}/${student.totalGoals}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      `
          : ""
      }

      ${
        summary.needsAttention.length > 0
          ? `
      <div class="section">
        <div class="section-title">⚠️ Students Needing Support</div>
        <div class="student-list">
          ${summary.needsAttention
            .map(
              (student) => `
            <div class="student-item">
              <div class="student-name">${student.name}</div>
              <div class="student-details">
                Grade ${student.grade} • ${student.sport} • 
                Areas for improvement: ${student.improvementAreas.join(", ")}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">📈 Trends & Insights</div>
        <ul class="insights-list">
          ${insights.trends.map((trend) => `<li>${trend}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">💡 Recommendations</div>
        <ul class="insights-list">
          ${insights.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">📚 Resource Usage</div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <strong>Most Used Resources:</strong>
          <ul>
            ${report.resources.mostUsed
              .map(
                (resource) => `
              <li>${resource.name} - ${resource.usage} students</li>
            `,
              )
              .join("")}
          </ul>
          
          <strong>Recommended for Your School:</strong>
          <ul>
            ${report.resources.recommended
              .map(
                (resource) => `
              <li><strong>${resource.name}</strong> - ${resource.reason}</li>
            `,
              )
              .join("")}
          </ul>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://your-app-url.com/admin/metrics" class="cta-button">View Full Dashboard</a>
        <a href="https://your-app-url.com/resources" class="cta-button">Browse Resources</a>
      </div>

      <div class="footer">
        <p><strong>UpSide AI</strong> - Empowering Rural Scholar-Athletes</p>
        <p>This automated report was generated on ${reportDate}</p>
        <p>Questions? Contact us at support@upsideai.com</p>
      </div>
    </body>
    </html>
    `
  }

  async sendDailyHighSchoolReports(reports: HighSchoolReport[], adminEmail: string): Promise<void> {
    try {
      for (const report of reports) {
        const emailContent = this.generateHighSchoolReportEmail(report)

        // Send to school administrators
        const recipients = [adminEmail, report.school.principalEmail, ...report.school.coachEmails].filter(
          (email) => email && email.includes("@"),
        )

        const success = await this.sendEmail({
          to: recipients,
          subject: `Daily UpSide AI Report - ${report.school.name} - ${new Date().toLocaleDateString()}`,
          htmlContent: emailContent,
        })

        if (success) {
          console.log(`Report sent successfully to ${report.school.name}`)
        } else {
          console.error(`Failed to send report to ${report.school.name}`)
        }

        // Add small delay between emails to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error("Error sending daily reports:", error)
    }
  }
}
