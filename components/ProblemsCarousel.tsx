'use client';

import { useState } from 'react';

interface Problem {
  title: string;
  body: string;
  impact: string[];
  solution: string[];
}

const ICON = (
  <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const VISIBLE = 3;

function ProblemCard({
  problem,
  active,
  onClick,
}: {
  problem: Problem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-2xl border flex flex-col gap-4 transition-all duration-300 focus:outline-none ${
        active
          ? 'bg-white border-sky-300 shadow-md'
          : 'bg-white border-zinc-200 hover:border-sky-200'
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${active ? 'border-sky-400 bg-sky-50' : 'border-sky-200'}`}>
        {ICON}
      </div>

      {/* Title — always visible */}
      <h3 className={`text-lg font-semibold font-['Onest'] leading-snug transition-colors duration-200 ${active ? 'text-sky-700' : 'text-zinc-900'}`}>
        {problem.title}
      </h3>

      {/* Body — always visible */}
      <p className="text-zinc-500 text-sm font-['Space_Grotesk'] leading-relaxed">
        {problem.body}
      </p>
    </button>
  );
}

export default function ProblemsCarousel({ problems }: { problems: Problem[] }) {
  // pageStart = which group of VISIBLE cards we're showing
  const [pageStart, setPageStart] = useState(0);
  // activeIndex = which problem card is expanded (global index)
  const [activeIndex, setActiveIndex] = useState(0);

  const maxStart = Math.max(0, problems.length - VISIBLE);
  const visibleProblems = problems.slice(pageStart, pageStart + VISIBLE);

  const handleDot = (i: number) => {
    const newStart = Math.min(i, maxStart);
    setPageStart(newStart);
    // If the clicked dot's problem isn't active, activate it
    setActiveIndex(i);
  };

  const handleCard = (globalIndex: number) => {
    setActiveIndex(globalIndex);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Desktop: 3 cards side-by-side */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        {visibleProblems.map((p, i) => {
          const globalIndex = pageStart + i;
          return (
            <ProblemCard
              key={p.title}
              problem={p}
              active={activeIndex === globalIndex}
              onClick={() => handleCard(globalIndex)}
            />
          );
        })}
      </div>

      {/* Mobile: single card at activeIndex, swipe via dots */}
      <div className="md:hidden">
        <ProblemCard
          problem={problems[activeIndex]}
          active={true}
          onClick={() => {}}
        />
      </div>

      {/* Dots — one per problem, navigate pages and activate */}
      <div className="flex items-center justify-center gap-2">
        {problems.map((_, i) => (
          <button
            key={i}
            aria-label={`Problem ${i + 1}`}
            onClick={() => handleDot(i)}
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
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Impact</h2>
          <div className="flex flex-col gap-3 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            {problems[activeIndex].impact.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Solution */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sky-700 text-2xl font-bold font-['Onest']">The Solution</h2>
          <div className="flex flex-col gap-3 text-zinc-700 text-sm font-['Space_Grotesk'] leading-relaxed">
            {problems[activeIndex].solution.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
