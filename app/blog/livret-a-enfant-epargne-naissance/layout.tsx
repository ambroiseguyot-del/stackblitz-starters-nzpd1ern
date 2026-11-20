import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Livret A enfant en 2026 : ouverture, taux et épargne dès la naissance',
  description: 'Ouvrir un Livret A à son bébé : taux 1,7 % depuis août 2026, plafond de 22 950 €, propriété des fonds, versements et simulations pédagogiques sur 18 ans.',
  keywords: ['livret A bébé naissance', 'livret A enfant 2026', 'épargne enfant combien par mois', 'taux livret A 2026', 'ouvrir épargne enfant'],
  alternates: { canonical: '/blog/livret-a-enfant-epargne-naissance' },
  openGraph: {
    type: 'article', title: 'Ouvrir un Livret A à son enfant : combien épargner dès la naissance ?',
    description: 'Taux 2026, intérêts, propriété des fonds et simulations sur dix-huit ans.',
    url: 'https://www.babybudget.fr/blog/livret-a-enfant-epargne-naissance',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — épargne et Livret A pour un enfant' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};
export default function ArticleLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
