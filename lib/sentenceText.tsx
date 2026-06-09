import React from 'react';

const ABBREVIATIONS = new Set([
  'dr', 'mr', 'mrs', 'ms', 'prof', 'eg', 'ie', 'etc', 'vs', 'fig', 'no',
  'vol', 'inc', 'ltd', 'corp', 'co', 'jr', 'sr', 'st', 'ave', 'blvd',
  'rd', 'dr', 'no', 'nos', 'pg', 'pp', 'et al', 'et', 'al', 'ca', 'approx',
  'est', 'e', 'g', 'i', 'e',
]);

export function splitSentences(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  const sentences: string[] = [];
  let current = '';

  // Split by period-space or period-newline, capturing the delimiter
  const parts = text.split(/(\.[\s\n]+)/);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    current += part;

    // If this part ends with period + whitespace
    if (/\.[\s\n]+$/.test(part) && i + 1 < parts.length) {
      const nextPart = parts[i + 1];
      const nextChar = nextPart[0];

      // Only break if next starts with uppercase or number (new sentence)
      if (/[A-Z0-9]/.test(nextChar)) {
        const beforePeriod = current.replace(/\.[\s\n]+$/, '').trim();
        const words = beforePeriod.split(/\s+/);
        const lastWordRaw = words[words.length - 1];
        const lastWord = lastWordRaw?.toLowerCase().replace(/[^a-z]/g, '');

        if (!ABBREVIATIONS.has(lastWord)) {
          sentences.push(current.trim());
          current = '';
        }
      }
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences;
}

interface SentenceTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SentenceText({ text, className, as: Tag = 'span' }: SentenceTextProps) {
  if (!text || typeof text !== 'string') return <Tag className={className}>{text}</Tag>;

  const lines = text.split('\n');

  if (lines.length <= 1) {
    const sentences = splitSentences(text);
    if (sentences.length <= 1) {
      return <Tag className={className}>{text}</Tag>;
    }
    return (
      <Tag className={className}>
        {sentences.map((sentence, i) => (
          <React.Fragment key={i}>
            {sentence}
            {i < sentences.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => {
        const sentences = splitSentences(line);
        return (
          <React.Fragment key={lineIndex}>
            {sentences.length <= 1 ? (
              line
            ) : (
              <>
                {sentences.map((sentence, i) => (
                  <React.Fragment key={i}>
                    {sentence}
                    {i < sentences.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </>
            )}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}
