import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://central.prag.global https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://central.prag.global https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src 'self' https://www.termsfeed.com https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'central.prag.global',
      },
      {
        protocol: 'https',
        hostname: '**.prag.global',
      },
    ],
  },
};

export default nextConfig;
