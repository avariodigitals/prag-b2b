import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';

export const metadata: Metadata = { title: 'Returns & Refund Policy' };

export default function ReturnPolicyPage() {
  return (
    <PolicyPageLayout
      title="Returns & Refund Policy"
      sections={[
        {
          heading: 'Return Eligibility',
          body: (
            <div className="flex flex-col gap-2">
              <p>Returns are accepted only where:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['The product is unused', 'The product is in original packaging', 'The request is made within 7 days of purchase'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          body: (
            <div className="flex flex-col gap-2">
              <p>The following are not eligible for return:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Installed products', 'Used or damaged products', 'Custom or special-order items'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Refunds',
          body: (
            <div className="flex flex-col gap-2">
              <p>Approved returns may be:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Exchanged, or', 'Refunded via the original payment method'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Important Notice',
          body: (
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <p className="text-sky-700 text-lg md:text-xl font-medium font-['Montserrat']">
                Once a product has been installed, it is deemed accepted and cannot be returned.
              </p>
            </div>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our returns policy, please contact our customer support team at{' '}
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
