import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guides et démarches pour les parents',
  description: 'Une feuille de route pratique et des ressources pour préparer vos dépenses familiales.',
  alternates: { canonical: '/informations' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
