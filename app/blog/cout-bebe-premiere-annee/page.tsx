'use client';

import Link from 'next/link';

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

const SOURCES = [
  { id: 1, label: 'INSEE — Enquête Budget des familles 2023', href: 'https://www.insee.fr/fr/statistiques/8241854' },
  { id: 2, label: 'CAF.fr — Barème PAJE et aides à la petite enfance 2024', href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
  { id: 3, label: 'CREDOC — Enquête sur les dépenses des familles avec jeunes enfants 2022', href: 'https://www.credoc.fr' },
  { id: 4, label: 'CNAF — Observatoire national de la petite enfance, Rapport 2023', href: 'https://www.caf.fr/sites/default/files/cnaf/Documents/Dossiers_documentaires/ONPE/Rapport_ONPE_2023.pdf' },
  { id: 5, label: 'Service-public.fr — Complément de Mode de Garde (CMG)', href: 'https://www.service-public.fr/particuliers/vosdroits/F345' },
  { id: 6, label: 'FEPEM — Baromètre des emplois de la famille 2024', href: 'https://www.fepem.fr' },
  { id: 7, label: 'Mon-enfant.fr — Trouver un mode de garde', href: 'https://www.mon-enfant.fr' },
];

function Ref({ id }: { id: number }) {
  return (
    <sup>
      <a href={`#source-${id}`} style={{ color: '#6366F1', textDecoration: 'none', fontSize: '0.75em', fontWeight: 600 }}>
        [{id}]
      </a>
    </sup>
  );
}

export default function ArticleCoutBebe() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: FONT, color: '#0F172A' }}>

      {/* ── HERO ARTICLE ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: '#475569', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 600 }}>Budget & finances</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.15, margin: '0 0 16px' }}>
            Combien coûte un bébé la première année ?
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 620 }}>
            Couches, lait, mode de garde, équipement... Le budget réel d'un enfant la première année dépasse souvent les estimations. Chiffres, postes de dépenses et aides disponibles — tout ce qu'il faut savoir avant l'arrivée de bébé.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>📅 Mis à jour en 2024</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>⏱ 8 min de lecture</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>✅ Sources INSEE · CAF · CREDOC</span>
          </div>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Intro */}
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '20px 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: '#1D4ED8', fontWeight: 600, margin: '0 0 8px' }}>💡 À retenir</p>
          <p style={{ fontSize: 14, color: '#1E40AF', lineHeight: 1.7, margin: 0 }}>
            Selon l'INSEE, un bébé coûte en moyenne <strong>700 € par mois</strong> la première année, soit <strong>8 400 € sur 12 mois</strong><Ref id={1} />. 
            Mais 40 % des parents sous-estiment ce budget de moitié avant la naissance<Ref id={3} />.
          </p>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          L'arrivée d'un enfant est l'un des événements les plus transformateurs d'une vie — et l'un des plus coûteux. Pourtant, rares sont les futurs parents qui anticipent avec précision ce que va réellement représenter cette première année sur le plan financier. Entre les achats d'équipement avant la naissance, les dépenses courantes mensuelles et le poste mode de garde qui peut à lui seul dépasser 1 000 € par mois, le budget se construit par strates successives.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 40 }}>
          Cet article vous propose un tour d'horizon complet et sourcé des dépenses à prévoir, poste par poste, avec les aides auxquelles vous avez droit pour alléger la facture.
        </p>

        {/* Section 1 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px', paddingTop: 8 }}>
          Le coût global : que disent les chiffres ?
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          L'enquête Budget des familles de l'INSEE<Ref id={1} /> évalue le surcoût mensuel lié à l'arrivée d'un premier enfant à <strong>700 € en moyenne</strong> sur la première année. Ce chiffre recouvre des réalités très différentes selon les choix de mode de garde, le recours ou non à l'allaitement, et la propension à acheter neuf ou d'occasion.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          L'Observatoire national de la petite enfance (CNAF) estime quant à lui que le budget total sur les 12 premiers mois peut dépasser <strong>10 000 €</strong> lorsqu'on intègre les achats d'équipement réalisés avant la naissance<Ref id={4} />. À l'inverse, des parents optant pour l'allaitement, la garde par un parent et les achats d'occasion peuvent contenir ce budget autour de 4 000 à 5 000 €.
        </p>

        {/* Encadré chiffres clés */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', marginBottom: 40 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8', margin: '0 0 16px' }}>Chiffres clés — première année</p>
          {[
            { label: 'Coût mensuel moyen', value: '700 €/mois', source: 1, color: '#6366F1' },
            { label: 'Budget total estimé', value: '8 400 – 12 000 €', source: 4, color: '#0070F3' },
            { label: 'Parents qui dépassent leur budget', value: '40 %', source: 3, color: '#EF4444' },
            { label: 'Mois où le budget dérape en moyenne', value: '3e mois', source: 4, color: '#F59E0B' },
          ].map(({ label, value, source, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: 14, color: '#475569' }}>{label} <Ref id={source} /></span>
              <span style={{ fontSize: 16, fontWeight: 800, color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Section 2 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>
          Les achats avant la naissance : le premier grand poste
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Avant même l'arrivée de bébé, les dépenses d'équipement représentent un investissement initial de <strong>2 000 à 4 000 €</strong> en moyenne<Ref id={1} />. Ce poste concentre les achats les plus importants, souvent réalisés en une seule fois, ce qui peut créer un effet de surprise budgétaire.
        </p>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '24px 0 12px' }}>Les incontournables</h3>
        <div style={{ marginBottom: 24 }}>
          {[
            { item: 'Poussette ou système de voyage', fourchette: '300 – 1 200 €', note: "Le poste le plus variable selon les marques. L'occasion permet d'économiser jusqu'à 50 %." },
            { item: 'Siège auto groupe 0+', fourchette: '80 – 400 €', note: "Obligatoire dès la sortie de maternité. À ne jamais acheter d'occasion — la sécurité n'est pas négociable." },
            { item: 'Lit bébé + matelas', fourchette: '150 – 600 €', note: 'Normes NF EN 716 obligatoires. Le matelas ne s\'achète pas d\'occasion pour des raisons hygiéniques.' },
            { item: 'Table à langer', fourchette: '50 – 200 €', note: 'Peut être remplacée par un tapis à langer posé sur une surface stable.' },
            { item: 'Vêtements naissance', fourchette: '100 – 300 €', note: 'La taille naissance ne dure que quelques semaines — ne pas sur-investir.' },
          ].map(({ item, fourchette, note }) => (
            <div key={item} style={{ borderLeft: '3px solid #6366F1', paddingLeft: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{item}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#6366F1' }}>{fourchette}</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{note}</p>
            </div>
          ))}
        </div>

        {/* Section 3 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '32px 0 16px' }}>
          Les dépenses courantes : 375 € par mois hors mode de garde
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Une fois bébé arrivé, les dépenses récurrentes mensuelles s'installent durablement. Hors mode de garde, l'INSEE les évalue à <strong>375 € par mois en moyenne</strong> pour un nourrisson<Ref id={1} />.
        </p>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#0F172A' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Poste de dépense</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'white', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Coût mensuel moyen</th>
              </tr>
            </thead>
            <tbody>
              {[
                { poste: 'Couches (5 à 8 changes/jour)', cout: '55 €', note: '' },
                { poste: 'Lait infantile 1er âge', cout: '90 €', note: '(si non allaitement)' },
                { poste: 'Alimentation (diversification dès 6 mois)', cout: '80 €', note: '' },
                { poste: 'Soins & hygiène (liniment, crème, coton)', cout: '40 €', note: '' },
                { poste: 'Vêtements (renouvellement fréquent)', cout: '50 €', note: '' },
                { poste: 'Santé (consultations, médicaments non remboursés)', cout: '35 €', note: '' },
                { poste: 'Loisirs & éveil', cout: '25 €', note: '' },
              ].map(({ poste, cout, note }, i) => (
                <tr key={poste} style={{ borderBottom: '1px solid #E2E8F0', background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{poste} {note && <span style={{ color: '#94A3B8', fontSize: 12 }}>{note}</span>}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{cout}</td>
                </tr>
              ))}
              <tr style={{ background: '#EFF6FF' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1D4ED8' }}>Total mensuel estimé <Ref id={1} /></td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#1D4ED8', fontSize: 16 }}>375 €</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 32px', fontStyle: 'italic' }}>
          Note : si vous allaitez, économisez ~90 €/mois sur le lait. Le budget tombe alors autour de 285 €/mois hors mode de garde.
        </p>

        {/* Section 4 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>
          Le mode de garde : le poste qui fait tout basculer
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          C'est le poste qui génère le plus d'écart entre familles. Selon le mode de garde choisi, la participation financière mensuelle peut aller de <strong>0 € (garde par un parent) à plus de 1 500 €</strong> pour une garde à domicile à temps plein, avant déduction des aides<Ref id={5} />.
        </p>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '24px 0 12px' }}>Comparatif des modes de garde (coût net après aides CAF)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { mode: 'Crèche municipale', cout: '160 – 600 €/mois', detail: "Calculé selon le barème PSU de la CAF en fonction des revenus du foyer", color: '#6366F1', pct: 45 },
            { mode: 'Assistante maternelle agréée', cout: '200 – 800 €/mois', detail: "Après déduction du CMG (jusqu'à 1 018 €/mois selon revenus)", color: '#0070F3', pct: 60 },
            { mode: 'Garde à domicile', cout: '500 – 1 500 €/mois', detail: "Après déduction du CMG (jusqu'à 2 085 €/mois selon revenus)", color: '#EF4444', pct: 90 },
            { mode: 'Halte-garderie', cout: '90 – 240 €/mois', detail: "Tarif horaire variable selon la structure (1,50 à 4 €/h)", color: '#F59E0B', pct: 30 },
            { mode: 'Garde par un parent (congé parental)', cout: '0 €', detail: "Perte de salaire à compenser, CLCA possible selon conditions", color: '#10B981', pct: 0 },
          ].map(({ mode, cout, detail, color, pct }) => (
            <div key={mode} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{mode}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color }}>{cout}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px' }}>{detail} <Ref id={5} /></p>
              {pct > 0 && (
                <div style={{ height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, opacity: 0.7 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 5 */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '32px 0 16px' }}>
          Les aides disponibles : jusqu'à 1 200 € par mois
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          La France est l'un des pays européens qui soutient le plus financièrement les familles avec jeunes enfants. L'ensemble des aides auxquelles vous pouvez avoir droit peut représenter plusieurs centaines d'euros par mois<Ref id={2} />.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {[
            { aide: 'Prime de naissance (PAJE)', montant: '1 021 €', timing: 'Versement unique au 7e mois de grossesse', condition: 'Sous conditions de ressources' },
            { aide: 'Allocation de base (PAJE)', montant: 'Jusqu\'à 184 €/mois', timing: 'Pendant 3 ans', condition: 'Sous conditions de ressources' },
            { aide: 'CMG — Complément Mode de Garde', montant: 'Jusqu\'à 2 085 €/mois', timing: 'Tant que l\'enfant est gardé', condition: 'Selon revenus et mode de garde' },
            { aide: 'Crédit d\'impôt frais de garde', montant: '50 % des dépenses', timing: 'Sur la déclaration annuelle', condition: "Plafonné à 2 300 € d'avantage fiscal" },
            { aide: 'Congé paternité indemnisé', montant: '28 jours', timing: 'À la naissance', condition: 'Indemnisé par la CPAM' },
          ].map(({ aide, montant, timing, condition }) => (
            <div key={aide} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 4px' }}>{aide} <Ref id={2} /></p>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 2px' }}>{timing}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, fontStyle: 'italic' }}>{condition}</p>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#166534', whiteSpace: 'nowrap' }}>{montant}</span>
            </div>
          ))}
        </div>

        {/* Section 6 — Simulation */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>
          Exemple concret : budget réel selon le mode de garde
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          Pour illustrer concrètement ce que représente ce budget, prenons un foyer avec <strong>3 500 € de revenus nets mensuels</strong> (tranche CAF moyenne) et un enfant de moins d'un an.
        </p>

        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ background: '#0F172A', padding: '14px 20px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', margin: 0 }}>Foyer type — 3 500 € nets/mois — Enfant 0-12 mois</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Mode de garde', 'Garde (net)', 'Dépenses courantes', 'PAJE déduite', 'Total mensuel'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Mode de garde' ? 'left' : 'right', fontWeight: 600, color: '#64748B', fontSize: 12, borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { mode: 'Crèche', garde: '280 €', dep: '375 €', paje: '-92 €', total: '563 €', highlight: false },
                { mode: 'Assistante mat.', garde: '311 €', dep: '375 €', paje: '-92 €', total: '594 €', highlight: false },
                { mode: 'Garde à domicile', garde: '1 118 €', dep: '375 €', paje: '-92 €', total: '1 401 €', highlight: false },
                { mode: 'Parent (congé)', garde: '0 €', dep: '375 €', paje: '-92 €', total: '283 €', highlight: true },
              ].map(({ mode, garde, dep, paje, total, highlight }) => (
                <tr key={mode} style={{ borderBottom: '1px solid #F1F5F9', background: highlight ? '#F0FDF4' : 'white' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{mode}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#EF4444', fontWeight: 500 }}>{garde}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#6366F1', fontWeight: 500 }}>{dep}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#10B981', fontWeight: 500 }}>{paje}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: highlight ? '#166534' : '#0F172A', fontSize: 15 }}>{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11, color: '#94A3B8', padding: '10px 14px', margin: 0, fontStyle: 'italic' }}>
            Simulation à titre indicatif. Basée sur les barèmes CAF 2024 <Ref id={2} /> et les données INSEE 2023 <Ref id={1} />.
          </p>
        </div>

        {/* Section 7 — Conseils */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>
          5 conseils pour maîtriser ce budget
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {[
            { num: '01', titre: 'Anticipez les achats d\'équipement dès le 6e mois', texte: "Les grosses dépenses (poussette, siège auto, lit) doivent être planifiées bien en amont. Commencez à constituer une épargne dédiée dès l'annonce de la grossesse." },
            { num: '02', titre: "Ouvrez votre dossier CAF sans attendre", texte: "La prime de naissance PAJE est versée sous conditions de ressources, mais la demande doit être faite avant les 6 mois de l'enfant. Ne tardez pas." },
            { num: '03', titre: "Pensez à l'occasion pour l'équipement non-sécurité", texte: "Poussette, vêtements, jouets, transat — le marché de l'occasion permet d'économiser 40 à 60 %. En revanche, jamais d'occasion pour un siège auto ou un matelas." },
            { num: '04', titre: "Suivez vos dépenses mois par mois", texte: "Les familles qui notent leurs dépenses identifient rapidement les postes qui débordent. Dès le 3e mois, les petits achats non planifiés s'accumulent sans qu'on s'en rende compte." },
            { num: '05', titre: "Comparez vos dépenses à la moyenne nationale", texte: "Savoir si vous êtes au-dessus ou en dessous de la moyenne nationale pour chaque poste vous permet d'identifier où optimiser sans vous priver de l'essentiel." },
          ].map(({ num, titre, texte }) => (
            <div key={num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#6366F1', flexShrink: 0 }}>{num}</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>{titre}</p>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{texte}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BabyBudget */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 20, padding: '36px 32px', marginBottom: 56, textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 10 }}>Passez à l'action</p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Calculez votre budget bébé personnalisé
          </h3>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
            BabyBudget vous permet de simuler votre budget selon vos revenus et votre mode de garde, avec les aides CAF déduites automatiquement — et de suivre vos dépenses réelles mois par mois.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/budget" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366F1', color: 'white', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Calculer mon budget →
            </Link>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#94A3B8', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid #2D364D' }}>
              Créer un compte gratuit
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 32, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
  Les chiffres présentés dans cet article sont issus des dernières enquêtes disponibles (INSEE 2023, CAF 2024). En raison de l'inflation et de la revalorisation annuelle des barèmes CAF, les montants réels en 2026 peuvent être légèrement supérieurs — comptez une hausse indicative de 3 à 5 % par rapport aux valeurs affichées.
</p>

        {/* Conclusion */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>
          En résumé
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Le coût d'un bébé la première année tourne autour de <strong>700 € par mois en moyenne</strong><Ref id={1} />, mais ce chiffre cache des réalités très contrastées. Le mode de garde est le facteur de variation le plus important : il peut à lui seul représenter entre 0 et 1 500 € de dépense mensuelle nette. Les aides de l'État — PAJE, CMG, crédit d'impôt — permettent d'alléger significativement la facture pour les familles qui les demandent à temps.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 40 }}>
          Ce qui distingue les familles qui maîtrisent leur budget de celles qui le subissent, c'est avant tout l'anticipation : prévoir les achats d'équipement en amont, ouvrir les dossiers d'aide rapidement, et se donner une visibilité mensuelle sur ce que coûte réellement leur enfant.
        </p>

        {/* Sources */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16 }}>Sources</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SOURCES.map(({ id, label, href }) => (
              <div key={id} id={`source-${id}`} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', flexShrink: 0, minWidth: 24 }}>[{id}]</span>
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none', lineHeight: 1.5, borderBottom: '1px solid #E2E8F0' }}>
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}