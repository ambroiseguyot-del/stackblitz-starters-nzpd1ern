'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSignUp} style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Inscription</h2>
        {sent ? <p>Merci ! Vérifiez vos emails.</p> : (
          <>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
            <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
            <button type="submit" style={{ width: '100%', padding: '0.7rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Créer mon compte</button>
          </>
        )}
        <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Déjà un compte ? <Link href="/login">Se connecter</Link></p>
      </form>
    </div>
  );
}
