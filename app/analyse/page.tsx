"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Expense {
  id: string;
  amount: number;
  category: string | null;
  label: string | null;
  date: string | null;
  child_name: string | null;
}

interface Profile {
  id: string;
  name: string;
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const PALETTE = ["#6366F1","#0070F3","#10B981","#F59E0B","#EF4444","#8B5CF6"];
const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";

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

// ─── FORMATTERS ───────────────────────────────────────────────────────────────

const formatEur = (v: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v);
const formatEurShort = (v: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

// ─── HOOK DONNÉES ─────────────────────────────────────────────────────────────

function useAnalyse(selectedMonth: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;

      // Fetch expenses avec filtre user_id
      let query = supabase.from("expenses").select("*").order("date", { ascending: false });
      if (uid) query = query.eq("user_id", uid);
      if (selectedMonth !== "all") {
        const [year, month] = selectedMonth.split("-");
        const startDate = `${year}-${month}-01`;
        const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
        const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
        const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
        query = query.gte("date", startDate).lt("date", endDate);
      }
      const { data: expData, error: expErr } = await query;
      if (expErr) throw expErr;
      setExpenses(expData || []);

      // Fetch profiles pour les prénoms
      let pQuery = supabase.from("profiles").select("id, name");
      if (uid) pQuery = pQuery.eq("user_id", uid);
      const { data: profData } = await pQuery;
      setProfiles(profData || []);

    } catch (e: any) {
      setError("Impossible de charger les données. Vérifiez votre connexion.");
      console.error("Erreur Supabase:", e);
    }
    setLoading(false);
  }, [selectedMonth]);

  useEffect(() => {
    fetch();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetch());
    return () => subscription.unsubscribe();
  }, [fetch]);

  return { expenses, profiles, loading, error, refetch: fetch };
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ h, bg }: { h: number; bg: string }) {
  return <div style={{ height: h, borderRadius: 16, background: bg, animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

function PageSkeleton({ bg }: { bg: string }) {
  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[1,2,3,4].map(i => <SkeletonBlock key={i} h={96} bg={bg} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          <SkeletonBlock h={320} bg={bg} />
          <SkeletonBlock h={320} bg={bg} />
        </div>
        <SkeletonBlock h={220} bg={bg} />
        <SkeletonBlock h={280} bg={bg} />
      </div>
    </>
  );
}

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent, cv }: {
  label: string; value: string; sub?: string; accent?: boolean; cv: any;
}) {
  return (
    <div style={{
      padding: '20px 24px', borderRadius: 16,
      border: `1.5px solid ${accent ? cv.accentBorder : cv.border}`,
      background: accent ? cv.accentBg : cv.card,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', color: cv.textMuted, textTransform: 'uppercase', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: accent ? cv.accent : cv.text, margin: 0, lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: cv.textMuted, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, height = 320, cv }: {
  title: string; children: React.ReactNode; height?: number; cv: any;
}) {
  return (
    <div style={{ background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: cv.text, margin: 0 }}>{title}</p>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, cv }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      {label && <p style={{ fontWeight: 600, marginBottom: 4, color: cv.text }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || cv.accent, margin: 0, fontWeight: 500 }}>{formatEur(p.value)}</p>
      ))}
    </div>
  );
}

