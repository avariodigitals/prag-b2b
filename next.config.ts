import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'central.prag.global',
      },
    ],
  },
};

export default nextConfig;
