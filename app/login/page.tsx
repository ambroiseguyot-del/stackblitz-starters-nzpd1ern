'use client';

import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Link from 'next/link';

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
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .lr { min-height: 100vh; display: flex; font-family: ${SYSTEM_FONT}; background: #F7F4F0; }

        .lr-left {
          display: none; flex: 1; background: #0F172A; padding: 3rem;
          flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        @media (min-width: 860px) { .lr-left { display: flex; } }

        .lr-left-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 85% 15%, rgba(16,185,129,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 85%, rgba(99,102,241,0.08) 0%, transparent 40%);
        }
        .lr-left-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        .lr-brand { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
        .lr-brand-icon { width: 38px; height: 38px; background: #6366F1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .lr-brand-name { font-weight: 800; font-size: 18px; color: white; letter-spacing: -0.02em; }

        .lr-left-content { position: relative; z-index: 1; }
        .lr-left-title { font-weight: 800; font-size: 2.5rem; color: white; line-height: 1.12; letter-spacing: -0.03em; margin: 0 0 1rem; }
        .lr-left-title span { color: #818CF8; }
        .lr-left-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.65; margin: 0; max-width: 300px; }

        .lr-stats { position: relative; z-index: 1; display: flex; gap: 2.5rem; }
        .lr-stat-val { font-weight: 800; font-size: 1.6rem; color: white; letter-spacing: -0.02em; }
        .lr-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; letter-spacing: 0.03em; }

        .lr-right { flex: 0 0 100%; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
        @media (min-width: 860px) { .lr-right { flex: 0 0 460px; } }

        .lr-wrap { width: 100%; max-width: 380px; }

        .lr-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1; margin: 0 0 8px; }
        .lr-title { font-weight: 800; font-size: 1.8rem; color: #0F172A; letter-spacing: -0.03em; margin: 0 0 6px; }
        .lr-sub { font-size: 14px; color: #64748B; margin: 0 0 1.75rem; line-height: 1.5; }

        .lr-field { margin-bottom: 1rem; }
        .lr-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 6px; }

        .lr-input-wrap { position: relative; }
        .lr-input {
          width: 100%; padding: 13px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px;
          font-size: 14px; font-family: ${SYSTEM_FONT}; background: white; color: #0F172A; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lr-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .lr-input.pw { padding-right: 48px; }
        .lr-input:disabled { opacity: 0.5; background: #F8FAFC; }

        .lr-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 4px;
          color: #94A3B8; font-size: 15px; line-height: 1; display: flex; align-items: center; transition: color 0.1s;
        }
        .lr-eye:hover { color: #475569; }

        .lr-error {
          display: flex; align-items: flex-start; gap: 8px; background: #FEF2F2;
          border: 1px solid #FECACA; border-radius: 10px; padding: 10px 14px; margin-bottom: 1rem;
          font-size: 13px; color: #991B1B; line-height: 1.4; animation: fadeIn 0.2s ease-out;
        }
        .lr-success {
          display: flex; align-items: flex-start; gap: 8px; background: #F0FDF4;
          border: 1px solid #BBF7D0; border-radius: 10px; padding: 10px 14px; margin-bottom: 1rem;
          font-size: 13px; color: #166534; line-height: 1.4; animation: fadeIn 0.2s ease-out;
        }

        .lr-attempts { font-size: 11px; color: #EF4444; text-align: center; margin: 6px 0 0; }

        .lr-btn {
          width: 100%; padding: 14px; margin-top: 0.75rem; background: #0F172A; color: white;
          border: none; border-radius: 12px; font-size: 14px; font-weight: 500;
          font-family: ${SYSTEM_FONT}; cursor: pointer;
          transition: background 0.15s, transform 0.1s; letter-spacing: 0.01em;
        }
        .lr-btn:hover:not(:disabled) { background: #1E293B; }
        .lr-btn:active:not(:disabled) { transform: scale(0.99); }
        .lr-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .lr-btn.danger { background: #DC2626; }

        .lr-footer { margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .lr-divider { width: 100%; height: 1px; background: #E2E8F0; }

        .lr-link {
          font-size: 13px; color: #64748B; text-decoration: none; background: none;
          border: none; cursor: pointer; padding: 0; font-family: ${SYSTEM_FONT}; transition: color 0.15s;
        }
        .lr-link:hover { color: #0F172A; }
        .lr-link.accent { color: #6366F1; font-weight: 500; }
        .lr-link.accent:hover { color: #4F46E5; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="lr">

        <div className="lr-left">
          <div className="lr-left-bg" />
          <div className="lr-left-grid" />
          <div className="lr-brand">
            <div className="lr-brand-icon">👶</div>
            <span className="lr-brand-name">BabyBudget</span>
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
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
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