/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Suppress webpack cache warnings about big strings in development
      // This warning is informational and doesn't affect production builds
      config.infrastructureLogging = {
        level: 'error',
      }
      // Increase the size threshold for the big string warning
      if (config.cache && typeof config.cache === 'object') {
        config.cache = {
          ...config.cache,
          maxMemoryGenerations: 1,
        }
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/integration-status',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
