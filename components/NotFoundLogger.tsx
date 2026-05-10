'use client';

import { useEffect } from 'react';

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
