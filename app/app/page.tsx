'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

// --- TYPES ---
interface Expense {
  id: string;
  child_name: string;
  label: string;
  amount: number;
  date: string;
  category: string;
  is_recurring: boolean;
}

interface Profile {
  id: string;
  name: string;
}

// --- CONSTANTES ---
const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕", 
  "Jouets": "🧸", "École": "📚", "Loisirs": "🎨", "Équipement": "🛒", "Autre": "📦"
};

const categoryColors = ['#002395', '#ED2939', '#5C7CFA', '#FF6B6B', '#2D364D', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const formatEuro = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const getTodayISO = () => new Date().toISOString().split('T')[0];

export default function UltimateBabyBudget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [pendingDeleteProfileId, setPendingDeleteProfileId] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewScope, setViewScope] = useState<'month' | 'year'>('month');
  const [filterChild, setFilterChild] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [expRes, profRes, settRes] = await Promise.all([
        supabase.from('expenses').select('*').order('date', { ascending: true }),
        supabase.from('profiles').select('*').order('name', { ascending: true }),
        supabase.from('settings').select('*').eq('key', 'monthly_budget').maybeSingle()
      ]);
      if (expRes.error || profRes.error) throw new Error("Erreur de synchronisation");
      setExpenses((expRes.data as Expense[]) || []);
      setProfiles((profRes.data as Profile[]) || []);
      if (settRes.data) setMonthlyBudget(parseFloat(settRes.data.value));
    } catch (error: any) { showToast(error.message, 'error'); }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date);
      const dateMatch = viewScope === 'month' 
        ? (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear())
        : (d.getFullYear() === currentDate.getFullYear());
      const childMatch = filterChild === 'all' || e.child_name === filterChild;
      const searchMatch = e.label.toLowerCase().includes(searchQuery.toLowerCase());
      return dateMatch && childMatch && searchMatch;
    });
  }, [expenses, currentDate, filterChild, searchQuery, viewScope]);

  const totalAmount = useMemo(() => filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0), [filteredExpenses]);

  const projection = useMemo(() => {
    if (viewScope !== 'month' || totalAmount === 0) return totalAmount;
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    if (!isCurrentMonth) return totalAmount;
    const daysPassed = today.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    return (totalAmount / daysPassed) * daysInMonth;
  }, [totalAmount, currentDate, viewScope]);

  const lineData = useMemo(() => {
    const dataPoints: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      const d = new Date(e.date);
      const key = viewScope === 'month' ? d.getDate().toString() : (d.getMonth() + 1).toString();
      dataPoints[key] = (dataPoints[key] || 0) + e.amount;
    });
    const labels = Array.from({ length: viewScope === 'month' ? 31 : 12 }, (_, i) => i + 1);
    return {
      labels: labels.map(i => viewScope === 'month' ? i : new Date(2000, i - 1).toLocaleDateString('fr-FR', {month: 'short'})),
      datasets: [{
        label: 'Dépenses',
        data: labels.map(i => dataPoints[i.toString()] || 0),
        borderColor: isDark ? '#5C7CFA' : '#002395',
        backgroundColor: isDark ? 'rgba(92, 124, 250, 0.1)' : 'rgba(0, 35, 149, 0.05)',
        tension: 0.4,
        fill: true,
        pointRadius: 2
      }]
    };
  }, [filteredExpenses, viewScope, isDark]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('expenses').insert([{
        child_name: formData.get('child'), label: formData.get('label'),
        amount: parseFloat(formData.get('amount') as string),
        date: formData.get('date'), category: formData.get('category'),
        is_recurring: formData.get('recurring') === 'on'
      }]).select();
      if (error) throw error;
      if (data) setLastAddedId(data[0].id);
      form.reset();
      fetchData();
      showToast("Dépense enregistrée");
    } catch (err: any) { showToast(err.message, 'error'); } finally { setIsLoading(false); }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast("Dépense supprimée");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const updateBudget = async () => {
    const val = parseFloat(tempBudget);
    if (isNaN(val)) return;
    try {
      await supabase.from('settings').upsert({ key: 'monthly_budget', value: tempBudget });
      setMonthlyBudget(val);
      setIsEditingBudget(false);
      showToast("Budget mis à jour");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const addProfile = async () => {
    if (!newProfileName) return;
    try {
      await supabase.from('profiles').insert([{ name: newProfileName }]);
      setNewProfileName('');
      fetchData();
      showToast("Enfant ajouté");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const deleteProfile = async (id: string) => {
    if(!confirm('Supprimer cet enfant ?')) return;
    try {
      await supabase.from('profiles').delete().eq('id', id);
      fetchData();
      showToast("Profil supprimé");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const currentEffectiveBudget = viewScope === 'month' ? monthlyBudget : monthlyBudget * 12;
  const percentUsed = Math.min((totalAmount / (currentEffectiveBudget || 1)) * 100, 100);
  const remaining = currentEffectiveBudget - totalAmount;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B0E14] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}
      style={{ 
        '--france-blue': isDark ? '#5C7CFA' : '#002395', 
        '--france-red': isDark ? '#FF6B6B' : '#ED2939', 
        '--bg-card': isDark ? '#161B26' : '#FFFFFF', 
        '--bg-input': isDark ? '#1F2633' : '#F1F5F9', 
        '--border': isDark ? '#2D364D' : '#E2E8F0' 
      } as React.CSSProperties}>

      <main className="container mx-auto px-5 py-8">
        
        {/* BARRE D'OUTILS LOCALE (Remplace l'ancien header pour éviter le doublon) */}
        <div className="flex justify-end items-center gap-3 mb-8">
            <div className="flex bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
              <button onClick={() => setViewScope('month')} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewScope === 'month' ? 'bg-[var(--france-blue)] text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}>MOIS</button>
              <button onClick={() => setViewScope('year')} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewScope === 'year' ? 'bg-[var(--france-blue)] text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}>ANNÉE</button>
            </div>
            <button onClick={() => setIsDark(!isDark)} className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-input)] shadow-sm hover:scale-105 transition-transform">
                {isDark ? '☀️' : '🌙'}
            </button>
        </div>

        {/* NAVIGATION DATE & SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg">
             <button onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() - (viewScope === 'month' ? 1 : 12));
                setCurrentDate(d);
             }} className="p-2 hover:bg-[var(--bg-input)] rounded-full">❮</button>
             <span className="flex-1 text-center font-black uppercase tracking-tighter">
               {viewScope === 'month' ? currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : `Année ${currentDate.getFullYear()}`}
             </span>
             <button onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() + (viewScope === 'month' ? 1 : 12));
                setCurrentDate(d);
             }} className="p-2 hover:bg-[var(--bg-input)] rounded-full">❯</button>
           </div>
           <div className="bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] flex items-center px-6 shadow-lg">
             <span className="mr-4 opacity-50">🔍</span>
             <input className="bg-transparent w-full outline-none font-bold" placeholder="Filtrer par nom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
           </div>
        </div>

        {/* BUDGET & PROJECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-[10px] font-black uppercase opacity-50 mb-1">Budget {viewScope === 'month' ? 'Mensuel' : 'Annuel'}</h3>
                {isEditingBudget ? (
                  <div className="flex gap-2">
                    <input type="number" className="bg-[var(--bg-input)] border border-[var(--france-blue)] rounded-lg px-2 py-1 text-xl font-bold w-24 outline-none" value={tempBudget} autoFocus onChange={(e) => setTempBudget(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && updateBudget()} />
                    <button onClick={updateBudget} className="bg-[var(--france-blue)] text-white px-3 rounded-lg text-xs">OK</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black">{formatEuro(currentEffectiveBudget)}</span>
                    <button onClick={() => { setTempBudget(monthlyBudget.toString()); setIsEditingBudget(true); }} className="text-[10px] opacity-30 hover:opacity-100 uppercase font-bold border border-[var(--border)] px-2 py-1 rounded">Modifier ✏️</button>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className={`text-xl font-black ${remaining < 0 ? 'text-[var(--france-red)]' : 'text-[var(--france-blue)]'}`}>
                  {remaining < 0 ? `-${formatEuro(Math.abs(remaining))}` : `${formatEuro(remaining)} restants`}
                </span>
              </div>
            </div>
            <div className="h-3 bg-[var(--bg-input)] rounded-full overflow-hidden border border-[var(--border)]">
              <div className={`h-full transition-all duration-1000 ${percentUsed >= 90 ? 'bg-[var(--france-red)]' : 'bg-[var(--france-blue)]'}`} style={{ width: `${percentUsed}%` }} />
            </div>
          </div>
          {projection !== null && (
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg flex flex-col justify-center">
              <h3 className="text-[10px] font-black uppercase opacity-50 mb-1">Projection fin de mois</h3>
              <div className="text-2xl font-black mb-1">{formatEuro(projection)}</div>
              <div className={`text-[10px] font-bold uppercase ${projection > currentEffectiveBudget ? 'text-[var(--france-red)]' : 'text-green-500'}`}>
                {projection > currentEffectiveBudget ? '⚠️ Dépassement prévu' : '✅ Dans les clous'}
              </div>
            </div>
          )}
        </div>

        {/* GRAPHIQUES & FORMULAIRE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg h-[300px]">
                <h3 className="text-sm mb-4 opacity-70">📈 Evolution</h3>
                <div className="h-full pb-8">
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg h-[300px]">
                <h3 className="text-sm mb-4 opacity-70">🍰 Répartition</h3>
                <div className="h-full pb-8">
                    <Doughnut data={{
                    labels: Object.keys(categoryIcons),
                    datasets: [{
                        data: Object.keys(categoryIcons).map(cat => filteredExpenses.filter(e => e.category === cat).reduce((acc, c) => acc + c.amount, 0)),
                        backgroundColor: categoryColors,
                        borderWidth: 0
                    }]
                    }} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] p-10 rounded-[40px] border border-[var(--border)] shadow-2xl">
              <h3 className="text-xl mb-8">✨ Nouvelle Entrée</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="child" className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none" required>
                  <option value="">Choisir un enfant</option>
                  {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="category" className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none" required>
                  {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                </select>
                <input name="label" required className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none" placeholder="Montant (€)" />
                <input name="date" type="date" required defaultValue={getTodayISO()} className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none" />
                <div className="flex items-center gap-3 px-2">
                  <input type="checkbox" name="recurring" id="rec" className="w-5 h-5 accent-[var(--france-blue)]" />
                  <label htmlFor="rec" className="text-sm font-bold opacity-50">Récurrente</label>
                </div>
                <button type="submit" disabled={isLoading || profiles.length === 0} className="md:col-span-2 bg-[var(--france-red)] text-white font-black py-5 rounded-2xl hover:brightness-110 shadow-xl transition-all active:scale-95 disabled:opacity-50">
                  {isLoading ? 'SYNC EN COURS...' : 'AJOUTER AU CLOUD'}
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="text-xl mb-6 font-bold italic">👶 Ma Famille</h3>
              <div className="space-y-3 mb-6">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-[var(--bg-input)] rounded-2xl">
                    <span className="font-bold">{p.name}</span>
                    <button onClick={() => deleteProfile(p.id)} className="text-[10px] opacity-30 hover:text-red-500 font-black uppercase">Retirer</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="bg-[var(--bg-input)] p-4 rounded-xl text-sm w-full outline-none border border-[var(--border)]" placeholder="Prénom..." value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addProfile()} />
                <button onClick={addProfile} className="bg-[var(--france-blue)] text-white px-5 rounded-xl font-bold">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg px-2 flex justify-between items-center italic">Historique <span>{formatEuro(totalAmount)}</span></h3>
              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {filteredExpenses.slice().reverse().map(exp => (
                  <div key={exp.id} className={`flex justify-between items-center p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] group hover:border-[var(--france-blue)] transition-all ${lastAddedId === exp.id ? 'highlight-new' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryIcons[exp.category] || "📦"}</span>
                      <div>
                        <div className="font-bold text-sm leading-none mb-1">{exp.label}</div>
                        <div className="text-[9px] opacity-50 uppercase font-black">{exp.child_name} • {new Date(exp.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-[var(--france-blue)]">{formatEuro(exp.amount)}</div>
                      <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity p-2">✕</button>
                    </div>
                  </div>
                ))}
                {filteredExpenses.length === 0 && <div className="text-center py-10 opacity-30">Aucun historique</div>}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl font-bold ${toast.type === 'error' ? 'bg-red-500' : 'bg-[var(--france-blue)]'} text-white animate-bounce`}>
          {toast.msg}
        </div>
      )}
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .highlight-new { animation: pulseSuccess 2s ease-out; }
        @keyframes pulseSuccess {
          0% { background-color: rgba(92, 124, 250, 0.2); transform: scale(1.03); }
          100% { background-color: transparent; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}