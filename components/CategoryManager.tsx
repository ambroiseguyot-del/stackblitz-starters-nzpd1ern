"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

// ─── Catégories par défaut ────────────────────────────────────────────────────
export const DEFAULT_CATEGORIES: { name: string; icon: string }[] = [
  { name: "Couches",    icon: "🧷" },
  { name: "Lait",       icon: "🍼" },
  { name: "Santé",      icon: "🩺" },
  { name: "Soins",      icon: "🧼" },
  { name: "Vêtements",  icon: "👕" },
  { name: "Jouets",     icon: "🧸" },
  { name: "École",      icon: "📚" },
  { name: "Loisirs",    icon: "🎨" },
  { name: "Équipement", icon: "🛒" },
  { name: "Autre",      icon: "📦" },
];

// Emojis proposés pour les catégories personnalisées
const EMOJI_LIST = [
  "🍼","🧷","🩺","🧼","👕","🧸","📚","🎨","🛒","📦",
  "🏥","💊","🚗","✈️","🏠","🎯","💰","🛍️","🎁","🍕",
  "🥗","🧃","👶","🌟","🎪","🏊","🚴","🎵","📷","🌿",
];

interface UserCategory {
  id: string;
  name: string;
  icon: string;
}

interface CategoryManagerProps {
  onCategoriesChange: (categories: { name: string; icon: string }[]) => void;
}

