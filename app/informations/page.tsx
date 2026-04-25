'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

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

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    id: 'prenatal', label: 'Avant la naissance', emoji: '🤰', months: -1,
    budget: '2 000 – 4 000 €', color: '#8B5CF6',
    description: 'La période de préparation concentre les achats les plus importants.',
    depenses: [
      { nom: 'Poussette / système de voyage', fourchette: '300 – 1 200 €', priorite: 'haute', note: 'Le plus gros achat — prévoir 3-6 mois avant' },
      { nom: 'Siège auto groupe 0+', fourchette: '80 – 400 €', priorite: 'haute', note: 'Obligatoire dès la sortie de maternité' },
      { nom: 'Lit bébé + matelas', fourchette: '150 – 600 €', priorite: 'haute', note: 'Normes NF EN 716 obligatoires' },
      { nom: 'Table à langer', fourchette: '50 – 200 €', priorite: 'moyenne', note: 'Peut être remplacée par un tapis' },
      { nom: 'Vêtements naissance (0-1 mois)', fourchette: '100 – 300 €', priorite: 'moyenne', note: 'Taille naissance = quelques semaines seulement' },
      { nom: 'Baignoire bébé', fourchette: '20 – 80 €', priorite: 'moyenne' },
      { nom: 'Baby monitor', fourchette: '30 – 150 €', priorite: 'faible' },
    ],
    evenements: [
      { nom: '3 échographies obligatoires', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Préparation à la naissance (8 séances)', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Déclaration de grossesse (avant 15 SA)', type: 'admin', remboursement: 'Déclenche les aides CAF' },
    ],
  },
  {
    id: 'm0', label: '0 – 1 mois', emoji: '🍼', months: 0,
    budget: '400 – 700 €/mois', color: '#0070F3',
    description: 'Le mois le plus intense en dépenses courantes.',
    depenses: [
      { nom: 'Couches (5-8/jour)', fourchette: '50 – 80 €/mois', priorite: 'haute', note: 'Taille 1 très courte — ne pas sur-stocker' },
      { nom: 'Lait infantile 1er âge', fourchette: '80 – 150 €/mois', priorite: 'haute', note: 'Si allaitement : tire-lait ~80€ remboursé' },
      { nom: 'Soins (liniment, crème, coton)', fourchette: '30 – 50 €/mois', priorite: 'haute' },
      { nom: 'Vêtements (croissance rapide)', fourchette: '50 – 100 €', priorite: 'moyenne' },
    ],
    evenements: [
      { nom: 'Examen du 1er mois obligatoire', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Déclaration de naissance (72h)', type: 'admin', remboursement: 'Gratuit — mairie' },
      { nom: 'Ouverture dossier CAF', type: 'admin', remboursement: 'PAJE ~184€/mois selon revenus' },
    ],
  },
  {
    id: 'm2', label: '2 – 3 mois', emoji: '💉', months: 2,
    budget: '350 – 600 €/mois', color: '#0070F3',
    description: 'Les vaccins obligatoires commencent — bien les planifier.',
    depenses: [
      { nom: 'Couches taille 2', fourchette: '45 – 75 €/mois', priorite: 'haute' },
      { nom: 'Lait 1er âge', fourchette: '80 – 150 €/mois', priorite: 'haute' },
      { nom: "Tapis d'éveil", fourchette: '30 – 80 €', priorite: 'moyenne' },
      { nom: 'Transat / balancelle', fourchette: '40 – 150 €', priorite: 'moyenne' },
    ],
    evenements: [
      { nom: 'Vaccins 2 mois : DTCaP-Hib-HepB + Pneumocoque + Rotavirus', type: 'médical', remboursement: '100% Sécu — obligatoires' },
      { nom: 'Vaccins 3 mois : Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Examen du 2e mois', type: 'médical', remboursement: '100% Sécu' },
    ],
  },
  {
    id: 'm4', label: '4 – 6 mois', emoji: '🥣', months: 4,
    budget: '350 – 550 €/mois', color: '#10B981',
    description: 'Début de la diversification alimentaire — nouvelles dépenses à prévoir.',
    depenses: [
      { nom: 'Petits pots / purées maison', fourchette: '40 – 80 €/mois', priorite: 'haute', note: 'Blender mixeur ~30-80€ si fait maison' },
      { nom: 'Chaise haute', fourchette: '40 – 300 €', priorite: 'haute', note: 'Investissement pour 2-3 ans' },
      { nom: 'Couches taille 3', fourchette: '40 – 70 €/mois', priorite: 'haute' },
      { nom: 'Lait 2e âge (à 6 mois)', fourchette: '60 – 120 €/mois', priorite: 'haute' },
      { nom: "Jouets d'éveil", fourchette: '20 – 60 €', priorite: 'faible' },
    ],
    evenements: [
      { nom: 'Vaccins 4 mois : DTCaP-Hib-HepB + Pneumocoque + Rotavirus', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Vaccins 5 mois : Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Examen du 4e mois', type: 'médical', remboursement: '100% Sécu' },
    ],
  },
  {
    id: 'm9', label: '7 – 12 mois', emoji: '🚶', months: 7,
    budget: '400 – 650 €/mois', color: '#F59E0B',
    description: 'Grande mobilité — sécuriser la maison et prévoir le changement de poussette.',
    depenses: [
      { nom: 'Barrières de sécurité escalier', fourchette: '30 – 80 €', priorite: 'haute', note: 'À prévoir dès les premiers crawls' },
      { nom: 'Protection prises et meubles', fourchette: '20 – 50 €', priorite: 'haute' },
      { nom: 'Siège auto groupe 1 (9-18kg)', fourchette: '100 – 400 €', priorite: 'haute', note: 'Vers 9-12 mois selon taille' },
      { nom: 'Chaussures premiers pas', fourchette: '30 – 70 €', priorite: 'moyenne', note: 'Mesure des pieds tous les 2 mois' },
      { nom: 'Alimentation variée', fourchette: '80 – 150 €/mois', priorite: 'haute' },
    ],
    evenements: [
      { nom: 'Vaccins 11 mois : Méningo C', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Examen du 9e mois', type: 'médical', remboursement: '100% Sécu' },
      { nom: "Recherche de crèche / nounou", type: 'admin', remboursement: "CMG CAF jusqu'à 1 000€/mois" },
    ],
  },
  {
    id: 'm12', label: '1 an', emoji: '🎂', months: 12,
    budget: '350 – 600 €/mois', color: '#EF4444',
    description: 'Cap symbolique — le budget se stabilise mais les postes évoluent.',
    depenses: [
      { nom: 'Lait de croissance (1-3 ans)', fourchette: '40 – 80 €/mois', priorite: 'moyenne' },
      { nom: 'Trotteur / porteur', fourchette: '30 – 100 €', priorite: 'faible' },
      { nom: 'Vêtements 12-18 mois', fourchette: '80 – 200 €', priorite: 'moyenne' },
      { nom: 'Livres carton / jouets 1 an', fourchette: '30 – 100 €', priorite: 'faible' },
    ],
    evenements: [
      { nom: 'Examen des 12 mois', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Rappels vaccins 12-13 mois : ROR + Méningocoque', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Entrée en crèche / modes de garde', type: 'admin', remboursement: 'AEEH si handicap' },
    ],
  },
  {
    id: 'm18', label: '18 mois – 2 ans', emoji: '🧒', months: 18,
    budget: '300 – 500 €/mois', color: '#6366F1',
    description: "Autonomie croissante — préparer l'entrée à la crèche et l'apprentissage.",
    depenses: [
      { nom: 'Apprentissage de la propreté (pot, culottes)', fourchette: '20 – 50 €', priorite: 'moyenne', note: 'En moyenne vers 24-30 mois' },
      { nom: "Vélo d'équilibre", fourchette: '40 – 120 €', priorite: 'faible' },
      { nom: 'Livres et jeux éducatifs', fourchette: '30 – 80 €', priorite: 'faible' },
      { nom: 'Vêtements 18-24 mois', fourchette: '80 – 200 €', priorite: 'moyenne' },
    ],
    evenements: [
      { nom: 'Examen des 18 mois', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Rappel vaccin 18 mois : DTCaP + Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Visite dentaire préventive', type: 'médical', remboursement: "M'T dents — 100% Sécu" },
    ],
  },
];

const GROSSES_DEPENSES = [
  { nom: 'Poussette', quand: 'Avant naissance', fourchette: '300 – 1 200 €', emoji: '🚼', conseil: "Acheter d'occasion peut économiser 50%" },
  { nom: 'Siège auto gr. 0+', quand: 'Avant naissance', fourchette: '80 – 400 €', emoji: '🚗', conseil: "Ne jamais acheter d'occasion — sécurité" },
  { nom: 'Lit + matelas', quand: 'Avant naissance', fourchette: '150 – 600 €', emoji: '🛏', conseil: "Le matelas ne s'achète pas d'occasion" },
  { nom: 'Siège auto gr. 1', quand: 'Vers 9-12 mois', fourchette: '100 – 400 €', emoji: '🪑', conseil: 'Prévoir 2-3 mois à l\'avance' },
  { nom: 'Chaise haute', quand: 'Vers 4-6 mois', fourchette: '40 – 300 €', emoji: '🍽', conseil: "Dure jusqu'à 3 ans — investir utile" },
  { nom: 'Siège auto gr. 2/3', quand: 'Vers 3-4 ans', fourchette: '80 – 350 €', emoji: '🚙', conseil: "Réhausseur jusqu'à 12 ans" },
  { nom: 'Vélo avec roues', quand: 'Vers 3-4 ans', fourchette: '80 – 200 €', emoji: '🚲', conseil: "Après le vélo d'équilibre" },
  { nom: 'Lit enfant', quand: 'Vers 2-3 ans', fourchette: '100 – 400 €', emoji: '🛏', conseil: 'Quand il sort du lit à barreaux' },
];

const AIDES = [
  { nom: 'PAJE — Prime naissance', montant: '1 021 €', condition: 'Sous conditions de ressources', emoji: '🎁', source: 'CAF' },
  { nom: 'PAJE — Allocation de base', montant: "Jusqu'à 184 €/mois", condition: "Jusqu'aux 3 ans de l'enfant", emoji: '💰', source: 'CAF' },
  { nom: 'CMG — Complément mode de garde', montant: "Jusqu'à 1 000 €/mois", condition: 'Garde par assistante maternelle', emoji: '👶', source: 'CAF' },
  { nom: 'Remboursement maternité', montant: '100% des frais', condition: 'Grossesse + accouchement', emoji: '🏥', source: 'Sécu' },
  { nom: 'Congé paternité', montant: '28 jours indemnisés', condition: 'Depuis juillet 2021', emoji: '👨', source: 'CPAM' },
  { nom: 'Allocations familiales', montant: 'Dès le 2e enfant', condition: 'À partir de 2 enfants', emoji: '👨‍👩‍👧', source: 'CAF' },
];

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function InformationsPage() {
  const isDark = useGlobalDark();
  const [selectedId, setSelectedId] = useState<string>('prenatal');
  const [showAll, setShowAll] = useState(false);

  const cv = useMemo(() => ({
    bg:           isDark ? '#0B0E14' : '#F8FAFC',
    card:         isDark ? '#161B26' : '#FFFFFF',
    border:       isDark ? '#2D364D' : '#E2E8F0',
    borderFaint:  isDark ? '#1E293B' : '#F1F5F9',
    text:         isDark ? '#F1F5F9' : '#0F172A',
    textMuted:    isDark ? '#94A3B8' : '#64748B',
    textSub:      isDark ? '#CBD5E1' : '#475569',
    accentBg:     isDark ? '#1E2D4A' : '#EFF6FF',
    selectorBg:   isDark ? 'rgba(22,27,38,0.95)' : 'rgba(255,255,255,0.95)',
    stageBtnBg:   isDark ? '#161B26' : '#FFFFFF',
    stageBtnActive: isDark ? '#F1F5F9' : '#0F172A',
    stageBtnActiveBg: isDark ? '#374151' : '#0F172A',
    budgetBg:     isDark ? '#161B26' : '#0F172A',
    budgetText:   '#60A5FA',
    budgetMuted:  isDark ? '#64748B' : '#475569',
    budgetDesc:   isDark ? '#94A3B8' : '#94A3B8',
    rowHover:     isDark ? '#1E293B' : '#F8FAFC',
    tagMedBg:     isDark ? '#1E2D4A' : '#EFF6FF',
    tagMedColor:  isDark ? '#60A5FA' : '#1D4ED8',
    tagAdmBg:     isDark ? '#0D2218' : '#F0FDF4',
    tagAdmColor:  isDark ? '#34D399' : '#166534',
    grosseHover:  isDark ? '#1E293B' : 'rgba(0,0,0,0)',
    aideBg:       isDark ? '#1E2D4A' : '#EFF6FF',
    ctaBg:        isDark ? '#161B26' : '#0F172A',
    ctaBorder:    isDark ? '#2D364D' : 'transparent',
  }), [isDark]);

  const selected = useMemo(() =>
    TIMELINE.find(t => t.id === selectedId) ?? TIMELINE[0],
    [selectedId]
  );

  const dotColor = (p: string) =>
    p === 'haute' ? '#EF4444' : p === 'moyenne' ? '#F59E0B' : '#10B981';

  return (
    <div style={{ minHeight: '100vh', background: cv.bg, fontFamily: FONT, color: cv.text }}>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease-out; }
        .stage-selector { display: flex; gap: 8px; overflow-x: auto; padding: 16px 24px; max-width: 1100px; margin: 0 auto; scrollbar-width: none; }
        .stage-selector::-webkit-scrollbar { display: none; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
        .grosse-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .aides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '60px 24px 48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.15)', color: '#A5B4FC',
          padding: '6px 14px', borderRadius: 99,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 20, border: '1px solid rgba(99,102,241,0.3)',
        }}>📋 Guide complet</div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px' }}>
          Les dépenses bébé,<br />étape par étape
        </h1>
        <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Tout ce que vous devez anticiper — des achats avant la naissance jusqu'aux 2 ans de votre enfant. Avec les aides disponibles et les vaccins obligatoires.
        </p>
      </div>

      {/* ── SÉLECTEUR D'ÉTAPE ── */}
      <div style={{
        background: cv.selectorBg,
        borderBottom: `1px solid ${cv.border}`,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky', top: 64, zIndex: 50,
      }}>
        <div className="stage-selector">
          {TIMELINE.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedId(stage.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 14,
                border: `1.5px solid ${selectedId === stage.id ? (isDark ? '#6366F1' : '#0F172A') : cv.border}`,
                background: selectedId === stage.id ? (isDark ? '#374151' : '#0F172A') : cv.stageBtnBg,
                color: selectedId === stage.id ? 'white' : cv.textMuted,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s', minWidth: 100,
                fontFamily: FONT,
              }}
            >
              <span style={{ fontSize: 20 }}>{stage.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{stage.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Budget de la période */}
        <div style={{ marginTop: 32 }}>
          <div className="fade-in" key={selectedId} style={{
            background: cv.budgetBg,
            border: `1px solid ${cv.border}`,
            borderRadius: 20, padding: '24px 28px', marginBottom: 32,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: cv.budgetMuted, margin: '0 0 6px' }}>
                {selected.emoji} {selected.label}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: cv.budgetText, letterSpacing: '-1px', margin: 0 }}>{selected.budget}</p>
            </div>
            <p style={{ fontSize: 14, color: cv.budgetDesc, margin: 0, maxWidth: 400, lineHeight: 1.6 }}>{selected.description}</p>
          </div>
        </div>

        {/* Dépenses + Événements */}
        <div className="two-col fade-in" key={selectedId + '-cols'}>

          {/* Dépenses */}
          <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cv.textMuted, margin: '0 0 12px' }}>
              💳 Dépenses typiques
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
              {[
                { label: 'Indispensable', color: '#EF4444' },
                { label: 'Important', color: '#F59E0B' },
                { label: 'Optionnel', color: '#10B981' },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: cv.textMuted, fontWeight: 500 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
            {selected.depenses.map((d, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '12px 0', borderBottom: i < selected.depenses.length - 1 ? `1px solid ${cv.borderFaint}` : 'none', gap: 12,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor(d.priorite), flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: cv.text, margin: 0 }}>{d.nom}</p>
                  {d.note && <p style={{ fontSize: 11, color: cv.textMuted, margin: '2px 0 0', lineHeight: 1.4 }}>{d.note}</p>}
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: cv.text, whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', margin: 0 }}>{d.fourchette}</p>
              </div>
            ))}
          </div>

          {/* Événements / Vaccins */}
          <div style={{ background: cv.card, borderRadius: 20, border: `1px solid ${cv.border}`, padding: '24px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cv.textMuted, margin: '0 0 16px' }}>
              📅 Événements & vaccins
            </p>
            {selected.evenements.map((e, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 0', borderBottom: i < selected.evenements.length - 1 ? `1px solid ${cv.borderFaint}` : 'none',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  background: e.type === 'médical' ? cv.tagMedBg : cv.tagAdmBg,
                  color: e.type === 'médical' ? cv.tagMedColor : cv.tagAdmColor,
                }}>
                  {e.type === 'médical' ? '💉 Médical' : '📋 Admin'}
                </span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: cv.text, margin: '0 0 2px' }}>{e.nom}</p>
                  <p style={{ fontSize: 11, color: '#10B981', fontWeight: 600, margin: 0 }}>{e.remboursement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GROSSES DÉPENSES ── */}
        <div style={{ margin: '48px 0 24px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', margin: '0 0 8px' }}>Planification</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: cv.text, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Les grosses dépenses à anticiper</h2>
          <p style={{ fontSize: 14, color: cv.textMuted, margin: 0, lineHeight: 1.6 }}>Les achats importants à prévoir bien à l'avance pour éviter les mauvaises surprises.</p>
        </div>

        <div className="grosse-grid">
          {(showAll ? GROSSES_DEPENSES : GROSSES_DEPENSES.slice(0, 6)).map((g, i) => (
            <div key={i} style={{
              background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`,
              padding: '20px', transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <span style={{ fontSize: 28, marginBottom: 12, display: 'block' }}>{g.emoji}</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: cv.text, margin: '0 0 4px' }}>{g.nom}</p>
              <p style={{ fontSize: 11, color: '#6366F1', fontWeight: 600, margin: '0 0 8px' }}>📅 {g.quand}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: cv.text, margin: '0 0 8px' }}>{g.fourchette}</p>
              <p style={{ fontSize: 11, color: cv.textMuted, lineHeight: 1.5, margin: 0 }}>💡 {g.conseil}</p>
            </div>
          ))}
        </div>

        {!showAll && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                padding: '10px 24px', borderRadius: 12,
                border: `1.5px solid ${cv.border}`,
                background: cv.card, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', color: cv.textSub,
                transition: 'all 0.15s', fontFamily: FONT,
              }}
            >
              Voir tous les achats →
            </button>
          </div>
        )}

        {/* ── AIDES ── */}
        <div style={{ margin: '48px 0 24px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', margin: '0 0 8px' }}>À ne pas manquer</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: cv.text, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Aides et remboursements disponibles</h2>
          <p style={{ fontSize: 14, color: cv.textMuted, margin: 0, lineHeight: 1.6 }}>Les principales aides auxquelles vous avez droit en France. Pensez à faire vos demandes rapidement.</p>
        </div>

        <div className="aides-grid">
          {AIDES.map((a, i) => (
            <div key={i} style={{
              background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`,
              padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: cv.aideBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              }}>{a.emoji}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: cv.text, margin: '0 0 4px' }}>{a.nom}</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#6366F1', margin: '0 0 4px' }}>{a.montant}</p>
                <p style={{ fontSize: 12, color: cv.textMuted, margin: '0 0 4px' }}>{a.condition}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: cv.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Source : {a.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: 56, padding: '40px',
          background: cv.ctaBg, border: `1px solid ${cv.ctaBorder}`,
          borderRadius: 24, textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>
            Passez à l'action
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Suivez vos vraies dépenses
          </h3>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 28, lineHeight: 1.7 }}>
            Comparez vos dépenses réelles à ces estimations et à la moyenne nationale.
          </p>
          <Link href="/app" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#6366F1', color: 'white', textDecoration: 'none',
            padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 600,
          }}>
            Aller au dashboard →
          </Link>
        </div>

      </div>
    </div>
  );
}