function MonthNav({ selectedDate, onPrev, onNext, isCurrentMonth, cv }: {
  selectedDate: { year: number; month: number };
  onPrev: () => void; onNext: () => void;
  isCurrentMonth: boolean; cv: any;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: cv.card, border: `1px solid ${cv.border}`, borderRadius: 14, padding: '8px 12px' }}>
      <button onClick={onPrev} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'none', cursor: 'pointer', color: cv.textMuted, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>❮</button>
      <div style={{ textAlign: 'center', minWidth: 140 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: cv.text, margin: 0, textTransform: 'capitalize' }}>
          {MONTHS_FR[selectedDate.month]} {selectedDate.year}
        </p>
        {isCurrentMonth && <p style={{ fontSize: 11, color: '#6366F1', fontWeight: 600, margin: 0 }}>Mois en cours</p>}
      </div>
      <button onClick={onNext} disabled={isCurrentMonth} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'none', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: cv.textMuted, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isCurrentMonth ? 0.3 : 1, fontFamily: FONT }}>❯</button>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function AnalysePage() {
  const isDark = useGlobalDark();

  // Palette couleurs dark/light
  const cv = useMemo(() => ({
    bg:          isDark ? '#0B0E14' : '#F8FAFC',
    card:        isDark ? '#161B26' : '#FFFFFF',
    border:      isDark ? '#2D364D' : '#E2E8F0',
    borderFaint: isDark ? '#1E293B' : '#F1F5F9',
    text:        isDark ? '#F1F5F9' : '#0F172A',
    textMuted:   isDark ? '#94A3B8' : '#64748B',
    textSub:     isDark ? '#CBD5E1' : '#374151',
    accentBg:    isDark ? '#1E2D4A' : '#EFF6FF',
    accentBorder:isDark ? '#1D4ED8' : '#BFDBFE',
    accent:      isDark ? '#60A5FA' : '#1E40AF',
    skColor:     isDark ? '#1E293B' : '#E2E8F0',
    rowHover:    isDark ? '#1E293B' : '#F8FAFC',
    tagBg:       isDark ? '#1E2D4A' : '#EFF6FF',
    tagColor:    isDark ? '#60A5FA' : '#1E40AF',
    tableHead:   isDark ? '#111827' : '#F8FAFC',
  }), [isDark]);

  // Navigation par mois (cohérent avec comparaison)
  const now = new Date();
  const [selDate, setSelDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const isCurrentMonth = selDate.year === now.getFullYear() && selDate.month === now.getMonth();
  const goPrev = () => setSelDate(d => d.month === 0 ? { year: d.year - 1, month: 11 } : { ...d, month: d.month - 1 });
  const goNext = () => setSelDate(d => d.month === 11 ? { year: d.year + 1, month: 0 } : { ...d, month: d.month + 1 });

  // "all" ou "YYYY-MM"
  const [showAll, setShowAll] = useState(false);
  const selectedMonth = showAll ? "all" : `${selDate.year}-${String(selDate.month + 1).padStart(2, "0")}`;

  const { expenses, profiles, loading, error, refetch } = useAnalyse(selectedMonth);

  // Map id → prénom
  const profileMap = useMemo(() =>
    profiles.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {} as Record<string, string>),
    [profiles]
  );

  // Dérivations
  const dataCategories = useMemo(() =>
    Object.values(expenses.reduce((acc: Record<string, { name: string; value: number }>, d) => {
      const cat = d.category || "Autre";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += d.amount || 0;
      return acc;
    }, {})).sort((a, b) => b.value - a.value),
    [expenses]
  );

  const dataMonthly = useMemo(() =>
    Object.entries(expenses.reduce((acc: Record<string, { month: string; total: number; key: string }>, d) => {
      if (!d.date) return acc;
      const dt = new Date(d.date);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const label = `${MONTHS_FR[dt.getMonth()]} ${dt.getFullYear()}`;
      if (!acc[key]) acc[key] = { month: label, total: 0, key };
      acc[key].total += d.amount || 0;
      return acc;
    }, {}))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v),
    [expenses]
  );

  const dataChildren = useMemo(() =>
    Object.values(expenses.reduce((acc: Record<string, { name: string; total: number }>, d) => {
      const name = d.child_name || (d.child_name && profileMap[d.child_name]) || "Non assigné";
      if (!acc[name]) acc[name] = { name, total: 0 };
      acc[name].total += d.amount || 0;
      return acc;
    }, {})).sort((a, b) => b.total - a.total),
    [expenses, profileMap]
  );

  const total = useMemo(() => expenses.reduce((s, d) => s + (d.amount || 0), 0), [expenses]);
  const moyenne = expenses.length ? total / expenses.length : 0;
  const categorieTop = dataCategories[0]?.name ?? "—";
  const categorieTopMontant = dataCategories[0]?.value ?? 0;

  const tooltipProps = { cv };

  return (
    <div style={{ minHeight: '100vh', background: cv.bg, padding: '32px 24px', fontFamily: FONT, color: cv.text, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── HEADER ── */}
        <header style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: cv.textMuted, textTransform: 'uppercase', margin: '0 0 4px' }}>Budget familial</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: cv.text, letterSpacing: '-0.5px' }}>Analyse détaillée</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${showAll ? '#6366F1' : cv.border}`,
                background: showAll ? '#6366F1' : cv.card, color: showAll ? 'white' : cv.textMuted,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s',
              }}
            >
              {showAll ? '✓ Toutes les périodes' : 'Toutes les périodes'}
            </button>
            {!showAll && (
              <MonthNav selectedDate={selDate} onPrev={goPrev} onNext={goNext} isCurrentMonth={isCurrentMonth} cv={cv} />
            )}
          </div>
        </header>

        {/* ── SKELETON ── */}
        {loading && <PageSkeleton bg={cv.skColor} />}

        {/* ── ERREUR ── */}
        {!loading && error && (
          <div style={{ background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`, padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 40 }}>⚠️</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: cv.text, margin: 0 }}>{error}</p>
            <button onClick={refetch} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6366F1', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Réessayer</button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && expenses.length === 0 && (
          <div style={{ background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`, padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: cv.skColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📊</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: cv.text, margin: 0 }}>Aucune dépense trouvée</p>
            <p style={{ fontSize: 14, color: cv.textMuted, margin: 0, maxWidth: 320 }}>
              Aucune dépense pour cette période. Naviguez vers un autre mois ou ajoutez des dépenses depuis le dashboard.
            </p>
          </div>
        )}

        {/* ── DONNÉES ── */}
        {!loading && !error && expenses.length > 0 && (
          <>
            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
              <StatCard label="Total dépensé" value={formatEur(total)} sub={`${expenses.length} opération${expenses.length > 1 ? "s" : ""}`} accent cv={cv} />
              <StatCard label="Moyenne / opération" value={formatEur(moyenne)} cv={cv} />
              <StatCard label="Catégorie principale" value={categorieTop} sub={formatEur(categorieTopMontant)} cv={cv} />
              <StatCard label="Nb d'opérations" value={String(expenses.length)} cv={cv} />
            </div>

            {/* Graphiques principaux */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

              <ChartCard title="Répartition par catégorie" cv={cv}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataCategories} innerRadius="42%" outerRadius="68%" paddingAngle={4} dataKey="value">
                      {dataCategories.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={(props: any) => <CustomTooltip {...props} {...tooltipProps} />} />
                    <Legend formatter={v => <span style={{ fontSize: 12, color: cv.textSub }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Montants par catégorie" cv={cv}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataCategories} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={cv.borderFaint} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: cv.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatEurShort} tick={{ fontSize: 10, fill: cv.textMuted }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={(props: any) => <CustomTooltip {...props} {...tooltipProps} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="value" fill="#6366F1" radius={[6,6,0,0]} maxBarSize={52} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Tendance mensuelle */}
            {dataMonthly.length > 1 && (
              <ChartCard title="Tendance mensuelle" height={220} cv={cv}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataMonthly} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={cv.borderFaint} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: cv.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatEurShort} tick={{ fontSize: 11, fill: cv.textMuted }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={(props: any) => <CustomTooltip {...props} {...tooltipProps} />} />
                    <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2.5}
                      dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#818CF8" }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Dépenses par enfant */}
            {dataChildren.length > 1 && (
              <ChartCard title="Dépenses par enfant" height={200} cv={cv}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataChildren} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={cv.borderFaint} />
                    <XAxis type="number" tickFormatter={formatEurShort} tick={{ fontSize: 11, fill: cv.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: cv.textSub }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={(props: any) => <CustomTooltip {...props} {...tooltipProps} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="total" fill="#0070F3" radius={[0,6,6,0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Tableau détail */}
            <div style={{ background: cv.card, borderRadius: 16, border: `1px solid ${cv.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${cv.borderFaint}` }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: cv.text, margin: 0 }}>Dernières opérations</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: cv.tableHead }}>
                      {['Date','Catégorie','Libellé','Montant'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px',
                          textAlign: h === 'Montant' ? 'right' : 'left',
                          fontWeight: 600, color: cv.textMuted,
                          fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase',
                          borderBottom: `1px solid ${cv.border}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.slice(0, 20).map((d, i) => (
                      <tr key={d.id || i}
                        style={{ borderBottom: i < Math.min(expenses.length, 20) - 1 ? `1px solid ${cv.borderFaint}` : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = cv.rowHover)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px', color: cv.textMuted, whiteSpace: 'nowrap' }}>
                          {d.date
                            ? new Date(d.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, background: cv.tagBg, color: cv.tagColor, fontSize: 11, fontWeight: 600 }}>
                            {d.category || 'Autre'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: cv.textSub, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {d.label || '—'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: cv.text, fontVariantNumeric: 'tabular-nums' }}>
                          {formatEur(d.amount || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {expenses.length > 20 && (
                  <p style={{ textAlign: 'center', padding: '12px', fontSize: 12, color: cv.textMuted, margin: 0 }}>
                    {expenses.length - 20} opération{expenses.length - 20 > 1 ? "s" : ""} supplémentaire{expenses.length - 20 > 1 ? "s" : ""} — affinez la période pour voir plus.
                  </p>
                )}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}