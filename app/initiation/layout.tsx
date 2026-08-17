import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Initiation',
  description: 'The mystery school. Seven degrees of occult education. Complete lessons, fulfill quests, and ascend from Seeker to Illuminated.',
  alternates: { canonical: '/initiation' },
  openGraph: {
    title: 'Chamber of Initiation — The Living Grimoire',
    description: 'The mystery school. Seven degrees of occult education. Complete lessons, fulfill quests, and ascend from Seeker to Illuminated.',
    url: '/initiation',
    type: 'website',
  },
};

export default function InitiationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
