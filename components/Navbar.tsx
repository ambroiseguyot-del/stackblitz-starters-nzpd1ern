import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #eee' }}>
      <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: 'black' }}>MonSaaS</Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/">Accueil</Link>
        <Link href="/login">Connexion</Link>
        <Link href="/signup" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', textDecoration: 'none' }}>Commencer</Link>
      </div>
    </nav>
  );
}