/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.startupsignals.in',
          },
        ],
        destination: 'https://startupsignals.in/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
