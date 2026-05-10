import type { Metadata, Viewport } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getB2BPublicContent } from '@/lib/b2bContent';

const onest = Onest({ subsets: ['latin'], variable: '--font-onest', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Prag B2B – Power Solutions for Businesses',
  description: 'Enterprise power engineering solutions across Nigeria.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
  const gaId = integrations?.googleAnalyticsId?.trim() || '';
  const gtmId = integrations?.googleTagManagerId?.trim() || '';
  const searchConsoleVerification = integrations?.searchConsoleVerification?.trim() || '';
  const zohoOneScript = integrations?.zohoOneScript?.trim() || '';
  const customDomainHook = integrations?.customDomainHook?.trim() || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
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
                <p className="mt-4 text-zinc-600 text-sm md:text-base font-['Space_Grotesk']">{launchMessage}</p>
              </div>
            </main>
          ) : (
            children
          )}
        </div>
        {!launchEnabled && <Footer settings={settings} />}
        {scripts?.footer && <script dangerouslySetInnerHTML={{ __html: scripts.footer }} />}
        {customDomainHook && <script dangerouslySetInnerHTML={{ __html: customDomainHook }} />}
      </body>
    </html>
  );
}
