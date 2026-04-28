import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Conseils budget bébé & famille | BabyBudget',
  description: 'Guides pratiques, chiffres sourcés et conseils concrets pour anticiper et maîtriser le budget de votre bébé. Rédigés par des experts, basés sur les données INSEE et CAF.',
  openGraph: {
    title: 'Blog BabyBudget — Conseils budget bébé & famille',
    description: 'Guides pratiques pour anticiper et maîtriser le budget de votre bébé.',
    url: 'https://www.babybudget.fr/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}