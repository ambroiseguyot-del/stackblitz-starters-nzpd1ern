'use client';

import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { Baby, TrendingDown, ShieldCheck, Zap, PieChart, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ─── Hook dark mode ───────────────────────────────────────────────────────────
function useGlobalDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay = 0, cardBg = 'white', cardBorder = '#EAECF0', textColor = '#16443D', textMuted = '#657A6E' }: { icon: React.ReactNode; title: string; desc: string; delay?: number; cardBg?: string; cardBorder?: string; textColor?: string; textMuted?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      whileHover={{ y: -4 }}
      style={{
        background: cardBg,
        padding: '28px',
        borderRadius: '20px',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: '#E7F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: textColor, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: textMuted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FAQItem({ q, a, delay = 0, textColor = '#16443D', textMuted = '#4D6759', borderColor = '#DFE7DE' }: { q: string; a: string; delay?: number; textColor?: string; textMuted?: string; borderColor?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 600, color: textColor }}>{q}</span>
        <span style={{ fontSize: '1.2rem', color: '#94A3B8', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 0 20px', fontSize: '0.95rem', color: textMuted, lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const isDark = useGlobalDark();

  // Variables de couleur dark/light
  const c = {
    bg: isDark ? '#0B0E14' : '#FFFFFF',
    bgAlt: isDark ? '#111827' : '#F8F8F4',
    bgHero: isDark ? 'linear-gradient(180deg, #16443D 0%, #0B0E14 100%)' : 'linear-gradient(180deg, #F0F6EF 0%, #FFFFFF 100%)',
    bgCTA: isDark ? 'linear-gradient(180deg, #0B0E14 0%, #16443D 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #F0F6EF 100%)',
    text: isDark ? '#F0F3EE' : '#16443D',
    textMuted: isDark ? '#94A3B8' : '#4D6759',
    textFaint: isDark ? '#657A6E' : '#657A6E',
    border: isDark ? '#214C40' : '#DFE7DE',
    card: isDark ? '#161B26' : '#FFFFFF',
    cardBorder: isDark ? '#214C40' : '#EAECF0',
    featureBg: isDark ? 'linear-gradient(180deg, #161B26, #214C40)' : 'linear-gradient(180deg, #F8F8F4, #F0F3EE)',
    mockupBg: isDark ? '#161B26' : '#F8F8F4',
    footerBg: isDark ? '#0B0E14' : '#FFFFFF',
    footerBorder: isDark ? '#214C40' : '#DFE7DE',
    footerLine: isDark ? '#214C40' : '#F0F3EE',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: c.text, lineHeight: '1.6', overflowX: 'hidden' }}>

      <style jsx global>{`
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── BLOBS BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none' }}>
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,112,243,0.12), transparent)', filter: 'blur(100px)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: -200, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent)', filter: 'blur(100px)' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section className="bb-landing-hero"
      style={{
        padding: '100px 24px 90px',
        textAlign: 'center',
        background: c.bgHero,
        position: 'relative',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#E7F1EA', color: '#1C6856',
              padding: '7px 16px', borderRadius: 99,
              fontSize: 13, fontWeight: 600, marginBottom: 24,
            }}
          >
            <Baby size={15} /> Le budget familial, en toute simplicité
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: '-2px',
              lineHeight: 1.08,
              marginBottom: 24,
              color: c.text,
            }}
          >
            Combien coûte vraiment votre bébé ?<br />
            <span style={{ color: isDark ? '#9FCDB1' : '#1C6856' }}>Suivez et anticipez chaque dépense.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: c.textMuted, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}
          >
            Du premier achat aux frais de garde : enregistrez vos dépenses, comprenez votre budget et anticipez les prochains mois avec des prévisions adaptées à votre famille.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#16443D', color: 'white',
                  padding: '15px 32px', borderRadius: 12,
                  fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                  Créer mon espace gratuitement <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/informations" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: c.textMuted,
                  padding: '15px 24px', borderRadius: 12,
                  fontSize: '1rem', fontWeight: 500, textDecoration: 'none',
                  border: `1px solid ${c.border}`,
                }}>
                  Voir le guide →
                </Link>
              </motion.div>
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
              Sans carte bancaire · Données privées · 2 minutes pour démarrer
            </p>
          </motion.div>

          {/* Démonstration avec données fictives, sans données utilisateurs */}
          <p style={{ fontSize: 12, fontWeight: 700, color: c.textMuted, margin: '24px 0 -34px' }}>APERÇU DE L’APPLICATION · DONNÉES FICTIVES</p>
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              marginTop: 56,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
              border: '1px solid #DFE7DE',
              background: c.mockupBg,
              padding: 24,
            }}
          >
            {/* Mini dashboard preview en CSS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Total dépensé', value: '684 €', accent: true },
                { label: 'Budget restant', value: '316 €', green: true },
                { label: 'Opérations', value: '23' },
              ].map((card, i) => (
                <div key={i} style={{
                  background: card.accent ? '#E7F1EA' : c.card,
                  border: `1px solid ${card.accent ? '#B9D8C3' : c.border}`,
                  borderRadius: 12, padding: '14px 16px', textAlign: 'left',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{card.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: card.green ? '#2F8A6B' : card.accent ? '#16443D' : '#16443D', margin: 0, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>{card.value}</p>
                </div>
              ))}
            </div>
            {/* Barres simulées */}
            <div style={{ background: c.card, borderRadius: 12, border: `1px solid ${c.border}`, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, margin: '0 0 14px' }}>Dépenses par catégorie</p>
              {[
                { label: 'Couches', pct: 31, amount: 210, color: '#1C6856' },
                { label: 'Alimentation', pct: 26, amount: 180, color: '#418A74' },
                { label: 'Santé', pct: 18, amount: 124, color: '#9FCDB1' },
                { label: 'Équipement', pct: 25, amount: 170, color: '#93C5FD' },
              ].map((bar, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: c.textMuted }}>{bar.label}</span>
                    <span style={{ fontSize: 11, color: c.textMuted }}>{bar.amount} € · {bar.pct} % des dépenses</span>
                  </div>
                  <div style={{ height: 6, background: '#F0F3EE', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <section className="bb-benefits-strip" aria-label="Pourquoi choisir BabyBudget">
        <div className="bb-benefits-inner">
          {[
            { icon: '01', title: 'Comprendre', desc: 'Voyez rapidement où part votre budget.' },
            { icon: '02', title: 'Anticiper', desc: 'Gardez un œil sur les dépenses à venir.' },
            { icon: '03', title: 'Décider', desc: 'Faites vos choix avec une vision claire.' },
            { icon: '04', title: 'Grandir', desc: 'Suivez votre famille au fil du temps.' },
          ].map(item => (
            <div key={item.icon} className="bb-benefit">
              <span className="bb-benefit-number">{item.icon}</span>
              <div><h2>{item.title}</h2><p>{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROBLÈME / AGITATION
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C85B56', marginBottom: 12 }}>Le problème réel</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 20 }}>
              Un budget qui explose…<br />sans prévenir
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', lineHeight: 1.75, marginBottom: 20 }}>
              Entre l'équipement, l'alimentation, la garde et les petits achats du quotidien, il est facile de perdre de vue le coût réel de la première année.
            </p>
            <p style={{ color: c.textMuted, fontSize: '1rem', lineHeight: 1.75, marginBottom: 0 }}>
              Avec une vue centralisée de vos opérations, vous pouvez comprendre vos habitudes et ajuster vos choix. <strong style={{ color: c.text }}>BabyBudget vous aide à garder une vision claire, mois après mois.</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: c.featureBg,
              padding: '36px',
              borderRadius: 24,
              border: `1px solid ${c.border}`,
            }}
          >
            {[
              { icon: <TrendingDown size={20} color="#1C6856" />, text: 'Anticipez les pics de dépenses mensuels' },
              { icon: <ShieldCheck size={20} color="#1C6856" />, text: 'Sécurisez votre budget familial' },
              { icon: <PieChart size={20} color="#1C6856" />, text: 'Repérez les postes de gaspillage' },
              { icon: <BarChart2 size={20} color="#1C6856" />, text: 'Comparez vos dépenses à des repères illustratifs' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 3 ? 20 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E7F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 500, color: c.text, fontSize: '0.95rem' }}>{item.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          REPÈRES BUDGÉTAIRES ILLUSTRATIFS
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bgAlt }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C6856', marginBottom: 12 }}>Repères budgétaires illustratifs</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16 }}>
              Comment se situent vos dépenses<br />face à un budget indicatif ?
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Explorez vos dépenses aux côtés de repères indicatifs par âge et par catégorie. Ces estimations sont utiles pour réfléchir à votre budget, sans constituer des statistiques officielles ni un classement.
            </p>
          </motion.div>

          {/* Aperçu comparaison */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: c.card, borderRadius: 20, border: `1px solid ${c.border}`,
              padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontWeight: 700, color: c.text, margin: 0, fontSize: '0.95rem' }}>Tranche 0–1 an · Repères indicatifs</p>
              <span style={{ background: '#E7F1EA', color: '#1C6856', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }}>Repères indicatifs · hypothèses explicites</span>
            </div>
            {[
              { cat: 'Couches', vous: 58, nationale: 60 },
              { cat: 'Alimentation', vous: 95, nationale: 80 },
              { cat: 'Santé', vous: 45, nationale: 70 },
              { cat: 'Équipement', vous: 120, nationale: 150 },
            ].map((row, i) => {
              const max = Math.max(row.vous, row.nationale);
              const diff = ((row.vous - row.nationale) / row.nationale * 100).toFixed(0);
              const isOver = row.vous > row.nationale;
              return (
                <div key={i} style={{ marginBottom: i < 3 ? 20 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{row.cat}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{row.vous} €</span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>/ {row.nationale} € de repère</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: isOver ? '#C85B56' : '#2F8A6B' }}>
                        {isOver ? '▲' : '▼'} {Math.abs(Number(diff))}%
                      </span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: '#F0F3EE', borderRadius: 99, overflow: 'visible' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(row.nationale / max) * 100}%`, background: '#DFE7DE', borderRadius: 99 }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(row.vous / max) * 100}%`, background: isOver ? '#C85B56' : '#1C6856', borderRadius: 99, opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1px', marginBottom: 12 }}>
              Pensé pour les parents modernes
            </h2>
            <p style={{ color: c.textFaint, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Tout ce dont vous avez besoin pour piloter le budget de votre bébé, sans complexité.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <FeatureCard icon={<Zap size={20} color="#1C6856" />} title="Ultra rapide" desc="Ajoutez une dépense en 3 secondes. Interface pensée pour être utilisée entre deux biberons." delay={0} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<PieChart size={20} color="#1C6856" />} title="Visuels clairs" desc="Graphiques intuitifs pour comprendre votre budget d'un coup d'œil, sans formation." delay={0.1} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<Baby size={20} color="#1C6856" />} title="Multi-enfants" desc="Un profil et un budget indépendant par enfant. Idéal pour les familles avec plusieurs enfants." delay={0.2} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<BarChart2 size={20} color="#1C6856" />} title="Insights automatiques" desc="L'app génère des analyses et conseils personnalisés sans que vous n'ayez rien à configurer." delay={0.3} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          OUTILS GRATUITS
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: c.bgAlt }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1C6856', marginBottom: 10 }}>Disponible sur BabyBudget</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1px', marginBottom: 12, color: c.text }}>
              Tout pour préparer l'arrivée de bébé
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Des outils concrets pour anticiper les dépenses avant même la naissance.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              {
                emoji: '📋',
                title: 'Guide des dépenses par âge',
                desc: 'De la grossesse aux 2 ans — vaccins obligatoires, achats indispensables, aides disponibles.',
                color: '#1C6856',
                preview: (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
                    {['Avant naissance', '0–1 mois', '2–3 mois', '4–6 mois'].map(s => (
                      <span key={s} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: isDark ? '#1E2D4A' : '#E7F1EA', color: isDark ? '#9FCDB1' : '#1C6856', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                ),
              },
              {
                emoji: '🧮',
                title: 'Calculateur de budget prévisionnel',
                desc: "Explorez les hypothèses de coût par mode de garde. Les droits CAF réels doivent être vérifiés sur caf.fr.",
                color: '#1C6856',
                preview: (
                  <div style={{ marginTop: 12 }}>
                    {[['Crèche', 250], ['Assistante mat.', 450], ['Garde à domicile', 950]].map(([label, montant]) => (
                      <div key={label as string} style={{ marginBottom: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: c.textMuted, marginBottom: 3 }}>
                          <span>{label}</span><span>{montant} €/mois</span>
                        </div>
                        <div style={{ height: 4, background: isDark ? '#214C40' : '#DFE7DE', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${Number(montant) / 950 * 100}%`, background: '#1C6856', borderRadius: 99, opacity: 0.7 }} />
                        </div>
                      </div>
                    ))}
                    <p style={{ fontSize: 10, color: c.textMuted, lineHeight: 1.5, margin: '9px 0 0' }}>Exemples fictifs de coût mensuel avant aides, pour illustrer les différences entre modes de garde. Pas des tarifs officiels ni des taux de prise en charge.</p>
                  </div>
                ),
              },
              {
                emoji: '📊',
                title: 'Repères budgétaires indicatifs',
                desc: "Comparez vos dépenses à des hypothèses fictives par catégorie et par âge — jamais à une moyenne nationale prétendue.",
                color: '#2F8A6B',
                preview: (
                  <div style={{ marginTop: 12 }}>
                    {[['Couches', 72, 60], ['Alimentation', 45, 80], ['Santé', 88, 70]].map(([label, vous, nat]) => (
                      <div key={label as string} style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: c.textMuted, marginBottom: 3 }}>{label}</div>
                        <div style={{ position: 'relative', height: 4, background: isDark ? '#214C40' : '#DFE7DE', borderRadius: 99 }}>
                          <div style={{ position: 'absolute', height: '100%', width: `${nat}%`, background: isDark ? '#2D364D' : '#B9D0BF', borderRadius: 99 }} />
                          <div style={{ position: 'absolute', height: '100%', width: `${vous}%`, background: '#2F8A6B', borderRadius: 99, opacity: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div style={{
                  background: c.card, borderRadius: 20, border: `1px solid ${c.cardBorder}`,
                  padding: '24px', height: '100%',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{tool.emoji}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: c.text, marginBottom: 8, lineHeight: 1.3 }}>{tool.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: c.textMuted, lineHeight: 1.6, marginBottom: 0 }}>{tool.desc}</p>
                  {tool.preview}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ textAlign: 'center', marginTop: 36 }}
          >
            <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>
              Créez un compte gratuit pour accéder à tous ces outils.
            </p>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#16443D', color: 'white',
              padding: '12px 28px', borderRadius: 12,
              fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
            }}>
              Créer mon compte gratuitement →
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bg }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1px', marginBottom: 12 }}>
              Questions fréquentes
            </h2>
          </motion.div>

          <FAQItem
            textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
            q="C'est vraiment gratuit ?"
            a="Oui, totalement gratuit. Sans carte bancaire, sans période d'essai cachée. BabyBudget est une application indépendante, sans publicité et sans abonnement caché."
            delay={0}
          />
          <FAQItem
            textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
            q="Mes données sont-elles privées ?"
            a="Les données de chaque compte sont protégées par des contrôles d'accès. Consultez notre politique de confidentialité pour connaître les prestataires et les traitements appliqués."
            delay={0.05}
          />
          <FAQItem
            textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
            q="Ça fonctionne pour plusieurs enfants ?"
            a="Oui. Vous pouvez créer un profil par enfant et suivre un budget indépendant pour chacun. Les graphiques s'adaptent automatiquement."
            delay={0.1}
          />
          <FAQItem
            textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
            q="D'où viennent les repères budgétaires indicatifs ?"
            a="Les repères sont des budgets fictifs par âge et catégorie, destinés à donner un ordre de grandeur pour une simulation. Ils ne proviennent pas d'une enquête représentative, ne classent pas les familles et ne permettent pas de déduire vos droits CAF. Consultez les sources officielles de nos guides pour les chiffres réglementaires."
            delay={0.15}
          />
          <FAQItem
            textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
            q="Puis-je exporter mes données ?"
            a="Oui, vous pouvez exporter vos dépenses en CSV depuis la page Analyse. Vos données vous appartiennent et sont récupérables à tout moment."
            delay={0.2}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: '120px 24px',
        textAlign: 'center',
        background: c.bgCTA,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1C6856', marginBottom: 16 }}>Commencez maintenant</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              Reprenez le contrôle<br />dès aujourd'hui
            </h2>
            <p style={{ color: c.textFaint, fontSize: '1rem', marginBottom: 36, lineHeight: 1.7 }}>
              Rejoignez les familles qui pilotent leur budget bébé avec clarté.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#16443D', color: 'white',
                  padding: '16px 36px', borderRadius: 12,
                  fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                }}>
                  Créer mon compte gratuitement <ArrowRight size={16} />
                </Link>
              </motion.div>

              {/* Réassurances */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px' }}>
                {['Sans carte bancaire', 'Données privées', 'Résultats immédiats'].map((item) => (
                  <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94A3B8' }}>
                    <CheckCircle size={12} color="#2F8A6B" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer style={{ padding: '32px 24px', borderTop: `1px solid ${c.footerBorder}`, background: c.footerBg }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BrandLogo />
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Link href="/confidentialite" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>Confidentialité</Link>
              <Link href="/cgu" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>CGU</Link>
              <a href="mailto:contact@babybudget.fr" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div style={{ height: 1, background: c.footerLine, marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            Les estimations et comparaisons sont indicatives et ne remplacent pas les barèmes officiels en vigueur.<br />
            © {new Date().getFullYear()} BabyBudget — Application gratuite, sans publicité, sans engagement.
          </p>
        </div>
      </footer>

    </div>
  );
}