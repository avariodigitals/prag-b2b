import Link from 'next/link';

interface Props {
  tags: string[];
}

export default function SolutionProductTags({ tags }: Props) {
  const normalizedTags = tags.map((tag) => tag.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {normalizedTags.map((tag) => (
          <Link
            key={tag}
            href={`/products?q=${encodeURIComponent(tag)}`}
            className="px-3 py-1 rounded-full border border-zinc-300 text-zinc-600 text-xs font-['Montserrat'] transition-colors hover:border-sky-700 hover:text-sky-700"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
