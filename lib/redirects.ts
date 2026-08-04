export interface RedirectEntry {
  source: string;
  destination: string;
}

export const LEGACY_REDIRECTS: RedirectEntry[] = [
  { source: '/inverter-warranty', destination: '/warranty/inverter' },
  { source: '/battery-warranty', destination: '/warranty/battery' },
  { source: '/solar-warranty', destination: '/warranty/solar' },
  { source: '/stabilizer-warranty', destination: '/warranty/stabilizer' },
  { source: '/product-category/:category/:subcategory', destination: '/products/:category' },
  { source: '/product-category/:category', destination: '/products/:category' },
];
