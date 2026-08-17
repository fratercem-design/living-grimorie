import type { MetadataRoute } from 'next';
import { SITE_URL as BASE_URL } from '@/lib/site';

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
