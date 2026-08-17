import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Synchronicities',
  description: 'Record strange coincidences. The system finds global patterns. A collective unconscious experiment in real time — what is the universe trying to say?',
  alternates: { canonical: '/synchronicities' },
  openGraph: {
    title: 'Chamber of Synchronicities — The Living Grimoire',
    description: 'Record strange coincidences. The system finds global patterns. A collective unconscious experiment in real time — what is the universe trying to say?',
    url: '/synchronicities',
    type: 'website',
  },
};

export default function SynchronicitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
