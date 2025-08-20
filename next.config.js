/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-url.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
}

module.exports = nextConfig
