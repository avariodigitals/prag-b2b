export interface RedirectEntry {
  source: string;
  destination: string;
  permanent?: boolean;
}

export const LEGACY_REDIRECTS: RedirectEntry[] = [
  { source: '/inverter-warranty', destination: '/warranty/inverter', permanent: true },
  { source: '/battery-warranty', destination: '/warranty/battery', permanent: true },
  { source: '/solar-warranty', destination: '/warranty/solar', permanent: true },
  { source: '/stabilizer-warranty', destination: '/warranty/stabilizer', permanent: true },
  { source: '/product-category/:category/:subcategory', destination: '/products/:category', permanent: true },
  { source: '/product-category/:category', destination: '/products/:category', permanent: true },
  { source: '/shop/:product', destination: '/products/:category/:product', permanent: true },
  { source: '/shop/:category/:product', destination: '/products/:category/:product', permanent: true },
];

export async function fetchDynamicRedirects(): Promise<RedirectEntry[]> {
  const adminUrl = process.env.B2B_ADMIN_API_URL || process.env.NEXT_PUBLIC_B2B_ADMIN_API_URL;
  
  if (!adminUrl) {
    return [];
  }

  try {
    const response = await fetch(`${adminUrl.replace(/\/$/, '')}/api/admin/b2b/redirects`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (data.success && Array.isArray(data.redirects)) {
      return data.redirects
        .filter((r: any) => r.active)
        .map((r: any) => ({
          source: r.source,
          destination: r.destination,
          permanent: r.permanent,
        }));
    }
  } catch (error) {
    console.error('Failed to fetch dynamic redirects:', error);
  }

  return [];
}
