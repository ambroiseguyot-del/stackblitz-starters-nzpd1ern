'use client';

import { supabase } from '../../supabaseClient';
import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '../../components/BrandLogo';

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
    if (msg.includes('Password should be')) return 'Le mot de passe doit contenir au moins 12 caractères.';
    if (msg.includes('valid email')) return 'Entrez une adresse email valide.';
    return 'Une erreur est survenue. Réessayez.';
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) { setError('Entrez une adresse email valide.'); return; }
    if (password.length < 12) { setError('Le mot de passe doit contenir au moins 12 caractères.'); return; }
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
    if (password.length === 0) return { label: '', color: '#DFE7DE', width: '0%' };
    if (password.length < 12) return { label: 'Trop court', color: '#C85B56', width: '25%' };
    if (password.length < 16) return { label: 'Faible', color: '#F97316', width: '40%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Moyen', color: '#EAB308', width: '65%' };
    return { label: 'Fort', color: '#22C55E', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      

      <div className="sr">
        <div className="sr-left">
          <div className="sr-left-bg" />
          <div className="sr-left-grid" />
          <div className="sr-brand">
            <BrandLogo light />
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
                        placeholder="Min. 12 caractères" value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        autoComplete="new-password" minLength={12} required disabled={loading} />
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
                        autoComplete="new-password" minLength={12} required disabled={loading} />
                      <button type="button" className="sr-eye" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Masquer' : 'Afficher'}>
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {confirm.length > 0 && confirm !== password && (
                      <p style={{ fontSize: 11, color: '#C85B56', margin: '5px 0 0' }}>Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                  <button type="submit" className="sr-btn" disabled={loading}>
                    {loading ? 'Création du compte…' : 'Créer mon compte'}
                  </button>
                  <div className="sr-footer">
                    <div className="sr-divider" />
                    <p style={{ fontSize: 13, color: '#657A6E', margin: 0 }}>
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