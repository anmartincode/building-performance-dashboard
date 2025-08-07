/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {
    // Enable modern features
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Enable static optimization
  output: 'standalone',
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig 