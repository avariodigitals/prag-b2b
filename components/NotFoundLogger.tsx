'use client';

import { useEffect } from 'react';

function deriveRedirect(path: string): string {
  // Handle old shop URLs
  const shopMatch = path.match(/^\/shop\/([^/]+)$/);
  if (shopMatch) {
    return `/products/${shopMatch[1]}`;
  }
  
  const shopCategoryMatch = path.match(/^\/shop\/([^/]+)\/([^/]+)$/);
  if (shopCategoryMatch) {
    return `/products/${shopCategoryMatch[1]}/${shopCategoryMatch[2]}`;
  }
  
  // Handle old product-category URLs
  const oldCategoryMatch = path.match(/^\/product-category\/([^/]+)(?:\/[^/]+)?$/);
  if (oldCategoryMatch) {
    return `/products/${oldCategoryMatch[1]}`;
  }
  
  // Handle product detail pages that might be missing
  const productMatch = path.match(/^\/products\/([^/]+)\/[^/]+/);
  if (productMatch) {
    return `/products/${productMatch[1]}`;
  }
  
  // Handle category pages
  const categoryMatch = path.match(/^\/products\/([^/]+)$/);
  if (categoryMatch) {
    return '/products';
  }
  
  return '';
}

export default function NotFoundLogger() {
  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    const key = `b2b-404:${path}`;
    const host = window.location.host;

    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    const payload = {
      path,
      host,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      redirect: deriveRedirect(path),
    };

    fetch('/api/public/404-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}
