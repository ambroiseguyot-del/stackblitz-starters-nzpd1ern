"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import ProfilePanel from './ProfilePanel';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('bb-theme', next ? 'dark' : 'light');
      return next;
    });
  };
  // Charge la préférence sauvegardée
  useEffect(() => {
    const saved = localStorage.getItem('bb-theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Effet sticky au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/app',        label: 'Dashboard',   icon: '🚀' },
    { href: '/analyse',    label: 'Analyse',      icon: '📊' },
    { href: '/comparaison', label: 'Comparaison', icon: '🇫🇷' },
    { href: '/informations', label: 'Informations',  icon: '📋' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        .nb {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          transition: background 0.2s, box-shadow 0.2s, backdrop-filter 0.2s;
        }
        .nb.scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
        }
        .nb.top { background: transparent; }

        .nb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px;
        }

        .nb-logo {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: -0.03em;
          color: #0F172A;
          text-decoration: none;
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }
        .nb-logo-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #0F172A;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .nb-logo span { color: #6366F1; }

        .nb-links {
          display: flex; align-items: center; gap: 4px;
          flex: 1; justify-content: center;
        }

        .nb-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          text-decoration: none;
          color: #64748B;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nb-link:hover { background: #F1F5F9; color: #0F172A; }
        .nb-link.active {
          background: #EFF6FF;
          color: #1D4ED8;
          font-weight: 600;
        }
        .nb-link-icon { font-size: 14px; }

        .nb-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .nb-user-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 6px;
          border-radius: 99px;
          border: 1px solid #E2E8F0;
          background: white;
          font-size: 12px; color: #475569; font-weight: 500;
        }
        .nb-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: #0F172A;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          flex-shrink: 0;
        }

        .nb-btn-signout {
          padding: 7px 14px; border-radius: 10px;
          border: 1px solid #E2E8F0; background: white;
          font-size: 13px; font-weight: 500; color: #64748B;
          cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .nb-btn-signout:hover { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }

        .nb-btn-login {
          padding: 8px 18px; border-radius: 10px;
          background: #0F172A; color: white;
          font-size: 13px; font-weight: 500;
          text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          transition: background 0.15s;
        }
        .nb-btn-login:hover { background: #1E293B; }

        .nb-toggle {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1px solid #E2E8F0; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; transition: background 0.15s;
          flex-shrink: 0;
        }
        .nb-toggle:hover { background: #F8FAFC; }

        .nb-btn-signup {
          padding: 8px 18px; border-radius: 10px;
          border: 1px solid #E2E8F0; background: white;
          color: #374151; font-size: 13px; font-weight: 500;
          text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          transition: background 0.15s;
        }
        .nb-btn-signup:hover { background: #F8FAFC; }

        /* Mobile burger */
        .nb-burger {
          display: none; flex-direction: column; gap: 4px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .nb-burger span {
          display: block; width: 20px; height: 2px;
          background: #0F172A; border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }

        /* Mobile menu */
        .nb-mobile {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0;
          background: white; border-top: 1px solid #E2E8F0;
          padding: 12px 16px 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          flex-direction: column; gap: 4px;
          z-index: 99;
        }
        .nb-mobile.open { display: flex; }
        .nb-mobile .nb-link { padding: 12px 14px; font-size: 15px; }
        .nb-mobile-sep { height: 1px; background: #F1F5F9; margin: 8px 0; }
        .nb-mobile-email { font-size: 12px; color: #94A3B8; padding: 4px 14px; }

        @media (max-width: 768px) {
          .nb-links { display: none; }
          .nb-right .nb-user-pill { display: none; }
          .nb-right .nb-btn-signout { display: none; }
          .nb-burger { display: flex; }
        }
        @media (min-width: 769px) {
          .nb-mobile { display: none !important; }
        }

        /* Dark mode global */
        :root.dark body { background: #0B0E14; color: #F1F5F9; }
        :root.dark .nb.scrolled { background: rgba(22,27,38,0.92); box-shadow: 0 1px 0 rgba(255,255,255,0.06); }
        :root.dark .nb-logo { color: #F1F5F9; }
        :root.dark .nb-logo-icon { background: #1F2633; }
        :root.dark .nb-link { color: #94A3B8; }
        :root.dark .nb-link:hover { background: #1F2633; color: #F1F5F9; }
        :root.dark .nb-link.active { background: #1E2D4A; color: #60A5FA; }
        :root.dark .nb-user-pill { background: #161B26; border-color: #2D364D; color: #94A3B8; }
        :root.dark .nb-avatar { background: #2D364D; }
        :root.dark .nb-btn-signout { background: #161B26; border-color: #2D364D; color: #94A3B8; }
        :root.dark .nb-btn-signout:hover { background: #2D1B1B; color: #F87171; border-color: #7F1D1D; }
        :root.dark .nb-btn-signup { background: #161B26; border-color: #2D364D; color: #CBD5E1; }
        :root.dark .nb-btn-login { background: #3B82F6; }
        :root.dark .nb-mobile { background: #161B26; border-color: #2D364D; }
        :root.dark .nb-mobile-sep { background: #2D364D; }
        :root.dark .nb-mobile-email { color: #475569; }
        :root.dark .nb-toggle { background: #1F2633; border-color: #2D364D; color: #94A3B8; }
        :root.dark .nb-toggle:hover { background: #2D364D; }
      `}</style>

      <nav className={`nb ${scrolled ? 'scrolled' : 'top'}`} role="navigation" aria-label="Navigation principale">
        <div className="nb-inner">

          {/* Logo */}
          <Link href={user ? '/app' : '/'} className="nb-logo">
            <div className="nb-logo-icon">👶</div>
            Baby<span>Budget</span>
          </Link>

          {/* Liens desktop — visibles uniquement si connecté */}
          {user && (
            <div className="nb-links">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nb-link${isActive(href) ? ' active' : ''}`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  <span className="nb-link-icon">{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Droite */}
          <div className="nb-right">
            {user ? (
              <>
                {/* Pill email utilisateur */}
                <button
                  className="nb-user-pill"
                  onClick={() => setProfileOpen(true)}
                  aria-label="Ouvrir le profil"
                  style={{ cursor: "pointer", border: "1px solid #E2E8F0", background: "white" }}
                >
                  <div className="nb-avatar">
                    {user.email?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <span>{user.email?.split('@')[0]}</span>
                  <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 2 }}>▾</span>
                </button>

                {/* Déconnexion */}
                <button className="nb-btn-signout" onClick={handleSignOut}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nb-btn-signup">Se connecter</Link>
                <Link href="/signup" className="nb-btn-login">Commencer</Link>
              </>
            )}

            {/* Toggle dark mode */}
            <button
              className="nb-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Burger mobile */}
            {user && (
              <button
                className="nb-burger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOpen}
              >
                <span style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                <span style={{ opacity: menuOpen ? 0 : 1 }} />
                <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {user && (
        <div className={`nb-mobile${menuOpen ? ' open' : ''}`} role="menu">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`nb-link${isActive(href) ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              <span className="nb-link-icon">{icon}</span>
              {label}
            </Link>
          ))}
          <div className="nb-mobile-sep" />
          <p className="nb-mobile-email">{user.email}</p>
          <button
            className="nb-btn-signout"
            onClick={handleSignOut}
            style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10 }}
          >
            Déconnexion
          </button>
        </div>
      )}

      {/* Spacer pour compenser la navbar fixed */}
      <div style={{ height: 64 }} />

      {/* Panel profil */}
      {profileOpen && (
        <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}