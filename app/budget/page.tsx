'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ModeGarde = 'creche' | 'assistante' | 'domicile' | 'parents' | 'halte';
type Tranche = 'basse' | 'moyenne' | 'haute';

// ─── HOOK DARK MODE ───────────────────────────────────────────────────────────

function useGlobalDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ─── CONSTANTES (hors composant pour éviter les dépendances manquantes) ───────

const MODES: ModeGarde[] = ['creche', 'assistante', 'domicile', 'halte', 'parents'];

const LABELS_MODE: Record<ModeGarde, string> = {
  creche:     'Crèche municipale',
  assistante: 'Assistante maternelle',
  domicile:   'Garde à domicile',
  parents:    'Garde par les parents',
  halte:      'Halte-garderie',
};

const EMOJI_MODE: Record<ModeGarde, string> = {
  creche:     '🏢',
  assistante: '🏠',
  domicile:   '👩',
  parents:    '👨‍👩‍👧',
  halte:      '🌅',
};

const COLORS_MODE: Record<ModeGarde, string> = {
  creche:     '#6366F1',
  assistante: '#0070F3',
  domicile:   '#EF4444',
  parents:    '#10B981',
  halte:      '#F59E0B',
};

// ─── BARÈMES CAF 2024 ─────────────────────────────────────────────────────────
// Source : CAF.fr — Barème PAJE et CMG 2024
// https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance

const PAJE_BASE: Record<Tranche, number> = {
  basse:   184.00,
  moyenne: 92.00,
  haute:   0,
};

// Source : service-public.fr — CMG
// https://www.service-public.fr/particuliers/vosdroits/F345
const CMG_PLAFOND = {
  assistante: { basse: 1018, moyenne: 509, haute: 254 },
  domicile:   { basse: 2085, moyenne: 1042, haute: 521 },
};

// Source : CNAF — Observatoire national de la petite enfance 2023
const TAUX_HORAIRE_ASSISTANTE = 4.5;
const HEURES_MOIS = 160;

// Source : FEPEM 2024 — https://www.fepem.fr
const TAUX_HORAIRE_DOMICILE = 13.5;

// Source : CAF — Barème PSU 2024
const TAUX_EFFORT_CRECHE: Record<Tranche, number> = { basse: 0.0219, moyenne: 0.0219, haute: 0.0219 };
const PLANCHER_CRECHE = 160;
const PLAFOND_CRECHE  = 900;

// Source : Familles de France — Enquête 2023
const TAUX_HORAIRE_HALTE: Record<Tranche, number> = { basse: 1.5, moyenne: 2.5, haute: 4.0 };
const HEURES_HALTE = 60;

// Source : INSEE — Enquête Budget des familles 2023
// https://www.insee.fr/fr/statistiques/8241854
const DEPENSES_COURANTES = {
  couches: 55, lait: 90, alimentation: 80,
  soins: 40, vetements: 50, sante: 35, loisirs: 25,
};

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

// ─── CALCUL ───────────────────────────────────────────────────────────────────

function getRevenuTranche(revenu: number): Tranche {
  const annuel = revenu * 12;
  if (annuel < 24000) return 'basse';
  if (annuel < 48000) return 'moyenne';
  return 'haute';
}

