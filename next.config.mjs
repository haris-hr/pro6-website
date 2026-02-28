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
  // Project detail pages still use static HTML for now
  async rewrites() {
    return [
      {
        source: '/projecten/dok6',
        destination: '/projects/dok6.html',
      },
    ];
  },
};

export default nextConfig;