export default function CategoryManager({ onCategoriesChange }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const [useDefaults, setUseDefaults] = useState(true);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📦");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charge les catégories utilisateur
  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (data && data.length > 0) {
      setUserCategories(data);
      // use_defaults est stocké sur chaque ligne — on lit la première
      setUseDefaults(data[0].use_defaults ?? true);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Notifie le parent à chaque changement
  useEffect(() => {
    const defaults = useDefaults ? DEFAULT_CATEGORIES : [];
    const custom = userCategories.map(c => ({ name: c.name, icon: c.icon }));
    // Déduplique si un nom custom existe aussi dans les défauts
    const defaultsFiltered = defaults.filter(
      d => !custom.some(c => c.name.toLowerCase() === d.name.toLowerCase())
    );
    onCategoriesChange([...defaultsFiltered, ...custom]);
  }, [userCategories, useDefaults, onCategoriesChange]);

  // Toggle catégories par défaut
  const handleToggleDefaults = async (val: boolean) => {
    setUseDefaults(val);
    // Met à jour toutes les lignes de l'utilisateur
    if (userCategories.length > 0) {
      await supabase
        .from("categories")
        .update({ use_defaults: val })
        .eq("user_id", userCategories[0].id); // approximation — le trigger gère user_id
    }
    // Si pas de catégories custom encore, on stocke le préférence dans une ligne fantôme
  };

  // Ajouter une catégorie
  const handleAdd = async () => {
    if (!newName.trim()) { setError("Entrez un nom."); return; }
    if (newName.trim().length > 30) { setError("30 caractères maximum."); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("categories")
      .insert({ name: newName.trim(), icon: newIcon, use_defaults: useDefaults });
    if (err) {
      setError(err.code === "23505" ? "Cette catégorie existe déjà." : err.message);
    } else {
      setNewName("");
      setNewIcon("📦");
      setShowEmojiPicker(false);
      fetchCategories();
    }
    setSaving(false);
  };

  // Supprimer une catégorie
  const handleDelete = async (id: string) => {
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <>
      <style>{`
        .cm-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 12px;
          border: 1.5px dashed var(--border);
          background: transparent; color: var(--text-muted);
          font-size: 12px; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.15s;
        }
        .cm-btn:hover { border-color: var(--france-blue); color: var(--france-blue); }

        .cm-modal-overlay {
          position: fixed; inset: 0; z-index: 4000;
          background: rgba(15,23,42,0.5); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: cmFade 0.2s ease-out;
        }
        .cm-modal {
          background: var(--bg-card); border-radius: 24px;
          border: 1px solid var(--border);
          width: 100%; max-width: 440px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: cmSlide 0.25s cubic-bezier(0.32,0.72,0,1);
          font-family: 'DM Sans', sans-serif;
        }
        .cm-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .cm-title { font-size: 15px; font-weight: 800; margin: 0; }
        .cm-close {
          width: 30px; height: 30px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          font-size: 16px; opacity: 0.4; transition: opacity 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .cm-close:hover { opacity: 1; }
        .cm-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; max-height: 70vh; overflow-y: auto; }

        .cm-toggle-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px; border-radius: 12px;
          background: var(--bg-input); border: 1px solid var(--border);
        }
        .cm-toggle-label { font-size: 13px; font-weight: 600; }
        .cm-toggle-sub { font-size: 11px; opacity: 0.5; margin-top: 2px; }
        .cm-toggle {
          position: relative; width: 40px; height: 22px;
          background: var(--border); border-radius: 99px;
          cursor: pointer; border: none; transition: background 0.2s;
          flex-shrink: 0;
        }
        .cm-toggle.on { background: var(--france-blue); }
        .cm-toggle-thumb {
          position: absolute; top: 2px; left: 2px;
          width: 18px; height: 18px; border-radius: 50%; background: white;
          transition: transform 0.2s;
        }
        .cm-toggle.on .cm-toggle-thumb { transform: translateX(18px); }

        .cm-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; opacity: 0.4; }

        .cm-cat-list { display: flex; flex-direction: column; gap: 6px; }
        .cm-cat-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 10px;
          background: var(--bg-input); border: 1px solid var(--border);
        }
        .cm-cat-icon { font-size: 18px; flex-shrink: 0; }
        .cm-cat-name { font-size: 13px; font-weight: 600; flex: 1; }
        .cm-cat-del {
          background: none; border: none; cursor: pointer;
          font-size: 13px; opacity: 0.3; transition: opacity 0.15s;
          padding: 2px 6px; border-radius: 6px;
        }
        .cm-cat-del:hover { opacity: 1; color: #EF4444; }
        .cm-default-badge {
          font-size: 9px; font-weight: 700; text-transform: uppercase;
          opacity: 0.3; letter-spacing: 0.05em;
        }

        .cm-add-row { display: flex; gap: 8px; align-items: center; }
        .cm-emoji-btn {
          width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
          background: var(--bg-input); border: 1.5px solid var(--border);
          font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s;
        }
        .cm-emoji-btn:hover { border-color: var(--france-blue); }
        .cm-name-input {
          flex: 1; padding: 10px 12px; border-radius: 10px;
          border: 1.5px solid var(--border); background: var(--bg-input);
          font-size: 13px; font-family: inherit; outline: none;
          transition: border-color 0.15s;
        }
        .cm-name-input:focus { border-color: var(--france-blue); }
        .cm-add-btn {
          padding: 10px 16px; border-radius: 10px; border: none;
          background: var(--france-blue); color: white;
          font-size: 12px; font-weight: 700; font-family: inherit;
          cursor: pointer; white-space: nowrap; transition: filter 0.15s;
          flex-shrink: 0;
        }
        .cm-add-btn:hover:not(:disabled) { filter: brightness(1.1); }
        .cm-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .cm-emoji-grid {
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px;
          padding: 10px; background: var(--bg-input); border-radius: 12px;
          border: 1px solid var(--border);
        }
        .cm-emoji-opt {
          width: 36px; height: 36px; border-radius: 8px; border: none;
          background: none; font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.1s;
        }
        .cm-emoji-opt:hover { background: var(--border); }
        .cm-emoji-opt.selected { background: var(--france-blue); }

        .cm-error { font-size: 12px; color: #EF4444; }

        @keyframes cmFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cmSlide {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Bouton d'ouverture */}
      <button type="button" className="cm-btn" onClick={() => setOpen(true)}>
        ⚙️ Gérer mes catégories
      </button>

      {/* Modale */}
      {open && (
        <div className="cm-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="cm-modal">

            <div className="cm-header">
              <h3 className="cm-title">🗂 Mes catégories</h3>
              <button className="cm-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="cm-body">

              {/* Toggle catégories par défaut */}
              <div className="cm-toggle-row">
                <div>
                  <p className="cm-toggle-label">Catégories par défaut</p>
                  <p className="cm-toggle-sub">Couches, Lait, Santé, Soins…</p>
                </div>
                <button
                  type="button"
                  className={`cm-toggle${useDefaults ? " on" : ""}`}
                  onClick={() => handleToggleDefaults(!useDefaults)}
                >
                  <div className="cm-toggle-thumb" />
                </button>
              </div>

              {/* Mes catégories personnalisées */}
              {userCategories.length > 0 && (
                <div>
                  <p className="cm-section-title" style={{ marginBottom: 8 }}>Mes catégories</p>
                  <div className="cm-cat-list">
                    {userCategories.map(cat => (
                      <div key={cat.id} className="cm-cat-item">
                        <span className="cm-cat-icon">{cat.icon}</span>
                        <span className="cm-cat-name">{cat.name}</span>
                        <button
                          type="button"
                          className="cm-cat-del"
                          onClick={() => handleDelete(cat.id)}
                          aria-label={`Supprimer ${cat.name}`}
                        >🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catégories par défaut en lecture */}
              {useDefaults && (
                <div>
                  <p className="cm-section-title" style={{ marginBottom: 8 }}>Catégories incluses par défaut</p>
                  <div className="cm-cat-list">
                    {DEFAULT_CATEGORIES.map(cat => (
                      <div key={cat.name} className="cm-cat-item">
                        <span className="cm-cat-icon">{cat.icon}</span>
                        <span className="cm-cat-name">{cat.name}</span>
                        <span className="cm-default-badge">défaut</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ajouter une catégorie */}
              <div>
                <p className="cm-section-title" style={{ marginBottom: 8 }}>Ajouter une catégorie</p>

                {/* Sélecteur emoji */}
                <div style={{ marginBottom: 8 }}>
                  <button
                    type="button"
                    className="cm-emoji-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Choisir un emoji"
                  >
                    {newIcon}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="cm-emoji-grid" style={{ marginBottom: 8 }}>
                    {EMOJI_LIST.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className={`cm-emoji-opt${newIcon === emoji ? " selected" : ""}`}
                        onClick={() => { setNewIcon(emoji); setShowEmojiPicker(false); }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="cm-add-row">
                  <input
                    className="cm-name-input"
                    placeholder="Ex : Garde d'enfant"
                    value={newName}
                    maxLength={30}
                    onChange={(e) => { setNewName(e.target.value); setError(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <button
                    type="button"
                    className="cm-add-btn"
                    onClick={handleAdd}
                    disabled={saving || !newName.trim()}
                  >
                    {saving ? "…" : "+ Ajouter"}
                  </button>
                </div>
                {error && <p className="cm-error" style={{ marginTop: 6 }}>{error}</p>}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}