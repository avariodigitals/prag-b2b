'use client';

import Link from 'next/link';
import { preferredProductCategory } from '@/lib/seoTaxonomy';

interface Props {
  product: {
    slug: string;
    categories?: Array<{ slug: string; name?: string }>;
  };
}

interface ContextLink {
  href: string;
  label: string;
}

// ─── Contextual link map by preferred category ───────────────────────────────
// Each category gets a set of useful, contextual internal links to related
// product categories and solution pages. Links are kept natural and useful —
// not artificial SEO link blocks.
const CATEGORY_LINKS: Record<string, { title: string; links: ContextLink[] }> = {
  'hybrid-inverters': {
    title: 'Explore related',
    links: [
      { href: '/products/hybrid-inverters', label: 'Hybrid Inverters' },
      { href: '/products/lithium-batteries', label: 'Lithium Batteries' },
      { href: '/solutions/solar-energy', label: 'Solar Energy Solutions' },
      { href: '/solutions/backup-power', label: 'Backup Power Solutions' },
    ],
  },
  'heavy-duty-inverters': {
    title: 'Explore related',
    links: [
      { href: '/products/heavy-duty-inverters', label: 'Heavy-Duty Inverters' },
      { href: '/products/inverters', label: 'All Inverters' },
      { href: '/products/lithium-batteries', label: 'Lithium Batteries' },
      { href: '/solutions/backup-power', label: 'Backup Power Solutions' },
      { href: '/solutions/industrial', label: 'Industrial Solutions' },
    ],
  },
  'relay-voltage-stabilizers': {
    title: 'Explore related',
    links: [
      { href: '/products/relay-voltage-stabilizers', label: 'Relay Voltage Stabilizers' },
      { href: '/products/voltage-stabilizers', label: 'All Voltage Stabilizers' },
      { href: '/solutions/voltage-stabilization-protection', label: 'Voltage Stabilization & Protection' },
    ],
  },
  'servo-voltage-stabilizers': {
    title: 'Explore related',
    links: [
      { href: '/products/servo-voltage-stabilizers', label: 'Servo Voltage Stabilizers' },
      { href: '/products/voltage-stabilizers', label: 'All Voltage Stabilizers' },
      { href: '/solutions/voltage-stabilization-protection', label: 'Voltage Stabilization & Protection' },
    ],
  },
  'thyristor-stabilizers': {
    title: 'Explore related',
    links: [
      { href: '/products/thyristor-stabilizers', label: 'Thyristor Stabilizers' },
      { href: '/products/voltage-stabilizers', label: 'All Voltage Stabilizers' },
      { href: '/solutions/voltage-stabilization-protection', label: 'Voltage Stabilization & Protection' },
    ],
  },
  'lithium-batteries': {
    title: 'Explore related',
    links: [
      { href: '/products/lithium-batteries', label: 'Lithium Batteries' },
      { href: '/products/batteries', label: 'All Batteries' },
      { href: '/products/hybrid-inverters', label: 'Hybrid Inverters' },
      { href: '/solutions/backup-power', label: 'Backup Power Solutions' },
    ],
  },
  'solar-panels': {
    title: 'Explore related',
    links: [
      { href: '/products/solar-panels', label: 'Solar Panels' },
      { href: '/products/solar-charge-controllers', label: 'Solar Charge Controllers' },
      { href: '/products/hybrid-inverters', label: 'Hybrid Inverters' },
      { href: '/solutions/solar-energy', label: 'Solar Energy Solutions' },
    ],
  },
  'solar-charge-controllers': {
    title: 'Explore related',
    links: [
      { href: '/products/solar-charge-controllers', label: 'Solar Charge Controllers' },
      { href: '/products/solar', label: 'Solar Products' },
      { href: '/products/solar-panels', label: 'Solar Panels' },
      { href: '/solutions/solar-energy', label: 'Solar Energy Solutions' },
    ],
  },
  'protective-device': {
    title: 'Explore related',
    links: [
      { href: '/products/protective-device', label: 'Protective Devices' },
      { href: '/products/solar', label: 'Solar Products' },
      { href: '/solutions/voltage-stabilization-protection', label: 'Voltage Stabilization & Protection' },
    ],
  },
};

export default function ProductContextLinks({ product }: Props) {
  const categorySlug = preferredProductCategory(
    product.categories as Array<{ slug: string }> | undefined,
    product.slug
  );

  const config = CATEGORY_LINKS[categorySlug];
  if (!config || config.links.length === 0) return null;

  return (
    <div className="w-full px-6 md:px-10 lg:px-20 pb-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-3">
          <h2 className="text-[#444444] font-['Onest'] text-lg md:text-xl font-medium">
            {config.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center px-4 py-2 rounded-full border border-[#c4c7cc] text-[#0166a5] font-['Onest'] text-sm font-medium hover:border-[#0166a5] hover:bg-[#0166a5]/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
