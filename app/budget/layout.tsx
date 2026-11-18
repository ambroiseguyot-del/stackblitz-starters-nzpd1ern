import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Préparer son budget bébé',
  description: 'Simulez des scénarios de dépenses pour votre enfant, avec des hypothèses présentées clairement.',
  alternates: { canonical: '/budget' },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
