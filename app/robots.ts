import type { MetadataRoute } from 'next';

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'https://living-grimorie-production.up.railway.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sanctum'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
