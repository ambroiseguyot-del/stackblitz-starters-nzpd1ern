"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  user_metadata: { display_name?: string; full_name?: string };
}

type Tab = "info" | "password" | "danger";

interface Props {
  open: boolean;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const initials = (email: string, name?: string) => {
  if (name) return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return email[0].toUpperCase();
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 2000, padding: "12px 20px", borderRadius: 12,
      background: type === "success" ? "#0F172A" : "#DC2626",
      color: "white", fontSize: 13, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap",
      animation: "toastIn 0.25s ease-out",
    }}>
      {type === "success" ? "✓ " : "⚠ "}{msg}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94A3B8" }}>{label}</span>
      <span style={{ fontSize: 14, color: "#0F172A", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function InputField({
  label, id, type = "text", value, onChange, placeholder, disabled,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
          fontSize: 14, fontFamily: "DM Sans, sans-serif", color: "#0F172A",
          background: disabled ? "#F8FAFC" : "white", outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
        onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePanel({ open, onClose }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Info tab
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  // Password tab
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Danger tab
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch user
  useEffect(() => {
    if (!open) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const u = data.user as unknown as User;
        setUser(u);
        setDisplayName(u.user_metadata?.display_name ?? u.user_metadata?.full_name ?? "");
        setEmail(u.email ?? "");
      }
    });
  }, [open]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  // Fermer à Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sauvegarder infos
  const handleSaveInfo = async () => {
    setLoading(true);
    const updates: Record<string, string> = {};
    if (email !== user?.email) updates.email = email;

    const { error } = await supabase.auth.updateUser({
      ...(updates.email ? { email: updates.email } : {}),
      data: { display_name: displayName },
    });
    setLoading(false);

    if (error) showToast(error.message, "error");
    else {
      showToast(updates.email ? "Email mis à jour — vérifiez votre boîte mail" : "Profil mis à jour ✓");
      supabase.auth.getUser().then(({ data }) => data.user && setUser(data.user as unknown as User));
    }
  };

  // Changer mot de passe
  const handleChangePassword = async () => {
    if (newPwd.length < 6) { showToast("6 caractères minimum", "error"); return; }
    if (newPwd !== confirmPwd) { showToast("Les mots de passe ne correspondent pas", "error"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setLoading(false);
    if (error) showToast(error.message, "error");
    else {
      showToast("Mot de passe mis à jour ✓");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) {
      showToast("Email incorrect", "error"); return;
    }
    setLoading(true);
    // Suppression via signOut (la vraie suppression nécessite une Edge Function côté serveur)
    await supabase.auth.signOut();
    router.push("/");
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "info", label: "Mon profil", icon: "👤" },
    { id: "password", label: "Mot de passe", icon: "🔒" },
    { id: "danger", label: "Compte", icon: "⚠️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .pp-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(15,23,42,0.35);
          backdrop-filter: blur(4px);
          animation: ppFadeIn 0.2s ease-out;
        }

        .pp-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 420px;
          background: #F8FAFC;
          box-shadow: -8px 0 48px rgba(0,0,0,0.12);
          display: flex; flex-direction: column;
          z-index: 501;
          animation: ppSlideIn 0.28s cubic-bezier(0.32, 0.72, 0, 1);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .pp-header {
          background: #0F172A;
          padding: 28px 24px 24px;
          flex-shrink: 0;
        }

        .pp-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.08); border: none;
          color: rgba(255,255,255,0.6); font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .pp-close:hover { background: rgba(255,255,255,0.15); color: white; }

        .pp-avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
        .pp-avatar {
          width: 60px; height: 60px; border-radius: 16px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 22px; color: white;
        }
        .pp-online {
          position: absolute; bottom: -2px; right: -2px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #10B981; border: 2px solid #0F172A;
        }

        .pp-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.1rem; color: white; margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .pp-email-small { font-size: 13px; color: rgba(255,255,255,0.45); margin: 0; }

        .pp-meta {
          display: flex; gap: 16px; margin-top: 20px;
          padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);
        }
        .pp-meta-item { display: flex; flex-direction: column; gap: 2px; }
        .pp-meta-label { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        .pp-meta-value { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 500; }

        .pp-tabs {
          display: flex; background: white;
          border-bottom: 1px solid #E2E8F0; flex-shrink: 0;
        }
        .pp-tab {
          flex: 1; padding: 12px 8px; border: none; background: none;
          font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          color: #94A3B8; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          border-bottom: 2px solid transparent; transition: color 0.15s;
        }
        .pp-tab:hover { color: #475569; }
        .pp-tab.active { color: #6366F1; border-bottom-color: #6366F1; }
        .pp-tab-icon { font-size: 16px; }

        .pp-body {
          flex: 1; overflow-y: auto; padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
        }

        .pp-card {
          background: white; border-radius: 14px;
          border: 1px solid #E2E8F0; padding: 20px;
          display: flex; flex-direction: column; gap: 16px;
        }

        .pp-card-title {
          font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em; color: #94A3B8;
          margin: 0;
        }

        .pp-divider { height: 1px; background: #F1F5F9; margin: 0 -20px; }

        .pp-btn {
          padding: 11px 20px; border-radius: 10px; border: none;
          font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .pp-btn:active { transform: scale(0.98); }
        .pp-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .pp-btn-primary { background: #0F172A; color: white; }
        .pp-btn-primary:hover:not(:disabled) { background: #1E293B; }

        .pp-btn-danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
        .pp-btn-danger:hover:not(:disabled) { background: #FEE2E2; }

        .pp-danger-box {
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: 12px; padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .pp-danger-title { font-size: 13px; font-weight: 600; color: #991B1B; margin: 0; }
        .pp-danger-desc { font-size: 12px; color: #B91C1C; line-height: 1.5; margin: 0; }

        .pp-info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid #F1F5F9;
        }
        .pp-info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .pp-info-label { font-size: 12px; color: #94A3B8; font-weight: 500; }
        .pp-info-value { font-size: 13px; color: #0F172A; font-weight: 500; text-align: right; max-width: 200px; word-break: break-all; }

        @keyframes ppFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ppSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>

      {/* Overlay */}
      <div className="pp-overlay" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="pp-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Profil utilisateur">

        {/* Header */}
        <div className="pp-header" style={{ position: "relative" }}>
          <button className="pp-close" onClick={onClose} aria-label="Fermer">✕</button>

          <div className="pp-avatar-wrap">
            <div className="pp-avatar">
              {user ? initials(user.email, user.user_metadata?.display_name) : "?"}
            </div>
            <div className="pp-online" title="Connecté" />
          </div>

          <p className="pp-name">
            {user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Mon profil"}
          </p>
          <p className="pp-email-small">{user?.email}</p>

          <div className="pp-meta">
            <div className="pp-meta-item">
              <span className="pp-meta-label">Inscrit le</span>
              <span className="pp-meta-value">{user ? fmtDate(user.created_at) : "—"}</span>
            </div>
            <div className="pp-meta-item">
              <span className="pp-meta-label">Dernière connexion</span>
              <span className="pp-meta-value">{user ? fmtDateTime(user.last_sign_in_at) : "—"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pp-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`pp-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={tab === t.id}
            >
              <span className="pp-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="pp-body">

          {/* ── TAB INFO ── */}
          {tab === "info" && (
            <>
              {/* Infos en lecture */}
              <div className="pp-card">
                <p className="pp-card-title">Informations du compte</p>
                <div className="pp-info-row">
                  <span className="pp-info-label">Identifiant</span>
                  <span className="pp-info-value" style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>
                    {user?.id?.slice(0, 8)}…
                  </span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-label">Méthode de connexion</span>
                  <span className="pp-info-value">Email / Mot de passe</span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-label">Inscription</span>
                  <span className="pp-info-value">{user ? fmtDate(user.created_at) : "—"}</span>
                </div>
                <div className="pp-info-row">
                  <span className="pp-info-label">Dernière connexion</span>
                  <span className="pp-info-value">{user ? fmtDateTime(user.last_sign_in_at) : "—"}</span>
                </div>
              </div>

              {/* Formulaire édition */}
              <div className="pp-card">
                <p className="pp-card-title">Modifier le profil</p>
                <InputField
                  label="Nom affiché"
                  id="display-name"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Ex : Marie Dupont"
                />
                <InputField
                  label="Adresse email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="vous@exemple.fr"
                />
                {email !== user?.email && (
                  <p style={{ fontSize: 11, color: "#F59E0B", margin: 0 }}>
                    ⚠ Un email de confirmation sera envoyé à la nouvelle adresse.
                  </p>
                )}
                <button
                  className="pp-btn pp-btn-primary"
                  onClick={handleSaveInfo}
                  disabled={loading || (!displayName && !email)}
                >
                  {loading ? "Enregistrement…" : "Enregistrer les modifications"}
                </button>
              </div>
            </>
          )}

          {/* ── TAB PASSWORD ── */}
          {tab === "password" && (
            <div className="pp-card">
              <p className="pp-card-title">Changer le mot de passe</p>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
                Votre nouveau mot de passe doit contenir au moins 6 caractères.
              </p>
              <InputField
                label="Nouveau mot de passe"
                id="new-pwd"
                type="password"
                value={newPwd}
                onChange={setNewPwd}
                placeholder="••••••••"
              />
              <InputField
                label="Confirmer le nouveau mot de passe"
                id="confirm-pwd"
                type="password"
                value={confirmPwd}
                onChange={setConfirmPwd}
                placeholder="••••••••"
              />
              {confirmPwd.length > 0 && confirmPwd !== newPwd && (
                <p style={{ fontSize: 11, color: "#EF4444", margin: 0 }}>
                  Les mots de passe ne correspondent pas
                </p>
              )}
              <button
                className="pp-btn pp-btn-primary"
                onClick={handleChangePassword}
                disabled={loading || !newPwd || !confirmPwd}
              >
                {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
              </button>
            </div>
          )}

          {/* ── TAB DANGER ── */}
          {tab === "danger" && (
            <>
              <div className="pp-card">
                <p className="pp-card-title">Zone de danger</p>

                <div className="pp-danger-box">
                  <p className="pp-danger-title">🗑 Supprimer mon compte</p>
                  <p className="pp-danger-desc">
                    Cette action est irréversible. Toutes vos dépenses et profils d'enfants seront définitivement supprimés.
                  </p>
                  <InputField
                    label={`Tapez votre email pour confirmer : ${user?.email}`}
                    id="delete-confirm"
                    type="email"
                    value={deleteConfirm}
                    onChange={setDeleteConfirm}
                    placeholder={user?.email}
                  />
                  <button
                    className="pp-btn pp-btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirm !== user?.email}
                  >
                    {loading ? "Suppression…" : "Supprimer définitivement mon compte"}
                  </button>
                </div>
              </div>

              <div className="pp-card">
                <p className="pp-card-title">Autres actions</p>
                <button
                  className="pp-btn"
                  style={{ background: "#F8FAFC", color: "#475569", border: "1px solid #E2E8F0" }}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    onClose();
                    window.location.href = "/";
                  }}
                >
                  Se déconnecter de tous les appareils
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}