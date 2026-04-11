'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕", "Autre": "📦"
};

export default function PremiumBabyBudget() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterChild, setFilterChild] = useState('all');
  const [isDark, setIsDark] = useState(false);
  
  // États pour la gestion de la famille
  const [newProfileName, setNewProfileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchData = async () => {
    const { data: exp } = await supabase.from('expenses').select('*').order('date', { ascending: true });
    const { data: prof } = await supabase.from('profiles').select('*').order('name', { ascending: true });
    if (exp) setExpenses(exp);
    if (prof) setProfiles(prof);
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIQUE FAMILLE ---
  const addProfile = async () => {
    if (!newProfileName.trim()) return;
    const { error } = await supabase.from('profiles').insert([{ name: newProfileName }]);
    if (!error) {
      setNewProfileName('');
      fetchData();
    }
  };

  const deleteProfile = async (id: string, name: string) => {
    if (confirm(`Supprimer ${name} ? Cela ne supprimera pas ses dépenses, mais il n'apparaîtra plus dans la liste.`)) {
      await supabase.from('profiles').delete().eq('id', id);
      fetchData();
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    await supabase.from('profiles').update({ name: editName }).eq('id', editingId);
    setEditingId(null);
    fetchData();
  };

  // --- LOGIQUE DÉPENSES ---
  const filteredExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear() && (filterChild === 'all' || e.child_name === filterChild);
  });

  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

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

  // --- GRAPH CONFIG ---
  const chartData = {
    labels: filteredExpenses.length > 0 ? filteredExpenses.map(e => new Date(e.date).getDate()) : ["1"],
    datasets: [{
      label: 'Dépenses (€)',
      data: filteredExpenses.map(e => e.amount),
      fill: true,
      borderColor: isDark ? '#5C7CFA' : '#002395',
      backgroundColor: isDark ? 'rgba(92, 124, 250, 0.15)' : 'rgba(0, 35, 149, 0.05)',
      tension: 0.4,
      pointRadius: 4,
    }]
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
      `}</style>

      <header className="h-20 bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <h1 className="font-premium text-2xl font-semibold">Baby<span className="text-[var(--france-red)]">Budget</span> 🇫🇷</h1>
          <button onClick={() => setIsDark(!isDark)} className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-input)]">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <main className="container mx-auto px-5 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[var(--bg-input)] rounded-xl p-1">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="px-4 py-2">❮</button>
              <span className="px-6 font-bold text-sm min-w-[140px] text-center uppercase tracking-widest">
                {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="px-4 py-2">❯</button>
            </div>
            <select className="bg-transparent font-bold text-sm outline-none border-l pl-6 border-[var(--border)]" value={filterChild} onChange={(e) => setFilterChild(e.target.value)}>
              <option value="all">Toute la Famille</option>
              {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="font-premium text-3xl text-[var(--france-red)] font-bold">{totalAmount.toFixed(2)} €</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="font-premium text-xl mb-8 flex items-center gap-3">📈 Analyses</h3>
              <div style={{ position: 'relative', height: '350px', width: '100%' }}>
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            <div className="bg-[var(--bg-card)] p-10 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="font-premium text-xl mb-8">➕ Nouvelle dépense</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="child" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none">
                  {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="category" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none">
                  {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
                </select>
                <input name="label" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" placeholder="Montant (€)" />
                <input name="date" type="date" required className="md:col-span-2 bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none" />
                <button type="submit" className="md:col-span-2 bg-[var(--france-red)] text-white font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.01] transition-all">Enregistrer</button>
              </form>
            </div>
          </div>

          <aside className="space-y-8">
            {/* PANNEAU DE GESTION FAMILLE */}
            <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg">
              <h3 className="font-premium text-xl mb-6">👶 Ma Famille</h3>
              
              <div className="space-y-3 mb-6">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-[var(--bg-input)] rounded-xl group transition-all">
                    {editingId === p.id ? (
                      <input 
                        className="bg-transparent font-bold outline-none w-full"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={saveEdit}
                        autoFocus
                      />
                    ) : (
                      <span className="font-bold">{p.name}</span>
                    )}
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(p.id, p.name)} className="text-xs text-[var(--text-muted)] hover:text-[var(--france-blue)]">✎</button>
                      <button onClick={() => deleteProfile(p.id, p.name)} className="text-xs text-[var(--text-muted)] hover:text-[var(--france-red)]">✕</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  className="bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border)] text-sm w-full outline-none"
                  placeholder="Nouveau prénom..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
                <button onClick={addProfile} className="bg-[var(--france-blue)] text-white px-4 rounded-xl font-bold">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-premium text-lg px-2">Dernières dépenses</h3>
              {filteredExpenses.slice().reverse().slice(0, 5).map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-4 bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="text-xl bg-[var(--bg-input)] w-10 h-10 flex items-center justify-center rounded-xl">{categoryIcons[exp.category] || "📦"}</div>
                    <div className="text-sm font-bold">{exp.label}</div>
                  </div>
                  <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-[var(--france-red)] transition-opacity">✕</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
