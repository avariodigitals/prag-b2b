import Link from 'next/link';

interface Props {
  tags: string[];
}

export default function SolutionProductTags({ tags }: Props) {
  const normalizedTags = tags.map((tag) => tag.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {normalizedTags.map((tag) => (
          <Link
            key={tag}
            href={`/products?q=${encodeURIComponent(tag)}`}
            className="px-2 py-1 rounded text-[#0166a5] bg-sky-50 text-[12px] font-medium font-['Space_Grotesk'] leading-[14px] transition-colors hover:bg-sky-100"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
