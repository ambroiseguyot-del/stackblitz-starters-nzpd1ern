import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aides CAF bébé 2026 : PAJE, prime à la naissance et CMG',
  description: 'Prime de naissance 1 093,08 €, allocation de base PAJE 2026, réforme du CMG : barèmes et conditions vérifiés auprès de la CAF, de l’Urssaf et de Service-Public.',
  keywords: ['aides CAF bébé 2026', 'PAJE 2026', 'prime naissance 2026', 'allocation base PAJE', 'CMG 2026'],
  alternates: { canonical: '/blog/aides-caf-bebe-2026' },
  openGraph: {
    type: 'article',
    title: 'Aides CAF pour bébé en 2026 : montants et démarches',
    description: 'Les montants officiels, les conditions et les liens vers les outils de simulation des organismes compétents.',
    url: 'https://www.babybudget.fr/blog/aides-caf-bebe-2026',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — Guides CAF et budget familial' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};

export default function ArticleAidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
