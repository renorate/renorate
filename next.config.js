/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14
  // Production domain configuration
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
  // Exclude test config from build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

module.exports = nextConfig
