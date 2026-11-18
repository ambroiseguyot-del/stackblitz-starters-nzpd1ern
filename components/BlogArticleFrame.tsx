import type { ReactNode } from 'react';
import Link from 'next/link';

export type EditorialSource = { title: string; url: string; organization: string };

export default function BlogArticleFrame({
  category, title, introduction, updated, readTime, sources, children,
}: {
  category: string; title: string; introduction: string; updated: string;
  readTime: string; sources: EditorialSource[]; children: ReactNode;
}) {
  return (
    <main className="bb-blog-page">
      <section className="bb-blog-article-hero">
        <div className="bb-blog-container">
          <nav className="bb-blog-breadcrumb" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link><span>›</span><Link href="/blog">Journal</Link><span>›</span><span>{category}</span>
          </nav>
          <span className="bb-blog-pill">{category}</span>
          <h1>{title}</h1>
          <p>{introduction}</p>
          <div className="bb-blog-meta">
            <span>Mis à jour le {updated}</span><span aria-hidden="true">·</span>
            <span>{readTime} de lecture</span><span aria-hidden="true">·</span>
            <span>Baby Budget</span>
          </div>
        </div>
      </section>
      <div className="bb-blog-container bb-blog-article-grid">
        <article className="bb-blog-prose">{children}
          <section className="bb-blog-article-sources" aria-label="Sources officielles">
            <h2>Sources et méthode de vérification</h2>
            <p>Les informations réglementaires et montants cités ont été contrôlés le {updated}. Les critères et barèmes peuvent évoluer ; les organismes compétents font foi pour vos droits individuels.</p>
            <ul>
              {sources.map(s => <li key={s.url}>
                <a href={s.url} rel="noopener noreferrer" target="_blank">{s.organization} — {s.title}</a>
              </li>)}
            </ul>
          </section>
        </article>
        <aside className="bb-blog-sidebar" aria-label="Outils complémentaires">
          <div className="bb-blog-side-card">
            <span className="bb-blog-side-kicker">PASSER À L'ACTION</span>
            <h2>Anticipez votre budget familial</h2>
            <p>Utilisez les outils gratuits Baby Budget pour définir vos dépenses et visualiser les prochains mois.</p>
            <Link className="bb-blog-cta" href="/budget">Estimer mon budget <span aria-hidden="true">→</span></Link>
            <Link className="bb-blog-side-link" href="/signup">Créer mon espace gratuit</Link>
          </div>
          <div className="bb-blog-side-card bb-blog-side-compact">
            <strong>À consulter également</strong>
            <Link href="/blog/cout-bebe-premiere-annee">Le coût d'un bébé la première année</Link>
            <Link href="/blog/aides-caf-bebe-2026">Les aides CAF pour bébé en 2026</Link>
          </div>
        </aside>
      </div>
      <div className="bb-blog-container bb-blog-back">
        <Link href="/blog">← Tous les articles du journal</Link>
      </div>
    </main>
  );
}
