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
  webpack: (config, { isServer }) => {
    // Suppress webpack cache warnings about large strings
    if (config.cache && typeof config.cache === 'object') {
      config.cache = {
        ...config.cache,
        buildDependencies: {
          ...config.cache.buildDependencies,
        },
      }
      // Increase the warning threshold for large strings in cache
      if (config.cache.type === 'filesystem') {
        config.cache.compression = false
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
