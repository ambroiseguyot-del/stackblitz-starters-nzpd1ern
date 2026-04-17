"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client'; // Vérifie bien ce chemin
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Vérifier la session actuelle au chargement
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    // 2. Ecouter les changements (connexion / déconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee', alignItems: 'center' }}>
      <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: 'black' }}>
        Mon App
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/">Accueil</Link>

        {/* --- CONDITION : Si l'utilisateur est connecté --- */}
        {user ? (
          <>
            <Link href="/analyse" style={{ color: '#0070f3', fontWeight: 'bold' }}>📊 Analyse</Link>
            <button 
              onClick={handleLogout}
              style={{ fontSize: '0.9rem', color: '#666', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          /* --- CONDITION : Si l'utilisateur est déconnecté --- */
          <>
            <Link href="/login">Connexion</Link>
            <Link href="/signup" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}