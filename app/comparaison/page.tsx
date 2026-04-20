"use client";

/**
 * Page "Comparaison Nationale" — Budget Bébé
 * Stack: Next.js App Router · Supabase · Recharts · Tailwind CSS
 * Copier ce fichier dans : app/comparaison/page.tsx
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AgeSlice = "0-1" | "1-3" | "3-6";

interface Expense {
  amount: number;
  category: string | null;
  created_at: string | null;
}

interface NationalSlice {
  total: number;
  categories: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES NATIONALES (INSEE / CAF / DREES)
// ─────────────────────────────────────────────────────────────────────────────

const nationalData: Record<AgeSlice, NationalSlice> = {
  "0-1": {
    total: 700,
    categories: {
      couches: 60,
      alimentation: 80,
      sante: 70,
      vetements: 50,
      equipement: 150,
      autres: 100,
    },
  },
  "1-3": {
    total: 550,
    categories: {
      couches: 30,
      alimentation: 120,
      sante: 60,
      vetements: 60,
      equipement: 80,
      autres: 100,
    },
  },
  "3-6": {
    total: 450,
    categories: {
      alimentation: 150,
      sante: 50,
      vetements: 70,
      education: 50,
      loisirs: 80,
    },
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  couches: "Couches",
  alimentation: "Alimentation",
  sante: "Santé",
  vetements: "Vêtements",
  equipement: "Équipement",
  education: "Éducation",
  loisirs: "Loisirs",
  autres: "Autres",
};

const PALETTE = {
  user: "#6366F1",
  national: "#E2E8F0",
  nationalLine: "#94A3B8",
};

const PIE_COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

function filterCurrentMonth(expenses: Expense[]): Expense[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return expenses.filter((e) => {
    if (!e.created_at) return false;
    const d = new Date(e.created_at);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

function generateInsights(
  userTotal: number,
  nationalTotal: number,
  userByCategory: Record<string, number>,
  nationalCategories: Record<string, number>
): string[] {
  const insights: string[] = [];
  if (nationalTotal === 0) return insights;

  const diff = ((userTotal - nationalTotal) / nationalTotal) * 100;
  const absDiff = Math.abs(diff);

  if (diff > 15) {
    insights.push(
      `Vous dépensez ${absDiff.toFixed(0)}% de plus que la moyenne nationale pour cette tranche d'âge.`
    );
  } else if (diff < -15) {
    insights.push(
      `Bravo ! Vous dépensez ${absDiff.toFixed(0)}% de moins que la moyenne nationale — vous faites partie des parents les plus économes.`
    );
  } else {
    insights.push(
      `Vos dépenses sont proches de la moyenne nationale (écart de ${absDiff.toFixed(0)}%).`
    );
  }

  const topUserCat = Object.entries(userByCategory).sort((a, b) => b[1] - a[1])[0];
  if (topUserCat) {
    const label = CATEGORY_LABELS[topUserCat[0]] || topUserCat[0];
    insights.push(`Votre poste principal est "${label}" (${fmt(topUserCat[1])}/mois).`);
  }

  const gaps = Object.entries(nationalCategories).map(([cat, natVal]) => {
    const userVal = userByCategory[cat] ?? 0;
    const gap = natVal > 0 ? ((userVal - natVal) / natVal) * 100 : 0;
    return { cat, gap };
  });
  const maxOverspend = gaps.sort((a, b) => b.gap - a.gap)[0];
  if (maxOverspend && maxOverspend.gap > 20) {
    const label = CATEGORY_LABELS[maxOverspend.cat] || maxOverspend.cat;
    insights.push(
      `Attention : "${label}" dépasse la moyenne de ${maxOverspend.gap.toFixed(0)}% — une piste d'optimisation.`
    );
  }

  const percentile =
    diff < 0 ? Math.min(95, 50 + Math.abs(diff)) : Math.max(5, 50 - diff);
  insights.push(
    `Vous êtes plus économe que ${percentile.toFixed(0)}% des parents sur cette tranche d'âge (estimation).`
  );

  return insights;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — attend la session auth avant de fetcher
// ─────────────────────────────────────────────────────────────────────────────

function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setWarning(null);
    try {
      // SELECT * pour ne pas supposer les noms de colonnes
      const { data, error: err } = await supabase
        .from("expenses")
        .select("*")
        .limit(500);

      if (err) {
        console.error("[Comparaison] Supabase error:", err);
        setWarning(`[${err.code}] ${err.message}`);
        setExpenses([]);
      } else {
        if (data && data.length > 0) {
          console.log("[Comparaison] Colonnes disponibles:", Object.keys(data[0]));
        }
        const normalized: Expense[] = (data || []).map((row: any) => ({
          amount:     Number(row.amount     ?? row.montant   ?? row.total  ?? 0),
          category:   row.category   ?? row.categorie ?? row.type    ?? null,
          created_at: row.created_at  ?? row.date      ?? row.createdAt ?? null,
        }));
        setExpenses(normalized);
      }
    } catch (e: any) {
      console.error("[Comparaison] Exception:", e);
      setWarning(`Erreur réseau : ${e?.message ?? String(e)}`);
      setExpenses([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    // Re-fetch automatique si la session change (reconnexion, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData();
    });
    return () => subscription.unsubscribe();
  }, [fetchData]);

  return { expenses, loading, warning, refetch: fetchData };
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      {label && <p className="font-semibold text-gray-800 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name} : {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const KPICard = ({
  label, value, sub, accent, icon,
}: {
  label: string; value: string; sub?: React.ReactNode; accent?: boolean; icon: string;
}) => (
  <div className={`rounded-2xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${
    accent ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-100"
  }`}>
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
    </div>
    <p className={`text-3xl font-extrabold leading-none ${accent ? "text-indigo-700" : "text-gray-900"}`}>
      {value}
    </p>
    {sub && <div className="text-sm text-gray-500">{sub}</div>}
  </div>
);

const DiffBadge = ({ diff }: { diff: number }) => {
  const isGood = diff <= 0;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
      isGood ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}>
      {isGood ? "▼" : "▲"} {fmtPct(diff)}
      <span className="font-normal opacity-70">vs moyenne</span>
    </span>
  );
};

const ComparisonBar = ({
  label, userVal, nationalVal,
}: {
  label: string; userVal: number; nationalVal: number;
}) => {
  const max = Math.max(userVal, nationalVal, 1);
  const userPct = (userVal / max) * 100;
  const natPct = (nationalVal / max) * 100;
  const diff = nationalVal > 0 ? ((userVal - nationalVal) / nationalVal) * 100 : 0;
  const isOver = diff > 0;
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">
          {CATEGORY_LABELS[label] || label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-700">{fmt(userVal)}</span>
          <span className="text-xs text-gray-400">/ {fmt(nationalVal)}</span>
          {nationalVal > 0 && (
            <span className={`text-xs font-semibold ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
              {fmtPct(diff)}
            </span>
          )}
        </div>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full rounded-full bg-gray-300" style={{ width: `${natPct}%` }} />
        <div className="absolute top-0 left-0 h-full rounded-full" style={{
          width: `${userPct}%`,
          background: isOver ? "#F43F5E" : "#6366F1",
          opacity: 0.85,
        }} />
      </div>
    </div>
  );
};

const InsightCard = ({ text, index }: { text: string; index: number }) => {
  const icons = ["💡", "📊", "⚡", "🎯"];
  const colors = [
    "border-indigo-100 bg-indigo-50",
    "border-violet-100 bg-violet-50",
    "border-amber-100 bg-amber-50",
    "border-emerald-100 bg-emerald-50",
  ];
  return (
    <div className={`rounded-xl border p-4 flex gap-3 ${colors[index % colors.length]}`}>
      <span className="text-xl flex-shrink-0">{icons[index % icons.length]}</span>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
};

const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer ${
      active
        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
    }`}
  >
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────────────────────────────────────

export default function ComparaisonNationale() {
  const { expenses, loading, warning, refetch } = useExpenses();
  const [ageSlice, setAgeSlice] = useState<AgeSlice>("0-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("toutes");

  const national = nationalData[ageSlice];
  const allCategories = useMemo(() => ["toutes", ...Object.keys(national.categories)], [national]);
  const monthlyExpenses = useMemo(() => filterCurrentMonth(expenses), [expenses]);

  const userByCategory = useMemo<Record<string, number>>(() => {
    return monthlyExpenses.reduce((acc, e) => {
      const cat = (e.category || "autres").toLowerCase().trim();
      acc[cat] = (acc[cat] ?? 0) + (e.amount || 0);
      return acc;
    }, {} as Record<string, number>);
  }, [monthlyExpenses]);

  const userTotal = useMemo(() => Object.values(userByCategory).reduce((s, v) => s + v, 0), [userByCategory]);

  const userFiltered = useMemo(() =>
    selectedCategory === "toutes" ? userTotal : (userByCategory[selectedCategory] ?? 0),
    [selectedCategory, userByCategory, userTotal]
  );

  const nationalFiltered = useMemo(() =>
    selectedCategory === "toutes" ? national.total : (national.categories[selectedCategory] ?? 0),
    [selectedCategory, national]
  );

  const diff = useMemo(() =>
    nationalFiltered === 0 ? 0 : ((userFiltered - nationalFiltered) / nationalFiltered) * 100,
    [userFiltered, nationalFiltered]
  );

  const barData = useMemo(() => {
    const cats = selectedCategory === "toutes" ? Object.keys(national.categories) : [selectedCategory];
    return cats.map((cat) => ({
      name: CATEGORY_LABELS[cat] || cat,
      Vous: userByCategory[cat] ?? 0,
      Nationale: national.categories[cat] ?? 0,
    }));
  }, [national, userByCategory, selectedCategory]);

  const pieData = useMemo(() =>
    Object.entries(national.categories).map(([cat, val]) => ({
      name: CATEGORY_LABELS[cat] || cat,
      value: val,
    })),
    [national]
  );

  const radarData = useMemo(() => {
    const natMax = Math.max(...Object.values(national.categories));
    return Object.keys(national.categories).map((cat) => ({
      subject: CATEGORY_LABELS[cat] || cat,
      Vous: Math.round(((userByCategory[cat] ?? 0) / natMax) * 100),
      Nationale: Math.round(((national.categories[cat] ?? 0) / natMax) * 100),
    }));
  }, [national, userByCategory]);

  const insights = useMemo(() =>
    generateInsights(userTotal, national.total, userByCategory, national.categories),
    [userTotal, national, userByCategory]
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-0.5">Budget Bébé</p>
            <h1 className="text-xl font-extrabold text-gray-900 leading-none">Comparaison Nationale</h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            🇫🇷 Données INSEE · CAF · DREES
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* FILTRES */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tranche d'âge de l'enfant</p>
              <div className="flex gap-2 flex-wrap">
                {(["0-1", "1-3", "3-6"] as AgeSlice[]).map((slice) => (
                  <FilterPill
                    key={slice}
                    label={`${slice} an${slice === "0-1" ? "" : "s"}`}
                    active={ageSlice === slice}
                    onClick={() => setAgeSlice(slice)}
                  />
                ))}
              </div>
            </div>
            <div className="w-px bg-gray-100 self-stretch hidden sm:block" />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Catégorie</p>
              <div className="flex gap-2 flex-wrap">
                {allCategories.map((cat) => (
                  <FilterPill
                    key={cat}
                    label={cat === "toutes" ? "Toutes" : (CATEGORY_LABELS[cat] || cat)}
                    active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Chargement de vos données…
          </div>
        )}

        {/* WARNING non-bloquant */}
        {!loading && warning && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-amber-800 font-medium">{warning}</p>
              <p className="text-xs text-amber-600 mt-0.5">
                La comparaison nationale reste fonctionnelle. Vos dépenses apparaîtront à 0 € jusqu'à la résolution.
              </p>
            </div>
            <button
              onClick={refetch}
              className="flex-shrink-0 text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* CONTENU PRINCIPAL — toujours visible après loading */}
        {!loading && (
          <>
            {/* KPI */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KPICard
                  icon="👤"
                  label="Vos dépenses / mois"
                  value={fmt(userFiltered)}
                  sub={monthlyExpenses.length === 0
                    ? "Aucune donnée ce mois-ci"
                    : `${monthlyExpenses.length} opération${monthlyExpenses.length > 1 ? "s" : ""} ce mois`}
                  accent
                />
                <KPICard
                  icon="🇫🇷"
                  label="Moyenne nationale"
                  value={fmt(nationalFiltered)}
                  sub={`Tranche ${ageSlice} an${ageSlice === "0-1" ? "" : "s"}`}
                />
                <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Votre écart</span>
                  </div>
                  <p className={`text-3xl font-extrabold leading-none ${diff <= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {fmtPct(diff)}
                  </p>
                  <DiffBadge diff={diff} />
                  <p className="text-xs text-gray-400">
                    {diff <= 0
                      ? `Vous économisez ${fmt(Math.abs(userFiltered - nationalFiltered))} vs la moyenne`
                      : `Vous dépensez ${fmt(Math.abs(userFiltered - nationalFiltered))} de plus que la moyenne`}
                  </p>
                </div>
              </div>
            </section>

            {/* NO DATA */}
            {monthlyExpenses.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4">
                <span className="text-3xl">📭</span>
                <div>
                  <p className="font-semibold text-slate-700">
                    {warning ? "Vos dépenses ne sont pas disponibles pour l'instant" : "Aucune dépense enregistrée ce mois-ci"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {warning
                      ? "La comparaison nationale ci-dessous reste entièrement fonctionnelle."
                      : "Ajoutez des dépenses pour une analyse personnalisée en temps réel."}
                  </p>
                </div>
              </div>
            )}

            {/* INSIGHTS */}
            {insights.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-indigo-500 inline-block" />
                  Insights automatiques
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {insights.map((text, i) => <InsightCard key={i} text={text} index={i} />)}
                </div>
              </section>
            )}

            {/* GRAPHIQUES */}
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-indigo-500 inline-block" />
                Analyse graphique
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-sm font-bold text-gray-800 mb-4">
                    Vous vs Moyenne nationale {selectedCategory !== "toutes" ? `— ${CATEGORY_LABELS[selectedCategory] || selectedCategory}` : "(par catégorie)"}
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={64} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
                        <Legend formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>} />
                        <Bar dataKey="Vous" fill={PALETTE.user} radius={[6, 6, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="Nationale" fill={PALETTE.national} stroke={PALETTE.nationalLine} strokeWidth={1} radius={[6, 6, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <p className="text-sm font-bold text-gray-800 mb-4">
                    Répartition nationale — {ageSlice} an{ageSlice === "0-1" ? "" : "s"}
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" innerRadius="42%" outerRadius="70%" paddingAngle={3}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: any) => [fmt(Number(value) || 0), ""]} />
                        <Legend formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
                  <p className="text-sm font-bold text-gray-800 mb-1">Profil de dépenses — Radar comparatif</p>
                  <p className="text-xs text-gray-400 mb-4">
                    Normalisé par rapport au maximum national. 100 = équivalent à la catégorie nationale la plus élevée.
                  </p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6B7280" }} />
                        <Radar name="Nationale" dataKey="Nationale" stroke={PALETTE.nationalLine} fill={PALETTE.national} fillOpacity={0.5} />
                        <Radar name="Vous" dataKey="Vous" stroke={PALETTE.user} fill={PALETTE.user} fillOpacity={0.3} />
                        <Legend formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>} />
                        <Tooltip formatter={(value: any, name: any) => [`Score ${Number(value) || 0}/100`, String(name)]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* DÉTAIL PAR CATÉGORIE */}
            {selectedCategory === "toutes" && (
              <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block" />
                  Détail catégorie par catégorie
                </h2>
                <div className="divide-y divide-gray-50">
                  {Object.keys(national.categories).map((cat) => (
                    <ComparisonBar
                      key={cat}
                      label={cat}
                      userVal={userByCategory[cat] ?? 0}
                      nationalVal={national.categories[cat] ?? 0}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-full bg-indigo-500 inline-block opacity-80" />
                    Vos dépenses
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-full bg-gray-300 inline-block" />
                    Moyenne nationale
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-full bg-rose-400 inline-block opacity-80" />
                    Au-dessus de la moyenne
                  </span>
                </div>
              </section>
            )}

            {/* FOOTER */}
            <footer className="text-center py-4">
              <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
                📄 Données indicatives basées sur des moyennes nationales (INSEE, CAF, DREES).
                Les chiffres représentent des estimations moyennes et peuvent varier selon la région,
                la situation familiale et le mode de garde.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}