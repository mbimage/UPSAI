import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">UpSide AI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering rural scholar-athletes in Texas with AI-powered life strategy tools. Building self-efficacy,
              emotional intelligence, and future-focused thinking for the next generation of leaders.
            </p>
            <div className="flex gap-2">
              <a href="mailto:support@upsideai.com" aria-label="Email us" className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+1-555-0123" aria-label="Call us" className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Our location" className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/chat" className="flex items-center min-h-[44px] py-2 text-gray-300 hover:text-white transition-colors touch-manipulation">
                  My Locker
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
          <p className="text-gray-400">© 2025 UpSide AI. All rights reserved. For rural scholar-athletes in Texas.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
