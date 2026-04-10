'use client';

import { useEffect, useState } from 'react';

export default function BabyBudgetPage() {
  // --- ZONE CERVEAU (LOGIQUE) ---
  const [currentDate, setCurrentDate] = useState(new Date());

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

            {/* FORMULAIRE */}
            <div className="card bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Nouvelle dépense</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border p-3 rounded-lg bg-[var(--bg-input)]" placeholder="Désignation" />
                <input className="border p-3 rounded-lg bg-[var(--bg-input)]" type="number" placeholder="Montant (€)" />
                <button className="bg-[var(--france-red)] text-white p-3 rounded-lg font-bold md:col-span-2">Ajouter</button>
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
