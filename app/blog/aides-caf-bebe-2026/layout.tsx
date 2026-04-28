import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aides CAF bébé 2026 : tout ce à quoi vous avez droit | BabyBudget',
  description: "Prime de naissance 1 084 €, allocation de base 198 €/mois, CMG, nouveau congé supplémentaire de naissance... Guide complet des aides CAF 2026 avec montants officiels revalorisés au 1er avril 2026.",
  keywords: ['aides CAF bébé 2026', 'PAJE 2026', 'CMG 2026', 'prime naissance 2026', 'allocation base PAJE', 'congé supplémentaire naissance 2026', 'allocations familiales 2026'],
  openGraph: {
    title: 'Aides CAF bébé 2026 : tout ce à quoi vous avez droit',
    description: "Guide complet des aides CAF 2026 avec les montants officiels revalorisés — PAJE, CMG, congé supplémentaire de naissance.",
    url: 'https://www.babybudget.fr/blog/aides-caf-bebe-2026',
  },
};

export default function ArticleAidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}