import Image from 'next/image';
import Link from 'next/link';

const articles = [
  {
    href: '/blog/creche-ou-assistante-maternelle-2026',
    category: 'Modes de garde',
    title: 'Crèche ou assistante maternelle : quel mode de garde coûte le moins cher en 2026 ?',
    desc: 'Barème CAF 2026, réforme du CMG et crédit d’impôt : comparez les coûts nets et les dépenses réellement facturées.',
    duration: '11 min',
    tag: 'COMPARATIF 2026',
  },
  {
    href: '/blog/15-achats-indispensables-avant-bebe',
    category: 'Équipement & économies',
    title: 'Les 15 achats indispensables avant l’arrivée de bébé (et ceux à éviter)',
    desc: 'Une checklist de naissance utile et réaliste : sécurité, équipement indispensable, achats facultatifs et économies possibles.',
    duration: '12 min',
    tag: 'CHECKLIST',
  },
  {
    href: '/blog/conge-parental-ou-reprise-travail-2026',
    category: 'Revenus & congés',
    title: 'Congé parental ou reprise du travail : quelle solution est la plus rentable en 2026 ?',
    desc: 'PreParE, nouveau congé de naissance, garde et revenus : trois simulations pour comparer les choix professionnels.',
    duration: '12 min',
    tag: 'SIMULATIONS',
  },
  {
    href: '/blog/livret-a-enfant-epargne-naissance',
    category: 'Épargne & famille',
    title: 'Ouvrir un Livret A à son enfant : combien épargner dès la naissance ?',
    desc: 'Taux de 1,7 % en août 2026, plafond, propriété de l’argent et simulations de versements sur 18 ans.',
    duration: '11 min',
    tag: 'ÉPARGNE 2026',
  },
  {
    href: '/blog/cout-bebe-premiere-annee',
    category: 'Budget & dépenses',
    title: 'Combien coûte un bébé la première année ?',
    desc: 'Une méthode concrète pour anticiper les achats, le budget mensuel et les frais de garde, avec un exemple clairement identifié comme illustratif.',
    duration: '8 min',
    tag: 'GUIDE BUDGET',
  },
  {
    href: '/blog/aides-caf-bebe-2026',
    category: 'Aides & démarches',
    title: 'Aides CAF bébé 2026 : prime, PAJE et CMG',
    desc: 'Montants officiels vérifiés, conditions de ressources, réforme du CMG et liens vers les simulateurs CAF et Urssaf.',
    duration: '7 min',
    tag: 'RÈGLES 2026',
  },
];

export default function BlogPage() {
  return (
    <main className="bb-blog-page">
      <section className="bb-blog-hero">
        <div className="bb-blog-container bb-blog-hero-content">
          <div>
            <span className="bb-blog-kicker">LES GUIDES BABY BUDGET</span>
            <h1>Des réponses claires pour <em>bien grandir</em> financièrement.</h1>
            <p>Coût d’un enfant, aides CAF, modes de garde : des ressources pratiques, des sources officielles et des hypothèses transparentes.</p>
            <Link href="/budget" className="bb-blog-cta bb-blog-cta-light">Essayer notre simulateur de budget <span aria-hidden="true">→</span></Link>
          </div>
          <div className="bb-blog-hero-visual" aria-hidden="true">
            <Image src="/brand-symbol.svg" width={210} height={210} alt="" unoptimized />
          </div>
        </div>
      </section>

      <section className="bb-blog-container bb-blog-index-section" aria-labelledby="articles-heading">
        <div className="bb-blog-section-heading">
          <div><span className="bb-blog-section-kicker">CONSEILS ET MÉTHODES</span><h2 id="articles-heading">Tous nos guides pratiques</h2></div>
          <span className="bb-blog-count">{articles.length} articles vérifiés</span>
        </div>
        <div className="bb-blog-card-grid">
          {articles.map((article, index) => (
            <Link href={article.href} className="bb-blog-card" key={article.href}>
              <div className="bb-blog-card-top">
                <span className="bb-blog-category">{article.category}</span>
                <span className="bb-blog-number">0{index + 1}</span>
              </div>
              <span className="bb-blog-card-tag">{article.tag}</span>
              <h3>{article.title}</h3>
              <p>{article.desc}</p>
              <div className="bb-blog-card-bottom"><span>{article.duration} de lecture</span><strong>Lire le guide <span aria-hidden="true">→</span></strong></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bb-blog-container bb-blog-promo">
        <div><span className="bb-blog-section-kicker">UN OUTIL POUR PASSER À L'ACTION</span>
          <h2>Un budget familial qui vous ressemble.</h2>
          <p>Les guides donnent des repères. Avec Baby Budget, vous suivez les dépenses réelles de vos enfants, par catégorie et par mois.</p>
        </div>
        <Link href="/signup" className="bb-blog-cta">Créer mon compte gratuit <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
