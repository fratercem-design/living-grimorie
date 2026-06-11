import type { MetadataRoute } from 'next';

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'https://living-grimorie-production.up.railway.app';

const ROUTES = [
  '', '/chambers', '/divination', '/dreams', '/spirits', '/symbols',
  '/synchronicities', '/initiation', '/oracles', '/akashic',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
