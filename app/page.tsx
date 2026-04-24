'use client';

import Link from 'next/link';
import { Baby, TrendingDown, ShieldCheck, Zap, PieChart, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

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

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '', duration = 2 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('fr-FR')}{suffix}</span>;
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay = 0, cardBg = 'white', cardBorder = '#EAECF0', textColor = '#0F172A', textMuted = '#64748B' }: { icon: React.ReactNode; title: string; desc: string; delay?: number; cardBg?: string; cardBorder?: string; textColor?: string; textMuted?: string }) {
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
        background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: textColor, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: textMuted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FAQItem({ q, a, delay = 0, textColor = '#0F172A', textMuted = '#475569', borderColor = '#E2E8F0' }: { q: string; a: string; delay?: number; textColor?: string; textMuted?: string; borderColor?: string }) {
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
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
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
    bgAlt: isDark ? '#111827' : '#F8FAFC',
    bgHero: isDark ? 'linear-gradient(180deg, #0F172A 0%, #0B0E14 100%)' : 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)',
    bgCTA: isDark ? 'linear-gradient(180deg, #0B0E14 0%, #0F172A 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)',
    text: isDark ? '#F1F5F9' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#475569',
    textFaint: isDark ? '#64748B' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0',
    card: isDark ? '#161B26' : '#FFFFFF',
    cardBorder: isDark ? '#1E293B' : '#EAECF0',
    featureBg: isDark ? 'linear-gradient(180deg, #161B26, #1E293B)' : 'linear-gradient(180deg, #F8FAFC, #F1F5F9)',
    mockupBg: isDark ? '#161B26' : '#F8FAFC',
    footerBg: isDark ? '#0B0E14' : '#FFFFFF',
    footerBorder: isDark ? '#1E293B' : '#E2E8F0',
    footerLine: isDark ? '#1E293B' : '#F1F5F9',
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", color: c.text, lineHeight: '1.6', overflowX: 'hidden' }}>

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
      <section style={{
        padding: '120px 24px 100px',
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
              background: '#E0EDFF', color: '#0070F3',
              padding: '7px 16px', borderRadius: 99,
              fontSize: 13, fontWeight: 600, marginBottom: 24,
            }}
          >
            <Baby size={15} /> L'allié financier des nouveaux parents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
              letterSpacing: '-2px',
              lineHeight: 1.08,
              marginBottom: 24,
              color: '#0F172A',
            }}
          >
            Bébé arrive.<br />
            <span style={{ color: '#0070F3' }}>Gardez le contrôle du budget.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: c.textMuted, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}
          >
            Un bébé coûte en moyenne <strong style={{ color: c.text }}>700 € par mois</strong> la première année.
            Visualisez chaque dépense, comparez-vous à la moyenne nationale et anticipez les coûts avant qu'ils vous surprennent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#0F172A', color: 'white',
                padding: '15px 32px', borderRadius: 12,
                fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}>
                Analyser mes dépenses gratuitement <ArrowRight size={16} />
              </Link>
            </motion.div>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
              Sans carte bancaire · Données privées · 2 minutes pour démarrer
            </p>
          </motion.div>

          {/* Dashboard preview — mockup CSS au lieu d'une image qui peut manquer */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              marginTop: 56,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
              border: '1px solid #E2E8F0',
              background: c.mockupBg,
              padding: 24,
            }}
          >
            {/* Mini dashboard preview en CSS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Total dépensé', value: '684 €', accent: true },
                { label: 'Vs moyenne nationale', value: '-2,3%', green: true },
                { label: 'Opérations', value: '23' },
              ].map((card, i) => (
                <div key={i} style={{
                  background: card.accent ? '#EFF6FF' : c.card,
                  border: `1px solid ${card.accent ? '#BFDBFE' : c.border}`,
                  borderRadius: 12, padding: '14px 16px', textAlign: 'left',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{card.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: card.green ? '#10B981' : card.accent ? '#1E40AF' : '#0F172A', margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" }}>{card.value}</p>
                </div>
              ))}
            </div>
            {/* Barres simulées */}
            <div style={{ background: c.card, borderRadius: 12, border: `1px solid ${c.border}`, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', margin: '0 0 14px' }}>Dépenses par catégorie</p>
              {[
                { label: 'Couches', pct: 62, color: '#1E40AF' },
                { label: 'Alimentation', pct: 48, color: '#3B82F6' },
                { label: 'Santé', pct: 71, color: '#60A5FA' },
                { label: 'Équipement', pct: 35, color: '#93C5FD' },
              ].map((bar, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: c.textMuted }}>{bar.label}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{bar.pct}% de la moyenne</span>
                  </div>
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHIFFRES CLÉS ANIMÉS
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#0F172A' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.textMuted, marginBottom: 48 }}
          >
            Ce que les études disent vraiment
          </motion.p>
          <style>{`
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 40px 24px;
              text-align: center;
            }
            @media (min-width: 768px) {
              .stats-grid { grid-template-columns: repeat(4, 1fr); }
            }
          `}</style>
          <div className="stats-grid">
            {[
              { value: 700, suffix: ' €/mois', label: 'Coût moyen 1re année', source: 'INSEE 2023' },
              { value: 10000, suffix: ' €', label: 'Budget total 1re année', source: 'CAF.fr' },
              { value: 40, suffix: '%', label: 'Parents dépassent leur budget', source: 'CREDOC 2022' },
              { value: 3, suffix: 'e mois', label: 'Quand le budget dérape', source: 'Observatoire CAF' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", color: '#60A5FA', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', margin: '0 0 4px', fontWeight: 500, lineHeight: 1.4 }}>{stat.label}</p>
                <p style={{ fontSize: 11, color: c.textMuted, margin: 0 }}>{stat.source}</p>
              </motion.div>
            ))}
          </div>
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
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EF4444', marginBottom: 12 }}>Le problème réel</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 20 }}>
              Un budget qui explose…<br />sans prévenir
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', lineHeight: 1.75, marginBottom: 20 }}>
              Selon l'INSEE, un bébé coûte en moyenne <strong style={{ color: c.text }}>700 € par mois</strong> la première année — mais 40% des parents sous-estiment cette dépense de moitié (CREDOC 2022).
            </p>
            <p style={{ color: c.textMuted, fontSize: '1rem', lineHeight: 1.75, marginBottom: 0 }}>
              Sans visibilité sur leurs dépenses réelles, les familles dépassent leur budget dès le 3e mois. <strong style={{ color: c.text }}>BabyBudget vous donne une vision claire, en temps réel.</strong>
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
              { icon: <TrendingDown size={20} color="#0070F3" />, text: 'Anticipez les pics de dépenses mensuel' },
              { icon: <ShieldCheck size={20} color="#0070F3" />, text: 'Sécurisez votre budget familial' },
              { icon: <PieChart size={20} color="#0070F3" />, text: 'Repérez les postes de gaspillage' },
              { icon: <BarChart2 size={20} color="#0070F3" />, text: 'Comparez-vous à la moyenne nationale (INSEE)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 3 ? 20 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 500, color: '#1E293B', fontSize: '0.95rem' }}>{item.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURE DIFFÉRENCIANTE — COMPARAISON NATIONALE
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bgAlt }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0070F3', marginBottom: 12 }}>Fonctionnalité unique</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16 }}>
              Êtes-vous au-dessus ou en dessous<br />de la moyenne nationale ?
            </h2>
            <p style={{ color: c.textMuted, fontSize: '1rem', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 }}>
              BabyBudget est la seule app qui compare vos dépenses aux moyennes nationales (INSEE, CAF, DREES) par tranche d'âge et par catégorie — pour savoir exactement où vous vous situez.
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
              <p style={{ fontWeight: 700, color: '#0F172A', margin: 0, fontSize: '0.95rem' }}>Tranche 0–1 an · Comparaison nationale</p>
              <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }}>🇫🇷 Données INSEE · CAF · DREES</span>
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
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{row.cat}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>{row.vous} €</span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>/ {row.nationale} € moy.</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: isOver ? '#EF4444' : '#10B981' }}>
                        {isOver ? '▲' : '▼'} {Math.abs(Number(diff))}%
                      </span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'visible' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(row.nationale / max) * 100}%`, background: '#E2E8F0', borderRadius: 99 }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(row.vous / max) * 100}%`, background: isOver ? '#EF4444' : '#6366F1', borderRadius: 99, opacity: 0.85 }} />
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
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", letterSpacing: '-1px', marginBottom: 12 }}>
              Pensé pour les parents modernes
            </h2>
            <p style={{ color: c.textFaint, fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Tout ce dont vous avez besoin pour piloter le budget de votre bébé, sans complexité.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            <FeatureCard icon={<Zap size={20} color="#0070F3" />} title="Ultra rapide" desc="Ajoutez une dépense en 3 secondes. Interface pensée pour être utilisée entre deux biberons." delay={0} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<PieChart size={20} color="#0070F3" />} title="Visuels clairs" desc="Graphiques intuitifs pour comprendre votre budget d'un coup d'œil, sans formation." delay={0.1} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<Baby size={20} color="#0070F3" />} title="Multi-enfants" desc="Un profil et un budget indépendant par enfant. Idéal pour les familles avec plusieurs enfants." delay={0.2} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
            <FeatureCard icon={<BarChart2 size={20} color="#0070F3" />} title="Insights automatiques" desc="L'app génère des analyses et conseils personnalisés sans que vous n'ayez rien à configurer." delay={0.3} cardBg={c.card} cardBorder={c.cardBorder} textColor={c.text} textMuted={c.textFaint} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: c.bgAlt }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", letterSpacing: '-1px', marginBottom: 12 }}>
              Questions fréquentes
            </h2>
          </motion.div>

          textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
          <FAQItem
            q="C'est vraiment gratuit ?"
            a="Oui, totalement gratuit. Sans carte bancaire, sans période d'essai cachée. BabyBudget est une application indépendante sans publicité."
            delay={0}
          />
          textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
          <FAQItem
            q="Mes données sont-elles privées ?"
            a="Vos données sont stockées de façon sécurisée sur Supabase (infrastructure européenne). Chaque famille n'a accès qu'à ses propres données — aucun partage avec des tiers."
            delay={0.05}
          />
          textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
          <FAQItem
            q="Ça fonctionne pour plusieurs enfants ?"
            a="Oui. Vous pouvez créer un profil par enfant et suivre un budget indépendant pour chacun. Les graphiques s'adaptent automatiquement."
            delay={0.1}
          />
          textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
          <FAQItem
            q="D'où viennent les moyennes nationales ?"
            a="Les données de comparaison sont issues de l'INSEE (enquête budget des familles 2023), de la CAF et de la DREES. Elles sont mises à jour annuellement et représentent les moyennes françaises par tranche d'âge."
            delay={0.15}
          />
          textColor={c.text} textMuted={c.textMuted} borderColor={c.border}
          <FAQItem
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
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0070F3', marginBottom: 16 }}>Commencez maintenant</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              Reprenez le contrôle<br />dès aujourd'hui
            </h2>
            <p style={{ color: c.textFaint, fontSize: '1rem', marginBottom: 36, lineHeight: 1.7 }}>
              Rejoignez les familles qui pilotent leur budget bébé avec clarté.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#0F172A', color: 'white',
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
                    <CheckCircle size={12} color="#10B981" /> {item}
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
              <div style={{ width: 28, height: 28, background: '#0F172A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👶</div>
              <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif", fontWeight: 800, fontSize: 15, color: c.text, letterSpacing: '-0.02em' }}>
                Baby<span style={{ color: '#6366F1' }}>Budget</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Link href="/confidentialite" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>Confidentialité</Link>
              <Link href="/cgu" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>CGU</Link>
              <Link href="/budget" style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}>Budget estimé</Link>
              <a href="mailto:contact@babybudget.app" style={{ fontSize: 13, color: c.textFaint, textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div style={{ height: 1, background: c.footerLine, marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            Données indicatives basées sur les moyennes nationales françaises (INSEE, CAF, DREES, CREDOC). À titre indicatif uniquement.<br />
            © {new Date().getFullYear()} BabyBudget — Application gratuite, sans publicité, sans engagement.
          </p>
        </div>
      </footer>

    </div>
  );
}