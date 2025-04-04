/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
  // 👇 NEW: Allow dev calls from your deployed domain
  allowedDevOrigins: ["https://www.mellingholdingsgroup.com"],
};

module.exports = nextConfig;
