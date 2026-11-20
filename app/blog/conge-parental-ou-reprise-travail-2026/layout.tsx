import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Congé parental ou reprise du travail en 2026 : simulation et PreParE',
  description: 'Reprendre à temps plein, à 80 % ou prendre un congé parental ? Montants PreParE 2026, nouveau congé de naissance, exemples de budgets et pièges à éviter.',
  keywords: ['congé parental ou reprise travail', 'PreParE 2026', 'reprise travail bébé rentabilité', 'congé supplémentaire naissance 2026', 'temps partiel bébé coût'],
  alternates: { canonical: '/blog/conge-parental-ou-reprise-travail-2026' },
  openGraph: {
    type: 'article', title: 'Congé parental ou reprise du travail : quelle solution est la plus rentable en 2026 ?',
    description: 'Simulations de revenus disponibles, PreParE, garde et congé de naissance.',
    url: 'https://www.babybudget.fr/blog/conge-parental-ou-reprise-travail-2026',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — comparer congé parental et reprise du travail' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};
export default function ArticleLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
