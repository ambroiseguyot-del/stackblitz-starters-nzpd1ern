'use client';

import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import Link from 'next/link';

const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const getFriendlyError = (msg: string): string => {
    if (msg.includes('already registered') || msg.includes('already exists')) return 'Un compte existe déjà avec cet email. Connectez-vous.';
    if (msg.includes('Password should be')) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (msg.includes('valid email')) return 'Entrez une adresse email valide.';
    return 'Une erreur est survenue. Réessayez.';
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) { setError('Entrez une adresse email valide.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (password !== confirm) { setError('Les deux mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (authError) setError(getFriendlyError(authError.message));
    else setSent(true);
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '#E2E8F0', width: '0%' };
    if (password.length < 6) return { label: 'Trop court', color: '#EF4444', width: '25%' };
    if (password.length < 8) return { label: 'Faible', color: '#F97316', width: '40%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Moyen', color: '#EAB308', width: '65%' };
    return { label: 'Fort', color: '#22C55E', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .sr { min-height: 100vh; display: flex; font-family: ${SYSTEM_FONT}; background: #F7F4F0; }
        .sr-left { display: none; flex: 1; background: #0F172A; padding: 3rem; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        @media (min-width: 860px) { .sr-left { display: flex; } }
        .sr-left-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 25% 60%, rgba(16,185,129,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 50%); }
        .sr-left-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 44px 44px; }
        .sr-brand { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
        .sr-brand-icon { width: 38px; height: 38px; background: #10B981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .sr-brand-name { font-weight: 800; font-size: 18px; color: white; letter-spacing: -0.02em; }
        .sr-left-content { position: relative; z-index: 1; }
        .sr-left-title { font-weight: 800; font-size: 2.4rem; color: white; line-height: 1.12; letter-spacing: -0.03em; margin: 0 0 1rem; }
        .sr-left-title span { color: #6EE7B7; }
        .sr-left-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.65; margin: 0; max-width: 300px; }
        .sr-steps { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 16px; }
        .sr-step { display: flex; align-items: flex-start; gap: 14px; }
        .sr-step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); flex-shrink: 0; margin-top: 1px; }
        .sr-step-text { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.5; }
        .sr-step-text strong { color: rgba(255,255,255,0.8); font-weight: 500; display: block; margin-bottom: 1px; }
        .sr-right { flex: 0 0 100%; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
        @media (min-width: 860px) { .sr-right { flex: 0 0 460px; } }
        .sr-wrap { width: 100%; max-width: 380px; }
        .sr-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #10B981; margin: 0 0 8px; }
        .sr-title { font-weight: 800; font-size: 1.8rem; color: #0F172A; letter-spacing: -0.03em; margin: 0 0 6px; }
        .sr-sub { font-size: 14px; color: #64748B; margin: 0 0 1.75rem; line-height: 1.5; }
        .sr-field { margin-bottom: 1rem; }
        .sr-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .sr-input-wrap { position: relative; }
        .sr-input { width: 100%; padding: 13px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 14px; font-family: ${SYSTEM_FONT}; background: white; color: #0F172A; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .sr-input:focus { border-color: #10B981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .sr-input.pw { padding-right: 48px; }
        .sr-input.err { border-color: #EF4444; }
        .sr-input:disabled { opacity: 0.5; background: #F8FAFC; }
        .sr-eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; color: #94A3B8; font-size: 15px; line-height: 1; display: flex; align-items: center; transition: color 0.1s; }
        .sr-eye:hover { color: #475569; }
        .sr-strength { margin-top: 8px; }
        .sr-strength-bar { height: 3px; background: #E2E8F0; border-radius: 99px; overflow: hidden; margin-bottom: 4px; }
        .sr-strength-fill { height: 100%; border-radius: 99px; transition: width 0.3s, background 0.3s; }
        .sr-error { display: flex; align-items: flex-start; gap: 8px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 10px 14px; margin-bottom: 1rem; font-size: 13px; color: #991B1B; line-height: 1.4; animation: fadeIn 0.2s ease-out; }
        .sr-btn { width: 100%; padding: 14px; margin-top: 0.75rem; background: #0F172A; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; font-family: ${SYSTEM_FONT}; cursor: pointer; transition: background 0.15s, transform 0.1s; letter-spacing: 0.01em; }
        .sr-btn:hover:not(:disabled) { background: #1E293B; }
        .sr-btn:active:not(:disabled) { transform: scale(0.99); }
        .sr-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .sr-footer { margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .sr-divider { width: 100%; height: 1px; background: #E2E8F0; }
        .sr-link { font-size: 13px; color: #64748B; text-decoration: none; transition: color 0.15s; }
        .sr-link:hover { color: #0F172A; }
        .sr-link.accent { color: #10B981; font-weight: 500; }
        .sr-link.accent:hover { color: #059669; }
        .sr-success { text-align: center; padding: 2rem 1rem; animation: fadeIn 0.3s ease-out; }
        .sr-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #F0FDF4; border: 2px solid #BBF7D0; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 1.25rem; }
        .sr-success-title { font-weight: 800; font-size: 1.4rem; color: #0F172A; letter-spacing: -0.02em; margin: 0 0 8px; }
        .sr-success-sub { font-size: 14px; color: #64748B; line-height: 1.6; margin: 0 0 1.5rem; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="sr">
        <div className="sr-left">
          <div className="sr-left-bg" />
          <div className="sr-left-grid" />
          <div className="sr-brand">
            <div className="sr-brand-icon">👶</div>
            <span className="sr-brand-name">BabyBudget</span>
          </div>
          <div className="sr-left-content">
            <h2 className="sr-left-title">Créez votre<br />espace <span>familial</span><br />en 30 secondes</h2>
            <p className="sr-left-sub">Gratuit, sans carte bancaire, sans engagement. Vos données restent privées et sécurisées.</p>
          </div>
          <div className="sr-steps">
            {[
              { n: '1', t: 'Créez votre compte', s: 'Email + mot de passe, c\'est tout.' },
              { n: '2', t: 'Ajoutez vos enfants', s: 'Un profil par enfant pour un suivi précis.' },
              { n: '3', t: 'Suivez vos dépenses', s: 'Graphiques, insights et comparaison nationale.' },
            ].map(step => (
              <div key={step.n} className="sr-step">
                <div className="sr-step-num">{step.n}</div>
                <div className="sr-step-text"><strong>{step.t}</strong>{step.s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sr-right">
          <div className="sr-wrap">
            {sent ? (
              <div className="sr-success">
                <div className="sr-success-icon">✉️</div>
                <h2 className="sr-success-title">Vérifiez vos emails</h2>
                <p className="sr-success-sub">Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.</p>
                <Link href="/login" className="sr-link accent" style={{ fontSize: 14 }}>← Retour à la connexion</Link>
              </div>
            ) : (
              <>
                <p className="sr-eyebrow">Nouveau compte</p>
                <h1 className="sr-title">Créer mon compte</h1>
                <p className="sr-sub">Rejoignez BabyBudget et prenez le contrôle de votre budget bébé.</p>
                {error && <div className="sr-error" role="alert"><span style={{ flexShrink: 0 }}>⚠️</span>{error}</div>}
                <form onSubmit={handleSignUp} noValidate>
                  <div className="sr-field">
                    <label htmlFor="email" className="sr-label">Adresse email</label>
                    <input id="email" type="email" className="sr-input" placeholder="vous@exemple.fr" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }} autoComplete="email" required disabled={loading} />
                  </div>
                  <div className="sr-field">
                    <label htmlFor="password" className="sr-label">Mot de passe</label>
                    <div className="sr-input-wrap">
                      <input id="password" type={showPassword ? 'text' : 'password'} className="sr-input pw"
                        placeholder="Min. 6 caractères" value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        autoComplete="new-password" required disabled={loading} />
                      <button type="button" className="sr-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="sr-strength">
                        <div className="sr-strength-bar"><div className="sr-strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                        <span style={{ fontSize: 11, color: strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="sr-field">
                    <label htmlFor="confirm" className="sr-label">Confirmer le mot de passe</label>
                    <div className="sr-input-wrap">
                      <input id="confirm" type={showConfirm ? 'text' : 'password'}
                        className={`sr-input pw${confirm.length > 0 && confirm !== password ? ' err' : ''}`}
                        placeholder="Répétez le mot de passe" value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                        autoComplete="new-password" required disabled={loading} />
                      <button type="button" className="sr-eye" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Masquer' : 'Afficher'}>
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {confirm.length > 0 && confirm !== password && (
                      <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                  <button type="submit" className="sr-btn" disabled={loading}>
                    {loading ? 'Création du compte…' : 'Créer mon compte'}
                  </button>
                  <div className="sr-footer">
                    <div className="sr-divider" />
                    <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                      Déjà un compte ?{' '}<Link href="/login" className="sr-link accent">Se connecter</Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}