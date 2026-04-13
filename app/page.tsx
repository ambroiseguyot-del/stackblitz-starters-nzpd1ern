import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Baby, TrendingDown, ShieldCheck, Zap, PieChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-container" style={{ fontFamily: 'sans-serif', color: '#1a1a1a', lineHeight: '1.6', overflowX: 'hidden' }}>
      <Navbar />

      {/* BACKGROUND GLOBAL */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        left: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0,112,243,0.15), transparent 70%)',
        filter: 'blur(80px)',
        zIndex: -1
      }} />

      {/* SECTION HERO */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#e0edff',
            color: '#0070f3',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            <Baby size={18} /> L'allié des nouveaux parents
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            letterSpacing: '-1px',
            marginBottom: '20px',
            lineHeight: '1.1'
          }}>
            Bébé arrive, <br />
            <span style={{ color: '#0070f3' }}>gardez le contrôle du budget.</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#666',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Visualisez chaque dépense, anticipez les coûts et évitez les mauvaises surprises.
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={primaryBtn}>
              Commencer gratuitement
            </Link>
          </div>

          {/* PREVIEW DASHBOARD */}
          <div style={{
            marginTop: '60px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: '1px solid #eee'
          }}>
            <img
              src="/dashboard-preview.png"
              alt="preview"
              style={{ width: '100%', display: 'block' }}
            />
          </div>

        </div>
      </section>

      {/* SECTION STORYTELLING */}
      <section style={{ padding: '100px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
              Un budget qui explose… sans prévenir
            </h2>

            <p style={{ color: '#444', fontSize: '1.1rem' }}>
              Un bébé coûte en moyenne <strong>600€ par mois</strong> la première année.
              <br /><br />
              Sans visibilité, les dépenses s'accumulent et deviennent incontrôlables.
              <br /><br />
              <strong>BabyBudget</strong> vous donne une vision claire et instantanée.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #ffffff, #f8f9fa)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid #eee',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}>
            
            <FeatureLine icon={<TrendingDown color="#0070f3" />} text="Anticipez les pics de dépenses" />
            <FeatureLine icon={<ShieldCheck color="#0070f3" />} text="Sécurisez votre budget" />
            <FeatureLine icon={<PieChart color="#0070f3" />} text="Repérez les gaspillages" />

          </div>
        </div>
      </section>

      {/* SECTION FEATURES */}
      <section style={{ padding: '100px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '60px' }}>
            Pensé pour les parents modernes
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            
            <FeatureCard icon={<Zap color="#0070f3" />} title="Ultra rapide" desc="Ajoutez une dépense en 3 secondes." />
            <FeatureCard icon={<PieChart color="#0070f3" />} title="Visuel" desc="Comprenez tout en un coup d'œil." />
            <FeatureCard icon={<Baby color="#0070f3" />} title="Multi-enfants" desc="Un budget par enfant." />

          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: '120px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #ffffff, #f0f7ff)'
      }}>
        
        <h2 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>
          Reprenez le contrôle dès aujourd’hui
        </h2>

        <p style={{ color: '#666', marginBottom: '40px' }}>
          Gratuit. Sans engagement. Résultats immédiats.
        </p>

        <Link href="/signup" style={secondaryBtn}>
          Créer mon compte
        </Link>

      </section>

    </div>
  );
}

/* COMPONENTS INLINE SAFE */

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div style={featureCardStyle}>
      <div style={iconBoxStyle}>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function FeatureLine({ icon, text }: any) {
  return (
    <div style={{
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      {icon}
      <span><strong>{text}</strong></span>
    </div>
  );
}

/* STYLES */

const primaryBtn = {
  backgroundColor: '#0070f3',
  color: 'white',
  padding: '16px 32px',
  borderRadius: '12px',
  fontSize: '1.1rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 14px rgba(0,118,255,0.39)',
  transition: '0.2s'
};

const secondaryBtn = {
  backgroundColor: '#1a1a1a',
  color: 'white',
  padding: '18px 40px',
  borderRadius: '12px',
  fontSize: '1.2rem',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const featureCardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  textAlign: 'left' as const,
  border: '1px solid #eee',
  transition: 'transform 0.2s ease'
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