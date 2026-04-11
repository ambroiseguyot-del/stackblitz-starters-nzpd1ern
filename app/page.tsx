'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Mapping des icônes pour le design Premium
const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷",
  "Lait": "🍼",
  "Santé": "🩺",
  "Soins": "🧼",
  "Vêtements": "👕",
  "Education": "👨‍🎓",
  "Autre": "📦"
};

export default function PremiumBabyBudget() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterChild, setFilterChild] = useState('all');
  const [isDark, setIsDark] = useState(false);

  const fetchData = async () => {
    const { data: exp } = await supabase.from('expenses').select('*').order('date', { ascending: true });
    const { data: prof } = await supabase.from('profiles').select('*');
    if (exp) setExpenses(exp);
    if (prof) setProfiles(prof);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTRAGE ---
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const monthMatch = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    const childMatch = filterChild === 'all' || e.child_name === filterChild;
    return monthMatch && childMatch;
  });

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // --- ACTIONS ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    await supabase.from('expenses').insert([{
      child_name: formData.get('child'),
      label: formData.get('label'),
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date'),
      category: formData.get('category') || 'Autre'
    }]);
    
    form.reset();
    fetchData();
  };

  const deleteExpense = async (id: string) => {
    if (confirm("Supprimer cette dépense ?")) {
      await supabase.from('expenses').delete().eq('id', id);
      fetchData();
    }
  };

  const exportCSV = () => {
    const headers = ["Date,Enfant,Categorie,Label,Montant\n"];
    const rows = filteredExpenses.map(e => `${e.date},${e.child_name},${e.category},${e.label},${e.amount}\n`);
    const blob = new Blob([headers.concat(rows).join("")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BabyBudget_${currentDate.getMonth()+1}_${currentDate.getFullYear()}.csv`;
    a.click();
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-[#0B0E14]' : 'bg-[#F8FAFC]'}`}>
      <header className="h-20 bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <h1 className="font-premium text-2xl font-semibold text-[var(--text-main)]">Baby<span className="text-[var(--france-red)]">Budget</span> 🇫🇷</h1>
          <button onClick={() => setIsDark(!isDark)} className="p-2 border border-[var(--border)] rounded-xl hover:bg-[var(--bg-input)]">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[var(--bg-input)] rounded-lg p-1">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="px-3 py-1">❮</button>
              <span className="px-4 font-bold text-sm min-w-[120px] text-center uppercase">{currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="px-3 py-1">❯</button>
            </div>
            <select className="bg-transparent font-bold text-sm outline-none border-l pl-4 border-[var(--border)]" value={filterChild} onChange={(e) => setFilterChild(e.target.value)}>
              <option value="all">Tous les enfants</option>
              {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <button onClick={exportCSV} className="btn-outline px-4 py-2 rounded-xl text-xs font-bold border border-[var(--border)]">Export CSV</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm">
              <h3 className="font-premium text-xl mb-6">Nouvelle dépense</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Enfant</label>
                  <select name="child" className="bg-[var(--bg-input)] p-3 rounded-xl outline-none border border-[var(--border)] text-[var(--text-main)]">
                    {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Catégorie</label>
                  <select name="category" className="bg-[var(--bg-input)] p-3 rounded-xl outline-none border border-[var(--border)] text-[var(--text-main)]">
                    {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                  </select>
                </div>
                <input name="label" required className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border)] text-[var(--text-main)]" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border)] text-[var(--text-main)]" placeholder="Montant (€)" />
                <input name="date" type="date" required className="md:col-span-2 bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border)] text-[var(--text-main)]" />
                <button type="submit" className="md:col-span-2 bg-[var(--france-red)] text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all">Ajouter au Cloud</button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="font-premium text-xl">Dernières transactions</h3>
              {filteredExpenses.slice().reverse().map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm hover:border-[var(--france-blue)] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl bg-[var(--bg-input)] p-3 rounded-xl">{categoryIcons[exp.category] || "📦"}</div>
                    <div>
                      <div className="font-bold text-[var(--text-main)]">{exp.label}</div>
                      <div className="text-xs text-[var(--text-muted)] uppercase font-bold">{exp.child_name} • {new Date(exp.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-premium text-xl text-[var(--france-blue)]">{exp.amount.toFixed(2)} €</div>
                    <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all px-2">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm sticky top-28">
              <div className="stat-card mb-8 text-center">
                <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2 tracking-tighter">Total Période</p>
                <p className="font-premium text-4xl text-[var(--france-red)]">{totalAmount.toFixed(2)} €</p>
              </div>
              <h3 className="font-premium text-lg mb-4 border-b pb-2">👶 Famille</h3>
              <div className="space-y-3">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-[var(--bg-input)] rounded-xl font-bold text-sm">
                    {p.name} <span className="text-[8px] bg-green-500 text-white px-2 py-1 rounded-full uppercase">Sync</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
