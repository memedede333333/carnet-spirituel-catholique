/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingExcludes: {
      '*': ['.next/server/app/(app)/**']
    }
  }
}

module.exports = nextConfig
