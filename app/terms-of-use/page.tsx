import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsOfUsePage() {
  return (
    <PolicyPageLayout
      title="Terms of Use"
      sections={[
        {
          heading: 'Terms of Use',
          body: null,
        },
        {
          heading: 'Use of Our Website',
          body: (
            <div className="flex flex-col gap-2">
              <p>By using this website, you agree:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Not to misuse or disrupt the platform', 'Not to copy or reproduce content without permission'].map((i) => <li key={i}>{i}</li>)}
              </ul>
              <p>All content remains the property of PRAG.</p>
            </div>
          ),
        },
        {
          heading: 'Limitation of Liability',
          body: (
            <div className="flex flex-col gap-2">
              <p>PRAG is not liable for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Website interruptions', 'Errors in content', 'Reliance on website information'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Terms of Sale',
          body: null,
        },
        {
          heading: 'Orders & Payments',
          body: (
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              {['Orders are subject to confirmation and availability', 'Full payment is required before delivery unless otherwise agreed'].map((i) => <li key={i}>{i}</li>)}
            </ul>
          ),
        },
        {
          heading: 'Pricing',
          body: (
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              {['Prices may change without notice', 'Pricing errors may be corrected at any time'].map((i) => <li key={i}>{i}</li>)}
            </ul>
          ),
        },
        {
          heading: 'Delivery',
          body: (
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              {['Nationwide delivery is available', 'Delivery timelines are estimates and may vary'].map((i) => <li key={i}>{i}</li>)}
            </ul>
          ),
        },
        {
          heading: 'Risk Transfer',
          body: (
            <div className="flex flex-col gap-1">
              <p>Responsibility for products passes to the customer upon delivery.</p>
              <p>Customers are advised to inspect items immediately upon receipt.</p>
            </div>
          ),
        },
        {
          heading: 'Installation',
          body: (
            <div className="flex flex-col gap-1">
              <p>Customers may use any qualified installer.</p>
              <p>PRAG may recommend installers but is not responsible for third-party installation outcomes.</p>
            </div>
          ),
        },
        {
          heading: 'Product Performance',
          body: (
            <div className="flex flex-col gap-2">
              <p>Performance depends on:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Installation quality', 'Load usage', 'Environmental conditions'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Warranty Policy',
          body: null,
        },
        {
          heading: 'Warranty Coverage',
          body: (
            <div className="flex flex-col gap-2">
              <p>At PRAG (Pragmatic Technologies Ltd.), we stand behind the quality of our products.</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['All PRAG Products: 1-Year Limited Warranty', 'Lithium Batteries: 5-Year Limited Warranty'].map((i) => <li key={i}>{i}</li>)}
              </ul>
              <p>This warranty covers manufacturing defects under normal and proper use.</p>
            </div>
          ),
        },
        {
          heading: 'Conditions for Warranty',
          body: (
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-zinc-800">What Is Not Covered</p>
              <p>The warranty does not cover issues arising from:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Improper or poor installation', 'Overloading or misuse', 'Exposure to water, fire, or physical damage', 'Power conditions outside product rating', 'Unauthorized repairs or modifications', 'Normal wear and tear'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Important Notice',
          body: (
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <p className="text-sky-700 text-lg md:text-xl font-medium font-['Montserrat']">
                PRAG is not liable for indirect or consequential losses, including damage to connected appliances or loss of business.
              </p>
            </div>
          ),
        },
        {
          heading: 'Warranty Claims',
          body: (
            <div className="flex flex-col gap-2">
              <p>To make a claim:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Contact our support team', 'Provide proof of purchase', 'Allow product inspection'].map((i) => <li key={i}>{i}</li>)}
              </ul>
              <p>Repairs or replacements will be handled at PRAG&apos;s discretion.</p>
            </div>
          ),
        },
        {
          heading: 'General Disclaimer',
          body: (
            <div className="flex flex-col gap-1">
              <p>PRAG products operate within defined specifications.</p>
              <p>Performance may vary depending on installation, usage, and environmental conditions.</p>
            </div>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our terms, please contact our customer support team at{' '}
              <Link href="mailto:sales@prag.global" className="text-sky-700 hover:underline">sales@prag.global</Link>
              {' '}or call us at{' '}
              <Link href="tel:+2348032170129" className="text-sky-700 hover:underline">+2348032170129</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
