'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ModeGarde = 'creche' | 'assistante' | 'domicile' | 'parents' | 'halte';
type Tranche = 'basse' | 'moyenne' | 'haute';

// ─── BARÈMES CAF 2024 ─────────────────────────────────────────────────────────
// Source : CAF.fr — Barème PAJE et CMG 2024
// https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance

const PAJE_BASE = {
  basse:   184.00, // Revenus < 24 000 €/an
  moyenne: 92.00,  // Revenus 24 000 – 48 000 €/an
  haute:   0,      // Revenus > 48 000 €/an
};

// CMG (Complément Mode de Garde) — plafonds mensuels 2024
// Source : service-public.fr — CMG
// https://www.service-public.fr/particuliers/vosdroits/F345
const CMG_PLAFOND = {
  assistante: { basse: 1018, moyenne: 509, haute: 254 },  // 1 enfant
  domicile:   { basse: 2085, moyenne: 1042, haute: 521 }, // 1 enfant
};

// Coût horaire moyen assistante maternelle
// Source : CNAF — Observatoire national de la petite enfance 2023
// https://www.caf.fr/sites/default/files/cnaf/Documents/Dossiers_documentaires/ONPE/Rapport_ONPE_2023.pdf
const TAUX_HORAIRE_ASSISTANTE = 4.5; // €/h brut moyen national
const HEURES_MOIS = 160; // base 40h/semaine

// Coût garde à domicile
// Source : FEPEM — Fédération des particuliers employeurs 2024
// https://www.fepem.fr
const TAUX_HORAIRE_DOMICILE = 13.5; // €/h net moyen

// Coût crèche municipale (participation famille)
// Source : CAF — Barème participation familiale PSU 2024
// https://www.caf.fr/partenaires/caf-du-finistere/partenaires-locaux/etablissements-d-accueil-du-jeune-enfant/le-financement-des-eaje/la-prestation-de-service-unique-psu
const TAUX_EFFORT_CRECHE: Record<Tranche, number> = {
  basse:   0.0219, // % du revenu mensuel net
  moyenne: 0.0219,
  haute:   0.0219,
};
const PLANCHER_CRECHE = 160; // € min/mois
const PLAFOND_CRECHE  = 900; // € max/mois (estimé)

// Halte-garderie (tarif horaire moyen)
// Source : Associations Familles de France — Enquête 2023
const TAUX_HORAIRE_HALTE: Record<Tranche, number> = {
  basse:   1.5,
  moyenne: 2.5,
  haute:   4.0,
};
const HEURES_HALTE = 60; // ~15h/semaine

// Dépenses courantes bébé (hors mode de garde)
// Source : INSEE — Enquête Budget des familles 2023
// https://www.insee.fr/fr/statistiques/8241854
const DEPENSES_COURANTES = {
  couches:       55,  // €/mois
  lait:          90,  // €/mois (si non allaitement)
  alimentation:  80,  // €/mois (diversification dès 6 mois)
  soins:         40,  // €/mois
  vetements:     50,  // €/mois (moyenne lissée)
  sante:         35,  // €/mois (visites, médicaments non remboursés)
  loisirs:       25,  // €/mois
};

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

// ─── CALCUL ───────────────────────────────────────────────────────────────────

function getRevenuTranche(revenuMensuelNet: number): Tranche {
  const annuel = revenuMensuelNet * 12;
  if (annuel < 24000) return 'basse';
  if (annuel < 48000) return 'moyenne';
  return 'haute';
}

function calculerCoutGarde(mode: ModeGarde, revenuMensuelNet: number, allaitement: boolean): {
  brut: number;
  aide: number;
  net: number;
} {
  const tranche = getRevenuTranche(revenuMensuelNet);

  switch (mode) {
    case 'creche': {
      const brut = Math.max(PLANCHER_CRECHE, Math.min(PLAFOND_CRECHE, revenuMensuelNet * TAUX_EFFORT_CRECHE[tranche]));
      return { brut: Math.round(brut), aide: 0, net: Math.round(brut) };
    }
    case 'assistante': {
      const brut = TAUX_HORAIRE_ASSISTANTE * HEURES_MOIS;
      const aide = CMG_PLAFOND.assistante[tranche];
      const net = Math.max(0, brut - aide);
      return { brut: Math.round(brut), aide: Math.round(aide), net: Math.round(net) };
    }
    case 'domicile': {
      const brut = TAUX_HORAIRE_DOMICILE * HEURES_MOIS;
      const aide = CMG_PLAFOND.domicile[tranche];
      const net = Math.max(0, brut - aide);
      return { brut: Math.round(brut), aide: Math.round(aide), net: Math.round(net) };
    }
    case 'parents': {
      return { brut: 0, aide: 0, net: 0 };
    }
    case 'halte': {
      const brut = TAUX_HORAIRE_HALTE[tranche] * HEURES_HALTE;
      return { brut: Math.round(brut), aide: 0, net: Math.round(brut) };
    }
  }
}

