import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Divination',
  description: 'Peer through the veil of time. Draw the cards, cast the runes, consult the I Ching. Each reading becomes a permanent page in your personal grimoire.',
  alternates: { canonical: '/divination' },
  openGraph: {
    title: 'Chamber of Divination — The Living Grimoire',
    description: 'Peer through the veil of time. Draw the cards, cast the runes, consult the I Ching. Each reading becomes a permanent page in your personal grimoire.',
    url: '/divination',
    type: 'website',
  },
};

export default function DivinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
