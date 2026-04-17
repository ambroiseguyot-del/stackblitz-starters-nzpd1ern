import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: 'black' }}>
        Mon App
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/">Accueil</Link>
        {/* Voici le nouveau bouton */}
        <Link href="/analyse" style={{ color: '#0070f3', fontWeight: 'bold' }}>📊 Analyse</Link> 
        
        <Link href="/login">Connexion</Link>
        <Link href="/signup" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', textDecoration: 'none' }}>
          S'inscrire
        </Link>
      </div>
    </nav>
  );
}