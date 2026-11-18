import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app', '/login', '/signup', '/reset-password', '/auth'],
    },
    sitemap: 'https://www.babybudget.fr/sitemap.xml',
  };
}
