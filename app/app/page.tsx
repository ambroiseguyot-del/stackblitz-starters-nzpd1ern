'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/supabaseClient';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, ArcElement
);

// --- CONSTANTES & UTILITAIRES ---
const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕", "Autre": "📦"
};

const categoryColors = ['#002395', '#ED2939', '#5C7CFA', '#FF6B6B', '#F1F5F9', '#2D364D'];

const formatEuro = (amount: number) => 
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

// --- COMPOSANT PRINCIPAL ---
export default function UltimateBabyBudget() {
  // États de données
  const [expenses, setExpenses] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  
  // États d'interface
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterChild, setFilterChild] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  // --- LOGIQUE DE NOTIFICATION ---
  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // --- RÉCUPÉRATION DES DONNÉES ---
  const fetchData = async () => {
    try {
      const { data: exp, error: errExp } = await supabase.from('expenses').select('*').order('date', { ascending: true });
      const { data: prof, error: errProf } = await supabase.from('profiles').select('*').order('name', { ascending: true });
      
      if (errExp || errProf) throw new Error("Erreur de synchronisation");
      
      setExpenses(exp || []);
      setProfiles(prof || []);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      const monthMatch = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      const childMatch = filterChild === 'all' || e.child_name === filterChild;
      const searchMatch = e.label.toLowerCase().includes(searchQuery.toLowerCase());
      return monthMatch && childMatch && searchMatch;
    });
  }, [expenses, currentDate, filterChild, searchQuery]);

  const totalAmount = useMemo(() => 
    filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0), [filteredExpenses]);

  // --- CONFIGURATION GRAPHIQUES ---
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
      hoverOffset: 15
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
      pointRadius: 5,
      pointHoverRadius: 8,
      pointHitRadius: 30,
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1F2633' : '#FFF',
        titleColor: isDark ? '#FFF' : '#000',
        bodyColor: isDark ? '#94A3B8' : '#64748B',
        borderColor: isDark ? '#2D364D' : '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Montant : ${formatEuro(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: { ticks: { color: isDark ? '#94A3B8' : '#64748B' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      x: { ticks: { color: isDark ? '#94A3B8' : '#64748B' }, grid: { display: false } }
    }
  };

  // --- ACTIONS ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount') as string);

    if (amount <= 0 || isNaN(amount)) return showToast("Montant invalide", "error");

    setIsLoading(true);
    try {
      const { data: inserted, error } = await supabase.from('expenses').insert([{
        child_name: formData.get('child'),
        label: formData.get('label'),
        amount: amount,
        date: formData.get('date'),
        category: formData.get('category'),
        is_recurring: formData.get('recurring') === 'on'
      }]).select();

      if (error) throw error;

      if (inserted && inserted[0]) {
        setLastAddedId(inserted[0].id);
        setTimeout(() => setLastAddedId(null), 2000);
      }

      form.reset();
      fetchData();
      showToast("Dépense synchronisée !");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if(!confirm("Confirmer la suppression ?")) return;
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      fetchData();
      showToast("Dépense supprimée");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const addProfile = async () => {
    if (!newProfileName.trim()) return;
    try {
      const { error } = await supabase.from('profiles').insert([{ name: newProfileName }]);
      if (error) throw error;
      setNewProfileName('');
      fetchData();
      showToast(`Profil ${newProfileName} créé !`);
    } catch (err: any) {
      showToast(err.message, "error");
    }
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
          --text-muted: ${isDark ? '#94A3B8' : '#64748B'};
        }
        .highlight-new { animation: pulseSuccess 2s ease-out; }
        @keyframes pulseSuccess {
          0% { background-color: rgba(92, 124, 250, 0.2); transform: scale(1.02); }
          100% { background-color: transparent; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NOTIFICATIONS */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl font-bold transition-all transform animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-[var(--france-blue)]'} text-white`}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header className="h-20 bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <h1 className="font-premium text-2xl font-semibold italic">BabyBudget <span className="text-[var(--france-red)]">Executive</span></h1>
          <button onClick={() => setIsDark(!isDark)} className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-input)] shadow-sm active:scale-90 transition-transform">
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        {/* BARRE DE RECHERCHE & MOIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-[var(--bg-input)] rounded-full transition-colors">❮</button>
                <span className="flex-1 text-center font-black uppercase tracking-tighter">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-[var(--bg-input)] rounded-full transition-colors">❯</button>
            </div>
            <div className="bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg flex items-center px-6 focus-within:border-[var(--france-blue)] transition-colors">
                <span className="text-xl mr-4 opacity-50">🔍</span>
                <input 
                    className="bg-transparent w-full outline-none font-bold placeholder:opacity-30" 
                    placeholder="Rechercher une dépense..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="font-premium text-lg mb-6 tracking-tight opacity-70">📈 Évolution du mois</h3>
                    <div style={{ height: '220px' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="font-premium text-lg mb-6 tracking-tight opacity-70">🍰 Répartition</h3>
                    <div style={{ height: '220px' }}>
                        <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            {/* FORMULAIRE D'AJOUT */}
            <div className="bg-[var(--bg-card)] p-10 rounded-[40px] border border-[var(--border)] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 font-premium text-5xl text-[var(--france-red)] font-black opacity-10 select-none">
                {totalAmount.toFixed(0)}€
              </div>
              <h3 className="font-premium text-xl mb-8 flex items-center gap-3">✨ Nouvelle Entrée</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="child" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors">
                  {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="category" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors">
                  {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                </select>
                <input name="label" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" placeholder="Montant (€)" />
                <input name="date" type="date" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" />
                <div className="flex items-center gap-3 px-2">
                    <input type="checkbox" name="recurring" id="rec" className="w-5 h-5 accent-[var(--france-blue)] cursor-pointer" />
                    <label htmlFor="rec" className="text-sm font-bold opacity-50 cursor-pointer">Dépense récurrente</label>
                </div>
                <button 
                  type="submit" disabled={isLoading || profiles.length === 0}
                  className={`md:col-span-2 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 ${isLoading || profiles.length === 0 ? 'bg-gray-400 grayscale' : 'bg-[var(--france-red)] hover:brightness-110'}`}
                >
                  {isLoading ? 'SYNCHRONISATION...' : profiles.length === 0 ? 'AJOUTEZ UN ENFANT D\'ABORD' : 'AJOUTER AU CLOUD'}
                </button>
              </form>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            {/* GESTION FAMILLE */}
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="font-premium text-xl mb-6">👶 Ma Famille</h3>
              <div className="space-y-3 mb-6">
                {profiles.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-[var(--border)] rounded-2xl text-center">
                    <p className="text-xs font-bold opacity-40">Aucun enfant enregistré</p>
                  </div>
                ) : (
                  profiles.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-[var(--bg-input)] rounded-2xl border border-transparent hover:border-[var(--france-blue)] transition-all font-bold">
                      {p.name}
                      <span className="text-[9px] bg-[var(--france-blue)] text-white px-2 py-1 rounded-full uppercase tracking-widest">Actif</span>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input 
                  className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border)] text-sm w-full outline-none focus:border-[var(--france-blue)]"
                  placeholder="Prénom..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProfile()}
                />
                <button onClick={addProfile} className="bg-[var(--france-blue)] text-white px-5 rounded-xl font-bold hover:brightness-110 active:scale-90 transition-all">+</button>
              </div>
            </div>

            {/* HISTORIQUE / TIMELINE */}
            <div className="space-y-4">
              <h3 className="font-premium text-lg px-2 flex justify-between items-center">
                Historique <span className="text-xs bg-[var(--bg-input)] px-2 py-1 rounded-lg opacity-50">{filteredExpenses.length}</span>
              </h3>
              
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {filteredExpenses.length === 0 ? (
                  <div className="bg-[var(--bg-card)] p-12 rounded-[32px] border border-[var(--border)] text-center opacity-40">
                    <div className="text-4xl mb-4">💤</div>
                    <p className="text-xs font-black uppercase">Aucune dépense trouvée</p>
                  </div>
                ) : (
                  filteredExpenses.slice().reverse().map(exp => (
                    <div 
                      key={exp.id} 
                      className={`flex justify-between items-center p-5 bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] shadow-sm hover:translate-x-2 hover:border-[var(--france-blue)] transition-all group ${lastAddedId === exp.id ? 'highlight-new' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-2xl bg-[var(--bg-input)] w-12 h-12 flex items-center justify-center rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                                {categoryIcons[exp.category] || "📦"}
                            </div>
                            <div>
                                <div className="font-bold text-sm leading-tight">{exp.label}</div>
                                <div className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">
                                  {exp.child_name} • {new Date(exp.date).getDate()} {currentDate.toLocaleDateString('fr-FR', {month: 'short'})}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="font-premium font-bold text-[var(--france-blue)]">{formatEuro(exp.amount)}</div>
                            <button 
                                onClick={() => deleteExpense(exp.id)} 
                                className="opacity-0 group-hover:opacity-100 text-[var(--france-red)] font-bold transition-all p-2 hover:bg-red-500/10 rounded-lg"
                            >
                              ✕
                            </button>
                        </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
