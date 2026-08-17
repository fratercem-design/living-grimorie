import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Dreams',
  description: 'Submit your dreams to the collective archive. The AI Oracle analyzes them through Jungian psychology, alchemy, Kabbalah, and mythology. Your dream joins the living Atlas.',
  alternates: { canonical: '/dreams' },
  openGraph: {
    title: 'Chamber of Dreams — The Living Grimoire',
    description: 'Submit your dreams to the collective archive. The AI Oracle analyzes them through Jungian psychology, alchemy, Kabbalah, and mythology. Your dream joins the living Atlas.',
    url: '/dreams',
    type: 'website',
  },
};

export default function DreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
