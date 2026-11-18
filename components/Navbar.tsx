"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, BookOpen, Calculator, ChartPie, LayoutDashboard, CalendarRange, LogOut, Menu, Moon, Newspaper, Sun, UserRound, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ProfilePanel from './ProfilePanel';
import BrandLogo from './BrandLogo';

const privateLinks = [
  { href: '/app', label: 'Tableau de bord', short: 'Accueil', icon: LayoutDashboard },
  { href: '/analyse', label: 'Analyse', short: 'Analyse', icon: BarChart3 },
  { href: '/previsions', label: 'Prévisions', short: 'Prévoir', icon: CalendarRange },
  { href: '/budget', label: 'Budget estimé', short: 'Budget', icon: Calculator },
  { href: '/comparaison', label: 'Comparaison', short: 'Comparer', icon: ChartPie },
  { href: '/informations', label: 'Guides', short: 'Guides', icon: BookOpen },
  { href: '/blog', label: 'Blog', short: 'Blog', icon: Newspaper },
];

const publicLinks = privateLinks.filter(item => !['/app', '/analyse', '/previsions'].includes(item.href));

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('bb-theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    }).catch(() => { if (active) setUser(null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('bb-signed-in', Boolean(user));
    return () => document.documentElement.classList.remove('bb-signed-in');
  }, [user]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bb-theme', next ? 'dark' : 'light');
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setProfileOpen(false);
    router.push('/');
  }

  const links = user ? privateLinks : publicLinks;
  const active = (href: string) => pathname === href || (href === '/blog' && pathname.startsWith('/blog/'));
  const initials = (user?.email?.split('@')[0] || 'P').slice(0, 1).toUpperCase();

  return (
    <>
      <a className="bb-skip-link" href="#contenu-principal">Aller au contenu</a>
      <header className="bb-header">
        <nav className="bb-nav" aria-label="Navigation principale">
          <Link href={user ? '/app' : '/'} className="bb-home-link" aria-label="BabyBudget — accueil">
            <BrandLogo />
          </Link>
          <div className="bb-nav-links">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={'bb-nav-link' + (active(href) ? ' is-active' : '')} aria-current={active(href) ? 'page' : undefined}>
                <Icon size={16} strokeWidth={1.9} aria-hidden="true" /><span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="bb-nav-actions">
            <button type="button" className="bb-icon-button" onClick={toggleTheme} aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'} title={isDark ? 'Mode clair' : 'Mode sombre'}>
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {user ? (
              <button type="button" className="bb-account-button" onClick={() => setProfileOpen(true)} aria-label="Ouvrir mon profil">
                <span className="bb-account-avatar">{initials}</span>
                <span className="bb-account-label">Mon compte</span>
              </button>
            ) : (
              <div className="bb-auth-actions">
                <Link className="bb-login-link" href="/login">Connexion</Link>
                <Link className="bb-primary-link" href="/signup">Créer mon compte</Link>
              </div>
            )}
            <button type="button" className="bb-icon-button bb-menu-toggle" onClick={() => setMenuOpen(prev => !prev)} aria-expanded={menuOpen} aria-controls="bb-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>
      {menuOpen && (
        <div className="bb-mobile-overlay" onClick={() => setMenuOpen(false)}>
          <nav id="bb-mobile-menu" className="bb-mobile-menu" aria-label="Navigation mobile" onClick={e => e.stopPropagation()}>
            <span className="bb-menu-kicker">NAVIGATION</span>
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={'bb-mobile-link' + (active(href) ? ' is-active' : '')} aria-current={active(href) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
              </Link>
            ))}
            {user && <>
              <div className="bb-menu-divider"/>
              <button type="button" className="bb-mobile-link" onClick={() => { setMenuOpen(false); setProfileOpen(true); }}><UserRound size={19}/><span>Mon profil</span></button>
              <button type="button" className="bb-mobile-link bb-signout" onClick={handleSignOut}><LogOut size={19}/><span>Déconnexion</span></button>
            </>}
            {!user && <Link href="/signup" className="bb-primary-link bb-mobile-cta" onClick={() => setMenuOpen(false)}>Créer mon compte</Link>}
          </nav>
        </div>
      )}
      {user && (
        <nav className="bb-bottom-nav" aria-label="Navigation rapide">
          {privateLinks.filter(item => ['/app', '/analyse', '/previsions', '/budget'].includes(item.href)).map(({ href, short, icon: Icon }) => (
            <Link key={href} href={href} className={'bb-bottom-link' + (active(href) ? ' is-active' : '')} aria-current={active(href) ? 'page' : undefined}>
              <Icon size={21} strokeWidth={1.9} aria-hidden="true"/><span>{short}</span>
            </Link>
          ))}
          <button type="button" className={'bb-bottom-link' + (menuOpen ? ' is-active' : '')} aria-label="Afficher toutes les rubriques" aria-expanded={menuOpen} onClick={() => setMenuOpen(prev => !prev)}>
            <Menu size={21}/><span>Menu</span>
          </button>
        </nav>
      )}
      {profileOpen && user && <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />}
    </>
  );
}
