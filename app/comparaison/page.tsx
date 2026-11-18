"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, Cell, PieChart, Pie, Legend,
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type AgeSlice = "0-1" | "1-3" | "3-6";

interface Expense {
  amount: number;
  category: string;
  created_at: string | null;
}

interface NationalSlice {
  total: number;
  categories: Record<string, number>;
}

// ─── HOOK DARK MODE ───────────────────────────────────────────────────────────

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

// ─── REPÈRES BUDGÉTAIRES FICTIFS : AUCUNE SOURCE STATISTIQUE ─────────────────

const nationalData: Record<AgeSlice, NationalSlice> = {
  "0-1": {
    total: 510,
    categories: { couches: 60, alimentation: 80, sante: 70, vetements: 50, equipement: 150, autres: 100 },
  },
  "1-3": {
    total: 450,
    categories: { couches: 30, alimentation: 120, sante: 60, vetements: 60, equipement: 80, autres: 100 },
  },
  "3-6": {
    total: 400,
    categories: { alimentation: 150, sante: 50, vetements: 70, education: 50, loisirs: 80 },
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  couches: "Couches", alimentation: "Alimentation", sante: "Santé", soins: "Soins",
  lait: "Lait", vetements: "Vêtements", vetement: "Vêtements", equipement: "Équipement",
  education: "Éducation", ecole: "École", loisirs: "Loisirs", jouets: "Jouets",
  autre: "Autre", autres: "Autres",
};

const CATEGORY_MAP: Record<string, string> = {
  couches: "couches", lait: "alimentation", sante: "sante", soins: "sante",
  vetements: "vetements", jouets: "equipement", ecole: "education", loisirs: "loisirs",
  equipement: "equipement", education: "education", alimentation: "alimentation",
  autre: "autres", autres: "autres",
};

const PIE_COLORS = ["#1C6856","#8B5CF6","#A78BFA","#C4B5FD","#DDD6FE","#EDE9FE"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

function filterByMonth(expenses: Expense[], year: number, month: number): Expense[] {
  return expenses.filter(e => {
    if (!e.created_at) return false;
    const parts = e.created_at.split("T")[0].split("-").map(Number);
    return parts[0] === year && parts[1] - 1 === month;
  });
}

function generateInsights(
  userTotal: number, nationalTotal: number,
  userByCategory: Record<string, number>, nationalCategories: Record<string, number>
): string[] {
  const insights: string[] = [];
  if (nationalTotal === 0) return insights;
  const diff = ((userTotal - nationalTotal) / nationalTotal) * 100;
  const absDiff = Math.abs(diff);
  if (diff > 15) insights.push(`Vos dépenses sont ${absDiff.toFixed(0)} % au-dessus du budget de référence illustratif pour cette tranche d'âge.`);
  else if (diff < -15) insights.push(`Vos dépenses sont ${absDiff.toFixed(0)} % en dessous du budget de référence illustratif — ce montant reste une hypothèse indicative.`);
  else insights.push(`Vos dépenses sont proches du budget de référence illustratif (écart de ${absDiff.toFixed(0)} %).`);
  const topUserCat = Object.entries(userByCategory).sort((a, b) => b[1] - a[1])[0];
  if (topUserCat) insights.push(`Votre poste principal est "${CATEGORY_LABELS[topUserCat[0]] || topUserCat[0]}" (${fmt(topUserCat[1])}/mois).`);
  const gaps = Object.entries(nationalCategories).map(([cat, natVal]) => ({
    cat, gap: natVal > 0 ? ((userByCategory[cat] ?? 0) - natVal) / natVal * 100 : 0,
  }));
  const maxOverspend = gaps.sort((a, b) => b.gap - a.gap)[0];
  if (maxOverspend && maxOverspend.gap > 20) {
    insights.push(`Attention : "${CATEGORY_LABELS[maxOverspend.cat] || maxOverspend.cat}" dépasse le repère indicatif de ${maxOverspend.gap.toFixed(0)} % — il peut être utile de comparer vos dépenses à vos propres objectifs.`);
  }
  insights.push('Ces repères sont des hypothèses budgétaires illustratives et non des percentiles statistiques.');
  return insights;
}

// ─── HOOK EXPENSES — avec filtre user_id ──────────────────────────────────────

function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setWarning(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setExpenses([]);
        setLoading(false);
        return; // Public comparisons remain available; private data is not queried.
      }
      const uid = user.id;
      const query = supabase.from("expenses").select("*").eq("user_id", uid).limit(1000);

      const { data, error: err } = await query;

      if (err) {
        setWarning(`[${err.code}] ${err.message}`);
        setExpenses([]);
      } else {
        const normalized: Expense[] = (data || []).map((row: any) => ({
          amount: Number(row.amount ?? row.montant ?? row.total ?? 0),
          category: (row.category ?? row.categorie ?? row.type ?? "autres")
            .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(),
          created_at: row.date ?? row.created_at ?? row.createdAt ?? null,
        }));
        setExpenses(normalized);
      }
    } catch (e: any) {
      setWarning(`Erreur réseau : ${e?.message ?? String(e)}`);
      setExpenses([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchData());
    return () => subscription.unsubscribe();
  }, [fetchData]);

  return { expenses, loading, warning, refetch: fetchData };
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ h, skColor }: { h: number; skColor: string }) {
  return (
    <div style={{
      height: h, borderRadius: 20, background: skColor,
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  );
}

function PageSkeleton({ skColor }: { skColor: string }) {
  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <SkeletonBlock h={120} skColor={skColor} />
          <SkeletonBlock h={120} skColor={skColor} />
          <SkeletonBlock h={120} skColor={skColor} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SkeletonBlock h={260} skColor={skColor} />
          <SkeletonBlock h={260} skColor={skColor} />
        </div>
        <SkeletonBlock h={300} skColor={skColor} />
      </div>
    </>
  );
}

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, cardBg, border, text }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', fontSize: 13 }}>
      {label && <p style={{ fontWeight: 600, color: text, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontWeight: 500, margin: '2px 0' }}>{p.name} : {fmt(p.value)}</p>
      ))}
    </div>
  );
};

