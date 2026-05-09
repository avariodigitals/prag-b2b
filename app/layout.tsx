import type { Metadata } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const onest = Onest({ subsets: ['latin'], variable: '--font-onest', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

export const metadata: Metadata = {
  title: 'Prag B2B – Power Solutions for Businesses',
  description: 'Enterprise power engineering solutions across Nigeria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
