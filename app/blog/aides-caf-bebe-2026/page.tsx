'use client';

import Link from 'next/link';

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

const SOURCES = [
  { id: 1, label: 'Service-public.fr — Revalorisation BMAF au 1er avril 2026 (478,16 €)', href: 'https://www.service-public.gouv.fr/particuliers/actualites/A16506' },
  { id: 2, label: 'CAF.fr — PAJE : présentation générale et conditions 2026', href: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/petite-enfance' },
  { id: 3, label: 'Quelles-aides.fr — Prime de naissance 2026 : montant 1 084,44 €', href: 'https://www.quelles-aides.fr/allocations-familiales/naissance/paje/' },
  { id: 4, label: 'Aide-sociale.fr — Allocation de base PAJE au 1er avril 2026 : 198,16 €/mois taux plein', href: 'https://www.aide-sociale.fr/caf-paje/' },
  { id: 5, label: 'Quelles-aides.fr — PreParE 2026 : montant 456,06 €/mois et conditions', href: 'https://www.quelles-aides.fr/allocations-familiales/naissance/conge-parental/' },
  { id: 6, label: 'Quelles-aides.fr — CMG 2026 : montants et barèmes après réforme septembre 2025', href: 'https://www.quelles-aides.fr/allocations-familiales/naissance/cmg/' },
  { id: 7, label: 'Solidarités.gouv.fr — Congé supplémentaire de naissance accessible dès le 1er juillet 2026', href: 'https://solidarites.gouv.fr/conge-supplementaire-de-naissance' },
  { id: 8, label: 'CAF.fr — Tout savoir sur le congé supplémentaire de naissance', href: 'https://www.caf.fr/allocataires/actualites/actualites-nationales/tout-savoir-sur-le-conge-supplementaire-de-naissance' },
  { id: 9, label: 'Ameli.fr — Indemnités journalières congé paternité : maximum 104,02 €/jour au 1er janvier 2026', href: 'https://www.ameli.fr/assure/remboursements/indemnites-journalieres-maladie-maternite-paternite/conge-paternite-accueil-enfant' },
  { id: 10, label: 'Service-public.fr — Congé supplémentaire de naissance : création par la LFSS 2026', href: 'https://www.service-public.gouv.fr/particuliers/actualites/A18750' },
  { id: 11, label: 'SimuAides.fr — Liste complète des aides CAF 2026 et montants', href: 'https://simulateur-aides.fr/blog/aides-caf-liste-complete-2026' },
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '40px 0 16px', paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
      {children}
    </h2>
  );
}

