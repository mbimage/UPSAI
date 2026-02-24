"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        We apologize for the inconvenience. Please try again or contact support if the problem persists.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-neon-600 text-white rounded-md hover:bg-neon-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </a>
      </div>
      {error.digest && <p className="mt-8 text-xs text-gray-500">Error ID: {error.digest}</p>}
    </div>
  )
}