function KPICard({ label, value, sub, accent, icon, cv }: {
  label: string; value: string; sub?: React.ReactNode; accent?: boolean; icon: string; cv: any;
}) {
  return (
    <div style={{
      background: accent ? cv.accentBg : cv.card,
      border: `1px solid ${accent ? cv.accentBorder : cv.border}`,
      borderRadius: 20, padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: cv.textMuted }}>{label}</span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent ? cv.accent : cv.text, margin: 0, letterSpacing: '-1px' }}>{value}</p>
      {sub && <div style={{ fontSize: 13, color: cv.textMuted }}>{sub}</div>}
    </div>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  const isGood = diff <= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700,
      background: isGood ? '#EEF7EE' : '#FEF2F2',
      color: isGood ? '#166534' : '#991B1B',
    }}>
      {isGood ? "▼" : "▲"} {fmtPct(diff)}
      <span style={{ fontWeight: 400, opacity: 0.7 }}>vs repère indicatif</span>
    </span>
  );
}

function ComparisonBar({ label, userVal, nationalVal, cv }: {
  label: string; userVal: number; nationalVal: number; cv: any;
}) {
  const max = Math.max(userVal, nationalVal, 1);
  const userPct = (userVal / max) * 100;
  const natPct = (nationalVal / max) * 100;
  const diff = nationalVal > 0 ? ((userVal - nationalVal) / nationalVal) * 100 : 0;
  const isOver = diff > 0;
  return (
    <div style={{ padding: '10px 0', borderBottom: `1px solid ${cv.borderFaint}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: cv.text }}>{CATEGORY_LABELS[label] || label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1C6856' }}>{fmt(userVal)}</span>
          <span style={{ fontSize: 12, color: cv.textMuted }}>/ {fmt(nationalVal)}</span>
          {nationalVal > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: isOver ? '#C85B56' : '#2F8A6B' }}>{fmtPct(diff)}</span>}
        </div>
      </div>
      <div style={{ position: 'relative', height: 8, background: cv.border, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${natPct}%`, background: cv.textMuted, borderRadius: 99, opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${userPct}%`, background: isOver ? '#C85B56' : '#1C6856', borderRadius: 99, opacity: 0.85 }} />
      </div>
    </div>
  );
}

function InsightCard({ text, index, cv }: { text: string; index: number; cv: any }) {
  const icons = ["💡", "📊", "⚡", "🎯"];
  return (
    <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12 }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icons[index % icons.length]}</span>
      <p style={{ fontSize: 13, color: cv.textSecondary, lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

function FilterPill({ label, active, onClick, cv }: { label: string; active: boolean; onClick: () => void; cv: any }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
      border: `1.5px solid ${active ? '#1C6856' : cv.border}`,
      background: active ? '#1C6856' : cv.card,
      color: active ? 'white' : cv.textMuted,
      cursor: 'pointer', transition: 'all 0.15s',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {label}
    </button>
  );
}

function SectionTitle({ children, cv }: { children: React.ReactNode; cv: any }) {
  return (
    <h2 style={{ fontSize: 15, fontWeight: 700, color: cv.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 4, height: 20, borderRadius: 2, background: '#1C6856', display: 'inline-block', flexShrink: 0 }} />
      {children}
    </h2>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function ComparaisonIndicative() {
  const isDark = useGlobalDark();
  const { expenses, loading, warning, refetch } = useExpenses();
  const [ageSlice, setAgeSlice] = useState<AgeSlice>("0-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("toutes");

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const goPrev = () => setSelectedDate(d => d.month === 0 ? { year: d.year - 1, month: 11 } : { ...d, month: d.month - 1 });
  const goNext = () => setSelectedDate(d => d.month === 11 ? { year: d.year + 1, month: 0 } : { ...d, month: d.month + 1 });
  const isCurrentMonth = selectedDate.year === now.getFullYear() && selectedDate.month === now.getMonth();

  // Palette couleurs dark/light
  const cv = useMemo(() => ({
    bg:            isDark ? '#0B0E14' : '#F8F8F4',
    card:          isDark ? '#161B26' : '#FFFFFF',
    border:        isDark ? '#2D364D' : '#DFE7DE',
    borderFaint:   isDark ? '#214C40' : '#F0F3EE',
    text:          isDark ? '#F0F3EE' : '#16443D',
    textMuted:     isDark ? '#94A3B8' : '#657A6E',
    textSecondary: isDark ? '#B9D0BF' : '#4D6759',
    accentBg:      isDark ? '#1E2D4A' : '#E7F1EA',
    accentBorder:  isDark ? '#1C6856' : '#B9D8C3',
    accent:        isDark ? '#9FCDB1' : '#1C6856',
    headerBg:      isDark ? 'rgba(22,27,38,0.95)' : 'rgba(255,255,255,0.95)',
    skColor:       isDark ? '#214C40' : '#DFE7DE',
    barNat:        isDark ? '#2D364D' : '#DFE7DE',
  }), [isDark]);

  const national = nationalData[ageSlice];
  const allCategories = useMemo(() => ["toutes", ...Object.keys(national.categories)], [national]);

  const monthlyExpenses = useMemo(
    () => filterByMonth(expenses, selectedDate.year, selectedDate.month),
    [expenses, selectedDate]
  );

  const userByCategory = useMemo<Record<string, number>>(() =>
    monthlyExpenses.reduce((acc, e) => {
      const cat = CATEGORY_MAP[e.category] ?? e.category;
      acc[cat] = (acc[cat] ?? 0) + (e.amount || 0);
      return acc;
    }, {} as Record<string, number>),
    [monthlyExpenses]
  );

  const userTotal = useMemo(() => Object.values(userByCategory).reduce((s, v) => s + v, 0), [userByCategory]);
  const userFiltered = useMemo(() => selectedCategory === "toutes" ? userTotal : (userByCategory[selectedCategory] ?? 0), [selectedCategory, userByCategory, userTotal]);
  const nationalFiltered = useMemo(() => selectedCategory === "toutes" ? national.total : (national.categories[selectedCategory] ?? 0), [selectedCategory, national]);
  const diff = useMemo(() => nationalFiltered === 0 ? 0 : ((userFiltered - nationalFiltered) / nationalFiltered) * 100, [userFiltered, nationalFiltered]);

  const barData = useMemo(() => {
    const cats = selectedCategory === "toutes" ? Object.keys(national.categories) : [selectedCategory];
    return cats.map(cat => ({ name: CATEGORY_LABELS[cat] || cat, Vous: userByCategory[cat] ?? 0, Repère: national.categories[cat] ?? 0 }));
  }, [national, userByCategory, selectedCategory]);

  const pieData = useMemo(() =>
    Object.entries(national.categories).map(([cat, val]) => ({ name: CATEGORY_LABELS[cat] || cat, value: val })),
    [national]
  );

  const radarData = useMemo(() => {
    const natMax = Math.max(...Object.values(national.categories));
    return Object.keys(national.categories).map(cat => ({
      subject: CATEGORY_LABELS[cat] || cat,
      Vous: Math.round(((userByCategory[cat] ?? 0) / natMax) * 100),
      Repère: Math.round(((national.categories[cat] ?? 0) / natMax) * 100),
    }));
  }, [national, userByCategory]);

  const insights = useMemo(() =>
    generateInsights(userTotal, national.total, userByCategory, national.categories),
    [userTotal, national, userByCategory]
  );

  const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

  return (
    <div style={{ minHeight: '100vh', background: cv.bg, color: cv.text, fontFamily: FONT }}>

      {/* ── HEADER ── */}
      <div style={{
        background: cv.headerBg, borderBottom: `1px solid ${cv.border}`,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1C6856', margin: '0 0 2px' }}>Budget Bébé</p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: cv.text, margin: 0, letterSpacing: '-0.5px' }}>Vos repères budgétaires indicatifs</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 16, padding: '8px 12px' }}>
            <button onClick={goPrev} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', color: cv.textMuted, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }} aria-label="Mois précédent">❮</button>
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: cv.text, margin: 0, textTransform: 'capitalize' }}>{MONTHS_FR[selectedDate.month]} {selectedDate.year}</p>
              {isCurrentMonth && <p style={{ fontSize: 11, color: '#1C6856', fontWeight: 600, margin: 0 }}>Mois en cours</p>}
            </div>
            <button onClick={goNext} disabled={isCurrentMonth} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'none', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: cv.textMuted, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isCurrentMonth ? 0.3 : 1, fontFamily: FONT }} aria-label="Mois suivant">❯</button>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: cv.accentBg, color: cv.accent, fontSize: 12, fontWeight: 600, border: `1px solid ${cv.accentBorder}` }}>
            Hypothèses illustratives · non officielles
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <aside className="bb-data-notice" role="note">
          <strong>Important : repères indicatifs, pas des statistiques officielles</strong> — Les montants ci-dessous sont des <strong>hypothèses budgétaires fictives</strong>, construites pour illustrer différentes situations. Ils ne proviennent pas d'une enquête nationale, ne sont pas des moyennes françaises et ne permettent pas de classer les familles.
        </aside>

        <details className="bb-comparison-method" open>
          <summary>Comment sont construits ces repères ? Pourquoi ne sont-ils pas « nationaux » ?</summary>
          <div>
            <p>Les valeurs correspondent à des exemples de budget mensuel fictifs répartis entre catégories et tranches d'âge. Elles ne sont pas calculées à partir de données INSEE, CAF ou DREES, ni ajustées selon le revenu, le lieu de vie ou le mode de garde de votre famille.</p>
            <p>Les écarts avec vos propres dépenses sont purement arithmétiques. Ils ne représentent ni une moyenne française, ni un classement, ni une estimation de vos droits à une aide. Pour une décision, utilisez vos dépenses réelles et consultez les sources officielles dans <a href="/blog">les guides Baby Budget</a>.</p>
          </div>
        </details>

        {/* ── FILTRES ── */}
        <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: cv.textMuted, margin: 0 }}>Tranche d'âge</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(["0-1","1-3","3-6"] as AgeSlice[]).map(slice => (
                  <FilterPill key={slice} label={`${slice} an${slice === "0-1" ? "" : "s"}`} active={ageSlice === slice} onClick={() => setAgeSlice(slice)} cv={cv} />
                ))}
              </div>
            </div>
            <div style={{ width: 1, background: cv.border, alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: cv.textMuted, margin: 0 }}>Catégorie</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {allCategories.map(cat => (
                  <FilterPill key={cat} label={cat === "toutes" ? "Toutes" : (CATEGORY_LABELS[cat] || cat)} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} cv={cv} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SKELETON ── */}
        {loading && <PageSkeleton skColor={cv.skColor} />}

        {/* ── WARNING ── */}
        {!loading && warning && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '12px 16px' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500, margin: '0 0 2px' }}>{warning}</p>
              <p style={{ fontSize: 12, color: '#78350F', margin: 0 }}>Les repères fictifs restent visibles, mais vos dépenses ne peuvent pas être affichées correctement. Veuillez réessayer.</p>
            </div>
            <button onClick={refetch} style={{ fontSize: 12, fontWeight: 600, color: '#B45309', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0, fontFamily: FONT }}>Réessayer</button>
          </div>
        )}

        {/* ── CONTENU PRINCIPAL ── */}
        {!loading && (
          <>
            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <KPICard icon="👤" label="Vos dépenses / mois" value={fmt(userFiltered)} accent cv={cv}
                sub={monthlyExpenses.length === 0
                  ? `Aucune dépense — ${MONTHS_FR[selectedDate.month]} ${selectedDate.year}`
                  : `${monthlyExpenses.length} opération${monthlyExpenses.length > 1 ? "s" : ""} · ${MONTHS_FR[selectedDate.month]}`}
              />
              <KPICard icon="📊" label="Repère indicatif" value={fmt(nationalFiltered)} cv={cv}
                sub={`Tranche ${ageSlice} an${ageSlice === "0-1" ? "" : "s"}`}
              />
              <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>📈</span>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: cv.textMuted }}>Votre écart</span>
                </div>
                <p style={{ fontSize: 28, fontWeight: 800, color: diff <= 0 ? '#2F8A6B' : '#C85B56', margin: 0, letterSpacing: '-1px' }}>{fmtPct(diff)}</p>
                <DiffBadge diff={diff} />
                <p style={{ fontSize: 12, color: cv.textMuted, margin: 0 }}>
                  {diff <= 0
                    ? `Vos dépenses sont inférieures de ${fmt(Math.abs(userFiltered - nationalFiltered))} au repère indicatif`
                    : `Vos dépenses dépassent le repère indicatif de ${fmt(Math.abs(userFiltered - nationalFiltered))}`}
                </p>
              </div>
            </div>

            {/* NO DATA */}
            {monthlyExpenses.length === 0 && (
              <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32 }}>📭</span>
                <div>
                  <p style={{ fontWeight: 600, color: cv.text, margin: '0 0 4px' }}>
                    {warning ? "Vos dépenses ne sont pas disponibles pour l'instant" : `Aucune dépense en ${MONTHS_FR[selectedDate.month]} ${selectedDate.year}`}
                  </p>
                  <p style={{ fontSize: 13, color: cv.textMuted, margin: 0 }}>
                    {warning ? "Les repères illustratifs restent consultables." : "Naviguez vers un autre mois ou ajoutez des dépenses depuis le dashboard."}
                  </p>
                </div>
              </div>
            )}

            {/* INSIGHTS */}
            {insights.length > 0 && (
              <div>
                <SectionTitle cv={cv}>Insights automatiques</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  {insights.map((text, i) => <InsightCard key={i} text={text} index={i} cv={cv} />)}
                </div>
              </div>
            )}

            {/* GRAPHIQUES */}
            <div>
              <SectionTitle cv={cv}>Analyse graphique</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

                <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: cv.text, margin: '0 0 16px' }}>
                    Vous vs Repère {selectedCategory !== "toutes" ? `— ${CATEGORY_LABELS[selectedCategory] || selectedCategory}` : "(par catégorie)"}
                  </p>
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={cv.border} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: cv.textMuted }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={v => fmt(v)} tick={{ fontSize: 10, fill: cv.textMuted }} axisLine={false} tickLine={false} width={64} />
                        <Tooltip content={(props: any) => <CustomTooltip {...props} cardBg={cv.card} border={cv.border} text={cv.text} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} />
                        <Legend formatter={value => <span style={{ fontSize: 12, color: cv.textSecondary }}>{value}</span>} />
                        <Bar dataKey="Vous" fill="#1C6856" radius={[6,6,0,0]} maxBarSize={40} />
                        <Bar dataKey="Repère" fill={cv.barNat} stroke={cv.textMuted} strokeWidth={1} radius={[6,6,0,0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: cv.text, margin: '0 0 16px' }}>
                    Répartition du repère — {ageSlice} an{ageSlice === "0-1" ? "" : "s"}
                  </p>
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" innerRadius="42%" outerRadius="70%" paddingAngle={3}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: any) => [fmt(Number(value) || 0), ""]} contentStyle={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 12, fontFamily: FONT }} />
                        <Legend formatter={value => <span style={{ fontSize: 12, color: cv.textSecondary }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px', gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: cv.text, margin: '0 0 4px' }}>Profil de dépenses — Radar comparatif</p>
                  <p style={{ fontSize: 12, color: cv.textMuted, margin: '0 0 16px' }}>
                    100 = équivalent à la catégorie du repère la plus élevée. Plus votre profil est proche du bord, plus vous dépensez dans cette catégorie.
                  </p>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke={cv.border} />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: cv.textMuted }} />
                        <Radar name="Repère" dataKey="Repère" stroke={cv.textMuted} fill={cv.barNat} fillOpacity={0.5} />
                        <Radar name="Vous" dataKey="Vous" stroke="#1C6856" fill="#1C6856" fillOpacity={0.3} />
                        <Legend formatter={value => <span style={{ fontSize: 12, color: cv.textSecondary, fontWeight: 500 }}>{value}</span>} />
                        <Tooltip formatter={(value: any, name: any) => [`Score ${Number(value) || 0}/100`, String(name)]} contentStyle={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 12, fontFamily: FONT }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

            {/* DÉTAIL PAR CATÉGORIE */}
            {selectedCategory === "toutes" && (
              <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 20, padding: '20px 24px' }}>
                <SectionTitle cv={cv}>Détail catégorie par catégorie</SectionTitle>
                <div>
                  {Object.keys(national.categories).map(cat => (
                    <ComparisonBar key={cat} label={cat} userVal={userByCategory[cat] ?? 0} nationalVal={national.categories[cat] ?? 0} cv={cv} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                  {[
                    { color: '#1C6856', label: 'Vos dépenses', opacity: 1 },
                    { color: cv.textMuted, label: 'Repère indicatif', opacity: 0.4 },
                    { color: '#C85B56', label: 'Au-dessus du repère', opacity: 0.85 },
                  ].map(({ color, label, opacity }) => (
                    <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: cv.textMuted }}>
                      <span style={{ width: 12, height: 8, borderRadius: 99, background: color, display: 'inline-block', opacity }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER SOURCE */}
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ fontSize: 12, color: cv.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
                📄 Repères fictifs, non issus d'une enquête statistique représentative. Elles ne permettent pas de classer les familles ni de déduire vos droits aux aides.
              </p>
            </div>

          </>
        )}
      </div>
    </div>
  );
}