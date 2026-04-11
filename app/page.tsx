'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
// On importe les outils de graphique
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// On enregistre les composants du graphique
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BabyBudgetPage() {
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: true });
    if (!error) setExpenses(data || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- CONFIGURATION DU GRAPHIQUE ---
  const chartData = {
    labels: expenses.map(e => new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Dépenses (€)',
        data: expenses.map(e => e.amount),
        fill: true,
        borderColor: '#0055A4',
        backgroundColor: 'rgba(0, 85, 164, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Calculs Stats
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // CORRECTION : Ajout du type React.FormEvent pour "e"
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupération sécurisée des éléments
    const labelInput = document.getElementById('inp-name') as HTMLInputElement;
    const amountInput = document.getElementById('inp-amount') as HTMLInputElement;
    const childInput = document.getElementById('inp-child') as HTMLSelectElement;
    const dateInput = document.getElementById('inp-date') as HTMLInputElement;

    if (labelInput && amountInput && childInput && dateInput) {
      const { error } = await supabase.from('expenses').insert([{ 
        child_name: childInput.value, 
        label: labelInput.value, 
        amount: parseFloat(amountInput.value), 
        date: dateInput.value 
      }]);

      if (!error) {
        (e.target as HTMLFormElement).reset();
        fetchExpenses();
      } else {
        alert("Erreur Supabase : " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      <header className="h-[80px] bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-[1000] backdrop-blur-md">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <a href="#" className="logo font-bold text-[26px]">Baby<span className="text-[var(--france-red)]">Budget</span> 🇫🇷</a>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center border-b-4 border-[var(--france-red)]">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Dépenses</div>
            <div className="text-3xl font-bold">{totalAmount.toFixed(2)} €</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Évolution des dépenses</h3>
              <div className="h-[300px]">
                {expenses.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">En attente de données...</div>
                )}
              </div>
            </div>

            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Nouvelle dépense</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select id="inp-child" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]">
                  <option value="Léo">Léo</option>
                  <option value="Emma">Emma</option>
                </select>
                <input id="inp-name" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" placeholder="Désignation" required />
                <input id="inp-amount" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" type="number" step="0.01" placeholder="Montant (€)" required />
                <input id="inp-date" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" type="date" required />
                <button type="submit" className="bg-[var(--france-red)] text-white p-3 rounded-lg font-bold md:col-span-2 hover:opacity-90">Ajouter au Cloud</button>
              </form>
            </div>
          </div>

          <div className="sidebar">
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm sticky top-[110px]">
              <h3 className="text-xl font-bold mb-4">👶 Dernières transactions</h3>
              <div className="space-y-3">
                {expenses.length > 0 ? (
                  expenses.slice(-5).reverse().map(exp => (
                    <div key={exp.id} className="text-sm border-b pb-2 flex justify-between">
                      <span className="text-gray-600">{exp.label}</span>
                      <span className="font-bold text-[var(--france-blue)]">{exp.amount}€</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Aucun historique...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