function calculerCoutGarde(mode: ModeGarde, revenu: number): { brut: number; aide: number; net: number } {
  const tranche = getRevenuTranche(revenu);
  switch (mode) {
    case 'creche': {
      const brut = Math.max(PLANCHER_CRECHE, Math.min(PLAFOND_CRECHE, revenu * TAUX_EFFORT_CRECHE[tranche]));
      return { brut: Math.round(brut), aide: 0, net: Math.round(brut) };
    }
    case 'assistante': {
      const brut = TAUX_HORAIRE_ASSISTANTE * HEURES_MOIS;
      const aide = CMG_PLAFOND.assistante[tranche];
      return { brut: Math.round(brut), aide: Math.round(aide), net: Math.round(Math.max(0, brut - aide)) };
    }
    case 'domicile': {
      const brut = TAUX_HORAIRE_DOMICILE * HEURES_MOIS;
      const aide = CMG_PLAFOND.domicile[tranche];
      return { brut: Math.round(brut), aide: Math.round(aide), net: Math.round(Math.max(0, brut - aide)) };
    }
    case 'parents':
      return { brut: 0, aide: 0, net: 0 };
    case 'halte': {
      const brut = TAUX_HORAIRE_HALTE[tranche] * HEURES_HALTE;
      return { brut: Math.round(brut), aide: 0, net: Math.round(brut) };
    }
  }
}

function calculerDepensesCourantes(allaitement: boolean) {
  const base = { ...DEPENSES_COURANTES, lait: allaitement ? 0 : DEPENSES_COURANTES.lait };
  return { ...base, total: Object.values(base).reduce((a, b) => a + b, 0) };
}

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

function SliderInput({ label, sublabel, value, min, max, step = 100, unit = '€', onChange, cv }: {
  label: string; sublabel?: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void; cv: any;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: cv.text, margin: 0 }}>{label}</p>
          {sublabel && <p style={{ fontSize: 11, color: cv.textMuted, margin: '2px 0 0' }}>{sublabel}</p>}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0070F3' }}>
          {value.toLocaleString('fr-FR')} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0070F3', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: cv.textMuted, marginTop: 4 }}>
        <span>{min.toLocaleString('fr-FR')} {unit}</span>
        <span>{max.toLocaleString('fr-FR')} {unit}</span>
      </div>
    </div>
  );
}

function Tag({ label, value, color, cv }: { label: string; value: string; color: string; cv: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: cv.tagBg, borderRadius: 6, padding: '3px 8px' }}>
      <span style={{ fontSize: 10, color: cv.textMuted, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function ResultCard({ mode, coutGarde, depenses, paje, selected, onClick, cv }: {
  mode: ModeGarde; coutGarde: { brut: number; aide: number; net: number };
  depenses: number; paje: number; selected: boolean; onClick: () => void; cv: any;
}) {
  const [hovered, setHovered] = useState(false);
  const total = Math.max(0, coutGarde.net + depenses - paje);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? cv.accentBg : hovered ? cv.rowHover : cv.card,
        border: `2px solid ${selected ? '#0070F3' : hovered ? cv.borderHover : cv.border}`,
        borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative',
        transform: hovered && !selected ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -8, right: 12,
          background: '#0070F3', color: 'white', fontSize: 10,
          fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Sélectionné</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{EMOJI_MODE[mode]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: cv.text }}>{LABELS_MODE[mode]}</span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: total === 0 ? '#10B981' : cv.text }}>
          {total.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag label="Garde" value={`${coutGarde.net} €`} color="#0070F3" cv={cv} />
        {coutGarde.aide > 0 && <Tag label="CMG déduit" value={`-${coutGarde.aide} €`} color="#10B981" cv={cv} />}
        <Tag label="Dépenses" value={`${depenses} €`} color="#6366F1" cv={cv} />
        {paje > 0 && <Tag label="PAJE déduite" value={`-${paje} €`} color="#10B981" cv={cv} />}
      </div>
    </div>
  );
}

