import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '15 achats indispensables avant bébé : checklist, sécurité et économies',
  description: 'Liste de naissance utile : couchage, vêtements, change, transport, alimentation. 15 besoins concrets, achats à éviter et sécurité vérifiée auprès d’Ameli et de la DGCCRF.',
  keywords: ['achats indispensables bébé', 'liste naissance essentielle', 'équipement bébé à éviter', 'checklist naissance', 'budget puériculture 2026'],
  alternates: { canonical: '/blog/15-achats-indispensables-avant-bebe' },
  openGraph: {
    type: 'article', title: 'Les 15 achats indispensables avant l’arrivée de bébé',
    description: 'Choisir l’essentiel, différer les gadgets et préserver la sécurité et le budget.',
    url: 'https://www.babybudget.fr/blog/15-achats-indispensables-avant-bebe',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Baby Budget — préparer la liste de naissance' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};
export default function ArticleLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
