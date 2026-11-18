import Image from 'next/image';
import Link from 'next/link';

const articles = [
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
          <div><span className="bb-blog-section-kicker">CONSEILS ET MÉTHODES</span><h2 id="articles-heading">Les premiers guides</h2></div>
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
