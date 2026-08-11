import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Let middleware handle trailing-slash normalisation so legacy URLs with
  // trailing slashes redirect in ONE hop instead of two (308 normalise + 301
  // legacy redirect). The middleware strips the trailing slash, checks
  // RETIRED_URLS / LEGACY_REDIRECTS, and falls back to a 308 to the
  // non-trailing-slash URL for everything else.
  skipTrailingSlashRedirect: true,
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
    qualities: [75],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // NOTE: Legacy redirect rules (LEGACY_REDIRECTS), retired URLs (410),
    // and dynamic admin redirects are ALL handled centrally in middleware.ts.
    //
    // This ensures:
    //   1. Trailing-slash legacy URLs redirect in ONE hop (middleware normalises
    //      the trailing slash before matching, avoiding a 308→308 chain).
    //   2. Retired URLs (RETIRED_URLS) return 410 Gone BEFORE any catch-all
    //      redirect pattern can fire.
    //   3. LEGACY_REDIRECTS take priority over dynamic admin redirects, so
    //      conflicting admin-created redirects don't override the curated
    //      Step 6 manifest.
    //
    // Only Step 5 hardcoded structural redirects remain here (these don't
    // conflict with any legacy or retired URL).
    return [
      {
        source: '/products/all-prag-stabilizers',
        destination: '/products/voltage-stabilizers',
        permanent: true,
      },
      {
        source: '/products/all-prag-stabilizers/:slug',
        destination: '/products/voltage-stabilizers/:slug',
        permanent: true,
      },
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
      // NOTE: /shop/:category/:product is NOT here. It is handled by middleware's
      // WooCommerce product lookup which resolves the product against live WC data
      // and uses preferredProductCategory() for the canonical category. The old
      // :category segment is NOT trusted as the current canonical category.
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://central.prag.global https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https://central.prag.global https://www.termsfeed.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
              "frame-src 'self' https://www.termsfeed.com https://www.googletagmanager.com https://challenges.cloudflare.com",
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
