import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Living Grimoire',
    short_name: 'Grimoire',
    description:
      'A constantly evolving digital grimoire. Explore hidden knowledge through initiation, symbolism, divination, AI interaction, and discovery.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05010a',
    theme_color: '#ff00cc',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
