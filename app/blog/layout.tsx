import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal — Budget bébé, dépenses et aides CAF',
  description: 'Guides pratiques sourcés pour anticiper le coût d’un bébé, les dépenses de la première année et les aides CAF. Méthodes transparentes et simulateur gratuit.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Le journal Baby Budget — Préparer le budget d’un enfant',
    description: 'Des guides concrets, des chiffres officiels vérifiés et un outil gratuit pour anticiper le budget familial.',
    url: 'https://www.babybudget.fr/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — Body et graphique de croissance' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
