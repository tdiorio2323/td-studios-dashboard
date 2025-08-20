/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-url.com'],
  },
  serverExternalPackages: ['sharp']
}

module.exports = nextConfig