function calculerDepensesCourantes(allaitement: boolean) {
  return {
    ...DEPENSES_COURANTES,
    lait: allaitement ? 0 : DEPENSES_COURANTES.lait,
    total: Object.values({
      ...DEPENSES_COURANTES,
      lait: allaitement ? 0 : DEPENSES_COURANTES.lait,
    }).reduce((a, b) => a + b, 0),
  };
}

// ─── COMPOSANTS ───────────────────────────────────────────────────────────────

function SliderInput({ label, value, min, max, step = 100, unit = '€', onChange, sublabel }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void; sublabel?: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{label}</p>
          {sublabel && <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{sublabel}</p>}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0070F3' }}>
          {value.toLocaleString('fr-FR')} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#0070F3', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
        <span>{min.toLocaleString('fr-FR')} {unit}</span>
        <span>{max.toLocaleString('fr-FR')} {unit}</span>
      </div>
    </div>
  );
}

function ResultCard({ mode, coutGarde, depenses, paje, selected, onClick }: {
  mode: ModeGarde; coutGarde: { brut: number; aide: number; net: number };
  depenses: number; paje: number; selected: boolean; onClick: () => void;
}) {
  const total = coutGarde.net + depenses - paje;
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#EFF6FF' : 'white',
        border: `2px solid ${selected ? '#0070F3' : '#E2E8F0'}`,
        borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -8, right: 12,
          background: '#0070F3', color: 'white', fontSize: 10,
          fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>Sélectionné</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{EMOJI_MODE[mode]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{LABELS_MODE[mode]}</span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: total < 0 ? '#10B981' : '#0F172A' }}>
          {Math.max(0, total).toLocaleString('fr-FR')} €
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag label="Garde" value={`${coutGarde.net} €`} color="#0070F3" />
        {coutGarde.aide > 0 && <Tag label="CMG déduit" value={`-${coutGarde.aide} €`} color="#10B981" />}
        <Tag label="Dépenses" value={`${depenses} €`} color="#6366F1" />
        {paje > 0 && <Tag label="PAJE déduite" value={`-${paje} €`} color="#10B981" />}
      </div>
    </div>
  );
}

