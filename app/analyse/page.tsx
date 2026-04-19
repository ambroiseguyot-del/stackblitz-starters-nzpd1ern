"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "recharts";

type Depense = {
  id: string;
  amount: number;
  category: string | null;
  created_at: string;
};

const COLORS = ["#001253", "#3E54AC", "#655DBB", "#BFACE2", "#FF1E1E"];

export default function AnalysePage() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periode, setPeriode] = useState<"mois" | "annee" | "all">("mois");

  useEffect(() => {
    async function fetchDonnees() {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, amount, category, created_at");

      if (error) {
        setError("Impossible de charger les données");
      } else {
        setDepenses(data || []);
      }
      setLoading(false);
    }

    fetchDonnees();
  }, []);

  // 🔎 Filtre période
  const depensesFiltrees = useMemo(() => {
    const now = new Date();

    return depenses.filter((d) => {
      const date = new Date(d.created_at);

      if (periode === "mois") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      if (periode === "annee") {
        return date.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [depenses, periode]);

  // ⚡ Agrégation performante
  const dataCategories = useMemo(() => {
    const map: Record<string, number> = {};

    depensesFiltrees.forEach((d) => {
      const cat = d.category || "Autre";
      map[cat] = (map[cat] || 0) + d.amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [depensesFiltrees]);

  const total = useMemo(
    () => depensesFiltrees.reduce((sum, d) => sum + d.amount, 0),
    [depensesFiltrees]
  );

  // 💡 Insights
  const topCategorie = dataCategories[0];
  const topPourcentage = topCategorie
    ? ((topCategorie.value / total) * 100).toFixed(1)
    : 0;

  if (loading)
    return (
      <div className="p-10 text-center">Chargement de l'analyse...</div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500">{error}</div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-white min-h-screen">
      <header className="border-b pb-4 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Analyse Détaillée
        </h1>

        {/* 🔘 Filtres */}
        <div className="flex gap-2">
          {["mois", "annee", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p as any)}
              className={`px-4 py-2 rounded-xl border text-sm ${
                periode === p
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100"
              }`}
            >
              {p === "mois"
                ? "Ce mois"
                : p === "annee"
                ? "Cette année"
                : "Tout"}
            </button>
          ))}
        </div>
      </header>

      {/* 📊 Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 rounded-2xl border">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Total Dépensé
          </p>
          <p className="text-4xl font-black text-blue-900">
            {total.toFixed(2)} €
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Nombre d'opérations
          </p>
          <p className="text-4xl font-black text-gray-800">
            {depensesFiltrees.length}
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Top catégorie
          </p>
          <p className="text-xl font-bold text-gray-900">
            {topCategorie?.name || "-"}
          </p>
          <p className="text-sm text-gray-500">
            {topPourcentage}% du total
          </p>
        </div>
      </div>

      {/* 📈 Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camembert */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4">
            Répartition par catégorie
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataCategories}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {dataCategories.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Barres */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4">
            Montants par catégorie (€)
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCategories}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: "#F3F4F6" }} />
              <Bar
                dataKey="value"
                fill="#001253"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}