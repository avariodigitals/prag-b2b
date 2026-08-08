import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';

export const metadata: Metadata = { title: 'Privacy Policy', alternates: { canonical: 'https://www.prag.global/privacy' } };

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      title="Privacy Policy"
      sections={[
        {
          heading: '',
          body: 'We respect your privacy and are committed to protecting your personal data.',
        },
        {
          heading: 'Information We Collect',
          body: (
            <div className="flex flex-col gap-2">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Name, phone number, email', 'Delivery address', 'Transaction details', 'Website usage data (cookies, analytics)'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'How We Use Your Information',
          body: (
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              {['Order processing', 'Customer support', 'Service updates', 'Marketing and promotions'].map((i) => <li key={i}>{i}</li>)}
            </ul>
          ),
        },
        {
          heading: 'Data Protection',
          body: (
            <p>
              Your data is handled in accordance with the{' '}
              <a href="https://ndpb.gov.ng/nigeria-data-protection-act/" target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
                Nigeria Data Protection Act
              </a>.
            </p>
          ),
        },
        {
          heading: 'Third-Party Sharing',
          body: (
            <div className="flex flex-col gap-2">
              <p>We may share data with:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                {['Payment providers', 'Logistics partners', 'Marketing platform'].map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our privacy policy, please contact our customer support team at{' '}
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
