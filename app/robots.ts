import type { MetadataRoute } from 'next';

const SITE_BASE = process.env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://prag.global';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/compare', '/api/'],
    },
    sitemap: `${SITE_BASE}/sitemap.xml`,
    host: SITE_BASE,
  };
}
