/**
 * Legacy URL redirect manifest for PRAG SEO recovery (Step 6).
 *
 * Source: PRAG_Legacy_Redirect_Audit_Post_Step5_Final.xlsx
 * Principle: OLD LEGACY URL → ONE PERMANENT REDIRECT → FINAL CANONICAL 200 URL
 *
 * These redirects are consumed by both next.config.ts (non-/shop/ routes)
 * and middleware.ts (/shop/ routes with product lookups).
 *
 * Do NOT add redirects to excluded categories:
 *   all-prag-stabilizers, travel, sales, health-fitness, personal-electronics,
 *   uncategorized, more-products, accessories
 */

export interface RedirectEntry {
  source: string;
  destination: string;
  permanent?: boolean;
}

export const LEGACY_REDIRECTS: RedirectEntry[] = [
  // ─── Existing warranty redirects (preserved) ──────────────────────────────
  { source: '/inverter-warranty', destination: '/warranty/inverter', permanent: true },
  { source: '/battery-warranty', destination: '/warranty/battery', permanent: true },
  { source: '/solar-warranty', destination: '/warranty/solar', permanent: true },
  { source: '/stabilizer-warranty', destination: '/warranty/stabilizer', permanent: true },

  // ─── P0 — Critical SEO / commercial ────────────────────────────────────────────────────────
  { source: '/about-prag', destination: '/about', permanent: true },
  { source: '/blog', destination: '/knowledge-center', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },
  { source: '/customer-care', destination: '/contact', permanent: true },
  { source: '/frequently-ask-question', destination: '/faq', permanent: true },
  { source: '/inverter', destination: '/products/inverters', permanent: true },
  { source: '/inverters', destination: '/products/inverters', permanent: true },
  { source: '/lithiumbattery', destination: '/products/lithium-batteries', permanent: true },
  { source: '/prag-inverter', destination: '/products/inverters', permanent: true },
  { source: '/prag-reseller-programme', destination: '/distributor', permanent: true },
  { source: '/product-category/all-prag-stabilizers', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/product-category/all-prag-stabilizers/voltage-stabilizers', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/product-category/all-prag-stabilizers/voltage-stabilizers/advanced-stabilizers', destination: '/products/advanced-stabilizers', permanent: true },
  { source: '/product-category/all-prag-stabilizers/voltage-stabilizers/relay-voltage-stabilizers', destination: '/products/relay-voltage-stabilizers', permanent: true },
  { source: '/product-category/all-prag-stabilizers/voltage-stabilizers/servo-voltage-stabilizers', destination: '/products/servo-voltage-stabilizers', permanent: true },
  { source: '/product-category/all-prag-stabilizers/voltage-stabilizers/thyristor-stabilizers', destination: '/products/thyristor-stabilizers', permanent: true },
  { source: '/product-category/batteries', destination: '/products/batteries', permanent: true },
  { source: '/product-category/batteries/lithium-battery', destination: '/products/lithium-batteries', permanent: true },
  { source: '/product-category/batteries/lithium-ion', destination: '/products/lithium-batteries', permanent: true },
  { source: '/product-category/inverters', destination: '/products/inverters', permanent: true },
  { source: '/product-category/inverters/heavy-duty-inverters', destination: '/products/heavy-duty-inverters', permanent: true },
  { source: '/product-category/inverters/hybrid-inverters', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/product-category/inverters/hybrid-inverters-inverters', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/product-category/inverters/pure-sine-inverters', destination: '/products/inverters', permanent: true },
  { source: '/product-category/solar', destination: '/products/solar', permanent: true },
  { source: '/product-category/solar/protective-device', destination: '/products/protective-device', permanent: true },
  { source: '/product-category/solar/solar-charge-controllers', destination: '/products/solar-charge-controllers', permanent: true },
  { source: '/product-category/solar/solar-panels', destination: '/products/solar-panels', permanent: true },
  { source: '/projects', destination: '/installations', permanent: true },
  { source: '/reseller', destination: '/distributor', permanent: true },
  { source: '/shop', destination: '/products', permanent: true },
  { source: '/solar-products', destination: '/products/solar', permanent: true },
  { source: '/stabilizers', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/store-locations', destination: '/find-a-distributor', permanent: true },
  { source: '/where-to-buy-prag', destination: '/find-a-distributor', permanent: true },

  // ─── P1 — High value ────────────────────────────────────────────────────────
  { source: '/20kva-servo-voltage-stabilizer', destination: '/knowledge-center/20kva-servo-voltage-stabilizer', permanent: true },
  { source: '/advancements-of-solar-power', destination: '/knowledge-center/advancements-of-solar-power', permanent: true },
  { source: '/affordable-inverter', destination: '/knowledge-center/affordable-inverter', permanent: true },
  { source: '/benefits-of-stabilizer-batteries-for-uninterrupted-power-supply', destination: '/knowledge-center/benefits-of-stabilizer-batteries-for-uninterrupted-power-supply', permanent: true },
  { source: '/blog-2', destination: '/knowledge-center', permanent: true },
  { source: '/category/our-past-projects', destination: '/installations', permanent: true },
  { source: '/common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them', destination: '/knowledge-center/common-problems-with-power-supply-and-how-stabilizers-can-help-solve-them', permanent: true },
  { source: '/how-much-is-a-solar-inverter-in-nigeria', destination: '/knowledge-center/how-much-is-a-solar-inverter-in-nigeria', permanent: true },
  { source: '/how-much-is-inverter-in-nigeria', destination: '/knowledge-center/how-much-is-inverter-in-nigeria', permanent: true },
  { source: '/integrating-solar-batteries-with-grid-tied-systems', destination: '/knowledge-center/integrating-solar-batteries-with-grid-tied-systems', permanent: true },
  { source: '/inverter-for-energy-storage', destination: '/knowledge-center/inverter-for-energy-storage', permanent: true },
  { source: '/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply', destination: '/knowledge-center/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply', permanent: true },
  { source: '/inverter-solar-battery', destination: '/knowledge-center/inverter-solar-battery', permanent: true },
  { source: '/inverter-with-energy-saving-mode', destination: '/knowledge-center/inverter-with-energy-saving-mode', permanent: true },
  { source: '/inverter-with-integrated-mppt', destination: '/knowledge-center/inverter-with-integrated-mppt', permanent: true },
  { source: '/inverters-for-renewable-energy-systems', destination: '/knowledge-center/inverters-for-renewable-energy-systems', permanent: true },
  { source: '/inverters-to-the-rescue-your-trusted-sidekick-for-power-outages', destination: '/knowledge-center/inverters-to-the-rescue-your-trusted-sidekick-for-power-outages', permanent: true },
  { source: '/lifepo4-battery', destination: '/knowledge-center/lifepo4-battery', permanent: true },
  { source: '/lifepo4-battery-in-nigeria', destination: '/knowledge-center/lifepo4-battery-in-nigeria', permanent: true },
  { source: '/lithium-batteries-for-inverters', destination: '/knowledge-center/lithium-batteries-for-inverters', permanent: true },
  { source: '/lithium-solar-batteries', destination: '/knowledge-center/lithium-solar-batteries', permanent: true },
  { source: '/maintaining-and-troubleshooting-inverters', destination: '/knowledge-center/maintaining-and-troubleshooting-inverters', permanent: true },
  { source: '/maximizing-the-lifespan-of-stabilizer-batteries-maintenance-tips', destination: '/knowledge-center/maximizing-the-lifespan-of-stabilizer-batteries-maintenance-tips', permanent: true },
  { source: '/prag-privacy-policy', destination: '/privacy', permanent: true },
  { source: '/pragmatic-technologies', destination: '/about', permanent: true },
  { source: '/product-tag/4kva-48v-heavy-duty-inverter', destination: '/products/heavy-duty-inverters', permanent: true },
  { source: '/product-tag/avr', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/product-tag/ecoseries-inverter', destination: '/products/inverters', permanent: true },
  { source: '/product-tag/heavy-duty-inverter', destination: '/products/heavy-duty-inverters', permanent: true },
  { source: '/product-tag/hybrid-inverter', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/product-tag/power-protection', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/product-tag/relay', destination: '/products/relay-voltage-stabilizers', permanent: true },
  { source: '/product-tag/servo', destination: '/products/servo-voltage-stabilizers', permanent: true },
  { source: '/product-tag/solar', destination: '/products/solar', permanent: true },
  { source: '/product-tag/solar-charge-controllers', destination: '/products/solar-charge-controllers', permanent: true },
  { source: '/product-tag/solar-inverter', destination: '/products/inverters', permanent: true },
  { source: '/product-tag/solar-panels', destination: '/products/solar-panels', permanent: true },
  { source: '/product-tag/stabilizer', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/product-tag/standard-series-inverter', destination: '/products/inverters', permanent: true },
  { source: '/product-tag/voltage-regulator', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/search-for-prag-products', destination: '/products', permanent: true },
  { source: '/servo-stabilizer', destination: '/knowledge-center/servo-stabilizer', permanent: true },
  { source: '/servo-stabilizers', destination: '/knowledge-center/servo-stabilizers', permanent: true },
  { source: '/solar-battery', destination: '/knowledge-center/solar-battery', permanent: true },
  { source: '/solar-battery-nigeria', destination: '/knowledge-center/solar-battery-nigeria', permanent: true },
  { source: '/solar-energy-in-nigeria', destination: '/knowledge-center/solar-energy-in-nigeria', permanent: true },
  { source: '/solar-installation-lagos', destination: '/knowledge-center/solar-installation-lagos', permanent: true },
  { source: '/solar-installation-lagos-cost', destination: '/knowledge-center/solar-installation-lagos-cost', permanent: true },
  { source: '/solar-installation-services-by-prag', destination: '/knowledge-center/solar-installation-services-by-prag', permanent: true },
  { source: '/solar-panel-installation-a-comprehensive-guide-to-harnessing-renewable-energy', destination: '/knowledge-center/solar-panel-installation-a-comprehensive-guide-to-harnessing-renewable-energy', permanent: true },
  { source: '/solar-panel-prices-in-nigeria', destination: '/knowledge-center/solar-panel-prices-in-nigeria', permanent: true },
  { source: '/stabilizer-batteries-vs-traditional-backup-power', destination: '/knowledge-center/stabilizer-batteries-vs-traditional-backup-power', permanent: true },
  { source: '/the-science-behind-solar-panels', destination: '/knowledge-center/the-science-behind-solar-panels', permanent: true },
  { source: '/things-to-check-if-your-1kva-2-5kva-prag-inverter-is-not-charging', destination: '/knowledge-center/things-to-check-if-your-1kva-2-5kva-prag-inverter-is-not-charging', permanent: true },
  { source: '/tired-of-generators', destination: '/knowledge-center/tired-of-generators', permanent: true },
  { source: '/vision-and-mission-statement', destination: '/about', permanent: true },
  { source: '/what-can-a-2-5-kva-solar-system-power', destination: '/knowledge-center/what-can-a-2-5-kva-solar-system-power', permanent: true },
  { source: '/what-causes-lithium-batteries-to-overheat-and-how-to-prevent-it', destination: '/knowledge-center/what-causes-lithium-batteries-to-overheat-and-how-to-prevent-it', permanent: true },
  { source: '/what-is-depth-of-discharge-dod', destination: '/knowledge-center/what-is-depth-of-discharge-dod', permanent: true },
  { source: '/what-is-the-difference-between-relay-servo-voltage-stabilizer', destination: '/knowledge-center/what-is-the-difference-between-relay-servo-voltage-stabilizer', permanent: true },
  { source: '/what-types-of-batteries-are-used-in-solar-electric-systems', destination: '/knowledge-center/what-types-of-batteries-are-used-in-solar-electric-systems', permanent: true },
  { source: '/why-we-need-servo-stabilizer', destination: '/knowledge-center/why-we-need-servo-stabilizer', permanent: true },

  // ─── P2 — Secondary / archive ────────────────────────────────────────────────────────
  { source: '/55977-2', destination: '/installations', permanent: true },

  // ─── P3 — Utility / functional ────────────────────────────────────────────────────────
  { source: '/cart', destination: 'https://shop.prag.global/cart', permanent: true },
  { source: '/checkout', destination: 'https://shop.prag.global/checkout', permanent: true },
  { source: '/my-account', destination: 'https://shop.prag.global/account', permanent: true },
  { source: '/product-cart', destination: 'https://shop.prag.global/cart', permanent: true },

  // ─── /shop/ product redirects (resolved via WooCommerce lookup) ──────────
  { source: '/shop/10kva-servo-100-250v-wall-voltage-stabilizer', destination: '/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-100-250v', permanent: true },
  { source: '/shop/10kva-servo-voltage-stabilizer-130-250v-b', destination: '/products/servo-voltage-stabilizers/10kva-servo-voltage-stabilizer-130-250v', permanent: true },
  { source: '/shop/15kva-relay-voltage-stabilizer-wall-45v-280v-tmp', destination: '/products/relay-voltage-stabilizers/15kva-relay-voltage-stabilizer-45-280v', permanent: true },
  { source: '/shop/15kva-servo-voltage-stabilizer', destination: '/products/servo-voltage-stabilizers/15kva-servo-voltage-stabilizer-100-260v', permanent: true },
  { source: '/shop/20kva-relay-45-280v-wall-voltage-stabilizer', destination: '/products/relay-voltage-stabilizers/20kva-relay-voltage-stabilizer-45-280v', permanent: true },
  { source: '/shop/30kva-servo-voltage-stabilizer', destination: '/products/servo-voltage-stabilizers/30kva-servo-voltage-stabilizer-80-260v', permanent: true },
  { source: '/shop/3kw-24v-heavy-duty-hybrid-inverter-2400w-mppt', destination: '/products/hybrid-inverters/3kw-24v-hybrid-inverter-2400w-mppt', permanent: true },
  { source: '/shop/3kw-24v-hybrid-inverter-with-mppt', destination: '/products/hybrid-inverters/3kw-24v-hybrid-inverter-3000w-mppt', permanent: true },
  { source: '/shop/5kva-relay-voltage-stabilizer', destination: '/products/relay-voltage-stabilizers/5kva-relay-voltage-stabilizer-95-270v', permanent: true },
  { source: '/shop/5kwh-24v-lithium-battery-battery', destination: '/products/lithium-batteries/5kwh-24v-lithium-battery', permanent: true },
  { source: '/shop/battery-status-processor-bsp-500', destination: '/products/solar-charge-controllers/battery-status-processor-bsp-500', permanent: true },
  { source: '/shop/battery-temperature-sensor-studer-bts-01', destination: '/products/solar-charge-controllers/battery-temperature-sensor-studer-bts-01', permanent: true },
  { source: '/shop/ds50-320vt-s-ac-surge-protective-device', destination: '/products/protective-device/ds50-320vt-s-ac-surge-protective-device-2-pole-enclosure', permanent: true },
  { source: '/shop/epsolar-remote-display', destination: '/products/solar-charge-controllers/epsolar-remote-display-with-cable', permanent: true },
  { source: '/shop/internet-based-communication-set-xcom-gsm', destination: '/products/solar-charge-controllers/internet-based-communication-set-xcom-gsm-including-gsm-modem-cables', permanent: true },
  { source: '/shop/internet-based-communication-set-xcom-lan-xtender-including-ethernet-bridge-cables', destination: '/products/solar-charge-controllers/internet-based-communication-set-xcom-lan-including-ethernet-bridge-cables', permanent: true },
  { source: '/shop/prag-100kva-3-phase-voltage-stabilizer', destination: '/products/servo-voltage-stabilizers/100kva-3-phase-servo-voltage-stabilizer-304-456v', permanent: true },
  { source: '/shop/prag-40a-mppt-solar-charge-controller', destination: '/products/solar-charge-controllers/prag-40a-mppt-solar-charge-controller', permanent: true },
  { source: '/shop/the-rcc-02-remote-control-centre-for-studer', destination: '/products/solar-charge-controllers/rcc-02-remote-control-centre-for-studer', permanent: true },

  // ─── /shop/ retired products → category fallback ──────────────────────────
  { source: '/shop/10kva-thyristor-voltage-stabilizer-50-255v', destination: '/products/thyristor-stabilizers/10kva-thyristor-voltage-stabilizer-50-255v', permanent: true },
  { source: '/shop/15kva-relay-voltage-stabilizer-45-280v', destination: '/products/relay-voltage-stabilizers/15kva-relay-voltage-stabilizer-45-280v', permanent: true },
  { source: '/shop/2-5kva-pure-sine-inverter', destination: '/products/inverters', permanent: true },
  { source: '/shop/20kva-servo-voltage-stabilizer-80-260v', destination: '/products/servo-voltage-stabilizers/20kva-servo-voltage-stabilizer-80-260v', permanent: true },
  { source: '/shop/20kva-thyristor-voltage-stabilizer-50-255v', destination: '/products/thyristor-stabilizers/20kva-thyristor-voltage-stabilizer-50-255v', permanent: true },
  { source: '/shop/24v-hybrid-solar-inverter', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/shop/25kva-relay-voltage-stabilizer-45-280v', destination: '/products/relay-voltage-stabilizers/25kva-relay-voltage-stabilizer-45-280v', permanent: true },
  { source: '/shop/3-5kva-24v-heavy-duty-inverter-studer-xtender-xtm-3500', destination: '/products/heavy-duty-inverters/3-5kva-24v-heavy-duty-inverter-studer-xtender-xtm-3500', permanent: true },
  { source: '/shop/3-6kw-24v-hybrid-inverter-mppt-5000w', destination: '/products/hybrid-inverters/3-6kw-24v-hybrid-inverter-mppt-5000w', permanent: true },
  { source: '/shop/3-8kva-24v-heavy-duty-hybrid-inverter-mppt-1600w', destination: '/products/hybrid-inverters/3-8kva-24v-heavy-duty-hybrid-inverter-mppt-1600w', permanent: true },
  { source: '/shop/30kva-3-phase-260-456-voltage-regulator', destination: '/products/advanced-stabilizers', permanent: true },
  { source: '/shop/30kva-relay-45-280-cabinet-voltage-stabilizer', destination: '/products/relay-voltage-stabilizers', permanent: true },
  { source: '/shop/30kva-thyristor-voltage-stabilizer-50-255v', destination: '/products/thyristor-stabilizers/30kva-thyristor-voltage-stabilizer-50-255v', permanent: true },
  { source: '/shop/455w-canadian-mono-panel', destination: '/products/solar-panels/455w-canadian-mono-panel', permanent: true },
  { source: '/shop/480w-jinko-mono-panel', destination: '/products/solar-panels/480w-jinko-mono-panel', permanent: true },
  { source: '/shop/5-12kwh-51-2v-lifepo4-lithium-battery', destination: '/products/lithium-batteries', permanent: true },
  { source: '/shop/5-5kw-48v-hybrid-inverter-6000w-mppt', destination: '/products/inverters/5-5kw-48v-hybrid-inverter-6000w-mppt', permanent: true },
  { source: '/shop/540w-mono-panel', destination: '/products/solar-panels/540w-mono-panel', permanent: true },
  { source: '/shop/595w-canadian-mono-panel', destination: '/products/solar-panels/595w-canadian-mono-panel', permanent: true },
  { source: '/shop/5kva-voltage-stabilizer', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/shop/5kva-wall-voltage-stabilizer', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/shop/5kw-modular-adv-online-solar-inverter', destination: '/products/inverters', permanent: true },
  { source: '/shop/6-3kva-48v-heavy-duty-hybrid-inverter-mppt-6400w', destination: '/products/hybrid-inverters/6-3kva-48v-heavy-duty-hybrid-inverter-mppt-6400w', permanent: true },
  { source: '/shop/60kva-3-phase-260-456-voltage-regulator', destination: '/products/advanced-stabilizers', permanent: true },
  { source: '/shop/6kw-48v-hybrid-inverter-6000w-mppt-expandable-6-to-36kw', destination: '/products/hybrid-inverters/6kw-48v-hybrid-inverter-6000w-mppt-expandable-6-to-36kw', permanent: true },
  { source: '/shop/7-2kw-hybrid-solar-inverter', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/shop/8kw-hybrid-inverter', destination: '/products/hybrid-inverters', permanent: true },
  { source: '/shop/jinko-solar-panel', destination: '/products/solar-panels', permanent: true },
  { source: '/shop/prag-200kva-3-phase-voltage-stabilizer', destination: '/products/advanced-stabilizers', permanent: true },
  { source: '/shop/prag-50kva-servo-cabinet-voltage-stabilizer', destination: '/products/servo-voltage-stabilizers', permanent: true },
  { source: '/shop/prag-6-5kva-48v-inverter-h-series', destination: '/products/inverters', permanent: true },
  { source: '/shop/prag-7-5kva-48v-inverter', destination: '/products/inverters', permanent: true },
  { source: '/shop/pv40-surge-protector', destination: '/products/protective-device', permanent: true },
  { source: '/shop/stb-200k-f-stabilizer', destination: '/products/voltage-stabilizers', permanent: true },
  { source: '/shop/voltage-stabilizer-for-home-and-office', destination: '/products/voltage-stabilizers', permanent: true },

  // ─── Catch-all legacy patterns ──────────────────────────────────────────────
  // NOTE: Broad /product-category/:category and /product-category/:category/:subcategory
  // catch-alls are NOT defined here as simple pattern redirects. They are handled
  // by middleware.ts with approved-taxonomy validation to prevent redirecting
  // unknown/excluded categories to dead pages.
  // NOTE: /shop/:product and /shop/:category/:product are handled by middleware's
  // WooCommerce product lookup (lookupShopProduct) which resolves the product
  // against live WC data and uses preferredProductCategory() for the canonical
  // category. Unknown products that fail WC lookup will 404 naturally.
];

/**
 * URLs that should return HTTP 410 Gone.
 * These are intentionally retired legacy URLs with no modern equivalent.
 * Handled by middleware.ts.
 */
export const RETIRED_URLS: ReadonlySet<string> = new Set([
  '/product-category/sales',
  '/product-category/uncategorized',
  '/product-category/accessories',
  '/category/blood-pressure-monitor',
  '/electrical-lights',
  '/fusion_tb_category/footer',
  '/health-fitness',
  '/personal-electronics',
  '/tag/blood-pressure-monitor',
  '/tag/blood-pressure',
  '/tag/health',
  '/traveler-luggage-scale',
]);

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
        .filter((r: any) => typeof r.source === 'string' && typeof r.destination === 'string')
        .filter((r: any) => !r.source.includes('?') && !r.destination.includes('?'))
        .filter((r: any) => r.source.startsWith('/'))
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