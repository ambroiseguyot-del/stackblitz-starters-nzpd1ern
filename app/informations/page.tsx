'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    id: 'prenatal',
    label: 'Avant la naissance',
    emoji: '🤰',
    months: -1,
    budget: '2 000 – 4 000 €',
    color: '#8B5CF6',
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
    id: 'm0',
    label: '0 – 1 mois',
    emoji: '🍼',
    months: 0,
    budget: '400 – 700 €/mois',
    color: '#0070F3',
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
    id: 'm2',
    label: '2 – 3 mois',
    emoji: '💉',
    months: 2,
    budget: '350 – 600 €/mois',
    color: '#0070F3',
    description: 'Les vaccins obligatoires commencent — bien les planifier.',
    depenses: [
      { nom: 'Couches taille 2', fourchette: '45 – 75 €/mois', priorite: 'haute' },
      { nom: 'Lait 1er âge', fourchette: '80 – 150 €/mois', priorite: 'haute' },
      { nom: 'Tapis d\'éveil', fourchette: '30 – 80 €', priorite: 'moyenne' },
      { nom: 'Transat / balancelle', fourchette: '40 – 150 €', priorite: 'moyenne' },
    ],
    evenements: [
      { nom: 'Vaccins 2 mois : DTCaP-Hib-HepB + Pneumocoque + Rotavirus', type: 'médical', remboursement: '100% Sécu — obligatoires' },
      { nom: 'Vaccins 3 mois : Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Examen du 2e mois', type: 'médical', remboursement: '100% Sécu' },
    ],
  },
  {
    id: 'm4',
    label: '4 – 6 mois',
    emoji: '🥣',
    months: 4,
    budget: '350 – 550 €/mois',
    color: '#10B981',
    description: 'Début de la diversification alimentaire — nouvelles dépenses à prévoir.',
    depenses: [
      { nom: 'Petits pots / purées maison', fourchette: '40 – 80 €/mois', priorite: 'haute', note: 'Blender mixeur ~30-80€ si fait maison' },
      { nom: 'Chaise haute', fourchette: '40 – 300 €', priorite: 'haute', note: 'Investissement pour 2-3 ans' },
      { nom: 'Couches taille 3', fourchette: '40 – 70 €/mois', priorite: 'haute' },
      { nom: 'Lait 2e âge (à 6 mois)', fourchette: '60 – 120 €/mois', priorite: 'haute' },
      { nom: 'Jouets d\'éveil', fourchette: '20 – 60 €', priorite: 'faible' },
    ],
    evenements: [
      { nom: 'Vaccins 4 mois : DTCaP-Hib-HepB + Pneumocoque + Rotavirus', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Vaccins 5 mois : Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Examen du 4e mois', type: 'médical', remboursement: '100% Sécu' },
    ],
  },
  {
    id: 'm9',
    label: '7 – 12 mois',
    emoji: '🚶',
    months: 7,
    budget: '400 – 650 €/mois',
    color: '#F59E0B',
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
      { nom: 'Recherche de crèche / nounou', type: 'admin', remboursement: 'CMG CAF jusqu\'à 1 000€/mois' },
    ],
  },
  {
    id: 'm12',
    label: '1 an',
    emoji: '🎂',
    months: 12,
    budget: '350 – 600 €/mois',
    color: '#EF4444',
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
    id: 'm18',
    label: '18 mois – 2 ans',
    emoji: '🧒',
    months: 18,
    budget: '300 – 500 €/mois',
    color: '#6366F1',
    description: 'Autonomie croissante — préparer l\'entrée à la crèche et l\'apprentissage.',
    depenses: [
      { nom: 'Apprentissage de la propreté (pot, culottes)', fourchette: '20 – 50 €', priorite: 'moyenne', note: 'En moyenne vers 24-30 mois' },
      { nom: 'Vélo d\'équilibre', fourchette: '40 – 120 €', priorite: 'faible' },
      { nom: 'Livres et jeux éducatifs', fourchette: '30 – 80 €', priorite: 'faible' },
      { nom: 'Vêtements 18-24 mois', fourchette: '80 – 200 €', priorite: 'moyenne' },
    ],
    evenements: [
      { nom: 'Examen des 18 mois', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Rappel vaccin 18 mois : DTCaP + Méningo B', type: 'médical', remboursement: '100% Sécu' },
      { nom: 'Visite dentaire préventive', type: 'médical', remboursement: 'M\'T dents — 100% Sécu' },
    ],
  },
];

