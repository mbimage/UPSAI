import { z } from "zod"

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(254, "Email too long")
  .transform((email) => email.toLowerCase().trim())

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number")
  .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, "Password must contain at least one special character")

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .transform((name) => name.trim())

export const schoolSchema = z
  .string()
  .min(2, "School name required")
  .max(200, "School name too long")
  .regex(/^[a-zA-Z0-9\s\-'.&()]+$/, "Invalid characters in school name")
  .transform((school) => school.trim())

export const sportSchema = z
  .string()
  .min(2, "Sport required")
  .max(100, "Sport name too long")
  .regex(/^[a-zA-Z\s\-&]+$/, "Sport name can only contain letters, spaces, hyphens, and ampersands")
  .transform((sport) => sport.trim())

export const gradeSchema = z.enum([
  "9th",
  "10th",
  "11th",
  "12th",
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
])

export const messageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(2000, "Message too long")
  .refine(
    (message) => !/<script|javascript:|data:|vbscript:/i.test(message),
    "Message contains potentially dangerous content",
  )

export const assessmentResponseSchema = z.object({
  questionId: z.string().regex(/^[a-zA-Z0-9_-]+$/, "Invalid question ID"),
  response: z.union([
    z.string().max(1000, "Response too long"),
    z.number().min(1).max(10),
    z.boolean(),
    z.array(z.string().max(100)).max(10, "Too many selections"),
  ]),
})

export const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general", "assessment", "chat"]),
  rating: z.number().min(1).max(5).optional(),
  message: z.string().min(10, "Feedback must be at least 10 characters").max(2000, "Feedback too long"),
  category: z.string().max(50).optional(),
})

export const profileUpdateSchema = z.object({
  fullName: nameSchema.optional(),
  sport: sportSchema.optional(),
  grade: gradeSchema.optional(),
  school: schoolSchema.optional(),
  goals: z.array(z.string().max(200, "Goal too long")).max(10, "Too many goals").optional(),
})

// Chat message validation
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: messageSchema,
  timestamp: z.string().datetime().optional(),
})

export const chatSessionSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "At least one message required").max(100, "Too many messages"),
  conversationId: z.string().uuid().optional(),
  sessionHistory: z.array(z.any()).max(50, "Session history too large").optional(),
  connectionStrength: z.enum(["building", "established", "strong"]).optional(),
  personalizationLevel: z.enum(["low", "medium", "high"]).optional(),
})

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(5, "Subject too short").max(200, "Subject too long"),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000, "Message too long"),
  type: z.enum(["general", "support", "partnership", "feedback"]).optional(),
})

// Assessment submission validation
export const assessmentSubmissionSchema = z.object({
  assessmentId: z
    .string()
    .min(1, "Assessment ID required")
    .max(100, "Invalid assessment ID")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid assessment ID format"),
  responses: z
    .record(z.string(), z.any())
    .refine((responses) => Object.keys(responses).length > 0, "At least one response required")
    .refine((responses) => Object.keys(responses).length <= 50, "Too many responses"),
  timeSpent: z.number().min(0).max(7200).optional(), // Max 2 hours
  completedAt: z.string().datetime().optional(),
})

// User registration validation
export const userRegistrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    dateOfBirth: z.string().refine((date) => {
      const dob = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      return age >= 13 && age <= 25 && dob <= today
    }, "Invalid date of birth"),
    school: schoolSchema,
    sport: sportSchema,
    grade: gradeSchema.optional(),
    requiresParentalConsent: z.boolean(),
    parentEmail: emailSchema.optional(),
    termsAccepted: z.boolean().refine((val) => val === true, "Terms must be accepted"),
    privacyAccepted: z.boolean().refine((val) => val === true, "Privacy policy must be accepted"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const dob = new Date(data.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }

      const isUnder18 = age < 18
      return !isUnder18 || (data.requiresParentalConsent && data.parentEmail)
    },
    {
      message: "Parent email required for users under 18",
      path: ["parentEmail"],
    },
  )

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required"),
  rememberMe: z.boolean().optional(),
})

// Admin validation schemas
export const adminUserUpdateSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(500).optional(),
})

export const securitySettingsSchema = z.object({
  rateLimitEnabled: z.boolean(),
  rateLimitWindow: z.number().min(60000).max(3600000), // 1 minute to 1 hour
  rateLimitMaxRequests: z.number().min(10).max(1000),
  threatDetectionEnabled: z.boolean(),
  auditLoggingEnabled: z.boolean(),
  sessionTimeout: z.number().min(300000).max(86400000), // 5 minutes to 24 hours
})
