import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';

const SOLUTIONS = [
  { label: 'Industrial Power', href: '/solutions/industrial' },
  { label: 'Commercial Power', href: '/solutions/commercial' },
  { label: 'Residential Power', href: '/solutions/residential' },
  { label: 'All Solutions', href: '/solutions' },
];

const COMPANY = [
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Find a Distributor', href: '/find-a-distributor' },
  { label: 'Become a Distributor', href: '/distributor' },
  { label: 'Compare Products', href: '/compare' },
];

const QUICKLINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Power Calculator', href: '/power-calculator' },
  { label: 'Technical Resources', href: '/resources' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
];

export default function Footer() {
  return (
    <footer>
      {/* CTA Banner */}
      <div className="w-full py-20 px-6 md:px-20 flex flex-col items-center gap-8 text-center" style={{ backgroundColor: '#012F4C' }}>
        <h2 className="text-white text-4xl md:text-6xl font-bold font-['Onest'] leading-tight max-w-3xl">
          Stop Losing Money<br />to Bad Power
        </h2>
        <p className="text-white/70 text-base md:text-lg font-['Space_Grotesk'] max-w-xl">
          Talk to a PRAG engineer today and fix your power issues permanently.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/power-calculator"
            className="px-7 py-3.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full transition-colors"
          >
            Get a Free Power Assessment
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3.5 border border-white text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-white hover:text-[#012F4C] transition-colors"
          >
            WhatsApp Us Now
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full bg-white px-6 md:px-20 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <Image
                src="https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png"
                alt="PRAG"
                width={90}
                height={26}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-zinc-700 text-sm font-['Space_Grotesk']">PRAG Power Engineering Ltd</p>
              <p className="text-zinc-500 text-sm font-['Space_Grotesk']">RC: 1234567.</p>
            </div>
            <p className="text-zinc-600 text-sm font-['Space_Grotesk'] leading-relaxed">
              Nigeria&apos;s leading power engineering company delivering reliable power systems for homes, businesses, and industries nationwide.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <a href="https://wa.me/2348032170129" className="flex items-center gap-2 text-zinc-600 text-sm font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                {/* WhatsApp icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +2348032170129
              </a>
              <a href="mailto:sales@prag.global" className="flex items-center gap-2 text-zinc-600 text-sm font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                sales@prag.global
              </a>
              <span className="flex items-center gap-2 text-zinc-600 text-sm font-['Space_Grotesk']">
                <MapPin className="w-4 h-4 shrink-0" />
                Lagos, Nigeria
              </span>
            </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-900 text-base font-bold font-['Space_Grotesk']">Solutions</h4>
            <ul className="flex flex-col gap-3">
              {SOLUTIONS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-600 text-sm font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-900 text-base font-bold font-['Space_Grotesk']">Company</h4>
            <ul className="flex flex-col gap-3">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-600 text-sm font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quicklinks */}
          <div className="flex flex-col gap-4">
            <h4 className="text-zinc-900 text-base font-bold font-['Space_Grotesk']">Quicklinks</h4>
            <ul className="flex flex-col gap-3">
              {QUICKLINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-600 text-sm font-['Space_Grotesk'] hover:text-sky-700 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + Bottom bar */}
        <div className="mt-12 border-t border-zinc-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs md:text-sm font-['Space_Grotesk'] text-center md:text-left">© Copyright {new Date().getFullYear()} PRAG. All rights reserved.</p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="https://facebook.com" aria-label="Facebook" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-zinc-500 hover:text-sky-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center text-sm font-['Space_Grotesk'] text-zinc-500">
            <Link href="/privacy" className="hover:text-sky-700 transition-colors">Privacy</Link>
            <span>|</span>
            <Link href="/terms-of-use" className="hover:text-sky-700 transition-colors">Terms of use</Link>
            <span>|</span>
            <Link href="/shipping-policy" className="hover:text-sky-700 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="w-full bg-sky-700 py-3 px-6 text-center">
        <p className="text-white text-xs font-['Space_Grotesk']">
          The products, prices and promotions on this website are applicable to our customers only and are subject to change anytime.
        </p>
      </div>
    </footer>
  );
}
