'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="bb-page-shell" role="alert">
      <h1>Une erreur est survenue</h1>
      <p>Impossible d'afficher cette page. Vous pouvez réessayer sans modifier vos données enregistrées.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
        <button type="button" onClick={() => reset()}>Réessayer</button>
        <Link href="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