function AideBlock({ titre, badge, badgeColor, badgeBg, montant, montantColor, details, conditions }: {
  titre: string; badge: string; badgeColor: string; badgeBg: string;
  montant: string; montantColor: string;
  details: string; conditions: string[];
}) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#F8FAFC', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{titre}</p>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: badgeBg, color: badgeColor }}>{badge}</span>
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: montantColor, letterSpacing: '-0.5px', margin: 0 }}>{montant}</p>
      </div>
      <div style={{ padding: '14px 20px' }}>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: '0 0 10px' }}>{details}</p>
        {conditions.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#6366F1', fontWeight: 700, flexShrink: 0 }}>→</span>
            <span style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableauSimple({ headers, rows, lastRowHighlight }: {
  headers: string[]; rows: string[][]; lastRowHighlight?: boolean;
}) {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ background: '#0F172A' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: i === 0 ? 'left' : 'right', color: '#94A3B8', fontWeight: 600, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{
              borderBottom: i < rows.length - 1 ? '1px solid #F1F5F9' : 'none',
              background: lastRowHighlight && i === rows.length - 1 ? '#EFF6FF' : i % 2 === 0 ? 'white' : '#F8FAFC',
            }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '11px 14px',
                  textAlign: j === 0 ? 'left' : 'right',
                  fontWeight: j === row.length - 1 ? 700 : 400,
                  color: lastRowHighlight && i === rows.length - 1 ? '#1D4ED8' : j === 0 ? '#0F172A' : '#374151',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticleAidesCAF2026() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: FONT, color: '#0F172A' }}>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: '#475569', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 600 }}>Aides & CAF</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 12px', borderRadius: 99, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mis à jour avril 2026</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.15, margin: '0 0 16px' }}>
            Aides CAF bébé 2026 : tout ce à quoi vous avez droit
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 620 }}>
            Prime de naissance, allocation de base, CMG, congé paternité, nouveau congé supplémentaire de naissance... Le guide complet des aides revalorisées au 1er avril 2026, avec les montants officiels et les démarches à effectuer.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>📅 Avril 2026</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>⏱ 10 min de lecture</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>✅ Sources CAF · Service-public · Ameli</span>
          </div>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Encadré résumé */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '20px 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: '#166534', fontWeight: 600, margin: '0 0 8px' }}>💡 À retenir</p>
          <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.7, margin: 0 }}>
            Depuis le 1er avril 2026, la base mensuelle de calcul des allocations familiales (BMAF) est revalorisée à <strong>478,16 €</strong> (+0,8 %)<Ref id={1} />. L'ensemble des aides PAJE, CMG et allocations familiales ont été recalculées en conséquence. Un nouveau congé supplémentaire de naissance est également créé par la LFSS 2026, accessible à partir du 1er juillet 2026<Ref id={7} />.
          </p>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          La France est l'un des pays européens qui soutient le plus financièrement les familles avec de jeunes enfants. Pourtant, une grande partie des parents ne connaît pas l'ensemble des aides auxquelles ils ont droit — ou n'effectue pas les démarches à temps pour en bénéficier, perdant parfois plusieurs centaines d'euros. Ce guide recense l'intégralité des aides CAF disponibles en 2026, avec les montants officiels revalorisés et les étapes concrètes pour les obtenir.
        </p>

        {/* ── SECTION 1 : PAJE ── */}
        <SectionTitle>1. La PAJE — Prestation d'accueil du jeune enfant</SectionTitle>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          La PAJE est le dispositif phare de soutien aux familles lors de l'arrivée d'un enfant. Elle regroupe quatre aides distinctes, cumulables entre elles selon votre situation<Ref id={2} />. Pour 2026, ce sont les revenus de l'année 2024 (année N-2) qui servent de base au calcul des droits soumis à conditions de ressources<Ref id={4} />.
        </p>

        <AideBlock
          titre="Prime de naissance"
          badge="Versement unique — 7e mois de grossesse"
          badgeColor="#1D4ED8" badgeBg="#EFF6FF"
          montant="1 084,44 €"
          montantColor="#6366F1"
          details="Versée au 7e mois de grossesse sous conditions de ressources. Pour une naissance simple. Le montant est plus élevé pour les naissances multiples ou l'adoption."
          conditions={[
            "Déclarer la grossesse à la CAF avant la 14e semaine d'aménorrhée (SA)",
            "Effectuer le premier examen prénatal obligatoire",
            "Revenus 2024 pris en compte pour l'éligibilité 2026",
          ]}
        />

        <AideBlock
          titre="Allocation de base (PAJE)"
          badge="Mensuel · jusqu'aux 3 ans de l'enfant"
          badgeColor="#1D4ED8" badgeBg="#EFF6FF"
          montant="198,16 €/mois"
          montantColor="#0070F3"
          details={`Taux plein : 198,16 €/mois — Taux partiel : 99,08 €/mois. Revalorisée au 1er avril 2026. L'allocation de base aide à faire face aux dépenses d'entretien et d'éducation de votre enfant.`}
          conditions={[
            "Cumulable avec les allocations familiales et le CMG",
            "Non cumulable avec le complément familial (3 enfants et plus, dès les 3 ans)",
            "Basée sur les revenus 2024 — taux plein ou partiel déterminé automatiquement",
          ]}
        />

        <AideBlock
          titre="PreParE — Prestation partagée d'éducation de l'enfant"
          badge="Sous conditions d'activité"
          badgeColor="#92400E" badgeBg="#FFFBEB"
          montant="456,06 €/mois"
          montantColor="#B45309"
          details="Pour les parents souhaitant cesser ou réduire leur activité professionnelle pour s'occuper de leur enfant. La durée varie selon le rang de l'enfant."
          conditions={[
            "1er enfant : 6 mois maximum par parent (12 mois si les deux parents en bénéficient)",
            "2e enfant et + : jusqu'aux 3 ans de l'enfant",
            "Non cumulable simultanément avec le nouveau congé supplémentaire de naissance — mais les deux peuvent se succéder",
          ]}
        />

        {/* ── SECTION 2 : CMG ── */}
        <SectionTitle>2. Le CMG — Complément de libre choix du mode de garde</SectionTitle>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Le CMG est souvent l'aide la plus impactante financièrement — et la plus méconnue. Depuis la réforme entrée en vigueur en septembre 2025, ce dispositif a été profondément revu pour mieux s'adapter à la situation réelle de chaque famille. Il peut désormais couvrir jusqu'à 85 % des frais de garde<Ref id={6} />.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          Le CMG se divise en deux volets : la prise en charge partielle du <strong>salaire</strong> de l'assistante maternelle ou de la garde à domicile, et la prise en charge des <strong>cotisations sociales</strong>. Il est calculé automatiquement par la CAF à partir de votre avis d'imposition.
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>Plafonds mensuels du CMG selon les revenus <Ref id={6} /></h3>

        <TableauSimple
          headers={['Mode de garde', 'Tranche basse', 'Tranche moyenne', 'Tranche haute']}
          rows={[
            ['Assistante maternelle agréée', "jusqu'à 1 018 €", "jusqu'à 509 €", "jusqu'à 254 €"],
            ['Garde à domicile', "jusqu'à 2 085 €", "jusqu'à 1 042 €", "jusqu'à 521 €"],
          ]}
        />

        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', margin: '0 0 6px' }}>💡 Estimez votre CMG en 30 secondes</p>
          <p style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6, margin: '0 0 12px' }}>
            Le calculateur BabyBudget intègre les barèmes CMG 2026. Entrez vos revenus et votre mode de garde pour voir votre budget mensuel net après aides déduites automatiquement.
          </p>
          <Link href="/budget" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0F172A', color: 'white', padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Calculer mon budget avec le CMG →
          </Link>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '14px 18px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: '0 0 6px' }}>⚠️ Attention : obligation déclarative mensuelle</p>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Si vous percevez le CMG, vous devez déclarer chaque mois les heures de garde réellement effectuées et les frais correspondants à votre CAF. Toute sous-déclaration peut entraîner un trop-perçu avec obligation de remboursement. Conservez tous vos justificatifs.
          </p>
        </div>

        {/* ── SECTION 3 : NOUVEAU CONGÉ ── */}
        <SectionTitle>3. Nouveau en 2026 — Le congé supplémentaire de naissance</SectionTitle>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '4px 12px', borderRadius: 99, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#166534' }}>🆕 Accessible à partir du 1er juillet 2026</span>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Créé par la loi de financement de la Sécurité sociale pour 2026<Ref id={10} />, le congé supplémentaire de naissance est une avancée majeure de la politique familiale française. Il s'ajoute aux congés existants sans les remplacer, et vise à renforcer l'égalité entre les parents tout en favorisant le développement de l'enfant dans ses premiers mois.
        </p>

        <AideBlock
          titre="Congé supplémentaire de naissance"
          badge="Nouveau — accessible dès juillet 2026"
          badgeColor="#166534" badgeBg="#F0FDF4"
          montant="1 à 2 mois par parent"
          montantColor="#10B981"
          details="Chaque parent peut prendre 1 ou 2 mois de congé supplémentaire indemnisé, simultanément ou en alternance avec l'autre parent. Le congé peut être fractionné en deux périodes d'un mois non consécutives."
          conditions={[
            "1er mois indemnisé à 70 % du salaire net, plafonné au PMSS 2026 (4 005 €/mois)",
            "2e mois indemnisé à 60 % du salaire net, même plafond",
            "Accessible pour tout enfant né à partir du 1er janvier 2026",
            "Doit être pris après épuisement complet du congé maternité ou paternité",
            "Délai : 9 mois à compter de la naissance pour les enfants nés dès le 1er juillet 2026",
          ]}
        />

        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 32, fontStyle: 'italic' }}>
          Pour les enfants nés entre le 1er janvier et le 30 juin 2026, le congé peut être pris à partir du 1er juillet 2026 et jusqu'au 31 mars 2027 au plus tard<Ref id={8} />.
        </p>

        {/* ── SECTION 4 : CONGÉS ── */}
        <SectionTitle>4. Congé maternité et congé paternité 2026</SectionTitle>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          Les indemnités journalières versées pendant les congés maternité et paternité sont calculées sur la base de votre salaire moyen des 3 derniers mois, dans la limite du plafond mensuel de la Sécurité sociale — fixé à <strong>4 005 €</strong> en 2026<Ref id={9} />.
        </p>

        <TableauSimple
          headers={['Type de congé', 'Durée', 'Indemnisation maximale']}
          rows={[
            ['Congé maternité — 1er enfant', '16 semaines', '104,02 €/jour'],
            ['Congé maternité — 3e enfant et +', '26 semaines', '104,02 €/jour'],
            ['Congé paternité (salarié)', '25 jours (22 indemnisés)', '104,02 €/jour'],
            ['Congé paternité (indépendant)', '25 jours', '65,84 €/jour forfaitaire'],
            ['Congé supplémentaire naissance', '1 à 2 mois', '70 % puis 60 % du salaire'],
          ]}
        />

        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 32 }}>
          Le congé paternité peut être fractionné en deux périodes distinctes d'au moins 5 jours calendaires chacune, à prendre dans les 6 mois suivant la naissance<Ref id={9} />.
        </p>

        {/* ── SECTION 5 : ALLOCATIONS FAMILIALES ── */}
        <SectionTitle>5. Allocations familiales — dès le 2e enfant</SectionTitle>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          Les allocations familiales démarrent à partir du 2e enfant à charge. La base mensuelle de calcul des allocations familiales (BMAF) est fixée à <strong>478,16 €</strong> à compter du 1er avril 2026, soit une hausse de 0,8 % par rapport à 2025<Ref id={1} />. Les montants dépendent du nombre d'enfants et des revenus du foyer pour certains dispositifs.
        </p>

        <TableauSimple
          headers={['Situation', 'Montant mensuel estimé']}
          rows={[
            ['2 enfants à charge', 'environ 140 €/mois'],
            ['3 enfants à charge', 'environ 320 €/mois'],
            ['Complément familial (3 enfants, sous conditions)', 'variable selon revenus'],
            ['Allocation de rentrée scolaire (ARS 2026)', '412 à 450 € selon l\'âge'],
          ]}
        />

        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 32 }}>
          Les allocations familiales sont cumulables avec la PAJE. Si vous percevez la PAJE et avez 2 enfants ou plus, vous pouvez percevoir les deux simultanément<Ref id={11} />.
        </p>

        {/* ── SECTION 6 : DÉMARCHES ── */}
        <SectionTitle>6. Les démarches dans le bon ordre</SectionTitle>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 24 }}>
          L'une des erreurs les plus fréquentes est d'effectuer les démarches trop tard, perdant ainsi des mois de versement. Voici le calendrier optimal à respecter.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', marginBottom: 40 }}>
          {[
            { num: '01', quand: 'Avant la 14e semaine de grossesse (SA)', action: "Déclarer la grossesse à la CAF et à l'Assurance maladie — déclenche la prime de naissance et les examens remboursés", couleur: '#6366F1', bg: '#EFF6FF' },
            { num: '02', quand: '7e mois de grossesse', action: "Réception de la prime de naissance (1 084,44 €) si conditions remplies", couleur: '#0070F3', bg: '#EFF6FF' },
            { num: '03', quand: 'Naissance — dans les 30 jours', action: "Ouvrir le dossier CAF : allocation de base PAJE + CMG si mode de garde prévu. Ne pas attendre — certaines aides ne sont pas rétroactives", couleur: '#10B981', bg: '#F0FDF4' },
            { num: '04', quand: 'Dans les 6 mois suivant la naissance', action: "Congé paternité à prendre impérativement avant cette limite. Demander la PreParE si souhait de congé parental", couleur: '#F59E0B', bg: '#FFFBEB' },
            { num: '05', quand: 'Dès le 1er juillet 2026', action: "Congé supplémentaire de naissance — pour tout enfant né à partir du 1er janvier 2026. Informer l'employeur 1 mois à l'avance (15 jours si suite immédiate au congé paternité)", couleur: '#EF4444', bg: '#FEF2F2' },
          ].map(({ num, quand, action, couleur, bg }, i, arr) => (
            <div key={num} style={{ display: 'flex', gap: 16, paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, border: `2px solid ${couleur}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: couleur, flexShrink: 0 }}>{num}</div>
                {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: '#E2E8F0', marginTop: 6, minHeight: 20 }} />}
              </div>
              <div style={{ paddingTop: 6 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: couleur, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{quand}</p>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>{action}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 7 : ERREURS COURANTES ── */}
        <SectionTitle>7. Les 4 erreurs à ne pas commettre</SectionTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          {[
            { emoji: '⏰', titre: "Déclarer la grossesse trop tard", texte: "La prime de naissance n'est accordée que si la grossesse est déclarée avant la 14e semaine. Passé ce délai, l'aide est définitivement perdue." },
            { emoji: '📋', titre: "Oublier de déclarer le mode de garde à la CAF", texte: "Le CMG n'est pas versé automatiquement — il faut en faire la demande auprès de la CAF avec le contrat de travail de l'assistante maternelle ou de la garde à domicile." },
            { emoji: '📅', titre: "Ne pas prendre le congé paternité dans les 6 mois", texte: "Le congé paternité doit impérativement être pris dans les 6 mois suivant la naissance. Passé ce délai, il est perdu, ainsi que les indemnités associées." },
            { emoji: '🔄', titre: "Ignorer le nouveau congé supplémentaire de naissance", texte: "Accessible dès juillet 2026, ce congé de 1 à 2 mois indemnisé à 70-60 % du salaire est méconnu. Il concerne tous les parents d'enfants nés à partir du 1er janvier 2026." },
          ].map(({ emoji, titre, texte }) => (
            <div key={titre} style={{ display: 'flex', gap: 14, background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '16px 20px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{titre}</p>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── RÉCAP ── */}
        <SectionTitle>En résumé — tableau récapitulatif des aides 2026</SectionTitle>

        <TableauSimple
          headers={['Aide', 'Montant 2026', 'Durée']}
          rows={[
            ['Prime de naissance (PAJE)', '1 084,44 €', 'Versement unique'],
            ['Allocation de base (PAJE — taux plein)', '198,16 €/mois', "Jusqu'aux 3 ans"],
            ['Allocation de base (PAJE — taux partiel)', '99,08 €/mois', "Jusqu'aux 3 ans"],
            ['PreParE (taux plein)', '456,06 €/mois', 'Selon rang enfant'],
            ['CMG assistante maternelle (tranche basse)', "jusqu'à 1 018 €/mois", "Jusqu'aux 6 ans"],
            ['CMG garde à domicile (tranche basse)', "jusqu'à 2 085 €/mois", "Jusqu'aux 6 ans"],
            ['Congé paternité (indemnité max)', '104,02 €/jour', '22 jours indemnisés'],
            ['Congé suppl. naissance (1er mois)', '70 % du salaire net', '1 mois'],
            ['Congé suppl. naissance (2e mois)', '60 % du salaire net', '1 mois'],
            ['Allocations familiales (2 enfants)', '~140 €/mois', 'Jusqu\'à 20 ans'],
          ]}
        />

        {/* ── CTA BABYBUDGET ── */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 20, padding: '36px 32px', marginBottom: 56, textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 10 }}>Passez à l'action</p>
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Calculez votre budget bébé net après aides
          </h3>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>
            Le calculateur BabyBudget intègre les barèmes CAF 2026. Entrez vos revenus et votre mode de garde pour voir votre budget mensuel net en 30 secondes — aides déduites automatiquement.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/budget" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6366F1', color: 'white', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              Calculer mon budget 2026 →
            </Link>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#94A3B8', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid #2D364D' }}>
              Créer un compte gratuit
            </Link>
          </div>
        </div>

        {/* ── CONCLUSION ── */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 16px' }}>En conclusion</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          Le système d'aides français pour les familles avec de jeunes enfants est généreux, mais complexe. Entre la PAJE, le CMG, les allocations familiales et le nouveau congé supplémentaire de naissance, une famille peut potentiellement bénéficier de <strong>plusieurs centaines à plus de 1 000 € d'aides par mois</strong> — à condition d'effectuer les démarches dans les délais et de bien connaître ses droits.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>
          La clé est l'anticipation : déclarer la grossesse avant la 14e semaine, ouvrir son dossier CAF rapidement après la naissance, et ne pas laisser passer les délais du congé paternité et du nouveau congé supplémentaire. Chaque mois de retard dans les démarches peut représenter plusieurs centaines d'euros perdus.
        </p>
        <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 40, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
          Les montants présentés dans cet article sont issus des barèmes officiels revalorisés au 1er avril 2026. Pour vérifier vos droits personnalisés, utilisez le simulateur officiel disponible sur <a href="https://www.caf.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#6366F1', textDecoration: 'none' }}>caf.fr</a> ou le portail <a href="https://www.mesdroitssociaux.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#6366F1', textDecoration: 'none' }}>mesdroitssociaux.gouv.fr</a>.
        </p>

        {/* ── SOURCES ── */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16 }}>Sources</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SOURCES.map(({ id, label, href }) => (
              <div key={id} id={`source-${id}`} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', flexShrink: 0, minWidth: 24 }}>[{id}]</span>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#64748B', textDecoration: 'none', lineHeight: 1.5, borderBottom: '1px solid #E2E8F0' }}>
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