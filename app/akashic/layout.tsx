import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Akashic Archive',
  description: 'Search the whole grimoire at once — tarot cards, symbols, entities and concepts, cross-linked by the connections between them.',
  alternates: { canonical: '/akashic' },
  openGraph: {
    title: 'The Akashic Archive — The Living Grimoire',
    description: 'Search the whole grimoire at once — tarot cards, symbols, entities and concepts, cross-linked by the connections between them.',
    url: '/akashic',
    type: 'website',
  },
};

export default function AkashicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
