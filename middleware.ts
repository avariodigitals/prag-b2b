import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchDynamicRedirects, LEGACY_REDIRECTS } from './lib/redirects';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Skip if it's an API route, static file, or Next.js internal route
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle /shop/ redirects - need to look up product category
  if (pathname.startsWith('/shop/')) {
    const productSlug = pathname.replace('/shop/', '');
    if (productSlug) {
      try {
        // Try to fetch product info to determine category
        const wpApi = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
        const auth = `consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
        
        const productRes = await fetch(`${wpApi}/wc/v3/products?slug=${productSlug}&${auth}`, {
          next: { revalidate: 300 },
        });
        
        if (productRes.ok) {
          const products = await productRes.json();
          if (Array.isArray(products) && products.length > 0) {
            const product = products[0];
            const category = product.categories?.[0];
            if (category) {
              const destination = `/products/${category.slug}/${productSlug}`;
              // Track the redirect hit
              trackRedirectHit('/shop/:product', req.headers.get('host'));
              url.pathname = destination;
              return NextResponse.redirect(url, 301);
            }
          }
        }
      } catch (error) {
        console.error('Failed to lookup product for shop redirect:', error);
      }
    }
  }

  try {
    // Check legacy redirects first (these are also in next.config.ts but
    // we handle them here to track hits accurately)
    for (const redirect of LEGACY_REDIRECTS) {
      const sourcePattern = redirect.source.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${sourcePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'));

        // Replace parameters in destination
        let destination = redirect.destination;
        const paramNames = (redirect.source.match(/:([^/]+)/g) || []).map((p) => p.slice(1));
        paramNames.forEach((param, index) => {
          destination = destination.replace(`:${param}`, match[index + 1]);
        });

        url.pathname = destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }
    }

    const dynamicRedirects = await fetchDynamicRedirects();
    
    for (const redirect of dynamicRedirects) {
      // Handle exact match
      if (redirect.source === pathname) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'));

        url.pathname = redirect.destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }

      // Handle pattern matching (simple :param support)
      const sourcePattern = redirect.source.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${sourcePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        // Track the redirect hit
        trackRedirectHit(redirect.source, req.headers.get('host'));

        // Replace parameters in destination
        let destination = redirect.destination;
        const paramNames = (redirect.source.match(/:([^/]+)/g) || []).map((p) => p.slice(1));
        paramNames.forEach((param, index) => {
          destination = destination.replace(`:${param}`, match[index + 1]);
        });

        url.pathname = destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }
    }
  } catch (error) {
    console.error('Middleware redirect error:', error);
  }

  return NextResponse.next();
}

// Fire-and-forget redirect hit tracker
function trackRedirectHit(source: string, host: string | null) {
  fetch('/api/admin/redirect-hit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, host: host ?? '' }),
  }).catch(() => {});
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};