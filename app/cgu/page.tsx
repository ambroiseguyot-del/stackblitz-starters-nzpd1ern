import Link from 'next/link';

export const metadata = {
  title: "Conditions générales d'utilisation — BabyBudget",
  description: "Conditions générales d'utilisation de l'application BabyBudget.",
};

export default function CGU() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'DM Sans, sans-serif', color: '#0F172A', lineHeight: 1.75 }}>

      <Link href="/" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
        ← Retour à l'accueil
      </Link>

      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 8 }}>
        Dernière mise à jour : avril 2025
      </p>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
        Conditions générales d'utilisation
      </h1>
      <p style={{ color: '#64748B', marginBottom: 48 }}>
        En utilisant BabyBudget, vous acceptez les présentes conditions. Veuillez les lire attentivement.
      </p>

      <Section title="1. Présentation du service">
        <p>BabyBudget est une application web gratuite de suivi de budget familial destinée aux parents souhaitant suivre les dépenses liées à leur(s) enfant(s).</p>
        <p>L'application est accessible à l'adresse <strong>https://www.babybudget.fr</strong> et développée à titre personnel.</p>
      </Section>

      <Section title="2. Accès au service">
        <p>L'utilisation de BabyBudget nécessite la création d'un compte avec une adresse email valide. L'accès est gratuit et sans engagement.</p>
        <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion. En cas de compromission de votre compte, contactez-nous immédiatement à <strong>contact@babybudget.app</strong>.</p>
      </Section>

      <Section title="3. Utilisation acceptable">
        <p>Vous vous engagez à utiliser BabyBudget uniquement à des fins personnelles et licites. Il est notamment interdit de :</p>
        <ul>
          <li>Utiliser le service à des fins commerciales sans autorisation</li>
          <li>Tenter d'accéder aux données d'autres utilisateurs</li>
          <li>Introduire des données fausses ou malveillantes</li>
          <li>Automatiser l'utilisation du service (scraping, bots)</li>
          <li>Contourner les mesures de sécurité</li>
        </ul>
      </Section>

      <Section title="4. Données et contenu">
        <p>Les dépenses et données que vous saisissez dans l'application vous appartiennent. Vous pouvez les exporter ou supprimer à tout moment.</p>
        <p>Vous garantissez que les données que vous saisissez ne violent aucun droit de tiers.</p>
      </Section>

      <Section title="5. Disponibilité du service">
        <p>BabyBudget est fourni "tel quel", sans garantie de disponibilité continue. Nous faisons notre possible pour assurer la continuité du service mais ne pouvons garantir une disponibilité 100%.</p>
        <p>Le service peut être interrompu pour maintenance, mise à jour ou pour toute autre raison, sans préavis.</p>
      </Section>

      <Section title="6. Limitation de responsabilité">
        <p>BabyBudget est un outil d'aide à la gestion budgétaire personnelle. Les données affichées (moyennes nationales, comparaisons) sont <strong>indicatives</strong> et basées sur des estimations. Elles ne constituent pas un conseil financier.</p>
        <p>Nous ne saurions être tenus responsables de décisions financières prises sur la base des informations fournies par l'application.</p>
        <p>En cas de perte de données due à un incident technique, notre responsabilité est limitée au rétablissement du service dans un délai raisonnable.</p>
      </Section>

      <Section title="7. Propriété intellectuelle">
        <p>L'application BabyBudget, son design, son code et ses contenus sont protégés par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation expresse.</p>
        <p>Les marques, logos et données tierces (INSEE, CAF, DREES) appartiennent à leurs propriétaires respectifs.</p>
      </Section>

      <Section title="8. Résiliation">
        <p>Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. La suppression entraîne l'effacement définitif de toutes vos données dans un délai de 30 jours.</p>
        <p>Nous nous réservons le droit de suspendre ou supprimer un compte en cas de violation des présentes conditions.</p>
      </Section>

      <Section title="9. Modifications des CGU">
        <p>Nous pouvons modifier ces conditions à tout moment. Les modifications importantes seront notifiées par email. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.</p>
      </Section>

      <Section title="10. Droit applicable">
        <p>Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.</p>
        <p>Pour toute question : <strong>contact@babybudget.app</strong></p>
      </Section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Link href="/confidentialite" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none' }}>Politique de confidentialité →</Link>
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