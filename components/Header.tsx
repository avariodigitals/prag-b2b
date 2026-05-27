'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';

type HeaderMenuItem = {
  label: string;
  href: string;
  children?: HeaderMenuItem[];
};

const SOLUTIONS = [
  {
    label: 'Residential',
    href: '/solutions/residential',
    children: [
      {
        label: 'Home Backup Power',
        href: '/solutions/residential#home-backup-power',
        children: [
          { label: 'Complete Systems', href: '/solutions/residential' },
          { label: 'Inverters', href: '/products/inverters' },
          { label: 'Batteries', href: '/products/batteries' },
        ],
      },
      {
        label: 'Home Solar Systems',
        href: '/solutions/residential#home-solar-systems',
        children: [
          { label: 'Complete Systems', href: '/solutions/residential' },
          { label: 'Inverters', href: '/products/inverters' },
          { label: 'Batteries', href: '/products/batteries' },
          { label: 'Solar Panels', href: '/products/solar' },
        ],
      },
      {
        label: 'Power Stabilization & Protection',
        href: '/solutions/residential#power-stabilization-protection',
        children: [
          { label: 'All Stabilizers', href: '/products/all-prag-stabilizers' },
          { label: 'Relay Stabilizers', href: '/products/all-prag-stabilizers#relay' },
          { label: 'Servo Stabilizers', href: '/products/all-prag-stabilizers#servo' },
          { label: 'Thyristor Stabilizers', href: '/products/all-prag-stabilizers#thyristor' },
          { label: '3 Phase Stabilizers', href: '/products/all-prag-stabilizers#3-phase' },
        ],
      },
    ],
  },
  {
    label: 'Commercial',
    href: '/solutions/commercial',
    children: [
      {
        label: 'Office Backup Power',
        href: '/solutions/commercial#office-backup-power',
        children: [
          { label: 'Complete Systems', href: '/solutions/commercial' },
          { label: 'Inverters', href: '/products/inverters' },
          { label: 'Batteries', href: '/products/batteries' },
        ],
      },
      {
        label: 'Solar for Businesses',
        href: '/solutions/commercial#solar-for-businesses',
        children: [
          { label: 'Complete Systems', href: '/solutions/commercial' },
          { label: 'Inverters', href: '/products/inverters' },
          { label: 'Batteries', href: '/products/batteries' },
          { label: 'Solar Panels', href: '/products/solar' },
        ],
      },
      {
        label: 'Power Stabilization & Protection',
        href: '/solutions/commercial#power-stabilization-protection',
        children: [
          { label: 'All Stabilizers', href: '/products/all-prag-stabilizers' },
          { label: 'Relay Stabilizers', href: '/products/all-prag-stabilizers#relay' },
          { label: 'Servo Stabilizers', href: '/products/all-prag-stabilizers#servo' },
          { label: 'Thyristor Stabilizers', href: '/products/all-prag-stabilizers#thyristor' },
          { label: '3 Phase Stabilizers', href: '/products/all-prag-stabilizers#3-phase' },
        ],
      },
    ],
  },
];

const PRODUCTS = [
  { label: 'Voltage Stabilizers', href: '/products/all-prag-stabilizers' },
  { label: 'Inverters', href: '/products/inverters' },
  { label: 'Lithium Batteries', href: '/products/batteries' },
  { label: 'Solar', href: '/products/solar' },
];

const COMPANY = [
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

    const children = normalizeMenuItems((rawItem as { children?: unknown })?.children);
    normalized.push(children.length > 0 ? { label, href, children } : { label, href });
  }
  return normalized;
}

function applyCompleteSystemsLinkRules(items: HeaderMenuItem[], trail: string[] = []): HeaderMenuItem[] {
  return items.map((item) => {
    const label = item.label.trim().toLowerCase();
    const parentLabel = trail[trail.length - 1]?.trim().toLowerCase() ?? '';

    let href = item.href;
    if (label === 'complete systems') {
      if (parentLabel === 'home backup power' || parentLabel === 'office backup power') {
        href = '/products?cats=inverters,batteries';
      } else if (parentLabel === 'home solar systems' || parentLabel === 'solar for businesses') {
        href = '/products?cats=inverters,batteries,solar';
      }
    }

    const children = Array.isArray(item.children)
      ? applyCompleteSystemsLinkRules(item.children, [...trail, item.label])
      : undefined;

    return children && children.length > 0
      ? { ...item, href, children }
      : { ...item, href };
  });
}

