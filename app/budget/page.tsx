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
  creche:     '#1C6856',
  assistante: '#1C6856',
  domicile:   '#C85B56',
  parents:    '#2F8A6B',
  halte:      '#D89753',
};

// ─── BARÈMES CAF 2024 ─────────────────────────────────────────────────────────
// Source : CAF.fr — Barème PAJE et CMG 2024
// https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance

// Les aides PAJE sont saisies par l'utilisateur après vérification officielle.

// Source : service-public.fr — CMG
// https://www.service-public.fr/particuliers/vosdroits/F345
// Le CMG ne se déduit plus d'un plafond 2024 : voir simulateur Urssaf.

// Source : CNAF — Observatoire national de la petite enfance 2023
const TAUX_HORAIRE_ASSISTANTE = 4.5;
const HEURES_MOIS = 160;

// Source : FEPEM 2024 — https://www.fepem.fr
const TAUX_HORAIRE_DOMICILE = 13.5;

// Source : CAF — PSU 2026, 1 enfant à charge en crèche collective.
// Taux horaire 0,0619 % des ressources mensuelles retenues ; 160 h/mois hypothétiques.
// https://www.caf.fr/sites/default/files/medias/661/Espace-Partenaires/Documents-Partenaires/2026-Baremes-Participation-Famille-Eaje.pdf
const TAUX_EFFORT_HORAIRE_CRECHE = 0.000619;
const RESSOURCES_PLANCHER_CRECHE = 814.62;
const RESSOURCES_PLAFOND_CRECHE = 8500;

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

