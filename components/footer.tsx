import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                Up
                <span className="relative bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                  Side
                  <span
                    aria-hidden="true"
                    className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-gradient-to-r from-neon-400 to-electric-400"
                  />
                </span>
                {" AI"}
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Personalized, on-demand support for college athletes across Texas. Building self-efficacy,
              emotional intelligence, and career readiness for the next generation of leaders.
            </p>
            <a
              href="mailto:contact.mbimage@gmail.com"
              className="inline-flex items-center gap-2 min-h-[44px] rounded-lg text-gray-300 hover:text-white transition-colors touch-manipulation"
            >
              <Mail className="h-5 w-5" />
              contact.mbimage@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/chat" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  Start Chat
                </Link>
              </li>
              <li>
                <Link href="/assessments" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  Assessments
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/contact" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 UpSide AI. All rights reserved. For college athletes across Texas.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
