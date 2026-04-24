import './globals.css';
import Navbar from '../components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // ── Titre & description ──────────────────────────────────────────────────
  title: {
    default: 'BabyBudget — Suivez les dépenses de votre bébé',
    template: '%s | BabyBudget',
  },
  description: 'Suivez et anticipez les dépenses de votre bébé. Comparez-vous à la moyenne nationale INSEE/CAF, calculez vos aides et pilotez votre budget familial. Gratuit, sans publicité.',

  // ── Mots-clés ────────────────────────────────────────────────────────────
  keywords: [
    'budget bébé', 'dépenses bébé', 'coût bébé', 'budget famille',
    'aides CAF naissance', 'PAJE', 'calculateur budget bébé',
    'suivi dépenses enfant', 'comparaison nationale bébé', 'coût premier enfant',
  ],

  // ── Auteur & robots ──────────────────────────────────────────────────────
  authors: [{ name: 'BabyBudget', url: 'https://www.babybudget.fr' }],
  creator: 'BabyBudget',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // ── URL canonique ────────────────────────────────────────────────────────
  metadataBase: new URL('https://www.babybudget.fr'),
  alternates: { canonical: '/' },

  // ── Open Graph (partage Facebook, LinkedIn, WhatsApp) ────────────────────
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.babybudget.fr',
    siteName: 'BabyBudget',
    title: 'BabyBudget — Suivez les dépenses de votre bébé',
    description: 'Suivez et anticipez les dépenses de votre bébé. Comparez-vous à la moyenne nationale INSEE/CAF et pilotez votre budget familial. Gratuit, sans publicité.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BabyBudget — Tableau de bord des dépenses bébé',
      },
    ],
  },

  // ── Twitter Card (partage sur X/Twitter) ─────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'BabyBudget — Suivez les dépenses de votre bébé',
    description: 'Suivez et anticipez les dépenses de votre bébé. Comparez-vous à la moyenne nationale. Gratuit.',
    images: ['/og-image.png'],
  },

  // ── Icônes ───────────────────────────────────────────────────────────────
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  // ── Vérification Google Search Console ───────────────────────────────────
  // Décommente et remplace par ton code de vérification Google après inscription
  // verification: { google: 'TON_CODE_VERIFICATION_GOOGLE' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}