import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Baby Budget — Votre budget familial',
    short_name: 'Baby Budget',
    description: 'Suivez et anticipez les dépenses de vos enfants.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    background_color: '#F8F8F4',
    theme_color: '#16443D',
    icons: [
      { src: '/brand-symbol.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
