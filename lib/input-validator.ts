import { z } from "zod"
import { sanitizeInput, sanitizeHtml, sanitizeSqlInput } from "./security-service"

export class InputValidator {
  static validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
  ): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      const result = schema.parse(data)
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        }
      }
      return {
        success: false,
        errors: ["Validation failed"],
      }
    }
  }

  static sanitizeAndValidate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    sanitizationType: "basic" | "html" | "sql" = "basic",
  ): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      // Recursively sanitize string values
      const sanitizedData = this.deepSanitize(data, sanitizationType)
      return this.validate(schema, sanitizedData)
    } catch (error) {
      return {
        success: false,
        errors: ["Sanitization failed"],
      }
    }
  }

  private static deepSanitize(obj: unknown, type: "basic" | "html" | "sql"): unknown {
    if (typeof obj === "string") {
      switch (type) {
        case "html":
          return sanitizeHtml(obj)
        case "sql":
          return sanitizeSqlInput(obj)
        default:
          return sanitizeInput(obj)
      }
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSanitize(item, type))
    }

    if (obj && typeof obj === "object") {
      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.deepSanitize(value, type)
      }
      return sanitized
    }

    return obj
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }

    if (password.length > 128) {
      errors.push("Password is too long")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    // Check for common weak passwords
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ]

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return ["http:", "https:"].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  static validatePhoneNumber(phone: string): boolean {
    // Basic phone number validation (US format)
    const phoneRegex = /^\+?1?[-.\s]?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  static validateAge(dateOfBirth: string): { isValid: boolean; age?: number; error?: string } {
    try {
      const dob = new Date(dateOfBirth)
      const today = new Date()

      if (dob > today) {
        return { isValid: false, error: "Date of birth cannot be in the future" }
      }

      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }

      if (age < 13) {
        return { isValid: false, error: "Must be at least 13 years old" }
      }

      if (age > 100) {
        return { isValid: false, error: "Invalid age" }
      }

      return { isValid: true, age }
    } catch {
      return { isValid: false, error: "Invalid date format" }
    }
  }

  static validateFileSize(size: number, maxSizeMB = 5): boolean {
    return size <= maxSizeMB * 1024 * 1024
  }

  static validateImageType(type: string): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    return allowedTypes.includes(type)
  }
}

export default InputValidator
