"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Chemin pour remonter à la racine
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#001253', '#3E54AC', '#655DBB', '#BFACE2', '#FF1E1E'];

export default function AnalysePage() {
  const [depenses, setDepenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonnees() {
      // On récupère les dépenses de la table 'expenses'
      const { data, error } = await supabase
        .from('expenses') 
        .select('*');

      if (error) {
        console.error("Erreur Supabase:", error);
      } else {
        setDepenses(data || []);
      }
      setLoading(false);
    }
    fetchDonnees();
  }, []);

  // Transformation des données pour le graphique par catégorie
  const dataCategories = depenses.reduce((acc: any[], current) => {
    const cat = current.category || 'Autre';
    const existing = acc.find(item => item.name === cat);
    if (existing) {
      existing.value += current.amount;
    } else {
      acc.push({ name: cat, value: current.amount });
    }
    return acc;
  }, []);

  const total = depenses.reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) return <div className="p-10 text-center">Chargement de l'analyse...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-white min-h-screen">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Analyse Détaillée</h1>
        <p className="text-gray-500">Répartition de votre budget familial</p>
      </header>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-2xl border">
          <p className="text-sm text-gray-500 uppercase font-bold">Total Dépensé</p>
          <p className="text-4xl font-black text-blue-900">{total.toFixed(2)} €</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl border">
          <p className="text-sm text-gray-500 uppercase font-bold">Nombre d'opérations</p>
          <p className="text-4xl font-black text-gray-800">{depenses.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique 1 : Camembert */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4">Répartition par catégorie</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataCategories}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dataCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique 2 : Barres */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4">Montants par poste (€)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCategories}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: '#F3F4F6'}} />
              <Bar dataKey="value" fill="#001253" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}