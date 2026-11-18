'use client';

import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Link from 'next/link';
import BrandLogo from '../../components/BrandLogo';

const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const blockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const getFriendlyError = (msg: string): string => {
    if (msg.includes('Invalid login') || msg.includes('invalid_grant')) return 'Email ou mot de passe incorrect.';
    if (msg.includes('Email not confirmed')) return 'Confirmez votre email avant de vous connecter.';
    if (msg.includes('Too many requests')) return 'Trop de tentatives. Attendez quelques minutes.';
    return 'Une erreur est survenue. Réessayez.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) { setError('Entrez une adresse email valide.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (blocked) { setError('Trop de tentatives échouées. Attendez avant de réessayer.'); return; }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(getFriendlyError(authError.message));
      setLoading(false);
      if (newAttempts >= 5) {
        setBlocked(true);
        setError('Trop de tentatives. Réessayez dans 30 secondes.');
        if (blockTimer.current) clearTimeout(blockTimer.current);
        blockTimer.current = setTimeout(() => { setBlocked(false); setAttempts(0); setError(null); }, 30000);
      }
    } else {
      router.push('/app');
      router.refresh();
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) { setError('Entrez une adresse email valide.'); return; }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) setError(getFriendlyError(resetError.message));
    else setSuccessMsg('Email envoyé ! Vérifiez votre boîte mail pour réinitialiser votre mot de passe.');
  };

  return (
    <>
      

      <div className="lr">

        <div className="lr-left">
          <div className="lr-left-bg" />
          <div className="lr-left-grid" />
          <div className="lr-brand">
            <BrandLogo light />
          </div>
          <div className="lr-left-content">
            <h2 className="lr-left-title">
              Suivez chaque<br />euro dépensé<br />pour <span>votre bébé</span>
            </h2>
            <p className="lr-left-sub">
              Tableau de bord familial, comparaison nationale et insights automatiques — tout pour piloter le budget de votre enfant sereinement.
            </p>
          </div>
          <div className="lr-stats">
            <div><div className="lr-stat-val">100%</div><div className="lr-stat-lbl">Données privées</div></div>
            <div><div className="lr-stat-val">0 €</div><div className="lr-stat-lbl">Publicités</div></div>
            <div><div className="lr-stat-val">∞</div><div className="lr-stat-lbl">Dépenses suivies</div></div>
          </div>
        </div>

        <div className="lr-right">
          <div className="lr-wrap">

            <p className="lr-eyebrow">{resetMode ? 'Récupération' : 'Bienvenue'}</p>
            <h1 className="lr-title">{resetMode ? 'Mot de passe oublié' : 'Connectez-vous'}</h1>
            <p className="lr-sub">
              {resetMode ? 'Entrez votre email pour recevoir un lien de réinitialisation.' : 'Accédez à votre espace familial BabyBudget.'}
            </p>

            {error && <div className="lr-error" role="alert"><span style={{ flexShrink: 0 }}>⚠️</span>{error}</div>}
            {successMsg && <div className="lr-success" role="status"><span style={{ flexShrink: 0 }}>✅</span>{successMsg}</div>}

            {!resetMode && (
              <form onSubmit={handleLogin} noValidate>
                <div className="lr-field">
                  <label htmlFor="email" className="lr-label">Adresse email</label>
                  <input id="email" type="email" className="lr-input" placeholder="vous@exemple.fr" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    autoComplete="email" required disabled={loading || blocked} />
                </div>
                <div className="lr-field">
                  <label htmlFor="password" className="lr-label">Mot de passe</label>
                  <div className="lr-input-wrap">
                    <input id="password" type={showPassword ? 'text' : 'password'} className="lr-input pw"
                      placeholder="••••••••" value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      autoComplete="current-password" required disabled={loading || blocked} />
                    <button type="button" className="lr-eye" onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                {attempts > 0 && attempts < 5 && (
                  <p className="lr-attempts">{5 - attempts} tentative{5 - attempts > 1 ? 's' : ''} restante{5 - attempts > 1 ? 's' : ''} avant blocage</p>
                )}
                <button type="submit" className={`lr-btn${blocked ? ' danger' : ''}`} disabled={loading || blocked}>
                  {loading ? 'Connexion…' : blocked ? 'Bloqué — attendez 30s' : 'Se connecter'}
                </button>
                <div className="lr-footer">
                  <button type="button" className="lr-link"
                    onClick={() => { setResetMode(true); setError(null); setSuccessMsg(null); }}>
                    Mot de passe oublié ?
                  </button>
                  <div className="lr-divider" />
                  <p style={{ fontSize: 13, color: '#657A6E', margin: 0 }}>
                    Pas encore de compte ?{' '}
                    <Link href="/signup" className="lr-link accent">Créer un compte</Link>
                  </p>
                </div>
              </form>
            )}

            {resetMode && !successMsg && (
              <form onSubmit={handleReset} noValidate>
                <div className="lr-field">
                  <label htmlFor="reset-email" className="lr-label">Adresse email</label>
                  <input id="reset-email" type="email" className="lr-input" placeholder="vous@exemple.fr" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    autoComplete="email" required disabled={loading} />
                </div>
                <button type="submit" className="lr-btn" disabled={loading}>
                  {loading ? 'Envoi…' : 'Envoyer le lien'}
                </button>
                <div className="lr-footer">
                  <button type="button" className="lr-link"
                    onClick={() => { setResetMode(false); setError(null); setSuccessMsg(null); }}>
                    ← Retour à la connexion
                  </button>
                </div>
              </form>
            )}

            {resetMode && successMsg && (
              <div className="lr-footer" style={{ marginTop: '1rem' }}>
                <button type="button" className="lr-link accent"
                  onClick={() => { setResetMode(false); setSuccessMsg(null); setError(null); }}>
                  ← Retour à la connexion
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}