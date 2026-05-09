'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const SOLUTIONS = [
  { label: 'Industrial', href: '/solutions/industrial' },
  { label: 'Commercial', href: '/solutions/commercial' },
  { label: 'Residential', href: '/solutions/residential' },
  { label: 'All Solutions', href: '/solutions' },
];

const PRODUCTS = [
  { label: 'Inverters', href: '/products/inverters' },
  { label: 'Batteries', href: '/products/batteries' },
  { label: 'Solar Panels', href: '/products/solar' },
  { label: 'Stabilizers', href: '/products/all-prag-stabilizers' },
  { label: 'All Products', href: '/products' },
];

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
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
          className="block px-4 py-2.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:bg-sky-50 hover:text-sky-700 transition-colors"
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
        className="text-zinc-800 text-sm font-medium font-['Space_Grotesk'] hover:text-sky-700 transition-colors"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="flex items-center gap-1 text-zinc-800 text-sm font-medium font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png"
            alt="Prag"
            width={100}
            height={32}
            priority
            className="h-8 w-auto"
            style={{ width: 'auto' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItem label="Solutions" items={SOLUTIONS} />
          <NavItem label="Products" items={PRODUCTS} />
          <NavItem label="Company" items={COMPANY} />
          <NavItem label="Contact" href="/contact" />
        </nav>

        {/* Shop Button */}
        <Link
          href="/products"
          className="hidden md:inline-flex px-5 py-2 rounded-full border border-zinc-800 text-zinc-800 text-sm font-medium font-['Space_Grotesk'] hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Shop
        </Link>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen
            ? <X className="w-6 h-6 text-zinc-800" />
            : <Menu className="w-6 h-6 text-zinc-800" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-bold text-zinc-400 font-['Space_Grotesk'] uppercase tracking-wider pt-1">Solutions</p>
          {SOLUTIONS.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setMobileOpen(false)} className="py-1.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:text-sky-700">{i.label}</Link>
          ))}
          <p className="text-xs font-bold text-zinc-400 font-['Space_Grotesk'] uppercase tracking-wider mt-3">Products</p>
          {PRODUCTS.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setMobileOpen(false)} className="py-1.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:text-sky-700">{i.label}</Link>
          ))}
          <p className="text-xs font-bold text-zinc-400 font-['Space_Grotesk'] uppercase tracking-wider mt-3">Company</p>
          {COMPANY.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setMobileOpen(false)} className="py-1.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:text-sky-700">{i.label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-1.5 text-sm text-zinc-700 font-['Space_Grotesk'] hover:text-sky-700">Contact</Link>
          <Link
            href="/products"
            className="mt-3 text-center px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-800 text-sm font-medium font-['Space_Grotesk'] hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Shop
          </Link>
        </div>
      )}
    </header>
  );
}
