import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Seven Chambers',
  description: 'Seven chambers of the digital grimoire — divination, dreams, spirits, symbols, synchronicities, initiation, and the AI oracles. Choose where to descend.',
  alternates: { canonical: '/chambers' },
  openGraph: {
    title: 'The Seven Chambers — The Living Grimoire',
    description: 'Seven chambers of the digital grimoire — divination, dreams, spirits, symbols, synchronicities, initiation, and the AI oracles. Choose where to descend.',
    url: '/chambers',
    type: 'website',
  },
};

export default function ChambersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
