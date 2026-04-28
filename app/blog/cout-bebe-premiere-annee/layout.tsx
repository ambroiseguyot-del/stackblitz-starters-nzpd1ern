import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combien coûte un bébé la première année ? Chiffres et conseils 2024 | BabyBudget',
  description: "Couches, lait, mode de garde, équipement... Découvrez le coût réel d'un bébé la première année, poste par poste, avec les chiffres INSEE 2023 et les aides CAF disponibles.",
  keywords: ['coût bébé première année', 'budget bébé', 'dépenses bébé', 'combien coûte un bébé', 'budget famille 2024'],
  openGraph: {
    title: 'Combien coûte un bébé la première année ?',
    description: "Le guide complet des dépenses bébé avec les chiffres INSEE 2023, poste par poste.",
    url: 'https://www.babybudget.fr/blog/cout-bebe-premiere-annee',
  },
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}