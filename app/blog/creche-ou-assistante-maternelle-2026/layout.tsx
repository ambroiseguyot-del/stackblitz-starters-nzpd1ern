import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Crèche ou assistante maternelle en 2026 : prix, CMG, crédit d’impôt',
  description: 'Crèche PSU ou assistante maternelle : barème CAF 2026, réforme CMG, frais annexes et crédit d’impôt. Méthode chiffrée et sources officielles.',
  keywords: ['crèche ou assistante maternelle 2026', 'coût crèche 2026', 'prix assistante maternelle', 'CMG 2026', 'reste à charge mode de garde'],
  alternates: { canonical: '/blog/creche-ou-assistante-maternelle-2026' },
  openGraph: {
    type: 'article', title: 'Crèche ou assistante maternelle : quel mode de garde coûte le moins cher en 2026 ?',
    description: 'Barème crèche PSU, CMG emploi direct, crédit d’impôt et comparaison des coûts réels.',
    url: 'https://www.babybudget.fr/blog/creche-ou-assistante-maternelle-2026',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — comparer les coûts des modes de garde en 2026' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};
export default function ArticleLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
