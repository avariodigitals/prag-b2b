import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';

export const metadata: Metadata = { title: 'Shipping Policy', alternates: { canonical: 'https://www.prag.global/shipping-policy' } };

const DELIVERY_TIMEFRAMES = [
  { area: 'Lagos & Environs', time: '1-2 business days for standard delivery' },
  { area: 'Major Cities (Abuja, Port Harcourt, Kano, Ibadan)', time: '2-4 business days for standard delivery' },
  { area: 'Other States', time: '3-7 business days for standard delivery' },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      title="Shipping Policy"
      sections={[
        {
          heading: 'Shipping Areas',
          body: 'We currently ship to all states in Nigeria. Our primary distribution centers are located in Lagos, Abuja, and Port Harcourt to ensure faster delivery times across the country.',
        },
        {
          heading: 'Delivery Timeframes',
          body: (
            <div className="flex flex-col gap-4">
              {DELIVERY_TIMEFRAMES.map((item) => (
                <div key={item.area} className="pl-4 border-l-4 border-sky-700 flex flex-col gap-1">
                  <p className="text-zinc-900 text-lg md:text-xl font-semibold font-['Onest']">{item.area}</p>
                  <p className="text-zinc-500 text-lg md:text-xl font-['Onest']">{item.time}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: 'Shipping Costs',
          body: (
            <div className="flex flex-col gap-4">
              <p>Shipping costs are calculated based on the weight and dimensions of your order, as well as your delivery location. The exact shipping cost will be displayed at checkout before you complete your purchase.</p>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-sky-700 text-lg md:text-xl font-medium font-['Onest']">Free Shipping on orders above ₦500,000 within Lagos</p>
              </div>
            </div>
          ),
        },
        {
          heading: 'Order Tracking',
          body: "Once your order has been shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package's journey to your doorstep through our website or the courier's tracking portal.",
        },
        {
          heading: 'Damaged or Lost Packages',
          body: 'If your package arrives damaged or goes missing during transit, please contact our customer support team within 48 hours of the expected delivery date. We will work with the courier to investigate and resolve the issue promptly. You may be eligible for a replacement or full refund.',
        },
        {
          heading: 'Delivery & Installation',
          body: (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-zinc-900 text-lg md:text-xl font-semibold font-['Onest'] mb-2">Delivery</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                  {['Available nationwide', 'Delivery fees vary by location', 'Timelines will be communicated at order confirmation'].map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-zinc-900 text-lg md:text-xl font-semibold font-['Onest'] mb-2">Installation</p>
                <ul className="list-disc pl-5 flex flex-col gap-1.5">
                  {['Installation is not mandatory through PRAG', 'Customers are responsible for ensuring proper installation'].map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            </div>
          ),
        },
        {
          heading: 'Disclaimer',
          body: (
            <div className="flex flex-col gap-2">
              <p>PRAG is not liable for issues resulting from:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Poor installation', 'Incorrect system configuration', 'Load mismatch'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our shipping policy, please contact our customer support team at{' '}
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
