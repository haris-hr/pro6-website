/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  // Ignore ESLint errors during build (we have legacy HTML pages with sync scripts)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Redirect root to static index.html
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false,
      },
    ];
  },
  // Rewrite to static HTML / API routes (to avoid hydration issues while keeping animations)
  async rewrites() {
    return [
      {
        source: '/projecten',
        destination: '/projecten.html',
      },
      {
        source: '/projecten/:slug',
        destination: '/api/project-page/:slug',
      },
    ];
  },
};

export default nextConfig;
