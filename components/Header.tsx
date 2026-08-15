'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Building2, ChevronDown, Handshake, Menu, ShieldCheck, X } from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';

type HeaderMenuItem = {
  label: string;
  href: string;
  image?: string;
  children?: HeaderMenuItem[];
};

const SOLUTIONS: HeaderMenuItem[] = [
  { label: 'For Homes', href: '/solutions/residential' },
  { label: 'For Commercial', href: '/solutions/commercial' },
  { label: 'For Industrial', href: '/solutions/industrial' },
  { label: 'Voltage Stabilization & Protection', href: '/solutions/voltage-stabilization-protection' },
  { label: 'Solar Energy', href: '/solutions/solar-energy' },
  { label: 'Backup Power', href: '/solutions/backup-power' },
];

const PRODUCTS: HeaderMenuItem[] = [
  { label: 'Voltage Stabilizers', href: '/products/voltage-stabilizers' },
  { label: 'Inverters', href: '/products/inverters' },
  { label: 'Batteries', href: '/products/batteries' },
  { label: 'Solar', href: '/products/solar' },
];

const COMPANY: HeaderMenuItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Become A Distributor', href: '/distributor' },
];

function normalizeMenuItems(items: unknown): HeaderMenuItem[] {
  if (!Array.isArray(items)) return [];

  const normalized: HeaderMenuItem[] = [];
  for (const rawItem of items) {
    const label = String((rawItem as { label?: unknown })?.label ?? '').trim();
    const href = String((rawItem as { href?: unknown })?.href ?? '').trim();
    if (!label || !href) continue;

    const image = String((rawItem as { image?: unknown })?.image ?? '').trim();
    const children = normalizeMenuItems((rawItem as { children?: unknown })?.children);
    const item: HeaderMenuItem = children.length > 0 ? { label, href, children } : { label, href };
    if (image) item.image = image;
    normalized.push(item);
  }
  return normalized;
}

function applyCompleteSystemsLinkRules(items: HeaderMenuItem[], trail: string[] = []): HeaderMenuItem[] {
  return items.map((item) => {
    const label = item.label.trim().toLowerCase();
    const parentLabel = trail[trail.length - 1]?.trim().toLowerCase() ?? '';
    const grandParentLabel = trail[trail.length - 2]?.trim().toLowerCase() ?? '';

    let href = item.href;
    // Fix CMS label/URL mismatch: a "Lithium Batteries" nav item should point
    // at the lithium-batteries category, not the broad batteries category.
    if (label === 'lithium batteries' && href === '/products/batteries') {
      href = '/products/lithium-batteries';
    }
    if (label === 'home backup power') href = '/solutions/residential/home-backup-power';
    if (label === 'home solar systems') href = '/solutions/residential/home-solar-systems';
    if (label === 'office backup power') href = '/solutions/commercial/office-backup-power';
    if (label === 'solar for businesses') href = '/solutions/commercial/solar-for-businesses';
    if (label === 'power stabilization & protection' && parentLabel === 'residential') {
      href = '/solutions/residential/power-stabilization-protection';
    }
    if (label === 'power stabilization & protection' && parentLabel === 'commercial') {
      href = '/solutions/commercial/power-stabilization-protection';
    }

    if (parentLabel === 'home backup power') {
      if (label === 'complete systems') href = '/solutions/residential/home-backup-power?tab=complete-systems';
      if (label === 'inverters') href = '/solutions/residential/home-backup-power?tab=inverters';
      if (label === 'batteries') href = '/solutions/residential/home-backup-power?tab=batteries';
    }

    if (parentLabel === 'home solar systems') {
      if (label === 'complete systems') href = '/solutions/residential/home-solar-systems?tab=complete-systems';
      if (label === 'inverters') href = '/solutions/residential/home-solar-systems?tab=inverters';
      if (label === 'batteries') href = '/solutions/residential/home-solar-systems?tab=batteries';
      if (label === 'solar panels') href = '/solutions/residential/home-solar-systems?tab=solar';
    }

    if (parentLabel === 'office backup power') {
      if (label === 'complete systems') href = '/solutions/commercial/office-backup-power?tab=complete-systems';
      if (label === 'inverters') href = '/solutions/commercial/office-backup-power?tab=inverters';
      if (label === 'batteries') href = '/solutions/commercial/office-backup-power?tab=batteries';
    }

    if (parentLabel === 'solar for businesses') {
      if (label === 'complete systems') href = '/solutions/commercial/solar-for-businesses?tab=complete-systems';
      if (label === 'inverters') href = '/solutions/commercial/solar-for-businesses?tab=inverters';
      if (label === 'batteries') href = '/solutions/commercial/solar-for-businesses?tab=batteries';
      if (label === 'solar panels') href = '/solutions/commercial/solar-for-businesses?tab=solar';
    }

    if (parentLabel === 'power stabilization & protection') {
      const isResidential = grandParentLabel === 'residential';
      const base = isResidential
        ? '/solutions/residential/power-stabilization-protection'
        : '/solutions/commercial/power-stabilization-protection';

      if (label === 'all stabilizers') href = `${base}?tab=all`;
      if (label === 'relay stabilizers') href = `${base}?tab=relay`;
      if (label === 'servo stabilizers') href = `${base}?tab=servo`;
      if (label === 'thyristor stabilizers') href = `${base}?tab=thyristor`;
      if (label === '3 phase stabilizers' || label === '3-phase stabilizers') href = `${base}?tab=three-phase`;
    }

    const children = Array.isArray(item.children)
      ? applyCompleteSystemsLinkRules(item.children, [...trail, item.label])
      : undefined;

    return children && children.length > 0
      ? { ...item, href, children }
      : { ...item, href };
  });
}

