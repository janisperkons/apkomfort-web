/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/cenas',
        destination: '/komforta-klubs',
        permanent: true,
      },
      {
        source: '/cenas/',
        destination: '/komforta-klubs/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
