import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of AI Oracles',
  description: 'Seven AI entities speak from seven traditions. Ask the same question to Hermes and to Jung and to the anonymous Alchemist — receive seven different truths.',
  alternates: { canonical: '/oracles' },
  openGraph: {
    title: 'Chamber of AI Oracles — The Living Grimoire',
    description: 'Seven AI entities speak from seven traditions. Ask the same question to Hermes and to Jung and to the anonymous Alchemist — receive seven different truths.',
    url: '/oracles',
    type: 'website',
  },
};

export default function OraclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