// Renommé BudgetBarChart pour éviter le conflit avec recharts BarChart
function BudgetBarChart({ data, cv }: { data: { mode: ModeGarde; total: number }[]; cv: any }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, padding: '0 8px' }}>
      {data.map(({ mode, total }) => (
        <div key={mode} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: cv.text }}>
            {total === 0 ? 'Gratuit' : `${total.toLocaleString('fr-FR')} €`}
          </span>
          <div style={{
            width: '100%', borderRadius: '6px 6px 0 0',
            background: COLORS_MODE[mode],
            height: `${Math.max((total / max) * 100, 4)}%`,
            transition: 'height 0.4s ease',
            opacity: 0.85,
          }} />
          <span style={{ fontSize: 9, color: cv.textMuted, textAlign: 'center', lineHeight: 1.3 }}>
            {EMOJI_MODE[mode]} {LABELS_MODE[mode].split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function BudgetPrevisionnelPage() {
  const isDark = useGlobalDark();
  const [revenu, setRevenu] = useState(3000);
  const [allaitement, setAllaitement] = useState(false);
  const [modeSelectionne, setModeSelectionne] = useState<ModeGarde>('creche');

  // Palette couleurs dark/light
  const cv = useMemo(() => ({
    bg:           isDark ? '#0B0E14' : '#F8FAFC',
    card:         isDark ? '#161B26' : '#FFFFFF',
    border:       isDark ? '#2D364D' : '#E2E8F0',
    borderFaint:  isDark ? '#1E293B' : '#F1F5F9',
    borderHover:  isDark ? '#6366F1' : '#BFDBFE',
    text:         isDark ? '#F1F5F9' : '#0F172A',
    textMuted:    isDark ? '#94A3B8' : '#64748B',
    textSub:      isDark ? '#CBD5E1' : '#475569',
    accentBg:     isDark ? '#1E2D4A' : '#EFF6FF',
    accentBorder: isDark ? '#1D4ED8' : '#BFDBFE',
    rowHover:     isDark ? '#1E293B' : '#F8FAFC',
    tagBg:        isDark ? '#1E293B' : '#F8FAFC',
    // Bloc résultat sélectionné — clair en light, sombre en dark
    resultBg:     isDark ? '#0F172A' : '#F1F5F9',
    resultBorder: isDark ? '#1E293B' : '#E2E8F0',
    resultText:   isDark ? '#F1F5F9' : '#0F172A',
    resultMuted:  isDark ? '#94A3B8' : '#64748B',
    resultValue:  isDark ? '#60A5FA' : '#0070F3',
    resultLine:   isDark ? '#1E293B' : '#E2E8F0',
    resultLabelC: isDark ? '#FCA5A5' : '#EF4444',
    resultLabelG: isDark ? '#6EE7B7' : '#10B981',
    resultLabelP: isDark ? '#C4B5FD' : '#6366F1',
  }), [isDark]);

  const tranche = getRevenuTranche(revenu);
  const paje = PAJE_BASE[tranche];
  const depenses = useMemo(() => calculerDepensesCourantes(allaitement), [allaitement]);

  // MODES est défini hors composant — pas de dépendance manquante
  const resultats = useMemo(() =>
    MODES.map(mode => {
      const coutGarde = calculerCoutGarde(mode, revenu);
      return {
        mode,
        coutGarde,
        total: Math.max(0, coutGarde.net + depenses.total - paje),
      };
    }),
    [revenu, depenses.total, paje]
  );

  const selected = resultats.find(r => r.mode === modeSelectionne)!;

  return (
    <div style={{ minHeight: '100vh', background: cv.bg, fontFamily: FONT, color: cv.text }}>

      {/* ── HERO ── */}
      <div style={{ background: '#0F172A', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>
          Outil gratuit
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>
          Calculateur de budget bébé
        </h1>
        <p style={{ fontSize: 15, color: '#94A3B8', maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.7 }}>
          Estimez votre budget mensuel réel selon vos revenus et votre mode de garde — aides CAF déduites automatiquement.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Barèmes CAF 2024', href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
            { label: 'Données INSEE 2023', href: 'https://www.insee.fr/fr/statistiques/8241854' },
            { label: 'Service-public.fr CMG', href: 'https://www.service-public.fr/particuliers/vosdroits/F345' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.06)',
              padding: '4px 12px', borderRadius: 99, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>📎 {s.label}</a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

          {/* ── COLONNE GAUCHE ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Revenus */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: cv.textMuted, marginBottom: 20, margin: '0 0 20px' }}>
                💰 Vos revenus
              </p>
              <SliderInput
                label="Revenu net mensuel du foyer"
                sublabel="Les deux parents combinés"
                value={revenu} min={1000} max={8000} step={100} unit="€"
                onChange={setRevenu} cv={cv}
              />
              <div style={{
                background: tranche === 'basse' ? '#F0FDF4' : tranche === 'moyenne' ? '#EFF6FF' : '#FEF2F2',
                border: `1px solid ${tranche === 'basse' ? '#BBF7D0' : tranche === 'moyenne' ? '#BFDBFE' : '#FECACA'}`,
                borderRadius: 10, padding: '10px 14px',
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: tranche === 'basse' ? '#166534' : tranche === 'moyenne' ? '#1D4ED8' : '#991B1B', margin: 0 }}>
                  {tranche === 'basse' && '🟢 Tranche basse — PAJE pleine + CMG maximum'}
                  {tranche === 'moyenne' && '🔵 Tranche moyenne — PAJE réduite + CMG partiel'}
                  {tranche === 'haute' && '🔴 Tranche haute — Pas de PAJE, CMG minimum'}
                </p>
                <p style={{ fontSize: 11, color: cv.textMuted, margin: '4px 0 0' }}>
                  PAJE allocation de base : <strong>{paje} €/mois</strong>
                  {' · '}
                  <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance/la-prestation-d-accueil-du-jeune-enfant-paje/l-allocation-de-base"
                    target="_blank" rel="noopener noreferrer" style={{ color: '#0070F3', fontSize: 10 }}>
                    Source CAF →
                  </a>
                </p>
              </div>
            </div>

            {/* Allaitement */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: cv.textMuted, margin: '0 0 16px' }}>
                👶 Options
              </p>
              <div
                onClick={() => setAllaitement(!allaitement)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  background: allaitement ? (isDark ? '#0D2218' : '#F0FDF4') : cv.bg,
                  border: `1px solid ${allaitement ? '#BBF7D0' : cv.border}`,
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: cv.text }}>Allaitement maternel</p>
                  <p style={{ fontSize: 11, color: cv.textMuted, margin: '2px 0 0' }}>Économie de ~{DEPENSES_COURANTES.lait} €/mois sur le lait</p>
                </div>
                <div style={{
                  width: 40, height: 22, borderRadius: 99, position: 'relative',
                  background: allaitement ? '#10B981' : cv.border, transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: allaitement ? 20 : 2,
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </div>
            </div>

            {/* Dépenses courantes */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: cv.textMuted, margin: 0 }}>
                  🧾 Dépenses courantes estimées
                </p>
                <a href="https://www.insee.fr/fr/statistiques/8241854" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, color: cv.textMuted, textDecoration: 'none' }}>INSEE 2023 →</a>
              </div>
              {[
                { label: 'Couches',                            val: depenses.couches },
                { label: allaitement ? 'Lait (allaitement)' : 'Lait infantile', val: depenses.lait },
                { label: 'Alimentation',                       val: depenses.alimentation },
                { label: 'Soins & hygiène',                    val: depenses.soins },
                { label: 'Vêtements',                          val: depenses.vetements },
                { label: 'Santé (non remboursé)',               val: depenses.sante },
                { label: 'Loisirs',                            val: depenses.loisirs },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${cv.borderFaint}` }}>
                  <span style={{ fontSize: 13, color: cv.textSub }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: val === 0 ? cv.textMuted : cv.text }}>
                    {val === 0 ? '— €' : `${val} €`}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: cv.text }}>Total dépenses courantes</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#6366F1' }}>{depenses.total} €</span>
              </div>
            </div>
          </div>

          {/* ── COLONNE DROITE ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Graphique */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: cv.textMuted, margin: '0 0 4px' }}>
                📊 Comparaison des modes de garde
              </p>
              <p style={{ fontSize: 11, color: cv.textMuted, margin: '0 0 20px' }}>Coût mensuel net après aides CAF et dépenses courantes</p>
              <BudgetBarChart data={resultats.map(r => ({ mode: r.mode, total: r.total }))} cv={cv} />
            </div>

            {/* Liste modes */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: cv.textMuted, margin: '0 0 16px' }}>
                🔍 Détail par mode de garde
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resultats.map(r => (
                  <ResultCard
                    key={r.mode} mode={r.mode} coutGarde={r.coutGarde}
                    depenses={depenses.total} paje={paje}
                    selected={modeSelectionne === r.mode}
                    onClick={() => setModeSelectionne(r.mode)}
                    cv={cv}
                  />
                ))}
              </div>
            </div>

            {/* Bloc résultat sélectionné — clair en light, sombre en dark */}
            <div style={{ background: cv.resultBg, borderRadius: 20, padding: '24px', border: `1px solid ${cv.resultBorder}` }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: cv.resultMuted, margin: '0 0 8px' }}>
                {EMOJI_MODE[modeSelectionne]} {LABELS_MODE[modeSelectionne]} — Budget mensuel estimé
              </p>
              <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: cv.resultValue, letterSpacing: '-1.5px', margin: '0 0 4px' }}>
                {selected.total.toLocaleString('fr-FR')} €/mois
              </p>
              <p style={{ fontSize: 13, color: cv.resultMuted, margin: '0 0 20px', lineHeight: 1.6 }}>
                Soit environ <strong style={{ color: cv.resultMuted }}>{(selected.total * 12).toLocaleString('fr-FR')} €/an</strong> pour la première année.
              </p>
              <div style={{ borderTop: `1px solid ${cv.resultLine}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Coût garde brut',    val: selected.coutGarde.brut,  color: cv.resultLabelC },
                  { label: 'CMG déduit',          val: -selected.coutGarde.aide, color: cv.resultLabelG },
                  { label: 'Dépenses courantes',  val: depenses.total,           color: cv.resultLabelP },
                  { label: 'PAJE déduite',        val: -paje,                    color: cv.resultLabelG },
                ].map(({ label, val, color }) => val !== 0 && (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: cv.resultMuted }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color }}>
                      {val > 0 ? '+' : ''}{val.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avertissement + sources */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', margin: '0 0 6px' }}>⚠️ Estimation indicative</p>
              <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, margin: '0 0 10px' }}>
                Ces chiffres sont des moyennes nationales. Vérifiez vos droits réels sur les simulateurs officiels.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Simulateur CAF — Mes droits',     href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
                  { label: 'Service-public.fr — CMG',         href: 'https://www.service-public.fr/particuliers/vosdroits/F345' },
                  { label: 'Mon-enfant.fr — Trouver une crèche', href: 'https://www.mon-enfant.fr' },
                  { label: 'FEPEM — Tarifs garde à domicile', href: 'https://www.fepem.fr' },
                  { label: 'CNAF — Rapport ONPE 2023',        href: 'https://www.caf.fr/sites/default/files/cnaf/Documents/Dossiers_documentaires/ONPE/Rapport_ONPE_2023.pdf' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#B45309', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🔗 {label}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: cv.accentBg, border: `1px solid ${cv.accentBorder}`, borderRadius: 16, padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#60A5FA' : '#1D4ED8', margin: '0 0 6px' }}>
                Suivez vos vraies dépenses
              </p>
              <p style={{ fontSize: 13, color: isDark ? '#93C5FD' : '#3B82F6', margin: '0 0 16px', lineHeight: 1.5 }}>
                Comparez votre budget estimé avec vos dépenses réelles dans le dashboard BabyBudget.
              </p>
              <Link href="/app" style={{
                display: 'inline-block', background: '#0F172A', color: 'white',
                padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}>
                Accéder au dashboard →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}