const GROSSES_DEPENSES = [
  { nom: 'Poussette', quand: 'Avant naissance', fourchette: '300 – 1 200 €', emoji: '🚼', conseil: 'Acheter d\'occasion peut économiser 50%' },
  { nom: 'Siège auto gr. 0+', quand: 'Avant naissance', fourchette: '80 – 400 €', emoji: '🚗', conseil: 'Ne jamais acheter d\'occasion — sécurité' },
  { nom: 'Lit + matelas', quand: 'Avant naissance', fourchette: '150 – 600 €', emoji: '🛏', conseil: 'Le matelas ne s\'achète pas d\'occasion' },
  { nom: 'Siège auto gr. 1', quand: 'Vers 9-12 mois', fourchette: '100 – 400 €', emoji: '🪑', conseil: 'Prévoir 2-3 mois à l\'avance' },
  { nom: 'Chaise haute', quand: 'Vers 4-6 mois', fourchette: '40 – 300 €', emoji: '🍽', conseil: 'Dure jusqu\'à 3 ans — investir utile' },
  { nom: 'Siège auto gr. 2/3', quand: 'Vers 3-4 ans', fourchette: '80 – 350 €', emoji: '🚙', conseil: 'Réhausseur jusqu\'à 12 ans' },
  { nom: 'Vélo avec roues', quand: 'Vers 3-4 ans', fourchette: '80 – 200 €', emoji: '🚲', conseil: 'Après le vélo d\'équilibre' },
  { nom: 'Lit enfant', quand: 'Vers 2-3 ans', fourchette: '100 – 400 €', emoji: '🛏', conseil: 'Quand il sort du lit à barreaux' },
];

