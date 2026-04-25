'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function useGlobalDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

export default function NotFound() {
  const isDark = useGlobalDark();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cv = {
    bg:       isDark ? '#0B0E14' : '#F8FAFC',
    card:     isDark ? '#161B26' : '#FFFFFF',
    border:   isDark ? '#2D364D' : '#E2E8F0',
    text:     isDark ? '#F1F5F9' : '#0F172A',
    textMuted:isDark ? '#94A3B8' : '#64748B',
    accent:   '#6366F1',
  };

  const links = [
    { href: '/app',          emoji: '🚀', label: 'Dashboard',           desc: 'Vos dépenses en un coup d\'œil' },
    { href: '/informations', emoji: '📋', label: 'Guide dépenses',       desc: 'Par âge, étape par étape' },
    { href: '/budget',       emoji: '🧮', label: 'Budget prévisionnel',  desc: 'Calculez vos aides CAF' },
    { href: '/comparaison',  emoji: '🇫🇷', label: 'Comparaison',          desc: 'Vs la moyenne nationale' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: cv.bg, fontFamily: FONT,
      color: cv.text, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.5s ease-out 0.1s both; }
        .fade-2 { animation: fadeUp 0.5s ease-out 0.25s both; }
        .fade-3 { animation: fadeUp 0.5s ease-out 0.4s both; }
        .fade-4 { animation: fadeUp 0.5s ease-out 0.55s both; }
        .nav-link:hover { border-color: #6366F1 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.15); }
        .nav-link { transition: all 0.15s !important; }
        .home-btn:hover { background: #4F46E5 !important; transform: translateY(-1px); }
        .home-btn { transition: all 0.15s !important; }
      `}</style>

      {/* Emoji flottant */}
      <div className="fade-1" style={{ fontSize: 72, marginBottom: 24, display: 'inline-block', animation: 'float 4s ease-in-out infinite' }}>
        👶
      </div>

      {/* 404 */}
      <div className="fade-2">
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: cv.accent, margin: '0 0 12px' }}>
          Erreur 404
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px', color: cv.text }}>
          Cette page n'existe pas
        </h1>
        <p style={{ fontSize: 16, color: cv.textMuted, maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Vous vous êtes perdus en chemin — comme un bébé qui cherche sa tétine à 3h du matin.
        </p>
      </div>

      {/* CTA principal */}
      <div className="fade-3" style={{ marginBottom: 48 }}>
        <Link href="/" className="home-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: cv.accent, color: 'white',
          padding: '13px 28px', borderRadius: 12,
          fontSize: 15, fontWeight: 600, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}>
          ← Retour à l'accueil
        </Link>
      </div>

      {/* Liens rapides */}
      <div className="fade-4" style={{ width: '100%', maxWidth: 640 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: cv.textMuted, marginBottom: 16 }}>
          Où vouliez-vous aller ?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {links.map(({ href, emoji, label, desc }) => (
            <Link key={href} href={href} className="nav-link" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: cv.card, border: `1px solid ${cv.border}`,
              borderRadius: 16, padding: '18px 12px',
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: cv.text }}>{label}</span>
              <span style={{ fontSize: 11, color: cv.textMuted, lineHeight: 1.4, textAlign: 'center' }}>{desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer minimal */}
      <p style={{ marginTop: 48, fontSize: 12, color: cv.textMuted }}>
        BabyBudget · <a href="mailto:contact@babybudget.fr" style={{ color: cv.textMuted, textDecoration: 'none' }}>contact@babybudget.fr</a>
      </p>

    </div>
  );
}