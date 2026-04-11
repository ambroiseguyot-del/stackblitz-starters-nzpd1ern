'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, ArcElement
);

const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕", "Autre": "📦"
};

const categoryColors = [
  '#002395', '#ED2939', '#5C7CFA', '#FF6B6B', '#F1F5F9', '#2D364D'
];

export default function UltimateBabyBudget() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterChild, setFilterChild] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const { data: exp } = await supabase.from('expenses').select('*').order('date', { ascending: true });
    const { data: prof } = await supabase.from('profiles').select('*').order('name', { ascending: true });
    if (exp) setExpenses(exp);
    if (prof) setProfiles(prof);
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIQUE DE FILTRAGE & RECHERCHE ---
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      const monthMatch = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      const childMatch = filterChild === 'all' || e.child_name === filterChild;
      const searchMatch = e.label.toLowerCase().includes(searchQuery.toLowerCase());
      return monthMatch && childMatch && searchMatch;
    });
  }, [expenses, currentDate, filterChild, searchQuery]);

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // --- DONNÉES DU DONUT ---
  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    filteredExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [filteredExpenses]);

  const donutData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: categoryColors,
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  const lineData = {
    labels: filteredExpenses.map(e => new Date(e.date).getDate()),
    datasets: [{
      label: 'Dépenses (€)',
      data: filteredExpenses.map(e => e.amount),
      fill: true,
      borderColor: isDark ? '#5C7CFA' : '#002395',
      backgroundColor: isDark ? 'rgba(92, 124, 250, 0.1)' : 'rgba(0, 35, 149, 0.05)',
      tension: 0.4,
      pointRadius: 4,
    }]
  };

  // --- ACTIONS ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setIsLoading(true);
    const { error } = await supabase.from('expenses').insert([{
      child_name: formData.get('child'),
      label: formData.get('label'),
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date'),
      category: formData.get('category'),
      is_recurring: formData.get('recurring') === 'on'
    }]);
    setIsLoading(false);
    if (!error) { form.reset(); fetchData(); showToast("Dépense enregistrée !"); }
  };

  const deleteExpense = async (id: string) => {
    if(!confirm("Supprimer ?")) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) { fetchData(); showToast("Dépense supprimée"); }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-[#0B0E14] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      <style jsx global>{`
        :root {
          --france-blue: ${isDark ? '#5C7CFA' : '#002395'};
          --france-red: ${isDark ? '#FF6B6B' : '#ED2939'};
          --bg-card: ${isDark ? '#161B26' : '#FFFFFF'};
          --bg-input: ${isDark ? '#1F2633' : '#F1F5F9'};
          --border: ${isDark ? '#2D364D' : '#E2E8F0'};
        }
      `}</style>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl font-bold bg-[var(--france-blue)] text-white animate-bounce">
          {toast.msg}
        </div>
      )}

      <header className="h-20 bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-50">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <h1 className="font-premium text-2xl font-semibold italic">BabyBudget <span className="text-[var(--france-red)]">Executive</span></h1>
          <button onClick={() => setIsDark(!isDark)} className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-input)] shadow-sm active:scale-90 transition-transform">
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        {/* TOP BAR SMART */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2">❮</button>
                <span className="flex-1 text-center font-black uppercase tracking-tighter">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2">❯</button>
            </div>
            <div className="bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg flex items-center px-6">
                <span className="text-xl mr-4">🔍</span>
                <input 
                    className="bg-transparent w-full outline-none font-bold" 
                    placeholder="Rechercher une dépense..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* ANALYTICS DUAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
                    <h3 className="font-premium text-lg mb-6 tracking-tight">📈 Évolution</h3>
                    <div style={{ height: '220px' }}>
                        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
                    <h3 className="font-premium text-lg mb-6 tracking-tight">🍰 Répartition</h3>
                    <div style={{ height: '220px' }}>
                        <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }} />
                    </div>
                </div>
            </div>

            {/* FORMULAIRE AVEC OPTIONS AVANCÉES */}
            <div className="bg-[var(--bg-card)] p-10 rounded-[40px] border border-[var(--border)] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 font-premium text-4xl text-[var(--france-red)] font-black opacity-20">{totalAmount.toFixed(0)}€</div>
              <h3 className="font-premium text-xl mb-8 flex items-center gap-3">✨ Nouvelle Entrée</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="child" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none">
                  {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="category" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none">
                  {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                </select>
                <input name="label" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" placeholder="Montant (€)" />
                <input name="date" type="date" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" />
                <div className="flex items-center gap-3 px-2">
                    <input type="checkbox" name="recurring" id="rec" className="w-5 h-5 accent-[var(--france-blue)]" />
                    <label htmlFor="rec" className="text-sm font-bold opacity-70">Dépense récurrente</label>
                </div>
                <button 
                  type="submit" disabled={isLoading}
                  className={`md:col-span-2 text-white font-black py-5 rounded-2xl shadow-xl transition-all ${isLoading ? 'bg-gray-400' : 'bg-[var(--france-red)] hover:brightness-110 active:scale-95'}`}
                >
                  {isLoading ? 'ENVOI AU CLOUD...' : 'SYNCHRONISER'}
                </button>
              </form>
            </div>
          </div>

          {/* SIDEBAR DYNAMIQUE */}
          <aside className="space-y-8">
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="font-premium text-xl mb-6">👶 Famille</h3>
              <div className="space-y-3">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-[var(--bg-input)] rounded-2xl border border-transparent hover:border-[var(--france-blue)] transition-all font-bold">
                    {p.name}
                    <span className="text-[10px] text-[var(--france-blue)] bg-[var(--bg-card)] px-3 py-1 rounded-full border border-[var(--border)]">SYNC</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-premium text-lg px-2 flex justify-between">
                Historique <span>{filteredExpenses.length}</span>
              </h3>
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {filteredExpenses.slice().reverse().map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-5 bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] shadow-sm hover:translate-x-1 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl bg-[var(--bg-input)] w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">{categoryIcons[exp.category] || "📦"}</div>
                            <div>
                                <div className="font-bold text-sm leading-tight">{exp.label}</div>
                                <div className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">{exp.child_name} • {new Date(exp.date).getDate()} {currentDate.toLocaleDateString('fr-FR', {month: 'short'})}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="font-premium font-bold text-[var(--france-blue)]">{exp.amount.toFixed(2)}€</div>
                            <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-[var(--france-red)] font-bold transition-all">✕</button>
                        </div>
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