const AIDES = [
  { nom: 'PAJE — Prime naissance', montant: '1 021 €', condition: 'Sous conditions de ressources', emoji: '🎁', source: 'CAF' },
  { nom: 'PAJE — Allocation de base', montant: 'Jusqu\'à 184 €/mois', condition: 'Jusqu\'aux 3 ans de l\'enfant', emoji: '💰', source: 'CAF' },
  { nom: 'CMG — Complément mode de garde', montant: 'Jusqu\'à 1 000 €/mois', condition: 'Garde par assistante maternelle', emoji: '👶', source: 'CAF' },
  { nom: 'Remboursement maternité', montant: '100% des frais', condition: 'Grossesse + accouchement', emoji: '🏥', source: 'Sécu' },
  { nom: 'Congé paternité', montant: '28 jours indemnisés', condition: 'Depuis juillet 2021', emoji: '👨', source: 'CPAM' },
  { nom: 'Allocations familiales', montant: 'Dès le 2e enfant', condition: 'À partir de 2 enfants', emoji: '👨‍👩‍👧', source: 'CAF' },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export default function InformationsPage() {
  const [selectedId, setSelectedId] = useState<string>('prenatal');
  const [showAll, setShowAll] = useState(false);

  const selected = useMemo(() =>
    TIMELINE.find(t => t.id === selectedId) ?? TIMELINE[0],
    [selectedId]
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", color: '#0F172A' }}>

      <style>{`
        * { box-sizing: border-box; }

        .info-hero {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          padding: 60px 24px 48px;
          text-align: center;
        }

        .info-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,0.15); color: #A5B4FC;
          padding: 6px 14px; border-radius: 99px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 20px;
          border: 1px solid rgba(99,102,241,0.3);
        }

        .info-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800; color: white;
          letter-spacing: -1.5px; line-height: 1.1;
          margin: 0 0 16px;
        }

        .info-sub {
          font-size: 1rem; color: #94A3B8;
          max-width: 520px; margin: 0 auto;
          line-height: 1.7;
        }

        /* Sélecteur d'étape */
        .stage-selector {
          display: flex; gap: 8px;
          overflow-x: auto; padding: 24px;
          max-width: 1100px; margin: 0 auto;
          scrollbar-width: none;
        }
        .stage-selector::-webkit-scrollbar { display: none; }

        .stage-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 16px; border-radius: 16px;
          border: 1.5px solid #E2E8F0; background: white;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: all 0.15s;
          min-width: 100px;
        }
        .stage-btn:hover { border-color: #6366F1; transform: translateY(-2px); }
        .stage-btn.active { background: #0F172A; border-color: #0F172A; color: white; }
        .stage-btn .stage-emoji { font-size: 22px; }
        .stage-btn .stage-label { font-size: 11px; font-weight: 600; text-align: center; line-height: 1.3; }

        /* Main content */
        .info-main { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }

        /* Budget badge */
        .budget-hero {
          background: #0F172A; border-radius: 20px;
          padding: 24px 28px; margin-bottom: 32px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .budget-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #475569; margin: 0 0 6px; }
        .budget-amount { font-size: 2rem; font-weight: 800; color: #60A5FA; letter-spacing: -1px; margin: 0; }
        .budget-desc { font-size: 14px; color: #94A3B8; margin: 0; max-width: 400px; line-height: 1.6; }

        /* Grille 2 colonnes */
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }

        /* Cards */
        .info-card {
          background: white; border-radius: 20px;
          border: 1px solid #E2E8F0; padding: 24px;
        }
        .card-title {
          font-size: 13px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: #94A3B8; margin: 0 0 16px;
        }

        /* Dépenses liste */
        .depense-item {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 12px 0; border-bottom: 1px solid #F1F5F9; gap: 12px;
        }
        .depense-item:last-child { border-bottom: none; padding-bottom: 0; }
        .depense-nom { font-size: 14px; font-weight: 500; color: #0F172A; margin-bottom: 2px; }
        .depense-note { font-size: 11px; color: #94A3B8; line-height: 1.4; }
        .depense-prix { font-size: 13px; font-weight: 700; color: #0F172A; white-space: nowrap; flex-shrink: 0; text-align: right; }
        .priorite-dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
        }
        .priorite-haute { background: #EF4444; }
        .priorite-moyenne { background: #F59E0B; }
        .priorite-faible { background: #10B981; }

        /* Événements */
        .event-item {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 12px 0; border-bottom: 1px solid #F1F5F9;
        }
        .event-item:last-child { border-bottom: none; padding-bottom: 0; }
        .event-badge {
          font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 99px;
          white-space: nowrap; flex-shrink: 0;
        }
        .event-medical { background: #EFF6FF; color: #1D4ED8; }
        .event-admin { background: #F0FDF4; color: #166534; }
        .event-nom { font-size: 13px; font-weight: 500; color: #0F172A; margin-bottom: 2px; }
        .event-remb { font-size: 11px; color: #10B981; font-weight: 600; }

        /* Grosses dépenses */
        .grosse-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;
          margin-bottom: 32px;
        }
        .grosse-card {
          background: white; border-radius: 16px; border: 1px solid #E2E8F0;
          padding: 20px; transition: transform 0.15s, box-shadow 0.15s;
        }
        .grosse-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .grosse-emoji { font-size: 28px; margin-bottom: 12px; display: block; }
        .grosse-nom { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        .grosse-quand { font-size: 11px; color: #6366F1; font-weight: 600; margin-bottom: 8px; }
        .grosse-prix { font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
        .grosse-conseil { font-size: 11px; color: #64748B; line-height: 1.5; }

        /* Aides */
        .aides-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;
        }
        .aide-card {
          background: white; border-radius: 16px; border: 1px solid #E2E8F0;
          padding: 20px; display: flex; gap: 14px; align-items: flex-start;
        }
        .aide-emoji-box {
          width: 44px; height: 44px; border-radius: 12px; background: #EFF6FF;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
          flex-shrink: 0;
        }
        .aide-nom { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
        .aide-montant { font-size: 16px; font-weight: 800; color: #6366F1; margin-bottom: 4px; }
        .aide-condition { font-size: 12px; color: #64748B; margin-bottom: 4px; }
        .aide-source { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.06em; }

        /* Section title */
        .section-header { margin: 48px 0 24px; }
        .section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1; margin: 0 0 8px; }
        .section-title { font-size: 1.5rem; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; margin: 0 0 8px; }
        .section-desc { font-size: 14px; color: #64748B; margin: 0; line-height: 1.6; }

        /* Légende priorité */
        .legende { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; }
        .legende-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748B; font-weight: 500; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease-out; }
      `}</style>

      {/* ── HERO ── */}
      <div className="info-hero">
        <div className="info-badge">📋 Guide complet</div>
        <h1 className="info-title">Les dépenses bébé,<br />étape par étape</h1>
        <p className="info-sub">
          Tout ce que vous devez anticiper — des achats avant la naissance jusqu'aux 2 ans de votre enfant. Avec les aides disponibles et les vaccins obligatoires.
        </p>
      </div>

      {/* ── SÉLECTEUR D'ÉTAPE ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 64, zIndex: 50 }}>
        <div className="stage-selector">
          {TIMELINE.map((stage) => (
            <button
              key={stage.id}
              className={`stage-btn${selectedId === stage.id ? ' active' : ''}`}
              onClick={() => setSelectedId(stage.id)}
            >
              <span className="stage-emoji">{stage.emoji}</span>
              <span className="stage-label">{stage.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="info-main">

        {/* Budget de la période */}
        <div style={{ marginTop: 32 }}>
          <div className="budget-hero fade-in" key={selectedId}>
            <div>
              <p className="budget-label">{selected.emoji} {selected.label}</p>
              <p className="budget-amount">{selected.budget}</p>
            </div>
            <p className="budget-desc">{selected.description}</p>
          </div>
        </div>

        {/* Dépenses + Événements */}
        <div className="two-col fade-in" key={selectedId + '-cols'}>

          {/* Dépenses */}
          <div className="info-card">
            <p className="card-title">💳 Dépenses typiques</p>
            <div className="legende">
              <div className="legende-item"><div className="priorite-dot priorite-haute" /> Indispensable</div>
              <div className="legende-item"><div className="priorite-dot priorite-moyenne" /> Important</div>
              <div className="legende-item"><div className="priorite-dot priorite-faible" /> Optionnel</div>
            </div>
            {selected.depenses.map((d, i) => (
              <div key={i} className="depense-item">
                <div className="priorite-dot" style={{
                  background: d.priorite === 'haute' ? '#EF4444' : d.priorite === 'moyenne' ? '#F59E0B' : '#10B981',
                  marginTop: 5, flexShrink: 0, width: 8, height: 8, borderRadius: '50%'
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="depense-nom">{d.nom}</p>
                  {d.note && <p className="depense-note">{d.note}</p>}
                </div>
                <p className="depense-prix">{d.fourchette}</p>
              </div>
            ))}
          </div>

          {/* Événements / Vaccins */}
          <div className="info-card">
            <p className="card-title">📅 Événements & vaccins</p>
            {selected.evenements.map((e, i) => (
              <div key={i} className="event-item">
                <div>
                  <span className={`event-badge ${e.type === 'médical' ? 'event-medical' : 'event-admin'}`}>
                    {e.type === 'médical' ? '💉 Médical' : '📋 Admin'}
                  </span>
                </div>
                <div>
                  <p className="event-nom">{e.nom}</p>
                  <p className="event-remb">{e.remboursement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GROSSES DÉPENSES À ANTICIPER ── */}
        <div className="section-header">
          <p className="section-eyebrow">Planification</p>
          <h2 className="section-title">Les grosses dépenses à anticiper</h2>
          <p className="section-desc">Les achats importants à prévoir bien à l'avance pour éviter les mauvaises surprises.</p>
        </div>

        <div className="grosse-grid">
          {(showAll ? GROSSES_DEPENSES : GROSSES_DEPENSES.slice(0, 6)).map((g, i) => (
            <div key={i} className="grosse-card">
              <span className="grosse-emoji">{g.emoji}</span>
              <p className="grosse-nom">{g.nom}</p>
              <p className="grosse-quand">📅 {g.quand}</p>
              <p className="grosse-prix">{g.fourchette}</p>
              <p className="grosse-conseil">💡 {g.conseil}</p>
            </div>
          ))}
        </div>

        {!showAll && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                padding: '10px 24px', borderRadius: 12, border: '1.5px solid #E2E8F0',
                background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: '#475569', transition: 'all 0.15s',
              }}
            >
              Voir tous les achats →
            </button>
          </div>
        )}

        {/* ── AIDES & REMBOURSEMENTS ── */}
        <div className="section-header">
          <p className="section-eyebrow">À ne pas manquer</p>
          <h2 className="section-title">Aides et remboursements disponibles</h2>
          <p className="section-desc">Les principales aides auxquelles vous avez droit en France. Pensez à faire vos demandes rapidement.</p>
        </div>

        <div className="aides-grid">
          {AIDES.map((a, i) => (
            <div key={i} className="aide-card">
              <div className="aide-emoji-box">{a.emoji}</div>
              <div>
                <p className="aide-nom">{a.nom}</p>
                <p className="aide-montant">{a.montant}</p>
                <p className="aide-condition">{a.condition}</p>
                <p className="aide-source">Source : {a.source}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: 56, padding: '40px', background: '#0F172A',
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