import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure video files are served correctly
  async headers() {
    return [
      {
        source: '/images/Grow a Muscle/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
