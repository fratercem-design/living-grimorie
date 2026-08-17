import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chamber of Spirits',
  description: 'Encyclopedia of beings beyond the mortal threshold. Angels, demons, deities, and mythological entities mapped in their full complexity and inter-relationship.',
  alternates: { canonical: '/spirits' },
  openGraph: {
    title: 'Chamber of Spirits — The Living Grimoire',
    description: 'Encyclopedia of beings beyond the mortal threshold. Angels, demons, deities, and mythological entities mapped in their full complexity and inter-relationship.',
    url: '/spirits',
    type: 'website',
  },
};

export default function SpiritsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
