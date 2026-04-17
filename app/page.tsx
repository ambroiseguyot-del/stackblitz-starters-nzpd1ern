'use client';

import Navbar from '../components/Navbar';
import Link from 'next/link';
import { Baby, TrendingDown, ShieldCheck, Zap, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="landing-container" style={{ fontFamily: 'sans-serif', color: '#1a1a1a', lineHeight: '1.6', overflowX: 'hidden', position: 'relative' }}>
      
      {/* BACKGROUND ANIMATIONS */}

      {/* Gradient animé global */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -3,
          background: 'linear-gradient(270deg, #0070f3, #00c6ff, #0070f3)',
          backgroundSize: '600% 600%',
          animation: 'gradientMove 18s ease infinite',
          opacity: 0.06
        }}
      />

      {/* Blob 1 */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,112,243,0.25), transparent)',
          filter: 'blur(120px)',
          zIndex: -2
        }}
      />

      {/* Blob 2 */}
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          bottom: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,198,255,0.25), transparent)',
          filter: 'blur(120px)',
          zIndex: -2
        }}
      />

      <Navbar />

      <section style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
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
            }}
          >
            <Baby size={18} /> L'allié des nouveaux parents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              letterSpacing: '-1px',
              marginBottom: '20px',
              lineHeight: '1.1'
            }}
          >
            Bébé arrive, <br />
            <span style={{ color: '#0070f3' }}>gardez le contrôle du budget.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
            style={{
              fontSize: '1.25rem',
              color: '#666',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}
          >
            Visualisez chaque dépense, anticipez les coûts et évitez les mauvaises surprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.3 }}
            style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" style={primaryBtn}>
                Commencer gratuitement
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
            style={{
              marginTop: '60px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid #eee'
            }}
          >
            <img
              src="/dashboard-preview.png"
              alt="preview"
              style={{ width: '100%', display: 'block' }}
            />
          </motion.div>

        </div>
      </section>

      {/* RESTE DU CODE IDENTIQUE */}

      <section style={{ padding: '100px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            style={{
              background: 'linear-gradient(180deg, #ffffff, #f8f9fa)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid #eee',
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }}
          >
            <FeatureLine icon={<TrendingDown color="#0070f3" />} text="Anticipez les pics de dépenses" />
            <FeatureLine icon={<ShieldCheck color="#0070f3" />} text="Sécurisez votre budget" />
            <FeatureLine icon={<PieChart color="#0070f3" />} text="Repérez les gaspillages" />
          </motion.div>

        </div>
      </section>

      <section style={{ padding: '100px 20px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ fontSize: '2.5rem', marginBottom: '60px' }}
          >
            Pensé pour les parents modernes
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <FeatureCard icon={<Zap color="#0070f3" />} title="Ultra rapide" desc="Ajoutez une dépense en 3 secondes." delay={0} />
            <FeatureCard icon={<PieChart color="#0070f3" />} title="Visuel" desc="Comprenez tout en un coup d'œil." delay={0.1} />
            <FeatureCard icon={<Baby color="#0070f3" />} title="Multi-enfants" desc="Un budget par enfant." delay={0.2} />
          </div>

        </div>
      </section>

      <section style={{
        padding: '120px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #ffffff, #f0f7ff)'
      }}>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ fontSize: '2.4rem', marginBottom: '20px' }}
        >
          Reprenez le contrôle dès aujourd'hui
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          style={{ color: '#666', marginBottom: '40px' }}
        >
          Gratuit. Sans engagement. Résultats immédiats.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'inline-block' }}
        >
          <Link href="/signup" style={secondaryBtn}>
            Créer mon compte
          </Link>
        </motion.div>

      </section>

      {/* KEYFRAMES GLOBAL */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

    </div>
  );
}

/* COMPONENTS inchangés */

function FeatureCard({ icon, title, desc, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
      style={featureCardStyle}
    >
      <div style={iconBoxStyle}>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
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

/* STYLES inchangés */

const primaryBtn = {
  backgroundColor: '#0070f3',
  color: 'white',
  padding: '16px 32px',
  borderRadius: '12px',
  fontSize: '1.1rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 14px rgba(0,118,255,0.39)',
  transition: '0.2s',
  display: 'inline-block'
};

const secondaryBtn = {
  backgroundColor: '#1a1a1a',
  color: 'white',
  padding: '18px 40px',
  borderRadius: '12px',
  fontSize: '1.2rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-block'
};

const featureCardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  textAlign: 'left' as const,
  border: '1px solid #eee',
  cursor: 'default'
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