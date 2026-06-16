import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  httpAgentOptions: {
    keepAlive: true,
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
    qualities: [75, 80, 85, 90],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/solutions/residential-2',
        destination: '/solutions/residential',
        permanent: true,
      },
      {
        source: '/solutions/residential-2/home-backup-power',
        destination: '/solutions/residential/home-backup-power',
        permanent: true,
      },
      {
        source: '/solutions/residential-2/home-solar-systems',
        destination: '/solutions/residential/home-solar-systems',
        permanent: true,
      },
      {
        source: '/solutions/residential-2/power-stabilization-protection',
        destination: '/solutions/residential/power-stabilization-protection',
        permanent: true,
      },
    ];
  },
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
};

export default nextConfig;
