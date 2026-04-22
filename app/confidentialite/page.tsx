import Link from 'next/link';

export const metadata = {
  title: 'Politique de confidentialité — BabyBudget',
  description: 'Comment BabyBudget collecte, utilise et protège vos données personnelles.',
};

export default function Confidentialite() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'DM Sans, sans-serif', color: '#0F172A', lineHeight: 1.75 }}>

      <Link href="/" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
        ← Retour à l'accueil
      </Link>

      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 8 }}>
        Dernière mise à jour : avril 2025
      </p>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
        Politique de confidentialité
      </h1>
      <p style={{ color: '#64748B', marginBottom: 48 }}>
        BabyBudget s'engage à protéger vos données personnelles. Ce document explique quelles données nous collectons, pourquoi, et comment vous pouvez les contrôler.
      </p>

      <Section title="1. Qui sommes-nous ?">
        <p>BabyBudget est une application de suivi de budget familial. Pour toute question relative à vos données, vous pouvez nous contacter à l'adresse : <strong>contact@babybudget.app</strong></p>
        <p>Hébergement : <strong>Vercel Inc.</strong> (États-Unis, certifié Privacy Shield) — <strong>Supabase Inc.</strong> (infrastructure AWS Europe)</p>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons uniquement les données nécessaires au fonctionnement de l'application :</p>
        <Table rows={[
          ['Adresse email', 'Création de compte, authentification', 'Exécution du contrat'],
          ['Mot de passe', 'Authentification (chiffré, jamais en clair)', 'Exécution du contrat'],
          ['Dépenses saisies', 'Suivi budgétaire (montant, catégorie, date)', 'Exécution du contrat'],
          ['Profils enfants', 'Prénom uniquement, pour organiser les dépenses', 'Exécution du contrat'],
          ['Budget mensuel', 'Paramètre de l\'application', 'Exécution du contrat'],
          ['Date d\'inscription', 'Gestion du compte', 'Intérêt légitime'],
          ['Dernière connexion', 'Sécurité du compte', 'Intérêt légitime'],
        ]} headers={['Donnée', 'Utilisation', 'Base légale']} />
        <p style={{ color: '#64748B', fontSize: 14 }}>Nous ne collectons pas de données de localisation, de numéro de téléphone, ni aucune donnée sensible au sens du RGPD.</p>
      </Section>

      <Section title="3. Comment vos données sont-elles utilisées ?">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Faire fonctionner l'application (authentification, affichage de vos dépenses)</li>
          <li>Vous permettre de récupérer votre compte (réinitialisation de mot de passe)</li>
          <li>Assurer la sécurité et la continuité du service</li>
        </ul>
        <p><strong>Nous ne vendons pas vos données. Nous ne les partageons pas avec des tiers à des fins publicitaires.</strong></p>
      </Section>

      <Section title="4. Qui a accès à vos données ?">
        <p>Seul vous avez accès à vos dépenses et profils. Les données sont isolées par utilisateur grâce à des règles de sécurité strictes (Row Level Security) sur notre base de données.</p>
        <p>Nos sous-traitants techniques (Supabase, Vercel) ont accès à l'infrastructure mais sont contractuellement tenus de protéger vos données et ne peuvent pas les utiliser à d'autres fins.</p>
      </Section>

      <Section title="5. Durée de conservation">
        <p>Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, toutes vos données (dépenses, profils, paramètres) sont définitivement effacées dans un délai de 30 jours.</p>
      </Section>

      <Section title="6. Vos droits (RGPD)">
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : vous pouvez exporter vos données depuis l'application (bouton CSV)</li>
          <li><strong>Droit de rectification</strong> : vous pouvez modifier vos données depuis votre profil</li>
          <li><strong>Droit à l'effacement</strong> : vous pouvez supprimer votre compte depuis les paramètres</li>
          <li><strong>Droit à la portabilité</strong> : export CSV disponible depuis la page Analyse</li>
          <li><strong>Droit d'opposition</strong> : contactez-nous à contact@babybudget.app</li>
        </ul>
        <p>Pour exercer vos droits ou pour toute réclamation, contactez-nous à <strong>contact@babybudget.app</strong>. Vous pouvez également déposer une plainte auprès de la <strong>CNIL</strong> (www.cnil.fr).</p>
      </Section>

      <Section title="7. Cookies et traceurs">
        <p>BabyBudget utilise uniquement des cookies techniques strictement nécessaires au fonctionnement de l'application (maintien de la session de connexion). Aucun cookie publicitaire ou analytique n'est utilisé.</p>
      </Section>

      <Section title="8. Sécurité">
        <p>Nous mettons en œuvre les mesures techniques suivantes pour protéger vos données :</p>
        <ul>
          <li>Chiffrement des communications (HTTPS/TLS)</li>
          <li>Mots de passe chiffrés (bcrypt, jamais stockés en clair)</li>
          <li>Isolation des données par utilisateur (Row Level Security)</li>
          <li>Hébergement sur infrastructure européenne (AWS eu-west)</li>
        </ul>
      </Section>

      <Section title="9. Modifications">
        <p>Nous pouvons mettre à jour cette politique. En cas de modification importante, vous serez informé par email. La date de dernière mise à jour est indiquée en haut de cette page.</p>
      </Section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Link href="/cgu" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none' }}>Conditions générales d'utilisation →</Link>
        <Link href="/" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Retour à l'accueil</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', marginBottom: 16, letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      <div style={{ color: '#374151', fontSize: 15 }}>{children}</div>
    </div>
  );
}

function Table({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', color: j === 0 ? '#0F172A' : '#64748B', fontWeight: j === 0 ? 500 : 400 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}