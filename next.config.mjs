/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
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
};

export default nextConfig;
