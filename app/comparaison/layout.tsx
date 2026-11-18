import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repères de budget bébé — exemples indicatifs',
  description: "Comparez vos dépenses à des exemples de budget fictifs par âge et par catégorie : il ne s'agit pas de moyennes nationales.",
  alternates: { canonical: '/comparaison' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
