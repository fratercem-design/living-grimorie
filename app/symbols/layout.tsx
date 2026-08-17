import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Symbols',
  description: 'The most referenced occult symbol database. Every glyph — its history, magical uses, psychological meaning, and connections to every tradition that touched it.',
  alternates: { canonical: '/symbols' },
  openGraph: {
    title: 'Chamber of Symbols — The Living Grimoire',
    description: 'The most referenced occult symbol database. Every glyph — its history, magical uses, psychological meaning, and connections to every tradition that touched it.',
    url: '/symbols',
    type: 'website',
  },
};

export default function SymbolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
