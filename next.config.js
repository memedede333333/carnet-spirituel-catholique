/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignorer les erreurs ESLint pendant le build en production
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
