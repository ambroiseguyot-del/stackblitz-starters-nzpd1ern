"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Chemin corrigé vers la racine
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', alignItems: 'center', backgroundColor: 'white' }}>
      <Link href="/app" style={{ fontWeight: 'bold', fontSize: '1.5rem', textDecoration: 'none', color: '#1a1a1a italic' }}>
        BabyBudget <span style={{ color: 'red' }}>Executive</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {/* On affiche ces liens uniquement si l'utilisateur est connecté */}
        {user && (
          <>
            <Link href="/app" style={{ textDecoration: 'none', color: '#666' }}>🚀 Dashboard</Link>
            <Link href="/analyse" style={{ textDecoration: 'none', color: '#666', fontWeight: 'bold' }}>📊 Analyse</Link>
          </>
        )}
        
        {!user ? (
          <Link href="/login" style={{ textDecoration: 'none', color: '#666' }}>🔓 Connexion</Link>
        ) : (
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
}