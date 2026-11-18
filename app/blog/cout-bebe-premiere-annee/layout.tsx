import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combien coûte un bébé la première année ? Budget et méthode 2026',
  description: 'Couches, alimentation, équipement, mode de garde : comment construire un budget réaliste pour la première année ? Exemples illustratifs et références officielles.',
  keywords: ['coût bébé première année', 'budget bébé 2026', 'dépenses bébé', 'combien coûte un bébé', 'budget jeune parent'],
  alternates: { canonical: '/blog/cout-bebe-premiere-annee' },
  openGraph: {
    type: 'article',
    title: 'Combien coûte un bébé la première année ?',
    description: 'Une méthode transparente pour anticiper les dépenses de la naissance à un an.',
    url: 'https://www.babybudget.fr/blog/cout-bebe-premiere-annee',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — Prévoir les dépenses de la première année' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
