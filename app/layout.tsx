import type { Metadata, Viewport } from 'next';
import { Onest, Space_Grotesk, DM_Sans } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';
import './globals.css';
import CookieConsentLoader from '@/components/CookieConsentLoader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChatWidget from '@/components/WhatsAppChatWidget';
import { getB2BPublicContent } from '@/lib/b2bContent';

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-onest',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "PRAG - Nigeria's Leading Power Engineering Company.",
    template: '%s - PRAG',
  },
  description: 'Enterprise power engineering solutions across Nigeria.',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getB2BPublicContent();
  const settings = content?.settings;
  const launch = settings?.launch;
  const scripts = settings?.scripts;
  const integrations = settings?.integrations;
  const launchEnabled = Boolean(launch?.enabled);
  const launchTitle = launch?.title?.trim() || 'Launching Soon';
  const launchMessage = launch?.message?.trim() || 'We are preparing updates. Please check back shortly.';
  const gaId = integrations?.googleAnalyticsId?.trim() || 'G-K0XL81C7CK';
  const gtmId = integrations?.googleTagManagerId?.trim() || '';
  const searchConsoleVerification = integrations?.searchConsoleVerification?.trim() || '';
  const zohoOneScript = integrations?.zohoOneScript?.trim() || '';
  const customDomainHook = integrations?.customDomainHook?.trim() || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://central.prag.global" />
        <link rel="dns-prefetch" href="https://central.prag.global" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {searchConsoleVerification && (
          <meta name="google-site-verification" content={searchConsoleVerification} />
        )}
        {gtmId && (
          <Script
            id="b2b-gtm-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script
              id="b2b-ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${onest.variable} ${spaceGrotesk.variable} ${dmSans.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <CookieConsentLoader />
        {scripts?.head && <script dangerouslySetInnerHTML={{ __html: scripts.head }} />}
        {!launchEnabled && <Header settings={settings} />}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {scripts?.body && <script dangerouslySetInnerHTML={{ __html: scripts.body }} />}
        {zohoOneScript && <script dangerouslySetInnerHTML={{ __html: zohoOneScript }} />}
        <div className="flex-1 flex flex-col">
          {launchEnabled ? (
            <main className="flex-1 flex items-center justify-center px-6 py-20 bg-stone-50">
              <div className="max-w-xl w-full text-center rounded-2xl border border-zinc-200 bg-white p-8 md:p-10">
                <div className="mx-auto mb-5 relative w-28 h-9">
                  <Image
                    src="https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png"
                    alt="PRAG B2B"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Onest']">{launchTitle}</h1>
                <p className="mt-4 text-zinc-600 text-lg md:text-xl font-['Onest']">{launchMessage}</p>
              </div>
            </main>
          ) : (
            children
          )}
        </div>
        {!launchEnabled && <WhatsAppChatWidget settings={settings} />}
        {!launchEnabled && <Footer settings={settings} />}
        {scripts?.footer && <script dangerouslySetInnerHTML={{ __html: scripts.footer }} />}
        {customDomainHook && <script dangerouslySetInnerHTML={{ __html: customDomainHook }} />}
      </body>
    </html>
  );
}
