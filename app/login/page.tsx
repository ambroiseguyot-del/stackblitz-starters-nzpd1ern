'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
    else router.push('/app');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Connexion</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <button type="submit" style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Se connecter</button>
        <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Pas de compte ? <Link href="/signup">S'inscrire</Link></p>
      </form>
    </div>
  );
}