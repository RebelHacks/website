import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optional: Proxy API requests during development
  // This allows you to call /api/* from the frontend and have it forwarded to Symfony
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
