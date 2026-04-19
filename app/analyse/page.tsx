"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Expense {
  id: string;
  amount: number;
  category: string | null;
  date: string | null;
  child_id: string | null;
  description?: string | null;
}

interface CategoryData {
  name: string;
  value: number;
}

interface MonthlyData {
  month: string;
  total: number;
}

interface ChildData {
  name: string;
  total: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PALETTE = ["#0F172A", "#1E40AF", "#2563EB", "#60A5FA", "#93C5FD", "#BFDBFE"];

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatEur = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const formatEurShort = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        fontSize: 13,
      }}
    >
      {label && <p style={{ fontWeight: 600, marginBottom: 4, color: "#0F172A" }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#1E40AF", margin: 0 }}>
          {formatEur(p.value)}
        </p>
      ))}
    </div>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useDepenses(selectedMonth: string) {
  const [depenses, setDepenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonnees = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("expenses").select("*");

    // Filtre par mois si "all" n'est pas sélectionné
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split("-");
      const startDate = `${year}-${month}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
      query = query.gte("date", startDate).lt("date", endDate);
    }

    const { data, error: supaError } = await query.order("date", { ascending: false });

    if (supaError) {
      setError("Impossible de charger les données. Vérifiez votre connexion.");
      console.error("Erreur Supabase:", supaError);
    } else {
      setDepenses(data || []);
    }

    setLoading(false);
  }, [selectedMonth]);

  useEffect(() => {
    fetchDonnees();
  }, [fetchDonnees]);

  return { depenses, loading, error, refetch: fetchDonnees };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 16,
        border: accent ? "1.5px solid #1E40AF" : "1px solid #E2E8F0",
        background: accent ? "#EFF6FF" : "white",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", color: "#64748B", textTransform: "uppercase", margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent ? "#1E40AF" : "#0F172A", margin: 0, lineHeight: 1.1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, height = 340 }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        padding: "22px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: 0 }}>{title}</p>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        📊
      </div>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>Aucune dépense trouvée</p>
      <p style={{ fontSize: 14, color: "#64748B", margin: 0, maxWidth: 320 }}>
        Il n'y a pas encore de dépenses pour cette période. Commencez par en ajouter une depuis la page principale.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 40 }}>⚠️</div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#0F172A", margin: 0 }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          border: "none",
          background: "#1E40AF",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Réessayer
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalysePage() {
  // Mois courant comme valeur par défaut (format: "YYYY-MM")
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);

  const { depenses, loading, error, refetch } = useDepenses(selectedMonth);

  // ── Dérivations des données ─────────────────────────────────────────────────

  // Agrégation par catégorie, triée par montant décroissant
  const dataCategories: CategoryData[] = Object.values(
    depenses.reduce((acc: Record<string, CategoryData>, d) => {
      const cat = d.category || "Autre";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += d.amount || 0;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  // Agrégation par mois (pour la tendance — toujours sur toutes les données du hook)
  const dataMonthly: MonthlyData[] = Object.values(
    depenses.reduce((acc: Record<string, MonthlyData>, d) => {
      if (!d.date) return acc;
      const date = new Date(d.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = `${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
      if (!acc[key]) acc[key] = { month: label, total: 0 };
      acc[key].total += d.amount || 0;
      return acc;
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month));

  // Agrégation par enfant
  const dataChildren: ChildData[] = Object.values(
    depenses.reduce((acc: Record<string, ChildData>, d) => {
      const key = d.child_id || "Non assigné";
      if (!acc[key]) acc[key] = { name: key, total: 0 };
      acc[key].total += d.amount || 0;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  // KPIs
  const total = depenses.reduce((s, d) => s + (d.amount || 0), 0);
  const moyenne = depenses.length ? total / depenses.length : 0;
  const categorieTop = dataCategories[0]?.name ?? "—";
  const categorieTopMontant = dataCategories[0]?.value ?? 0;

  // Options de filtre mois (12 derniers mois)
  const monthOptions: { value: string; label: string }[] = [{ value: "all", label: "Toutes les périodes" }];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
    monthOptions.push({ value, label });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "32px 24px",
        fontFamily: "'Geist', 'Geist Fallback', system-ui, sans-serif",
        color: "#0F172A",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#94A3B8", textTransform: "uppercase", margin: "0 0 4px" }}>
              Budget familial
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#0F172A" }}>Analyse détaillée</h1>
          </div>

          {/* Filtre période */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>Période :</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "white",
                fontSize: 13,
                color: "#0F172A",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                minWidth: 180,
              }}
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* ── Loading ── */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "48px 0",
              color: "#64748B",
              fontSize: 15,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Chargement de l'analyse…
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0" }}>
            <ErrorState message={error} onRetry={refetch} />
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && depenses.length === 0 && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0" }}>
            <EmptyState />
          </div>
        )}

        {/* ── Data ── */}
        {!loading && !error && depenses.length > 0 && (
          <>
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <StatCard label="Total dépensé" value={formatEur(total)} sub={`${depenses.length} opération${depenses.length > 1 ? "s" : ""}`} accent />
              <StatCard label="Moyenne / opération" value={formatEur(moyenne)} />
              <StatCard label="Catégorie dominante" value={categorieTop} sub={formatEur(categorieTopMontant)} />
              <StatCard label="Nombre d'opérations" value={String(depenses.length)} />
            </div>

            {/* Graphiques principaux */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>

              {/* PieChart */}
              <ChartCard title="Répartition par catégorie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataCategories}
                      innerRadius="45%"
                      outerRadius="70%"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dataCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: "#374151" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* BarChart catégories */}
              <ChartCard title="Montants par catégorie (€)">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataCategories} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatEurShort}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="value" fill="#1E40AF" radius={[6, 6, 0, 0]} maxBarSize={52} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Tendance mensuelle — seulement si on a des données avec dates */}
            {dataMonthly.length > 1 && (
              <ChartCard title="Tendance mensuelle" height={240}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataMonthly} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatEurShort}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#1E40AF"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#1E40AF", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#2563EB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Ventilation par enfant */}
            {dataChildren.length > 1 && (
              <ChartCard title="Dépenses par enfant" height={220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataChildren} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis
                      type="number"
                      tickFormatter={formatEurShort}
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#374151" }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="total" fill="#2563EB" radius={[0, 6, 6, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Tableau détail */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: 0 }}>
                  Dernières opérations
                </p>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["Date", "Catégorie", "Description", "Montant"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
                            textAlign: h === "Montant" ? "right" : "left",
                            fontWeight: 600,
                            color: "#64748B",
                            fontSize: 11,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            borderBottom: "1px solid #E2E8F0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {depenses.slice(0, 20).map((d, i) => (
                      <tr
                        key={d.id || i}
                        style={{
                          borderBottom: i < Math.min(depenses.length, 20) - 1 ? "1px solid #F1F5F9" : "none",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px", color: "#64748B" }}>
                          {d.date
                            ? new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: 99,
                              background: "#EFF6FF",
                              color: "#1E40AF",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {d.category || "Autre"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {d.description || "—"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>
                          {formatEur(d.amount || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {depenses.length > 20 && (
                  <p style={{ textAlign: "center", padding: "12px", fontSize: 12, color: "#94A3B8", margin: 0 }}>
                    {depenses.length - 20} opération{depenses.length - 20 > 1 ? "s" : ""} supplémentaire{depenses.length - 20 > 1 ? "s" : ""} — affinez la période pour voir plus.
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