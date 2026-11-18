import './globals.css';
import Navbar from '../components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // ── Titre & description ──────────────────────────────────────────────────
  title: {
    default: 'Baby Budget — Suivez les dépenses de votre bébé',
    template: '%s | BabyBudget',
  },
  description: 'Suivez les dépenses de votre enfant, anticipez votre budget familial et visualisez vos habitudes en toute simplicité. Application gratuite et sans publicité.',

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
    siteName: 'Baby Budget',
    title: 'BabyBudget — Suivez les dépenses de votre bébé',
    description: 'Un espace clair et pratique pour suivre les dépenses et anticiper votre budget familial. Gratuit, sans publicité.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Baby Budget — Body et graphique de croissance, suivez et anticipez les dépenses de votre enfant',
      },
    ],
  },

  // ── Twitter Card (partage sur X/Twitter) ─────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'BabyBudget — Suivez les dépenses de votre bébé',
    description: 'Suivez les dépenses et anticipez votre budget familial. Gratuit, sans publicité.',
    images: ['/og-image.png'],
  },

  // ── Icônes ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
        <div id="contenu-principal" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}