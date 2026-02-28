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
  // Use static HTML files for frontend (they have all animations & hamburger menu)
  // CMS is used for admin management only for now
  async rewrites() {
    return [
      {
        source: '/projecten',
        destination: '/projecten.html',
      },
      {
        source: '/projecten/dok6',
        destination: '/projects/dok6.html',
      },
    ];
  },
};

export default nextConfig;
