'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const router = useRouter();

  // Vérifie que le lien de reset est valide (Supabase pose la session
  // automatiquement depuis le token dans l'URL au montage)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
  }, []);

  // Indicateur de force du mot de passe
  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Trop court', color: '#EF4444', width: '25%' };
    if (password.length < 8) return { label: 'Faible', color: '#F97316', width: '45%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Moyen', color: '#EAB308', width: '65%' };
    return { label: 'Fort', color: '#22C55E', width: '100%' };
  };
  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('Une erreur est survenue. Le lien a peut-être expiré — demandez un nouveau lien.');
    } else {
      setSuccess(true);
      // Redirige vers le dashboard après 3 secondes
      setTimeout(() => router.push('/app'), 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .rp-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #F7F4F0; font-family: 'DM Sans', sans-serif; padding: 2rem 1.5rem;
        }
        .rp-card {
          width: 100%; max-width: 400px; background: white;
          border-radius: 24px; border: 1px solid #E2E8F0;
          padding: 40px 36px; box-shadow: 0 8px 40px rgba(0,0,0,0.06);
        }
        .rp-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
        .rp-logo-icon { width: 32px; height: 32px; background: #0F172A; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .rp-logo-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: #0F172A; letter-spacing: -0.02em; }
        .rp-logo-name span { color: #6366F1; }
        .rp-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1; margin: 0 0 8px; }
        .rp-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; color: #0F172A; letter-spacing: -0.03em; margin: 0 0 6px; }
        .rp-sub { font-size: 14px; color: #64748B; margin: 0 0 28px; line-height: 1.5; }
        .rp-field { margin-bottom: 16px; }
        .rp-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .rp-input-wrap { position: relative; }
        .rp-input {
          width: 100%; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px;
          font-size: 14px; font-family: 'DM Sans', sans-serif; color: #0F172A;
          background: white; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .rp-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .rp-input.pw { padding-right: 48px; }
        .rp-eye { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; color: #94A3B8; font-size: 15px; }
        .rp-eye:hover { color: #475569; }
        .rp-strength { margin-top: 6px; }
        .rp-strength-bar { height: 3px; background: #E2E8F0; border-radius: 99px; overflow: hidden; margin-bottom: 3px; }
        .rp-strength-fill { height: 100%; border-radius: 99px; transition: width 0.3s, background 0.3s; }
        .rp-strength-label { font-size: 11px; }
        .rp-mismatch { font-size: 11px; color: #EF4444; margin-top: 4px; }
        .rp-error { display: flex; align-items: flex-start; gap: 8px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #991B1B; line-height: 1.4; animation: fadeIn 0.2s ease-out; }
        .rp-btn { width: 100%; padding: 14px; margin-top: 8px; background: #0F172A; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.15s; }
        .rp-btn:hover:not(:disabled) { background: #1E293B; }
        .rp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .rp-success { text-align: center; }
        .rp-success-icon { width: 60px; height: 60px; border-radius: 50%; background: #F0FDF4; border: 2px solid #BBF7D0; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 16px; }
        .rp-success-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; color: #0F172A; margin: 0 0 8px; }
        .rp-success-sub { font-size: 14px; color: #64748B; line-height: 1.6; margin: 0 0 20px; }
        .rp-link { font-size: 13px; color: #6366F1; font-weight: 500; text-decoration: none; }
        .rp-link:hover { color: #4F46E5; }
        .rp-invalid { text-align: center; padding: 16px 0; }
        .rp-invalid-icon { font-size: 40px; margin-bottom: 12px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="rp-root">
        <div className="rp-card">

          {/* Logo */}
          <div className="rp-logo">
            <div className="rp-logo-icon">👶</div>
            <span className="rp-logo-name">Baby<span>Budget</span></span>
          </div>

          {/* Chargement — vérifie la session */}
          {validSession === null && (
            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Vérification du lien…</p>
          )}

          {/* Lien invalide ou expiré */}
          {validSession === false && (
            <div className="rp-invalid">
              <div className="rp-invalid-icon">🔗</div>
              <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Lien invalide ou expiré</p>
              <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20, lineHeight: 1.6 }}>
                Ce lien de réinitialisation n'est plus valide. Demandez-en un nouveau depuis la page de connexion.
              </p>
              <Link href="/login" className="rp-link">← Retour à la connexion</Link>
            </div>
          )}

          {/* Succès */}
          {validSession === true && success && (
            <div className="rp-success">
              <div className="rp-success-icon">✅</div>
              <p className="rp-success-title">Mot de passe mis à jour !</p>
              <p className="rp-success-sub">
                Votre mot de passe a bien été modifié.<br />
                Vous allez être redirigé vers le dashboard…
              </p>
              <Link href="/app" className="rp-link">Accéder au dashboard →</Link>
            </div>
          )}

          {/* Formulaire */}
          {validSession === true && !success && (
            <>
              <p className="rp-eyebrow">Sécurité</p>
              <h1 className="rp-title">Nouveau mot de passe</h1>
              <p className="rp-sub">Choisissez un mot de passe sécurisé pour votre compte BabyBudget.</p>

              {error && (
                <div className="rp-error">
                  <span style={{ flexShrink: 0 }}>⚠️</span>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="rp-field">
                  <label htmlFor="new-password" className="rp-label">Nouveau mot de passe</label>
                  <div className="rp-input-wrap">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      className="rp-input pw"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                    />
                    <button type="button" className="rp-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {strength && (
                    <div className="rp-strength">
                      <div className="rp-strength-bar">
                        <div className="rp-strength-fill" style={{ width: strength.width, background: strength.color }} />
                      </div>
                      <span className="rp-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="rp-field">
                  <label htmlFor="confirm-password" className="rp-label">Confirmer le mot de passe</label>
                  <div className="rp-input-wrap">
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`rp-input${confirm.length > 0 && confirm !== password ? ' pw' : ' pw'}`}
                      style={{ borderColor: confirm.length > 0 && confirm !== password ? '#EF4444' : undefined }}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                    />
                  </div>
                  {confirm.length > 0 && confirm !== password && (
                    <p className="rp-mismatch">Les mots de passe ne correspondent pas</p>
                  )}
                </div>

                <button type="submit" className="rp-btn" disabled={loading || !password || !confirm}>
                  {loading ? 'Mise à jour…' : 'Enregistrer le nouveau mot de passe'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94A3B8' }}>
                <Link href="/login" className="rp-link" style={{ color: '#94A3B8' }}>← Retour à la connexion</Link>
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
}