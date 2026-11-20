import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.babybudget.fr';
  const pages = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/budget', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/comparaison', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/informations', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/blog/aides-caf-bebe-2026', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/cout-bebe-premiere-annee', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/creche-ou-assistante-maternelle-2026', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/15-achats-indispensables-avant-bebe', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/conge-parental-ou-reprise-travail-2026', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/livret-a-enfant-epargne-naissance', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/cgu', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/confidentialite', priority: 0.2, changeFrequency: 'yearly' as const },
  ];
  return pages.map(page => ({
    url: base + page.path,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
