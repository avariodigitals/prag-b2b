import Link from 'next/link';

interface Section {
  heading: string;
  body: React.ReactNode;
}

interface Props {
  title: string;
  sections: Section[];
}

export default function PolicyPageLayout({ title, sections }: Props) {
  return (
    <main className="w-full flex flex-col">
      {/* Breadcrumb + title */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-3 md:gap-5">
        <div className="flex items-center gap-1 flex-wrap">
          <Link href="/" className="text-sky-700 text-sm font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-400 text-sm font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-sm font-['Onest']">{title}</span>
        </div>
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Onest']">{title}</h1>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <div className="w-full max-w-3xl p-5 md:p-10 bg-white rounded-2xl border border-zinc-100 flex flex-col gap-8 md:gap-10">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-3 md:gap-4">
              <h2 className="text-zinc-900 text-lg md:text-2xl font-semibold font-['Onest']">{section.heading}</h2>
              <div className="text-zinc-600 text-sm md:text-base font-['Space_Grotesk'] leading-relaxed">{section.body}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
