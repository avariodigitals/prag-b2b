'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { PublicB2BContent } from '@/lib/b2bContent';

const SOLUTIONS = [
  { label: 'Industrial', href: '/solutions/industrial' },
  { label: 'Commercial', href: '/solutions/commercial' },
  { label: 'Residential', href: '/solutions/residential' },
  { label: 'All Solutions', href: '/solutions' },
];

const PRODUCTS = [
  { label: 'Inverters', href: '/products/inverters' },
  { label: 'Batteries', href: '/products/batteries' },
  { label: 'Solar', href: '/products/solar' },
  { label: 'Stabilizers', href: '/products/all-prag-stabilizers' },
  { label: 'All Products', href: '/products' },
];

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Find a Distributor', href: '/find-a-distributor' },
  { label: 'Become a Distributor', href: '/distributor' },
  { label: 'Compare Products', href: '/compare' },
];

function Dropdown({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-2.5 text-base text-zinc-700 font-['Onest'] hover:bg-sky-50 hover:text-sky-700 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function NavItem({ label, items, href }: { label: string; items?: { label: string; href: string }[]; href?: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <div className="absolute top-full left-0 pt-2 w-52 z-50" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <Dropdown items={items} />
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, items, onClose }: { label: string; items: { label: string; href: string }[]; onClose: () => void }) {
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
        <div className="pb-3 flex flex-col gap-1">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={onClose}
              className="py-2 pl-4 text-base text-zinc-500 font-['Onest'] hover:text-sky-700 hover:pl-5 transition-all"
            >
              {i.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  companyItems,
  cta,
}: {
  open: boolean;
  onClose: () => void;
  companyItems: { label: string; href: string }[];
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
          <MobileAccordion label="Solutions" items={SOLUTIONS} onClose={onClose} />
          <MobileAccordion label="Products" items={PRODUCTS} onClose={onClose} />
          <MobileAccordion label="Company" items={companyItems} onClose={onClose} />
          <Link
            href="/contact"
            onClick={onClose}
            className="py-4 text-base font-semibold text-zinc-800 font-['Onest'] border-b border-gray-100 hover:text-sky-700 transition-colors"
          >
            Contact
          </Link>
          <Link
            href={cta.href}
            onClick={onClose}
            className="mt-5 mb-4 text-center px-5 py-3 rounded-full bg-zinc-800 text-white text-base font-medium font-['Onest'] hover:bg-sky-700 transition-colors"
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
  const configuredCompany = Array.isArray(settings?.header?.menuItems)
    ? settings?.header?.menuItems.filter((item) => item?.label && item?.href)
    : [];
  const companyItems = configuredCompany && configuredCompany.length > 0 ? configuredCompany : COMPANY;
  const cta = {
    label: 'Shop',
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
            <NavItem label="Solutions" items={SOLUTIONS} />
            <NavItem label="Products" items={PRODUCTS} />
            <NavItem label="Company" items={companyItems} />
            <NavItem label="Contact" href="/contact" />
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

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} companyItems={companyItems} cta={cta} />
    </header>
  );
}
