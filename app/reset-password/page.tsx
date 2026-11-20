'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '../../components/BrandLogo';

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
    if (password.length < 12) return { label: 'Trop court', color: '#C85B56', width: '25%' };
    if (password.length < 16) return { label: 'Faible', color: '#F97316', width: '45%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Moyen', color: '#EAB308', width: '65%' };
    return { label: 'Fort', color: '#22C55E', width: '100%' };
  };
  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères.');
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
      

      <div className="rp-root">
        <div className="rp-card">

          {/* Logo */}
          <div className="rp-logo">
            <BrandLogo />
          </div>

          {/* Chargement — vérifie la session */}
          {validSession === null && (
            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>Vérification du lien…</p>
          )}

          {/* Lien invalide ou expiré */}
          {validSession === false && (
            <div className="rp-invalid">
              <div className="rp-invalid-icon">🔗</div>
              <p style={{ fontWeight: 700, color: '#16443D', marginBottom: 8 }}>Lien invalide ou expiré</p>
              <p style={{ fontSize: 13, color: '#657A6E', marginBottom: 20, lineHeight: 1.6 }}>
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
                      style={{ borderColor: confirm.length > 0 && confirm !== password ? '#C85B56' : undefined }}
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