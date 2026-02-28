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
  // Redirect root to static index.html (until home page is also dynamic)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false,
      },
    ];
  },
  // Note: /projecten and /projecten/[slug] are now handled by dynamic Next.js pages
  // The old static HTML rewrites have been removed
};

export default nextConfig;
