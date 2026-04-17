"use client";

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell 
} from 'recharts';

// 1. Données fictives pour l'exemple
const DATA_MOCK = [
  { id: 1, enfant: 'Léa', categorie: 'Santé', montant: 45, date: '2024-03-10' },
  { id: 2, enfant: 'Lucas', categorie: 'École', montant: 120, date: '2024-03-12' },
  { id: 3, enfant: 'Léa', categorie: 'Loisirs', montant: 30, date: '2024-03-15' },
  { id: 4, enfant: 'Lucas', categorie: 'Santé', montant: 15, date: '2024-03-20' },
  { id: 5, enfant: 'Léa', categorie: 'École', montant: 200, date: '2024-03-22' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalysePage() {
  // États pour les filtres
  const [enfantFiltre, setEnfantFiltre] = useState('Tous');
  const [catFiltre, setCatFiltre] = useState('Toutes');

  // 2. Logique de filtrage
  const depensesFiltrees = DATA_MOCK.filter(d => {
    const matchEnfant = enfantFiltre === 'Tous' || d.enfant === enfantFiltre;
    const matchCat = catFiltre === 'Toutes' || d.categorie === catFiltre;
    return matchEnfant && matchCat;
  });

  // 3. Transformation des données pour le graphique par catégorie
  const statsParCategorie = depensesFiltrees.reduce((acc: any[], current) => {
    const existing = acc.find(item => item.name === current.categorie);
    if (existing) {
      existing.value += current.montant;
    } else {
      acc.push({ name: current.categorie, value: current.montant });
    }
    return acc;
  }, []);

  // 4. Calcul du total
  const totalGlobal = depensesFiltrees.reduce((sum, d) => sum + d.montant, 0);

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analyse Financière</h1>
        <p className="text-gray-500">Visualisez les dépenses de la famille</p>
      </div>

      {/* --- CARTES DE RÉSUMÉ --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 uppercase font-semibold">Total filtré</p>
          <p className="text-2xl font-bold text-gray-900">{totalGlobal} €</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500 uppercase font-semibold">Nb de dépenses</p>
          <p className="text-2xl font-bold text-gray-900">{depensesFiltrees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 uppercase font-semibold">Période</p>
          <p className="text-2xl font-bold text-gray-900">Mars 2024</p>
        </div>
      </div>

      {/* --- BARRE DE FILTRES --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enfant</label>
          <select 
            className="border rounded-md p-2 bg-gray-50"
            value={enfantFiltre}
            onChange={(e) => setEnfantFiltre(e.target.value)}
          >
            <option value="Tous">Tous les enfants</option>
            <option value="Léa">Léa</option>
            <option value="Lucas">Lucas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select 
            className="border rounded-md p-2 bg-gray-50"
            value={catFiltre}
            onChange={(e) => setCatFiltre(e.target.value)}
          >
            <option value="Toutes">Toutes catégories</option>
            <option value="Santé">Santé</option>
            <option value="École">École</option>
            <option value="Loisirs">Loisirs</option>
          </select>
        </div>
      </div>

      {/* --- GRAPHIQUES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graphique de répartition (Pie) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Répartition par catégorie</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsParCategorie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {statsParCategorie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique de comparaison (Barres) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Détail des montants (€)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsParCategorie}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}