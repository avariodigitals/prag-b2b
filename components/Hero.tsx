import Link from 'next/link';

async function getHeroImage() {
  const baseUrl = process.env.NEXT_PUBLIC_B2B_ADMIN_PUBLIC_URL;
  if (!baseUrl) return 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg';

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/public/b2b-content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg';
    const data = await res.json();
    const pages = Array.isArray(data?.pages)
      ? (data.pages as Array<{ route?: string; sections?: Array<{ type?: string; imageUrl?: string }> }>)
      : [];
    const heroPage = pages.find((page) => page.route === '/' || page.route === '/home' || page.route === '');
    const imageUrl = heroPage?.sections?.find((section: { type?: string; imageUrl?: string }) => section.type === 'hero')?.imageUrl;
    return imageUrl || 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg';
  } catch {
    return 'https://central.prag.global/wp-content/uploads/2026/05/pragrite-1.jpg';
  }
}

export default async function Hero() {
  const heroImage = await getHeroImage();
  return (
    <section
      className="relative w-full min-h-[84vh] md:min-h-[88vh] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url('${heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold font-['Onest'] leading-tight">
          Unstable Power?<br />We Fix It Permanently.
        </h1>
        <p className="text-white/80 text-base md:text-lg font-['Space_Grotesk'] max-w-xl">
          We design, install, and support reliable power systems for homes, businesses, and industries across Nigeria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href="/contact"
            className="px-6 py-3 bg-sky-700 text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-sky-800 transition-colors"
          >
            Get a Free Power Assessment
          </Link>
          <a
            href="https://wa.me/2348032170129"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-transparent border border-white text-white text-sm font-semibold font-['Space_Grotesk'] rounded-full hover:bg-white hover:text-zinc-900 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
