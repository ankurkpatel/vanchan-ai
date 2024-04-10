/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: process.env.NODE_ENV === 'production'
              ? 'your-production-domain.com'
              : 'glowing-guide-6rw59ppw5rwc5vv4-3000.app.github.dev',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};