function Tag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F8FAFC', borderRadius: 6, padding: '3px 8px' }}>
      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function BarChart({ data }: { data: { mode: ModeGarde; total: number }[] }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, padding: '0 8px' }}>
      {data.map(({ mode, total }) => (
        <div key={mode} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>
            {total === 0 ? 'Gratuit' : `${total.toLocaleString('fr-FR')} €`}
          </span>
          <div style={{
            width: '100%', borderRadius: '6px 6px 0 0',
            background: COLORS_MODE[mode],
            height: `${Math.max((total / max) * 100, 4)}%`,
            transition: 'height 0.4s ease',
            opacity: 0.85,
          }} />
          <span style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center', lineHeight: 1.3 }}>
            {EMOJI_MODE[mode]} {LABELS_MODE[mode].split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function BudgetPrevisionnelPage() {
  const [revenu, setRevenu] = useState(3000);
  const [allaitement, setAllaitement] = useState(false);
  const [modeSelectionne, setModeSelectionne] = useState<ModeGarde>('creche');

  const tranche = getRevenuTranche(revenu);
  const paje = PAJE_BASE[tranche];
  const depenses = calculerDepensesCourantes(allaitement);
  const modes: ModeGarde[] = ['creche', 'assistante', 'domicile', 'halte', 'parents'];

  const resultats = useMemo(() =>
    modes.map(mode => ({
      mode,
      coutGarde: calculerCoutGarde(mode, revenu, allaitement),
      total: Math.max(0, calculerCoutGarde(mode, revenu, allaitement).net + depenses.total - paje),
    })),
    [revenu, allaitement, depenses.total, paje]
  );

  const selected = resultats.find(r => r.mode === modeSelectionne)!;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      color: '#0F172A',
    }}>

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
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: 99, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'color 0.15s' }}>
              📎 {s.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

          {/* ── COLONNE GAUCHE : Paramètres ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Revenus */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 20 }}>
                💰 Vos revenus
              </p>
              <SliderInput
                label="Revenu net mensuel du foyer"
                sublabel="Les deux parents combinés"
                value={revenu} min={1000} max={8000} step={100} unit="€"
                onChange={setRevenu}
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
                <p style={{ fontSize: 11, color: '#64748B', margin: '4px 0 0' }}>
                  PAJE allocation de base : <strong>{paje} €/mois</strong>
                  {' '}·{' '}
                  <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance/la-prestation-d-accueil-du-jeune-enfant-paje/l-allocation-de-base"
                    target="_blank" rel="noopener noreferrer" style={{ color: '#0070F3', fontSize: 10 }}>
                    Source CAF →
                  </a>
                </p>
              </div>
            </div>

            {/* Options */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16 }}>
                👶 Options
              </p>
              <div
                onClick={() => setAllaitement(!allaitement)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  background: allaitement ? '#F0FDF4' : '#F8FAFC',
                  border: `1px solid ${allaitement ? '#BBF7D0' : '#E2E8F0'}`,
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#0F172A' }}>Allaitement maternel</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>Économie de ~{DEPENSES_COURANTES.lait} €/mois sur le lait</p>
                </div>
                <div style={{
                  width: 40, height: 22, borderRadius: 99, position: 'relative',
                  background: allaitement ? '#10B981' : '#E2E8F0', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: allaitement ? 20 : 2,
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s',
                  }} />
                </div>
              </div>
            </div>

            {/* Dépenses courantes */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', margin: 0 }}>
                  🧾 Dépenses courantes estimées
                </p>
                <a href="https://www.insee.fr/fr/statistiques/8241854" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, color: '#94A3B8', textDecoration: 'none' }}>INSEE 2023 →</a>
              </div>
              {[
                { label: 'Couches', val: depenses.couches },
                { label: allaitement ? 'Lait (allaitement)' : 'Lait infantile', val: depenses.lait },
                { label: 'Alimentation', val: depenses.alimentation },
                { label: 'Soins & hygiène', val: depenses.soins },
                { label: 'Vêtements', val: depenses.vetements },
                { label: 'Santé (non remboursé)', val: depenses.sante },
                { label: 'Loisirs', val: depenses.loisirs },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: val === 0 ? '#94A3B8' : '#0F172A' }}>
                    {val === 0 ? '— €' : `${val} €`}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Total dépenses courantes</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#6366F1' }}>{depenses.total} €</span>
              </div>
            </div>
          </div>

          {/* ── COLONNE DROITE : Résultats ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Graphique comparaison */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4 }}>
                📊 Comparaison des modes de garde
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 20 }}>Coût mensuel net après aides CAF et dépenses courantes</p>
              <BarChart data={resultats.map(r => ({ mode: r.mode, total: r.total }))} />
            </div>

            {/* Liste des modes */}
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16 }}>
                🔍 Détail par mode de garde
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resultats.map(r => (
                  <ResultCard
                    key={r.mode}
                    mode={r.mode}
                    coutGarde={r.coutGarde}
                    depenses={depenses.total}
                    paje={paje}
                    selected={modeSelectionne === r.mode}
                    onClick={() => setModeSelectionne(r.mode)}
                  />
                ))}
              </div>
            </div>

            {/* Budget total sélectionné */}
            <div style={{ background: '#0F172A', borderRadius: 20, padding: '24px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', marginBottom: 8 }}>
                {EMOJI_MODE[modeSelectionne]} {LABELS_MODE[modeSelectionne]} — Budget mensuel estimé
              </p>
              <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#60A5FA', letterSpacing: '-1.5px', margin: '0 0 4px' }}>
                {selected.total.toLocaleString('fr-FR')} €/mois
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 20px', lineHeight: 1.6 }}>
                Soit environ <strong style={{ color: '#94A3B8' }}>{(selected.total * 12).toLocaleString('fr-FR')} €/an</strong> pour la première année.
              </p>
              <div style={{ borderTop: '1px solid #1E293B', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Coût garde brut', val: selected.coutGarde.brut, color: '#FCA5A5' },
                  { label: 'CMG déduit', val: -selected.coutGarde.aide, color: '#6EE7B7' },
                  { label: 'Dépenses courantes', val: depenses.total, color: '#C4B5FD' },
                  { label: 'PAJE déduite', val: -paje, color: '#6EE7B7' },
                ].map(({ label, val, color }) => val !== 0 && (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color }}>
                      {val > 0 ? '+' : ''}{val.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avertissement + liens officiels */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 6 }}>⚠️ Estimation indicative</p>
              <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, margin: '0 0 10px' }}>
                Ces chiffres sont des moyennes nationales. Vérifiez vos droits réels sur les simulateurs officiels.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Simulateur CAF — Mes droits', href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
                  { label: 'Service-public.fr — CMG', href: 'https://www.service-public.fr/particuliers/vosdroits/F345' },
                  { label: 'Mon-enfant.fr — Trouver une crèche', href: 'https://www.mon-enfant.fr' },
                  { label: 'FEPEM — Tarifs garde à domicile', href: 'https://www.fepem.fr' },
                  { label: 'CNAF — Rapport ONPE 2023', href: 'https://www.caf.fr/sites/default/files/cnaf/Documents/Dossiers_documentaires/ONPE/Rapport_ONPE_2023.pdf' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#B45309', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🔗 {label}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA dashboard */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 6 }}>
                Suivez vos vraies dépenses
              </p>
              <p style={{ fontSize: 13, color: '#3B82F6', marginBottom: 16, lineHeight: 1.5 }}>
                Comparez votre budget estimé avec vos dépenses réelles dans le dashboard BabyBudget.
              </p>
              <Link href="/app" style={{
                display: 'inline-block', background: '#0F172A', color: 'white',
                padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
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