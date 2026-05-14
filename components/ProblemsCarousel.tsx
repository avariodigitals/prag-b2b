'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Problem {
  id: string;
  title: string;
  body: string;
  impact: string[];
  solution: string[];
  image: string;
  technologies: string[];
  productIds?: number[];
  productCategories: string[];
}

interface CarouselProduct {
  id: number;
  name: string;
  slug: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
}

const ICON = (
  <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

function getProblemIcon(problem: Problem): string | null {
  const id = (problem.id || '').toLowerCase();
  if (!id.startsWith('industrial-')) return null;

  if (id.includes('voltage')) return '/images/ix_voltage.svg';
  if (id.includes('downtime')) return '/images/arcticons_chuden-power-outage-infomation.svg';
  if (id.includes('generator')) return '/images/ph_solar-panel-bold.svg';
  if (id.includes('quality')) return '/images/streamline-plump_disable-protection-remix.svg';
  return '/images/ix_voltage.svg';
}

function ProblemCard({
  problem,
  active,
  onClick,
}: {
  problem: Problem;
  active: boolean;
  onClick: () => void;
}) {
  const iconSrc = getProblemIcon(problem);

  return (
    <button
      onClick={onClick}
      className={`w-full min-h-[270px] md:min-h-[300px] text-left p-6 rounded-2xl border flex flex-col transition-all duration-300 focus:outline-none ${
        active
          ? 'bg-[#F9F9F9] border-[#0166A5] shadow-md'
          : 'bg-[#F9F9F9] border-zinc-200 hover:border-[#0166A5]'
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 flex items-center justify-start shrink-0">
        {iconSrc ? (
          <Image src={iconSrc} alt="" width={36} height={36} className="w-9 h-9 object-contain" aria-hidden="true" />
        ) : (
          ICON
        )}
      </div>

      {/* Title — always visible */}
      <h3 className={`mt-4 w-full max-w-full break-words text-[24px] font-medium font-['Onest'] leading-[1] tracking-[0] min-h-[48px] md:min-h-[40px] transition-colors duration-200 ${active ? 'text-sky-700' : 'text-zinc-900'}`}>
        {problem.title}
      </h3>

      {/* Body — anchored to the bottom with consistent start position */}
      <div className="mt-auto w-full">
        <p className="text-zinc-600 text-[18px] font-normal font-['Onest'] leading-[1] tracking-[0]">
          {problem.body}
        </p>
      </div>
    </button>
  );
}

export default function ProblemsCarousel({
  problems,
  products,
  recommendedProductsByProblem,
}: {
  problems: Problem[];
  products: CarouselProduct[];
  recommendedProductsByProblem?: Record<string, CarouselProduct[]>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });

  if (problems.length === 0) return null;

  const activeProblem = problems[activeIndex];
  const queriedProducts = activeProblem?.id ? (recommendedProductsByProblem?.[activeProblem.id] ?? []) : [];
  const productsByIds = Array.isArray(activeProblem?.productIds) && activeProblem.productIds.length > 0
    ? products.filter((product) => activeProblem.productIds?.includes(product.id))
    : [];
  const filteredProducts = (queriedProducts.length > 0
    ? queriedProducts
    : productsByIds.length > 0
    ? productsByIds
    : products.filter((product) =>
      product.categories?.some((cat) => activeProblem.productCategories.includes(cat.slug))
    ))
    .slice(0, 4);
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 4);

  const handleCard = (index: number) => {
    setActiveIndex(index);
    const card = trackRef.current?.children?.[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const syncActiveFromScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    const referencePoint = track.scrollLeft + (track.clientWidth * 0.18);
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - referencePoint);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  };

  useEffect(() => {
    syncActiveFromScroll();
  }, [problems.length]);

  const handleTrackMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };
  };

  const handleTrackMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !dragStateRef.current.isDragging) return;
    const delta = event.clientX - dragStateRef.current.startX;
    track.scrollLeft = dragStateRef.current.startScrollLeft - delta;
    syncActiveFromScroll();
  };

  const stopDragging = () => {
    dragStateRef.current.isDragging = false;
  };

  const handleTrackWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 2) return;
    track.scrollLeft += delta;
    syncActiveFromScroll();
    event.preventDefault();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-0 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleTrackMouseDown}
          onMouseMove={handleTrackMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onWheel={handleTrackWheel}
          onScroll={syncActiveFromScroll}
        >
          {problems.map((problem, index) => (
            <div key={problem.id ?? `${problem.title}-${index}`} className="shrink-0 w-full sm:w-[70%] md:w-[52%] lg:w-[34%]">
              <ProblemCard
                problem={problem}
                active={activeIndex === index}
                onClick={() => handleCard(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots — one per problem, indicator only */}
      <div className="flex items-center justify-center gap-2">
        {problems.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
              activeIndex === i ? 'bg-sky-700' : 'bg-zinc-300 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      {/* Dynamic Impact + Solution panel */}
      <div className="mt-6 flex flex-col gap-8 transition-all duration-300">
        {/* Impact */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sky-700 text-[24px] font-medium [font-family:var(--font-space-grotesk)] leading-[28px] tracking-[0]">The Impact</h2>
          <div className="flex flex-col gap-3 text-zinc-700 text-[16px] font-normal [font-family:var(--font-space-grotesk)] leading-[20px] tracking-[0]">
            {activeProblem.impact.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Solution */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sky-700 text-[24px] font-medium [font-family:var(--font-space-grotesk)] leading-[28px] tracking-[0]">The Solution</h2>
          <div className="flex flex-col gap-3 text-zinc-700 text-[16px] font-normal [font-family:var(--font-space-grotesk)] leading-[20px] tracking-[0]">
            {activeProblem.solution.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Image under solution */}
        <div className="w-full rounded-2xl overflow-hidden relative h-[220px] md:h-[360px] lg:h-[440px] bg-[#F9F9F9]">
          <Image
            src={activeProblem.image}
            alt={activeProblem.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>

        {/* Technologies & Products */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sky-700 text-[24px] font-medium [font-family:var(--font-space-grotesk)] leading-[28px] tracking-[0]">Technologies &amp; Products</h2>
          <ul className="flex flex-col gap-3">
            {activeProblem.technologies.map((tech) => (
              <li key={tech} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-700 shrink-0" />
                <span className="text-zinc-700 text-[16px] font-normal [font-family:var(--font-space-grotesk)] leading-[20px] tracking-[0]">{tech}</span>
              </li>
            ))}
          </ul>

          {displayProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayProducts.map((product) => {
                const img = product.images?.[0];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.categories[0]?.slug ?? 'products'}/${product.slug}`}
                    className="aspect-square rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#F9F9F9] hover:shadow-md transition-shadow"
                  >
                    {img ? (
                      <div className="relative w-[58%] h-[58%] md:w-[56%] md:h-[56%]">
                        <Image
                          src={img.src}
                          alt={img.alt || product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                          className="object-contain mix-blend-multiply"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-zinc-200 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
