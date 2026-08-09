/**
 * Shared content-model types for on-page category/solution content.
 *
 * These types are consumed by lib/solutionContent.ts (and the solution-page
 * body renderer). The Step 9 product-category visual content blocks that
 * previously lived here were removed at PRAG's request — product category
 * pages now use the approved hero + product grid layout only, and category
 * FAQs are consolidated on /faq.
 */

export interface CatLink {
  label: string;
  href: string;
}

/** A paragraph is a sequence of text runs; a run is either plain text or a link. */
export type Segment = string | CatLink;

export interface Paragraph {
  segments: Segment[];
}

export interface Section {
  id?: string;
  heading: string;
  paragraphs?: Paragraph[];
  list?: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CategoryContent {
  /** Overrides the generic CMS/fallback H1 for this category. */
  h1: string;
  /** Concise intent-specific introduction shown directly under the H1. */
  intro: string;
  /** Quick category/type navigation chips shown above the grid. */
  quickNav?: CatLink[];
  /** Body sections (H2 + paragraphs/lists) shown above the grid. */
  sections: Section[];
  /** 3–6 FAQs shown after the grid. */
  faqs: Faq[];
  /** One clear primary CTA shown after the FAQs. */
  primaryCta: CatLink;
  /** Optional secondary CTA. */
  secondaryCta?: CatLink;
  /** Contextual proof links — only where a real relevant project exists. */
  proofLinks?: CatLink[];
}