function calculerCoutGarde(mode: ModeGarde, revenu: number, cmgRenseigne: number): { brut: number; aide: number; net: number } {
  const tranche = getRevenuTranche(revenu);
  switch (mode) {
    case 'creche': {
      const ressources = Math.max(RESSOURCES_PLANCHER_CRECHE, Math.min(RESSOURCES_PLAFOND_CRECHE, revenu));
      const brut = ressources * TAUX_EFFORT_HORAIRE_CRECHE * HEURES_MOIS;
      return { brut: Math.round(brut), aide: 0, net: Math.round(brut) };
    }
    case 'assistante': {
      const brut = TAUX_HORAIRE_ASSISTANTE * HEURES_MOIS;
      const aide = Math.min(brut, Math.max(0, cmgRenseigne));
      return { brut: Math.round(brut), aide: Math.round(aide), net: Math.round(Math.max(0, brut - aide)) };
    }
    case 'domicile': {
      const brut = TAUX_HORAIRE_DOMICILE * HEURES_MOIS;
      const aide = Math.min(brut, Math.max(0, cmgRenseigne));
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
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1C6856' }}>
          {value.toLocaleString('fr-FR')} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#1C6856', cursor: 'pointer' }}
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
        border: `2px solid ${selected ? '#1C6856' : hovered ? cv.borderHover : cv.border}`,
        borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
        transition: 'all 0.15s', position: 'relative',
        transform: hovered && !selected ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -8, right: 12,
          background: '#1C6856', color: 'white', fontSize: 10,
          fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>Sélectionné</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{EMOJI_MODE[mode]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: cv.text }}>{LABELS_MODE[mode]}</span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: total === 0 ? '#2F8A6B' : cv.text }}>
          {total.toLocaleString('fr-FR')} €
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag label="Garde" value={`${coutGarde.net} €`} color="#1C6856" cv={cv} />
        {coutGarde.aide > 0 && <Tag label="CMG saisi" value={`-${coutGarde.aide} €`} color="#2F8A6B" cv={cv} />}
        <Tag label="Dépenses" value={`${depenses} €`} color="#1C6856" cv={cv} />
        {paje > 0 && <Tag label="PAJE saisie" value={`-${paje} €`} color="#2F8A6B" cv={cv} />}
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
  const [aideCmgRenseignee, setAideCmgRenseignee] = useState(0);
  const [aidePajeRenseignee, setAidePajeRenseignee] = useState(0);

  // Palette couleurs dark/light
  const cv = useMemo(() => ({
    bg:           isDark ? '#0B0E14' : '#F8F8F4',
    card:         isDark ? '#161B26' : '#FFFFFF',
    border:       isDark ? '#2D364D' : '#DFE7DE',
    borderFaint:  isDark ? '#214C40' : '#F0F3EE',
    borderHover:  isDark ? '#1C6856' : '#B9D8C3',
    text:         isDark ? '#F0F3EE' : '#16443D',
    textMuted:    isDark ? '#94A3B8' : '#657A6E',
    textSub:      isDark ? '#B9D0BF' : '#4D6759',
    accentBg:     isDark ? '#1E2D4A' : '#E7F1EA',
    accentBorder: isDark ? '#1C6856' : '#B9D8C3',
    rowHover:     isDark ? '#214C40' : '#F8F8F4',
    tagBg:        isDark ? '#214C40' : '#F8F8F4',
    // Bloc résultat sélectionné — clair en light, sombre en dark
    resultBg:     isDark ? '#16443D' : '#F0F3EE',
    resultBorder: isDark ? '#214C40' : '#DFE7DE',
    resultText:   isDark ? '#F0F3EE' : '#16443D',
    resultMuted:  isDark ? '#94A3B8' : '#657A6E',
    resultValue:  isDark ? '#9FCDB1' : '#1C6856',
    resultLine:   isDark ? '#214C40' : '#DFE7DE',
    resultLabelC: isDark ? '#FCA5A5' : '#C85B56',
    resultLabelG: isDark ? '#6EE7B7' : '#2F8A6B',
    resultLabelP: isDark ? '#C4B5FD' : '#1C6856',
  }), [isDark]);

  const tranche = getRevenuTranche(revenu);
  const paje = Math.max(0, aidePajeRenseignee);
  const depenses = useMemo(() => calculerDepensesCourantes(allaitement), [allaitement]);

  // MODES est défini hors composant — pas de dépendance manquante
  const resultats = useMemo(() =>
    MODES.map(mode => {
      const coutGarde = calculerCoutGarde(mode, revenu, aideCmgRenseignee);
      return {
        mode,
        coutGarde,
        total: Math.max(0, coutGarde.net + depenses.total - paje),
      };
    }),
    [revenu, depenses.total, paje, aideCmgRenseignee]
  );

  const selected = resultats.find(r => r.mode === modeSelectionne)!;

  return (
    <div style={{ minHeight: '100vh', background: cv.bg, fontFamily: FONT, color: cv.text }}>

      {/* ── HERO ── */}
      <div style={{ background: '#16443D', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1C6856', marginBottom: 12 }}>
          Outil gratuit
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>
          Préparez votre budget bébé
        </h1>
        <p style={{ fontSize: 15, color: '#94A3B8', maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.7 }}>
          Explorez différents scénarios de dépenses et de garde. Les montants sont des estimations indicatives basées sur les hypothèses de cet outil.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Vérifier mes droits CAF', href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
            { label: 'Données INSEE 2023', href: 'https://www.insee.fr/fr/statistiques/8241854' },
            { label: 'Service-public.fr CMG', href: 'https://www.service-public.fr/particuliers/vosdroits/F345' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 11, color: '#4D6759', background: 'rgba(255,255,255,0.06)',
              padding: '4px 12px', borderRadius: 99, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>📎 {s.label}</a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 80px' }}>
        <aside className="bb-data-notice" role="note">
          <strong>Simulation de budget, pas de droits sociaux.</strong> Les coûts affichés sont des hypothèses indicatives. En crèche collective PSU, le scénario suppose 1 enfant à charge, 160 heures facturées par mois et utilise le revenu saisi comme approximation des ressources CAF (année de référence potentiellement différente). Le barème appliqué est celui de 2026. Aucune aide CAF n'est calculée automatiquement : les montants déduits sont ceux que vous renseignez après vérification officielle (0 € par défaut). Depuis septembre 2025, les règles du CMG emploi direct ont changé.
        </aside>
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
                background: tranche === 'basse' ? '#EEF7EE' : tranche === 'moyenne' ? '#E7F1EA' : '#FEF2F2',
                border: `1px solid ${tranche === 'basse' ? '#BBF7D0' : tranche === 'moyenne' ? '#B9D8C3' : '#FECACA'}`,
                borderRadius: 10, padding: '10px 14px',
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#16443D', margin: 0 }}>
                  Tranche de revenu : {tranche === 'basse' ? 'basse' : tranche === 'moyenne' ? 'intermédiaire' : 'haute'} — uniquement pour les hypothèses de coût de garde.
                </p>
                <p style={{ fontSize: 11, color: '#657A6E', margin: '5px 0 0' }}>
                  Vos droits réels à la PAJE et au CMG ne peuvent pas être déduits de ce seul revenu.
                </p>
              </div>
            </div>

            {/* Aides réelles saisies par l'utilisateur, sans estimation de droit. */}
            <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: cv.text, margin: '0 0 8px' }}>Aides réellement obtenues (facultatif)</h2>
              <p style={{ fontSize: 12, color: cv.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
                Indiquez uniquement vos montants confirmés. Laissez 0 € pour afficher un coût avant aides. Le CMG s'applique ici seulement aux modes de garde en emploi direct.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <div>
                  <label htmlFor="budget-cmg" style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>CMG mensuel (emploi direct)</label>
                  <input id="budget-cmg" type="number" min="0" step="1" value={aideCmgRenseignee}
                    onChange={e => setAideCmgRenseignee(Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '100%', border: `1px solid ${cv.border}`, borderRadius: 12, padding: '10px', background: cv.bg, color: cv.text }} />
                </div>
                <div>
                  <label htmlFor="budget-paje" style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Allocation de base PAJE mensuelle</label>
                  <input id="budget-paje" type="number" min="0" step="1" value={aidePajeRenseignee}
                    onChange={e => setAidePajeRenseignee(Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '100%', border: `1px solid ${cv.border}`, borderRadius: 12, padding: '10px', background: cv.bg, color: cv.text }} />
                </div>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: 12, lineHeight: 1.6, color: cv.textMuted }}>
                <a href="https://www.urssaf.fr/accueil/actualites/evolution-cmg-ce-qui-va-changer.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1C6856', textDecoration: 'underline' }}>Simulateur officiel CMG Urssaf</a>
                {' · '}
                <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance" target="_blank" rel="noopener noreferrer" style={{ color: '#1C6856', textDecoration: 'underline' }}>Vérifier mes droits CAF</a>
              </p>
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
                  background: allaitement ? (isDark ? '#0D2218' : '#EEF7EE') : cv.bg,
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
                  background: allaitement ? '#2F8A6B' : cv.border, transition: 'background 0.2s', flexShrink: 0,
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
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1C6856' }}>{depenses.total} €</span>
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
              <p style={{ fontSize: 11, color: cv.textMuted, margin: '0 0 20px' }}>Frais de garde indicatifs ; seules les aides saisies sont déduites</p>
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
                  { label: 'CMG renseigné',          val: -selected.coutGarde.aide, color: cv.resultLabelG },
                  { label: 'Dépenses courantes',  val: depenses.total,           color: cv.resultLabelP },
                  { label: 'PAJE renseignée',        val: -paje,                    color: cv.resultLabelG },
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
                Ces chiffres sont des hypothèses de dépenses, pas des moyennes nationales officielles. Les aides sont nulles par défaut et doivent être renseignées après vérification sur les simulateurs publics.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Vérifier mes droits CAF',     href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
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
              <p style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#9FCDB1' : '#1C6856', margin: '0 0 6px' }}>
                Suivez vos vraies dépenses
              </p>
              <p style={{ fontSize: 13, color: isDark ? '#93C5FD' : '#418A74', margin: '0 0 16px', lineHeight: 1.5 }}>
                Comparez votre budget estimé avec vos dépenses réelles dans le dashboard BabyBudget.
              </p>
              <Link href="/app" style={{
                display: 'inline-block', background: '#16443D', color: 'white',
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