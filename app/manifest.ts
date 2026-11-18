import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BabyBudget — Votre budget familial',
    short_name: 'BabyBudget',
    description: 'Suivez et anticipez les dépenses de vos enfants.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#F8F8F4',
    theme_color: '#16443D',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
