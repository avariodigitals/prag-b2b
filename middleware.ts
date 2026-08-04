import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchDynamicRedirects } from './lib/redirects';

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

  try {
    const dynamicRedirects = await fetchDynamicRedirects();
    
    for (const redirect of dynamicRedirects) {
      // Handle exact match
      if (redirect.source === pathname) {
        // Track the redirect hit
        fetch('/api/admin/redirect-hit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: redirect.source, host: req.headers.get('host') }),
        }).catch(() => {});

        url.pathname = redirect.destination;
        return NextResponse.redirect(url, redirect.permanent ? 301 : 302);
      }

      // Handle pattern matching (simple :param support)
      const sourcePattern = redirect.source.replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${sourcePattern}$`);
      const match = pathname.match(regex);

      if (match) {
        // Track the redirect hit
        fetch('/api/admin/redirect-hit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: redirect.source, host: req.headers.get('host') }),
        }).catch(() => {});

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