function MobileMenuNode({ item, onClose, depth = 0 }: { item: HeaderMenuItem; onClose: () => void; depth?: number }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [open, setOpen] = useState(false);
  const indent = depth * 24;

  if (!hasChildren) {
    return (
      <div className="border-b border-zinc-100 last:border-0" style={{ marginLeft: indent }}>
        <Link
          href={item.href}
          onClick={onClose}
          className={`block py-2.5 text-base hover:text-sky-700 transition-colors ${depth > 0 ? 'text-zinc-950' : 'text-zinc-600'}`}
        >
          {item.label}
        </Link>
      </div>
    );
  }

  return (
    <div className="border-b border-zinc-100 last:border-0" style={{ marginLeft: indent }}>
      <div className="flex items-center justify-between gap-2">
        <Link href={item.href} onClick={onClose} className={`py-2.5 text-base font-semibold hover:text-sky-700 transition-colors ${depth > 0 ? 'text-zinc-950' : 'text-zinc-700'}`}>
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-sky-700 transition-colors"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open ? (
        <div className="pt-0.5">
          {item.children?.map((child, index) => (
            <MobileMenuNode key={`${child.href}-${index}`} item={child} onClose={onClose} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type DesktopMegaKind = 'solutions' | 'products' | 'company';

const REAL_PRODUCT_IMAGES = {
  stabilizerWhite: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
  stabilizerBlack: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
  residentialStabilizer: 'https://central.prag.global/wp-content/uploads/2024/11/PRAG-LVG45-30K-STABILIZER-2-2000x2000.jpg',
  commercialInverter: 'https://central.prag.global/wp-content/uploads/2025/02/LF-inverter-4-1-2500x2500.jpg',
  voltageStabilizer5kva: 'https://central.prag.global/wp-content/uploads/2024/11/Untitled-design-8-2-500x500.jpg',
  inverterWhite: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5-1.png',
  highKvaInverter: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
  lithium48v15kwh: 'https://central.prag.global/wp-content/uploads/2026/04/dd4b835690b546ee636b7659added08cd02d9891.png',
  solar: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
  industrial: 'https://central.prag.global/wp-content/uploads/2021/08/PRAG-Axpert-Max-II-Pantone-2925C-R-side-600-by-600-8KW-Ads-Modular-600x600.jpg',
};

function getMainItems(items: HeaderMenuItem[]): Array<{ label: string; href: string; image?: string }> {
  return items.map((item) => ({ label: item.label, href: item.href, image: item.image }));
}

function getOrderedMainItems(kind: DesktopMegaKind, items: HeaderMenuItem[]): Array<{ label: string; href: string; image?: string }> {
  const mainItems = getMainItems(items);
  return [...mainItems].reverse();
}

function getCompanyIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes('about')) return Building2;
  if (key.includes('distributor') || key.includes('partner')) return Handshake;
  return ShieldCheck;
}

function getShowcaseImage(label: string, kind: Exclude<DesktopMegaKind, 'company'>, customImage?: string): string {
  if (customImage) return customImage;
  const key = label.toLowerCase();
  if (kind === 'solutions') {
    if (key.includes('homes') || key.includes('residential')) return REAL_PRODUCT_IMAGES.residentialStabilizer;
    if (key.includes('commercial')) return REAL_PRODUCT_IMAGES.commercialInverter;
    if (key.includes('industrial')) return REAL_PRODUCT_IMAGES.industrial;
    if (key.includes('voltage') || key.includes('stabilization') || key.includes('protection')) return REAL_PRODUCT_IMAGES.voltageStabilizer5kva;
    if (key.includes('backup')) return REAL_PRODUCT_IMAGES.lithium48v15kwh;
    if (key.includes('solar')) return REAL_PRODUCT_IMAGES.solar;
    return REAL_PRODUCT_IMAGES.inverterWhite;
  }
  if (key.includes('voltage') || key.includes('stabilizer')) return REAL_PRODUCT_IMAGES.voltageStabilizer5kva;
  if (key.includes('inverter')) return REAL_PRODUCT_IMAGES.inverterWhite;
  if (key.includes('lithium') || key.includes('battery')) return REAL_PRODUCT_IMAGES.lithium48v15kwh;
  if (key.includes('solar')) return REAL_PRODUCT_IMAGES.solar;
  return REAL_PRODUCT_IMAGES.inverterWhite;
}

function DesktopMegaPanel({
  label,
  kind,
  items,
  settings,
}: {
  label: string;
  kind: DesktopMegaKind;
  items: HeaderMenuItem[];
  settings?: PublicB2BContent['settings'];
}) {
  const mainItems = getOrderedMainItems(kind, items);
  const header = settings?.header;
  const introTitle =
    kind === 'solutions'
      ? (header?.solutionsMegaTitle ?? 'Power Solutions For Every Space')
      : kind === 'products'
        ? (header?.productsMegaTitle ?? 'Explore PRAG Products')
        : (header?.companyMegaTitle ?? 'About PRAG');
  const introBody =
    kind === 'solutions'
      ? (header?.solutionsMegaBody ?? 'Smart and sustainable systems tailored for homes and businesses.')
      : kind === 'products'
        ? (header?.productsMegaBody ?? 'Built for Nigerian power conditions with performance and reliability in mind.')
        : (header?.companyMegaBody ?? 'Learn more about our company, network, and what we stand for.');

  return (
    <div className="w-full rounded-b-xl rounded-t-none bg-transparent px-0 py-3">
      <div className="flex items-start gap-5">
        <div className="w-[280px] shrink-0 pt-2">
          <h3 className="text-zinc-800 text-[16px] leading-tight font-semibold font-['Onest'] whitespace-nowrap">{introTitle}</h3>
          <p className="mt-2 text-zinc-500 text-sm leading-5 font-normal font-['Space_Grotesk']">{introBody}</p>
        </div>
        <div
          className={`flex-1 flex flex-row-reverse flex-nowrap items-stretch justify-start gap-1 pr-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            kind === 'company' ? '' : ''
          }`}
        >
          {mainItems.map((item) => {
            if (kind === 'company') {
              const Icon = getCompanyIcon(item.label);
              return (
                <div key={item.href} className="contents">
                  <Link
                    href={item.href}
                    className="min-w-[170px] rounded-lg border border-zinc-300/70 bg-transparent px-2.5 py-2.5 flex flex-row items-center justify-start gap-2.5 text-left transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-zinc-800 text-sm font-medium font-['Onest'] leading-snug">{item.label}</span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="min-w-[150px] rounded-lg bg-transparent px-1.5 py-2 flex flex-col items-center justify-center gap-2 text-center transition-colors"
              >
                <div className="h-12 w-full flex items-center justify-center shrink-0">
                  <Image
                    src={getShowcaseImage(item.label, kind, item.image)}
                    alt={item.label}
                    width={120}
                    height={96}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
                <span className="text-zinc-800 text-sm font-medium font-['Onest'] leading-snug">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NavItem({
  label,
  items,
  href,
  megaKind,
  activeMega,
  onMegaEnter,
}: {
  label: string;
  items?: HeaderMenuItem[];
  href?: string;
  megaKind?: DesktopMegaKind;
  activeMega?: DesktopMegaKind | null;
  onMegaEnter?: (kind: DesktopMegaKind) => void;
}) {
  if (!items) {
    return (
      <Link
        href={href ?? '#'}
        className="text-zinc-800 text-base font-medium font-['Onest'] hover:text-sky-700 transition-colors"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => megaKind && onMegaEnter?.(megaKind)}>
      <button className="flex items-center gap-1 text-zinc-800 text-base font-medium font-['Onest'] hover:text-sky-700 transition-colors">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMega === megaKind ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

function MobileAccordion({ label, items, onClose }: { label: string; items: HeaderMenuItem[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-lg font-semibold text-zinc-800 font-['Onest']"
      >
        {label}
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-3 flex flex-col gap-2">
          {items.map((item, index) => (
            <MobileMenuNode key={`${item.href}-${index}`} item={item} onClose={onClose} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  solutionsItems,
  productItems,
  companyItems,
  contact,
  cta,
}: {
  open: boolean;
  onClose: () => void;
  solutionsItems: HeaderMenuItem[];
  productItems: HeaderMenuItem[];
  companyItems: HeaderMenuItem[];
  contact: { label: string; href: string };
  cta: { label: string; href: string };
}) {
  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 overflow-hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Tray */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Tray header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <Link href="/" onClick={onClose}>
            <Image
              src="https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png"
              alt="Prag"
              width={135}
              height={39}
              className="h-10 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </Link>
          <button onClick={onClose} aria-label="Close menu">
            <X className="w-6 h-6 text-zinc-800" />
          </button>
        </div>
        {/* Tray body */}
        <div className="px-6 py-2 flex flex-col overflow-y-auto max-h-[calc(100vh-4rem)]">
          <MobileAccordion label="Solutions" items={solutionsItems} onClose={onClose} />
          <MobileAccordion label="Products" items={productItems} onClose={onClose} />
          <MobileAccordion label="Company" items={companyItems} onClose={onClose} />
          <Link
            href={contact.href}
            onClick={onClose}
            className="py-4 text-lg font-semibold text-zinc-800 font-['Onest'] border-b border-gray-100 hover:text-sky-700 transition-colors"
          >
            {contact.label}
          </Link>
          <Link
            href={cta.href}
            onClick={onClose}
            className="mt-5 mb-4 text-center px-5 py-3 rounded-full bg-[#0166a5] text-white text-lg font-medium font-['Onest'] hover:bg-sky-800 transition-colors"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Header({ settings }: { settings?: PublicB2BContent['settings'] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<DesktopMegaKind | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMegaEnter(kind: DesktopMegaKind) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMega(kind);
  }

  function handleMegaLeave() {
    closeTimerRef.current = setTimeout(() => setActiveMega(null), 100);
  }
  const configuredSolutions = normalizeMenuItems(settings?.header?.solutionsMenuItems);
  const configuredProducts = normalizeMenuItems(settings?.header?.productsMenuItems);
  const configuredCompany = normalizeMenuItems(settings?.header?.companyMenuItems).length > 0
    ? normalizeMenuItems(settings?.header?.companyMenuItems)
    : normalizeMenuItems(settings?.header?.menuItems);
  const solutionsItems = applyCompleteSystemsLinkRules(configuredSolutions.length > 0 ? configuredSolutions : SOLUTIONS);
  const productItems = configuredProducts.length > 0 ? configuredProducts : PRODUCTS;
  const companyItems = configuredCompany.length > 0 ? configuredCompany : COMPANY;
  const contact = {
    label: settings?.header?.contactLabel?.trim() || 'Contact',
    href: settings?.header?.contactHref?.trim() || '/contact',
  };
  const cta = {
    label: settings?.header?.ctaLabel?.trim() || 'Shop',
    href: settings?.header?.ctaHref?.trim() || '/products',
  };

  const activeLabel = activeMega === 'solutions' ? 'Solutions' : activeMega === 'products' ? 'Products' : 'Company';
  const activeItems = activeMega === 'solutions' ? solutionsItems : activeMega === 'products' ? productItems : companyItems;

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-[rgba(1,102,165,0.10)]">
      <div className="w-full px-6 md:px-10 lg:px-20">
        <div className="max-w-[1280px] mx-auto h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png"
              alt="Prag"
              width={135}
              height={39}
              priority
              className="h-10 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-14 ml-auto" onMouseLeave={handleMegaLeave}>
            {/* Desktop Nav */}
            <nav className="flex items-center gap-6 xl:gap-14">
              <NavItem label="Solutions" items={solutionsItems} megaKind="solutions" activeMega={activeMega} onMegaEnter={handleMegaEnter} />
              <NavItem label="Products" items={productItems} megaKind="products" activeMega={activeMega} onMegaEnter={handleMegaEnter} />
              <NavItem label="Company" items={companyItems} megaKind="company" activeMega={activeMega} onMegaEnter={handleMegaEnter} />
              <NavItem label={contact.label} href={contact.href} />
            </nav>

            {/* Shop Button */}
            <Link
              href={cta.href}
              className="inline-flex px-5 py-2 rounded-full border border-zinc-800 text-zinc-800 text-base font-medium font-['Onest'] hover:bg-sky-700 hover:border-sky-700 hover:text-white transition-colors"
            >
              {cta.label}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            <Menu className="w-6 h-6 text-zinc-800" />
          </button>
        </div>
      </div>

      {activeMega && (
        <div className="hidden lg:block w-full px-6 md:px-10 lg:px-20" onMouseEnter={() => handleMegaEnter(activeMega)} onMouseLeave={handleMegaLeave}>
          <div className="max-w-[1280px] mx-auto">
            <DesktopMegaPanel label={activeLabel} kind={activeMega} items={activeItems} settings={settings} />
          </div>
        </div>
      )}

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        solutionsItems={solutionsItems}
        productItems={productItems}
        companyItems={companyItems}
        contact={contact}
        cta={cta}
      />
    </header>
  );
}
