"use client";

import { useState } from "react";
import { supabase } from "../../supabaseClient";

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [childName, setChildName] = useState("");
  const [budget, setBudget] = useState("");
  const [loadingChild, setLoadingChild] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [childSaved, setChildSaved] = useState(false);
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveChild = async () => {
    if (!childName.trim()) return;
    setLoadingChild(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from("profiles")
        .insert([{ name: childName.trim() }]);
      if (err) throw err;
      setChildSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingChild(false);
    }
  };

  const handleSaveBudget = async () => {
    const val = parseFloat(budget);
    if (isNaN(val) || val <= 0) { setError("Entrez un montant valide."); return; }
    setLoadingBudget(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from("settings")
        .upsert(
          { key: "monthly_budget", value: budget },
          { onConflict: "key" }
        );
      if (err) throw err;
      setBudgetSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingBudget(false);
    }
  };

  const steps = [
    { num: 1, label: "Votre enfant" },
    { num: 2, label: "Votre budget" },
    { num: 3, label: "C'est parti !" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ob-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(15,23,42,0.5);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: obFadeIn 0.3s ease-out;
        }

        .ob-card {
          background: white; border-radius: 28px;
          width: 100%; max-width: 480px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: obSlideUp 0.35s cubic-bezier(0.32,0.72,0,1);
          font-family: 'DM Sans', sans-serif;
        }

        .ob-header {
          background: #0F172A;
          padding: 28px 32px 24px;
          position: relative;
        }

        .ob-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .ob-logo-icon { width: 30px; height: 30px; background: #6366F1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .ob-logo-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; color: white; letter-spacing: -0.02em; }

        .ob-steps { display: flex; align-items: center; gap: 0; }
        .ob-step-item { display: flex; align-items: center; gap: 6px; }
        .ob-step-dot {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          transition: all 0.2s;
        }
        .ob-step-dot.active { background: #6366F1; color: white; }
        .ob-step-dot.done { background: #10B981; color: white; }
        .ob-step-dot.pending { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); }
        .ob-step-label { font-size: 11px; font-weight: 500; }
        .ob-step-label.active { color: white; }
        .ob-step-label.done { color: rgba(255,255,255,0.5); }
        .ob-step-label.pending { color: rgba(255,255,255,0.25); }
        .ob-step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); margin: 0 8px; min-width: 20px; }

        .ob-body { padding: 32px; }

        .ob-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6366F1; margin: 0 0 8px; }
        .ob-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.5rem; color: #0F172A; letter-spacing: -0.03em; margin: 0 0 8px; line-height: 1.2; }
        .ob-sub { font-size: 14px; color: #64748B; margin: 0 0 24px; line-height: 1.6; }

        .ob-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .ob-input-row { display: flex; gap: 8px; }
        .ob-input {
          flex: 1; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 12px;
          font-size: 14px; font-family: 'DM Sans', sans-serif; color: #0F172A;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ob-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .ob-input:disabled { opacity: 0.5; background: #F8FAFC; }

        .ob-btn-add {
          padding: 12px 20px; border-radius: 12px; border: none;
          background: #0F172A; color: white;
          font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.15s; white-space: nowrap;
          flex-shrink: 0;
        }
        .ob-btn-add:hover:not(:disabled) { background: #1E293B; }
        .ob-btn-add:disabled { opacity: 0.45; cursor: not-allowed; }
        .ob-btn-add.saved { background: #10B981; }

        .ob-saved-msg { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #10B981; font-weight: 500; margin-top: 10px; }

        .ob-error { font-size: 12px; color: #EF4444; margin-top: 6px; }

        .ob-btn-next {
          width: 100%; padding: 14px; margin-top: 24px;
          background: #6366F1; color: white; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ob-btn-next:hover { background: #4F46E5; }
        .ob-btn-next:active { transform: scale(0.99); }

        .ob-skip { display: block; text-align: center; margin-top: 12px; font-size: 12px; color: #94A3B8; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; width: 100%; }
        .ob-skip:hover { color: #64748B; }

        .ob-feature-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
        .ob-feature { display: flex; align-items: flex-start; gap: 12px; }
        .ob-feature-icon { width: 36px; height: 36px; border-radius: 10px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .ob-feature-text strong { display: block; font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 2px; }
        .ob-feature-text span { font-size: 13px; color: #64748B; }

        .ob-cta {
          width: 100%; padding: 16px; margin-top: 28px;
          background: #0F172A; color: white; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.15s;
        }
        .ob-cta:hover { background: #1E293B; }

        @keyframes obFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes obSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="ob-overlay">
        <div className="ob-card">

          {/* Header avec steps */}
          <div className="ob-header">
            <div className="ob-logo">
              <div className="ob-logo-icon">👶</div>
              <span className="ob-logo-name">BabyBudget</span>
            </div>
            <div className="ob-steps">
              {steps.map((s, i) => {
                const state = s.num < step ? "done" : s.num === step ? "active" : "pending";
                return (
                  <div key={s.num} className="ob-step-item" style={{ flex: i < steps.length - 1 ? 1 : 0 }}>
                    <div className={`ob-step-dot ${state}`}>
                      {state === "done" ? "✓" : s.num}
                    </div>
                    <span className={`ob-step-label ${state}`}>{s.label}</span>
                    {i < steps.length - 1 && <div className="ob-step-line" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="ob-body">

            {/* ── ÉTAPE 1 : Ajouter un enfant ── */}
            {step === 1 && (
              <>
                <p className="ob-eyebrow">Étape 1 sur 3</p>
                <h2 className="ob-title">Quel est le prénom<br />de votre enfant ?</h2>
                <p className="ob-sub">
                  BabyBudget suit les dépenses par enfant. Vous pourrez en ajouter d'autres plus tard.
                </p>

                <label htmlFor="ob-child" className="ob-label">Prénom de l'enfant</label>
                <div className="ob-input-row">
                  <input
                    id="ob-child"
                    className="ob-input"
                    placeholder="Ex : Emma, Lucas…"
                    value={childName}
                    onChange={(e) => { setChildName(e.target.value); setError(null); }}
                    disabled={childSaved || loadingChild}
                    onKeyDown={(e) => e.key === "Enter" && !childSaved && handleSaveChild()}
                    autoFocus
                  />
                  <button
                    className={`ob-btn-add${childSaved ? " saved" : ""}`}
                    onClick={handleSaveChild}
                    disabled={!childName.trim() || childSaved || loadingChild}
                  >
                    {loadingChild ? "…" : childSaved ? "✓ Ajouté" : "Ajouter"}
                  </button>
                </div>
                {childSaved && (
                  <p className="ob-saved-msg">
                    <span>✅</span> {childName} a été ajouté·e à votre famille !
                  </p>
                )}
                {error && <p className="ob-error">{error}</p>}

                <button
                  className="ob-btn-next"
                  onClick={() => { setError(null); setStep(2); }}
                  disabled={!childSaved}
                >
                  Continuer →
                </button>
                <button className="ob-skip" onClick={() => { setError(null); setStep(2); }}>
                  Passer cette étape
                </button>
              </>
            )}

            {/* ── ÉTAPE 2 : Budget mensuel ── */}
            {step === 2 && (
              <>
                <p className="ob-eyebrow">Étape 2 sur 3</p>
                <h2 className="ob-title">Quel est votre budget<br />mensuel ?</h2>
                <p className="ob-sub">
                  En France, un bébé coûte en moyenne <strong>700 €/mois</strong> la première année. Définissez votre budget pour suivre vos dépenses en temps réel.
                </p>

                <label htmlFor="ob-budget" className="ob-label">Budget mensuel (€)</label>
                <div className="ob-input-row">
                  <input
                    id="ob-budget"
                    type="number"
                    className="ob-input"
                    placeholder="Ex : 600"
                    min="1"
                    value={budget}
                    onChange={(e) => { setBudget(e.target.value); setError(null); }}
                    disabled={budgetSaved || loadingBudget}
                    onKeyDown={(e) => e.key === "Enter" && !budgetSaved && handleSaveBudget()}
                    autoFocus
                  />
                  <button
                    className={`ob-btn-add${budgetSaved ? " saved" : ""}`}
                    onClick={handleSaveBudget}
                    disabled={!budget || budgetSaved || loadingBudget}
                  >
                    {loadingBudget ? "…" : budgetSaved ? "✓ Enregistré" : "Valider"}
                  </button>
                </div>
                {budgetSaved && (
                  <p className="ob-saved-msg">
                    <span>✅</span> Budget de {parseFloat(budget).toFixed(0)} €/mois enregistré !
                  </p>
                )}
                {error && <p className="ob-error">{error}</p>}

                <button
                  className="ob-btn-next"
                  onClick={() => { setError(null); setStep(3); }}
                  disabled={!budgetSaved}
                >
                  Continuer →
                </button>
                <button className="ob-skip" onClick={() => { setError(null); setStep(3); }}>
                  Passer cette étape
                </button>
              </>
            )}

            {/* ── ÉTAPE 3 : Récap et démarrage ── */}
            {step === 3 && (
              <>
                <p className="ob-eyebrow">Tout est prêt !</p>
                <h2 className="ob-title">Bienvenue sur<br />BabyBudget 🎉</h2>
                <p className="ob-sub">Voici ce que vous pouvez faire dès maintenant :</p>

                <div className="ob-feature-list">
                  <div className="ob-feature">
                    <div className="ob-feature-icon">💸</div>
                    <div className="ob-feature-text">
                      <strong>Ajouter une dépense</strong>
                      <span>Saisissez vos achats en 3 secondes depuis le dashboard</span>
                    </div>
                  </div>
                  <div className="ob-feature">
                    <div className="ob-feature-icon">📊</div>
                    <div className="ob-feature-text">
                      <strong>Analyser vos dépenses</strong>
                      <span>Graphiques et insights automatiques dans l'onglet Analyse</span>
                    </div>
                  </div>
                  <div className="ob-feature">
                    <div className="ob-feature-icon">🇫🇷</div>
                    <div className="ob-feature-text">
                      <strong>Comparer à la moyenne nationale</strong>
                      <span>Données INSEE/CAF dans l'onglet Comparaison</span>
                    </div>
                  </div>
                </div>

                <button className="ob-cta" onClick={onComplete}>
                  Accéder à mon dashboard →
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}