import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Bienvenue sur BabyBudget</h1>
        <p>Gérez le budget de votre bébé en toute simplicité.</p>
        <Link href="/signup" style={{ backgroundColor: '#0070f3', color: 'white', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
          Commencer maintenant
        </Link>
      </main>
    </div>
  );
}