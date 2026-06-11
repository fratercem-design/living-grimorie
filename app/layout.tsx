import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? 'https://living-grimorie-production.up.railway.app'),
  title: {
    default: 'The Living Grimoire',
    template: '%s — The Living Grimoire',
  },
  description: 'A constantly evolving digital grimoire. Explore hidden knowledge through initiation, symbolism, divination, AI interaction, and discovery.',
  keywords: 'occult, grimoire, tarot, alchemy, kabbalah, divination, mysticism, esoteric',
  openGraph: {
    title: 'The Living Grimoire',
    description: 'Enter the digital grimoire. Seven chambers await.',
    type: 'website',
    siteName: 'The Living Grimoire',
  },
  twitter: {
    card: 'summary',
    title: 'The Living Grimoire',
    description: 'Enter the digital grimoire. Seven chambers await.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full void-bg antialiased overflow-x-hidden">
        {/* CRT Effects */}
        <div className="crt-overlay" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        {/* Star Field */}
        <StarField />

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

function StarField() {
  // Generate deterministic stars for SSR
  const stars = Array.from({ length: 80 }, (_, i) => {
    const seed = (i * 137.508 + 23.4) % 100; // deterministic pseudo-random
    const x = ((i * 13 + seed) % 100).toFixed(2);
    const y = ((i * 7.3 + seed * 0.5) % 100).toFixed(2);
    const size = ((i % 3) + 0.5).toFixed(1);
    const duration = (3 + (i % 6)).toFixed(1);
    const delay = (-(i % 8)).toFixed(1);
    const minOpacity = (0.1 + (i % 3) * 0.1).toFixed(1);
    const maxOpacity = (0.4 + (i % 5) * 0.1).toFixed(1);
    const hue = i % 3 === 0 ? '#ff00cc' : i % 3 === 1 ? '#00e5ff' : '#e8d5ff';

    return { x, y, size, duration, delay, minOpacity, maxOpacity, hue };
  });

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.hue,
            ['--duration' as string]: `${star.duration}s`,
            ['--delay' as string]: `${star.delay}s`,
            ['--min-opacity' as string]: star.minOpacity,
            ['--max-opacity' as string]: star.maxOpacity,
          }}
        />
      ))}
    </div>
  );
}
