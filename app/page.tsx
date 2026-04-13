import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Baby, TrendingDown, ShieldCheck, Zap, PieChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-container" style={{ fontFamily: 'sans-serif', color: '#1a1a1a', lineHeight: '1.6' }}>
      <Navbar />

      {/* SECTION HERO */}
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#e0edff', color: '#0070f3', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px' }}>
            <Baby size={18} /> L'allié des nouveaux parents
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '20px', lineHeight: '1.1' }}>
            Bébé arrive, <br /><span style={{ color: '#0070f3' }}>votre budget aussi.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Ne laissez plus les petites dépenses devenir de grandes surprises. Suivez, analysez et maîtrisez le budget de vos enfants en toute sérénité.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/signup" style={{ backgroundColor: '#0070f3', color: 'white', padding: '16px 32px', borderRadius: '12px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}>
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION STORYTELLING */}
      <section style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Pourquoi suivre le budget de Bébé ?</h2>
            <p style={{ color: '#444', fontSize: '1.1rem' }}>
              Entre les couches, le lait et les visites chez le pédiatre, on estime qu'un enfant coûte en moyenne <strong>600€ par mois</strong> la première année. 
              <br /><br />
              Sans outil adapté, il est impossible de savoir si vous optimisez vos dépenses ou si vous dépassez vos limites. <strong>BabyBudget</strong> a été conçu par des parents, pour des parents, pour apporter une réponse claire en un coup d'œil.
            </p>
          </div>
          <div style={{ backgroundColor: '#f8f9fa', padding: '40px', borderRadius: '24px', border: '1px solid #eee' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <TrendingDown color="#0070f3" /> 
              <span><strong>Anticipez les pics</strong> de dépenses (rentrée, hiver).</span>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ShieldCheck color="#0070f3" /> 
              <span><strong>Sécurisez l'avenir</strong> en épargnant ce que vous maîtrisez.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <PieChart color="#0070f3" /> 
              <span><strong>Identifiez les gaspillages</strong> inutiles immédiatement.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FEATURES */}
      <section style={{ padding: '80px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>Tout ce dont vous avez besoin</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            
            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><Zap color="#0070f3" /></div>
              <h3>Saisie Ultra-Rapide</h3>
              <p>Ajoutez une dépense en 3 secondes chrono depuis votre smartphone, même avec bébé dans les bras.</p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><PieChart color="#0070f3" /></div>
              <h3>Analyses Visuelles</h3>
              <p>Des graphiques simples pour comprendre immédiatement la répartition de vos coûts (Santé, Nourriture, Jeux...).</p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconBoxStyle}><Baby color="#0070f3" /></div>
              <h3>Gestion Multi-Enfants</h3>
              <p>Séparez les budgets de chaque enfant pour une vision précise et personnalisée de votre foyer.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Prêt à simplifier votre quotidien ?</h2>
        <Link href="/signup" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '18px 40px', borderRadius: '12px', fontSize: '1.2rem', textDecoration: 'none', fontWeight: 'bold' }}>
          Créer mon compte maintenant
        </Link>
      </section>
    </div>
  );
}

// Styles réutilisables
const featureCardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  textAlign: 'left' as const,
  border: '1px solid #eee'
};

const iconBoxStyle = {
  backgroundColor: '#f0f7ff',
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px'
};