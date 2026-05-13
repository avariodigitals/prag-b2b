import Link from 'next/link';
import NotFoundLogger from '@/components/NotFoundLogger';

export default function NotFound() {
  return (
    <main className="w-full bg-white flex flex-col flex-1 min-h-[70vh] justify-center items-center px-6 py-20 text-center gap-8">
      <NotFoundLogger />
      <span className="text-sky-700 text-[120px] md:text-[180px] font-bold font-['Montserrat'] leading-none">404</span>
      <h1 className="text-zinc-900 text-2xl md:text-4xl font-bold font-['Montserrat']">Page Not Found</h1>
      <p className="max-w-md text-zinc-500 text-lg md:text-xl font-['Montserrat'] leading-relaxed">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved, deleted, or the URL might be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="px-8 py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-base font-semibold font-['Montserrat'] rounded-full transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/contact"
          className="px-8 py-3.5 border border-sky-700 text-sky-700 hover:bg-sky-50 text-base font-semibold font-['Montserrat'] rounded-full transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </main>
  );
}
