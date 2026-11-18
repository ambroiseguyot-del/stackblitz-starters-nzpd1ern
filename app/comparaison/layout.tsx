import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repères budgétaires pour les familles',
  description: "Comparez votre budget à des hypothèses illustratives par tranche d'âge et par catégorie.",
  alternates: { canonical: '/comparaison' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
