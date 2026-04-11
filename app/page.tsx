'use client';

import { useEffect, useState } from 'react';
// On importe la connexion Supabase que tu as créée plus tôt
import { supabase } from '../supabaseClient';

export default function BabyBudgetPage() {
  // --- ZONE CERVEAU (LOGIQUE) ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fonction pour envoyer la dépense à Supabase
  const handleAddExpense = async (e) => {
    e.preventDefault(); // Empêche la page de se recharger

    // 1. Récupération des valeurs via leurs IDs
    const label = (document.getElementById('inp-name') as HTMLInputElement).value;
    const amount = (document.getElementById('inp-amount') as HTMLInputElement).value;
    const child = (document.getElementById('inp-child') as HTMLSelectElement).value;
    const date = (document.getElementById('inp-date') as HTMLInputElement).value;

    // 2. Envoi à la base de données
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        { 
          child_name: child, 
          label: label, 
          amount: parseFloat(amount), 
          date: date 
          // user_id sera ajouté automatiquement si tu as configuré l'Auth, 
          // pour l'instant on teste la connexion brute.
        }
      ]);

    if (error) {
      alert("Erreur Supabase : " + error.message);
    } else {
      alert("✅ Dépense enregistrée dans le Cloud !");
      (e.target as HTMLFormElement).reset(); // On vide le formulaire
    }
  };

  // --- ZONE VISUELLE ---
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* HEADER */}
      <header className="h-[80px] bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-[1000] backdrop-blur-md">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <a href="#" className="logo font-bold text-[26px]">
            Baby<span className="text-[var(--france-red)]">Budget</span> 🇫🇷
          </a>
          <div className="flex gap-3">
            <button className="btn border p-2 rounded opacity-60">Reset</button>
            <button className="btn border p-2 rounded">🌓</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center border-b-4 border-[var(--france-red)]">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Dépenses</div>
            <div className="text-3xl font-bold">0.00 €</div>
          </div>
          <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center border-b-4 border-[var(--france-blue)]">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Transactions</div>
            <div className="text-3xl font-bold">0</div>
          </div>
          <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm text-center border-b-4 border-[var(--france-red)]">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Moyenne / Jour</div>
            <div className="text-3xl font-bold">0.00 €</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* GRAPHIQUE */}
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Analyses</h3>
              <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Le graphique apparaîtra ici
              </div>
            </div>

            {/* FORMULAIRE CONNECTÉ */}
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Nouvelle dépense</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Enfant</label>
                  <select id="inp-child" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]">
                    <option value="Léo">Léo</option>
                    <option value="Emma">Emma</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Désignation</label>
                  <input id="inp-name" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" placeholder="Ex: Couches" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400">Montant (€)</label>
                  <input id="inp-amount" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Date</label>
                  <input id="inp-date" className="w-full border p-3 rounded-lg bg-[var(--bg-input)]" type="date" required />
                </div>
                <button type="submit" className="bg-[var(--france-red)] text-white p-3 rounded-lg font-bold md:col-span-2 hover:opacity-90 transition-opacity">
                  Ajouter au Cloud
                </button>
              </form>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">👶 Famille</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2"><span>Léo</span></div>
                <div className="flex justify-between border-b pb-2"><span>Emma</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}