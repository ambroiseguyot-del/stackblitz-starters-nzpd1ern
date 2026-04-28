import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Conseils budget bébé & famille | BabyBudget',
  description: 'Guides pratiques, chiffres sourcés et conseils concrets pour anticiper et maîtriser le budget de votre bébé. Rédigés par des experts, basés sur les données INSEE et CAF.',
  openGraph: {
    title: 'Blog BabyBudget — Conseils budget bébé & famille',
    description: 'Guides pratiques pour anticiper et maîtriser le budget de votre bébé.',
    url: 'https://www.babybudget.fr/blog',
  },
};

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

const CATEGORIES = [
  { id: 'tous', label: 'Tous les articles' },
  { id: 'budget', label: 'Budget & finances' },
  { id: 'aides', label: 'Aides & CAF' },
  { id: 'equipement', label: 'Équipement' },
  { id: 'garde', label: 'Mode de garde' },
];

const ARTICLES = [
  {
    slug: 'cout-bebe-premiere-annee',
    titre: 'Combien coûte un bébé la première année ?',
    description: 'Couches, lait, mode de garde, équipement... Le budget réel d\'un enfant la première année dépasse souvent les estimations. Chiffres INSEE, postes de dépenses et aides disponibles — tout ce qu\'il faut savoir.',
    categorie: 'budget',
    categorieLabel: 'Budget & finances',
    date: '2024',
    lecture: '8 min',
    sources: ['INSEE 2023', 'CAF 2024', 'CREDOC 2022'],
    featured: true,
    emoji: '💰',
  },
];

const ARTICLES_A_VENIR = [
  { titre: 'Aides CAF bébé 2024 : tout ce à quoi vous avez droit', categorie: 'Aides & CAF', emoji: '🎁' },
  { titre: 'Crèche, nounou ou garde à domicile : quel mode de garde choisir ?', categorie: 'Mode de garde', emoji: '🏠' },
  { titre: 'Liste des achats indispensables avant la naissance de bébé', categorie: 'Équipement', emoji: '🛒' },
  { titre: 'Budget bébé mois par mois : à quoi s\'attendre ?', categorie: 'Budget & finances', emoji: '📅' },
  { titre: 'Combien coûte une assistante maternelle en 2024 ?', categorie: 'Mode de garde', emoji: '👶' },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: FONT, color: '#0F172A' }}>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '56px 24px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>
          Ressources gratuites
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 }}>
          Le blog BabyBudget
        </h1>
        <p style={{ fontSize: 15, color: '#94A3B8', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Guides pratiques, chiffres sourcés et conseils concrets pour anticiper et maîtriser le budget de votre bébé.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── ARTICLE À LA UNE ── */}
        {ARTICLES.filter(a => a.featured).map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
            <div style={{
              background: '#0F172A', borderRadius: 24, padding: '36px',
              transition: 'transform 0.15s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}
            >
              {/* Blob décoratif */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(99,102,241,0.2)', color: '#A5B4FC', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  À la une
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.08)', color: '#64748B' }}>
                  {article.categorieLabel}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 14 }}>
                {article.emoji} {article.titre}
              </h2>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
                {article.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {article.sources.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#475569', border: '1px solid rgba(255,255,255,0.08)' }}>
                      📎 {s}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>⏱ {article.lecture} de lecture</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Lire l'article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* ── GRILLE ARTICLES ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Tous les articles
            </h2>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>{ARTICLES.length} article{ARTICLES.length > 1 ? 's' : ''} disponible{ARTICLES.length > 1 ? 's' : ''}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {ARTICLES.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: 'white', borderRadius: 20, border: '1px solid #E2E8F0',
                  padding: '24px', height: '100%',
                  transition: 'all 0.15s', display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#6366F1'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#E2E8F0'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>{article.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: '#EFF6FF', color: '#1D4ED8' }}>
                      {article.categorieLabel}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 10, flex: 1 }}>
                    {article.titre}
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6, marginBottom: 16 }}>
                    {article.description.substring(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>⏱ {article.lecture}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6366F1' }}>Lire →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── PROCHAINEMENT ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>Prochainement</h2>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: '#F1F5F9', color: '#64748B' }}>Bientôt disponible</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ARTICLES_A_VENIR.map((article, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid #E2E8F0', borderRadius: 14,
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 16, opacity: 0.7,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{article.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{article.titre}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0' }}>
                    {article.categorie}
                  </span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>À venir</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA NEWSLETTER ── */}
        <div style={{ marginTop: 56, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D4ED8', marginBottom: 10 }}>
            Restez informé
          </p>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 10 }}>
            Un nouvel article chaque semaine
          </h3>
          <p style={{ fontSize: 14, color: '#1E40AF', marginBottom: 24, lineHeight: 1.6 }}>
            Guides pratiques, chiffres mis à jour et conseils budgétaires — directement dans votre dashboard BabyBudget.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#0F172A', color: 'white',
            padding: '12px 28px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Créer un compte gratuit →
          </Link>
        </div>

      </div>
    </div>
  );
}