function DesktopMenuNode({ item }: { item: HeaderMenuItem }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className="block rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-sky-50 hover:text-sky-700 transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="px-1 py-1.5">
      <div className="flex items-center justify-between gap-2">
        <Link href={item.href} className="text-sm font-semibold text-zinc-800 hover:text-sky-700 transition-colors whitespace-nowrap">
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 hover:text-sky-700 transition-colors"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open ? (
        <div className="mt-1.5 space-y-1.5 pl-3">
          {item.children?.map((child, index) => (
            <DesktopMenuNode key={`${child.href}-${index}`} item={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileMenuNode({ item, onClose }: { item: HeaderMenuItem; onClose: () => void }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="block rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:text-sky-700 transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-2">
      <div className="flex items-center justify-between gap-2">
        <Link href={item.href} onClick={onClose} className="text-sm font-semibold text-zinc-700 hover:text-sky-700 transition-colors">
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:border-sky-200 hover:text-sky-700 transition-colors"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open ? (
        <div className="mt-2 space-y-1.5 border-l border-zinc-200 pl-3">
          {item.children?.map((child, index) => (
            <MobileMenuNode key={`${child.href}-${index}`} item={child} onClose={onClose} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Dropdown({ items }: { items: HeaderMenuItem[] }) {
  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
      <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <DesktopMenuNode key={`${item.href}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function hasLongMenuLabel(items: HeaderMenuItem[], threshold = 24): boolean {
  for (const item of items) {
    if (item.label.length >= threshold) return true;
    if (item.children && hasLongMenuLabel(item.children, threshold)) return true;
  }
  return false;
}

function NavItem({ label, items, href }: { label: string; items?: HeaderMenuItem[]; href?: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownWidthClass = items && hasLongMenuLabel(items) ? 'w-[19rem] max-w-[19rem]' : 'w-[15rem] max-w-[15rem]';

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

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
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="flex items-center gap-1 text-zinc-800 text-base font-medium font-['Onest'] hover:text-sky-700 transition-colors">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute top-full left-0 pt-2 z-50 ${dropdownWidthClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <Dropdown items={items} />
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, items, onClose }: { label: string; items: HeaderMenuItem[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-base font-semibold text-zinc-800 font-['Onest']"
      >
        {label}
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-3 flex flex-col gap-2">
          {items.map((item, index) => (
            <MobileMenuNode key={`${item.href}-${index}`} item={item} onClose={onClose} />
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
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Tray */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-sm z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
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
            className="py-4 text-base font-semibold text-zinc-800 font-['Onest'] border-b border-gray-100 hover:text-sky-700 transition-colors"
          >
            {contact.label}
          </Link>
          <Link
            href={cta.href}
            onClick={onClose}
            className="mt-5 mb-4 text-center px-5 py-3 rounded-full bg-[#0166a5] text-white text-base font-medium font-['Onest'] hover:bg-sky-800 transition-colors"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </>
  );
}

export default function Header({ settings }: { settings?: PublicB2BContent['settings'] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-[rgba(1,102,165,0.10)]">
      <div className="w-full px-6 md:px-20">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItem label="Solutions" items={solutionsItems} />
            <NavItem label="Products" items={productItems} />
            <NavItem label="Company" items={companyItems} />
            <NavItem label={contact.label} href={contact.href} />
          </nav>

          {/* Shop Button */}
          <Link
            href={cta.href}
            className="hidden md:inline-flex px-5 py-2 rounded-full border border-zinc-800 text-zinc-800 text-base font-medium font-['Onest'] hover:bg-sky-700 hover:border-sky-700 hover:text-white transition-colors"
          >
            {cta.label}
          </Link>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            <Menu className="w-6 h-6 text-zinc-800" />
          </button>
        </div>
      </div>

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
