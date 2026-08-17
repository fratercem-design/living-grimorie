import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Inner Gate',
  description: 'Your private sanctum — initiation degree, akashic points, and the readings and dreams you have recorded.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/sanctum' },
  openGraph: {
    title: 'The Inner Gate — The Living Grimoire',
    description: 'Your private sanctum — initiation degree, akashic points, and the readings and dreams you have recorded.',
    url: '/sanctum',
    type: 'website',
  },
};

export default function SanctumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
