"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const role = formData.get("role") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !role || !subject || !message) {
      return {
        success: false,
        error: "Please fill in all required fields.",
      }
    }

    // Send notification email to you
    const adminEmailResult = await resend.emails.send({
      from: "UpSide AI Contact <noreply@upsideai.com>",
      to: ["support@upsideai.com"], // Replace with your actual email
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Role:</strong> ${role}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">Subject</h3>
            <p style="font-size: 16px; font-weight: 600;">${subject}</p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #065f46;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Submitted:</strong> ${new Date().toLocaleString("en-US", {
                timeZone: "America/Chicago",
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: ${subject}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to ${firstName}
            </a>
          </div>
        </div>
      `,
    })

    // Send confirmation email to the user
    const userEmailResult = await resend.emails.send({
      from: "UpSide AI Support <support@upsideai.com>",
      to: [email],
      subject: "We received your message - UpSide AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thanks for reaching out!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">
              Hi ${firstName},
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              We've received your message about "<strong>${subject}</strong>" and we're excited to help you on your journey!
            </p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #0c4a6e; margin-top: 0;">What happens next?</h3>
              <ul style="color: #374151; line-height: 1.6;">
                <li>We typically respond within 2-4 hours during business hours</li>
                <li>A member of our team will review your message personally</li>
                <li>We'll provide tailored guidance based on your specific situation</li>
              </ul>
            </div>

            <p style="color: #6b7280; line-height: 1.6;">
              In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/resources" style="color: #2563eb;">resources</a> 
              or chat with our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/chat" style="color: #2563eb;">AI teammate</a> for immediate support.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/chat" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Chat with AI Teammate
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The UpSide AI Team<br>
              <em>Empowering rural Texas scholar-athletes</em>
            </p>
          </div>
        </div>
      `,
    })

    if (adminEmailResult.error || userEmailResult.error) {
      console.error("Email sending error:", adminEmailResult.error || userEmailResult.error)
      return {
        success: false,
        error: "Message sent but there was an issue with email notifications. We will still respond to your inquiry.",
      }
    }

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 2-4 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: "There was an error sending your message. Please try again or email us directly at support@upsideai.com",
    }
  }
}
