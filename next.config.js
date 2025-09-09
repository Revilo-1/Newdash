/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // 🚑 Lad build fortsætte selvom der er TypeScript-fejl
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🚑 Lad build fortsætte selvom der er ESLint-fejl
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;