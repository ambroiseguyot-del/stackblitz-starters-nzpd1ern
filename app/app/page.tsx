'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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

// ─── TYPES ───────────────────────────────────────────────────────────────────
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

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕",
  "Jouets": "🧸", "École": "📚", "Loisirs": "🎨", "Équipement": "🛒", "Autre": "📦"
};

const categoryColors = ['#002395', '#ED2939', '#5C7CFA', '#FF6B6B', '#2D364D', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const formatEuro = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

// FIX: Protection timezone — évite le décalage d'un jour selon le fuseau
const parseDateLocal = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getTodayISO = () => new Date().toISOString().split('T')[0];

// ─── SOUS-COMPOSANT : Modale de confirmation ─────────────────────────────────
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein">
      <div className="rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 border border-[var(--border)]"
        style={{ backgroundColor: 'var(--bg-card)' }}>
        <p className="font-bold text-center mb-6 text-base leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-[var(--border)] font-bold text-sm hover:bg-[var(--bg-input)] transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-[var(--france-red)] text-white font-bold text-sm hover:brightness-110 transition-all">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SOUS-COMPOSANT : Modale d'édition ───────────────────────────────────────
interface EditModalProps {
  expense: Expense;
  profiles: Profile[];
  onSave: (updated: Partial<Expense>) => Promise<void>;
  onCancel: () => void;
}
function EditModal({ expense, profiles, onSave, onCancel }: EditModalProps) {
  const [form, setForm] = useState({
    child_name: expense.child_name,
    label: expense.label,
    amount: expense.amount.toString(),
    date: expense.date,
    category: expense.category,
    is_recurring: expense.is_recurring,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(form.amount);
    if (isNaN(parsed) || parsed <= 0) return;
    setSaving(true);
    await onSave({
      child_name: form.child_name,
      label: form.label,
      amount: parsed,
      date: form.date,
      category: form.category,
      is_recurring: form.is_recurring,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein p-4">
      <div className="rounded-[32px] p-8 shadow-2xl w-full max-w-lg border border-[var(--border)] animate-slideup"
        style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black">✏️ Modifier la dépense</h3>
          <button onClick={onCancel}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-input)] transition-colors text-lg opacity-50 hover:opacity-100">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-wider">Enfant</label>
            <select value={form.child_name} onChange={e => setForm(f => ({ ...f, child_name: e.target.value }))}
              className="bg-[var(--bg-input)] p-3 rounded-2xl outline-none text-sm font-bold border border-[var(--border)] focus:border-[var(--france-blue)] transition-colors" required>
              {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-wider">Catégorie</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="bg-[var(--bg-input)] p-3 rounded-2xl outline-none text-sm font-bold border border-[var(--border)] focus:border-[var(--france-blue)] transition-colors" required>
              {Object.keys(categoryIcons).map(cat => (
                <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-wider">Désignation</label>
            <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              className="bg-[var(--bg-input)] p-3 rounded-2xl outline-none text-sm font-bold border border-[var(--border)] focus:border-[var(--france-blue)] transition-colors"
              placeholder="Ex : Pampers taille 3" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-wider">Montant (€)</label>
            <input type="number" step="0.01" min="0.01" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="bg-[var(--bg-input)] p-3 rounded-2xl outline-none text-sm font-bold border border-[var(--border)] focus:border-[var(--france-blue)] transition-colors" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-wider">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="bg-[var(--bg-input)] p-3 rounded-2xl outline-none text-sm font-bold border border-[var(--border)] focus:border-[var(--france-blue)] transition-colors" required />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2 px-1">
            <input type="checkbox" id="edit-recurring" checked={form.is_recurring}
              onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))}
              className="w-5 h-5 accent-[var(--france-blue)]" />
            <label htmlFor="edit-recurring" className="text-sm font-bold opacity-50">Dépense récurrente 🔁</label>
          </div>
          <div className="flex gap-3 sm:col-span-2 mt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 py-4 rounded-2xl border border-[var(--border)] font-bold text-sm hover:bg-[var(--bg-input)] transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-4 rounded-2xl bg-[var(--france-blue)] text-white font-black text-sm hover:brightness-110 transition-all disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── SOUS-COMPOSANT : Empty state graphiques ──────────────────────────────────
function EmptyChartOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-25 pointer-events-none">
      <span className="text-4xl mb-2">📭</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function UltimateBabyBudget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  // Modale de confirmation (suppression)
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  // Modale d'édition
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewScope, setViewScope] = useState<'month' | 'year'>('month');
  const [filterChild, setFilterChild] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [newProfileName, setNewProfileName] = useState('');

  // FIX: showToast stable via ref — rompt la chaîne de dépendances fragile
  const showToastRef = useRef<(msg: string, type?: 'success' | 'error') => void>(() => {});
  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  showToastRef.current = showToast;

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
    } catch (error: any) { showToastRef.current(error.message, 'error'); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = parseDateLocal(e.date); // FIX: timezone safe
      const dateMatch = viewScope === 'month'
        ? (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear())
        : (d.getFullYear() === currentDate.getFullYear());
      const childMatch = filterChild === 'all' || e.child_name === filterChild;
      const searchMatch = e.label.toLowerCase().includes(searchQuery.toLowerCase());
      return dateMatch && childMatch && searchMatch;
    });
  }, [expenses, currentDate, filterChild, searchQuery, viewScope]);

  const totalAmount = useMemo(() =>
    filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0),
    [filteredExpenses]
  );

  // FIX: mémoïsé — évite le slice().reverse() à chaque render
  const reversedFilteredExpenses = useMemo(() =>
    filteredExpenses.slice().reverse(),
    [filteredExpenses]
  );

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
      const d = parseDateLocal(e.date);
      const key = viewScope === 'month' ? d.getDate().toString() : (d.getMonth() + 1).toString();
      dataPoints[key] = (dataPoints[key] || 0) + e.amount;
    });
    const labels = Array.from({ length: viewScope === 'month' ? 31 : 12 }, (_, i) => i + 1);
    return {
      labels: labels.map(i => viewScope === 'month' ? i : new Date(2000, i - 1).toLocaleDateString('fr-FR', { month: 'short' })),
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

  // FIX: Doughnut mémoïsé + empty state propre
  const doughnutData = useMemo(() => {
    const values = Object.keys(categoryIcons).map(cat =>
      filteredExpenses.filter(e => e.category === cat).reduce((acc, c) => acc + c.amount, 0)
    );
    const isEmpty = values.every(v => v === 0);
    return {
      isEmpty,
      data: {
        labels: Object.keys(categoryIcons),
        datasets: [{
          data: isEmpty ? [1] : values,
          backgroundColor: isEmpty ? ['#E2E8F0'] : categoryColors,
          borderWidth: 0
        }]
      }
    };
  }, [filteredExpenses]);

  // ── HANDLERS ────────────────────────────────────────────────────────────────

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    // FIX: Validation montant avant insert
    const parsedAmount = parseFloat(formData.get('amount') as string);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("Montant invalide", 'error');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('expenses').insert([{
        child_name: formData.get('child'),
        label: formData.get('label'),
        amount: parsedAmount,
        date: formData.get('date'),
        category: formData.get('category'),
        is_recurring: formData.get('recurring') === 'on'
      }]).select();
      if (error) throw error;
      if (data) setLastAddedId(data[0].id);
      form.reset();
      fetchData();
      showToast("Dépense enregistrée ✓");
    } catch (err: any) { showToast(err.message, 'error'); } finally { setIsLoading(false); }
  };

  // NOUVEAU : Édition d'une dépense existante
  const handleEditExpense = async (updated: Partial<Expense>) => {
    if (!editingExpense) return;
    try {
      const { error } = await supabase
        .from('expenses')
        .update(updated)
        .eq('id', editingExpense.id);
      if (error) throw error;
      setEditingExpense(null);
      fetchData();
      showToast("Dépense modifiée ✓");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  // NOUVEAU : Duplication rapide d'une dépense (utile pour les récurrentes)
  const handleDuplicateExpense = async (exp: Expense) => {
    try {
      const { data, error } = await supabase.from('expenses').insert([{
        child_name: exp.child_name,
        label: exp.label,
        amount: exp.amount,
        date: getTodayISO(), // duplique à la date du jour
        category: exp.category,
        is_recurring: exp.is_recurring,
      }]).select();
      if (error) throw error;
      if (data) setLastAddedId(data[0].id);
      fetchData();
      showToast(`"${exp.label}" dupliqué ✓`);
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const deleteExpense = async (id: string, label: string) => {
    // FIX: modale stylée à la place du confirm() natif
    setConfirmModal({
      message: `Supprimer "${label}" ?`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const { error } = await supabase.from('expenses').delete().eq('id', id);
          if (error) throw error;
          setExpenses(prev => prev.filter(e => e.id !== id));
          showToast("Dépense supprimée");
        } catch (err: any) { showToast(err.message, 'error'); }
      }
    });
  };

  const updateBudget = async () => {
    const val = parseFloat(tempBudget);
    if (isNaN(val) || val < 0) { showToast("Budget invalide", 'error'); return; }
    try {
      await supabase.from('settings').upsert({ key: 'monthly_budget', value: tempBudget });
      setMonthlyBudget(val);
      setIsEditingBudget(false);
      showToast("Budget mis à jour ✓");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const addProfile = async () => {
    if (!newProfileName.trim()) return;
    try {
      await supabase.from('profiles').insert([{ name: newProfileName.trim() }]);
      setNewProfileName('');
      fetchData();
      showToast("Enfant ajouté ✓");
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const deleteProfile = async (id: string, name: string) => {
    setConfirmModal({
      message: `Supprimer le profil de ${name} ? Ses dépenses resteront dans l'historique.`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await supabase.from('profiles').delete().eq('id', id);
          if (filterChild === name) setFilterChild('all');
          fetchData();
          showToast("Profil supprimé");
        } catch (err: any) { showToast(err.message, 'error'); }
      }
    });
  };

  const currentEffectiveBudget = viewScope === 'month' ? monthlyBudget : monthlyBudget * 12;
  const budgetIsDefined = currentEffectiveBudget > 0;
  // FIX: guard explicite — plus de division par 0 silencieuse
  const percentUsed = budgetIsDefined ? Math.min((totalAmount / currentEffectiveBudget) * 100, 100) : 0;
  const remaining = currentEffectiveBudget - totalAmount;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B0E14] text-[#F1F5F9]' : 'bg-[#F0F4FF] text-[#0F172A]'}`}
      style={{
        '--france-blue': isDark ? '#5C7CFA' : '#002395',
        '--france-red': isDark ? '#FF6B6B' : '#ED2939',
        '--bg-card': isDark ? '#161B26' : '#FFFFFF',
        '--bg-input': isDark ? '#1F2633' : '#EEF2FF',
        '--border': isDark ? '#2D364D' : '#DDE3F5',
        '--text-muted': isDark ? 'rgba(241,245,249,0.45)' : 'rgba(15,23,42,0.4)',
      } as React.CSSProperties}
    >
      <main className="container mx-auto px-5 py-8 max-w-7xl">

        {/* ── BARRE D'OUTILS ─────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">👶</span>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">Baby Budget</h1>
              <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest mt-0.5">Suivi des dépenses</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
              <button onClick={() => setViewScope('month')}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${viewScope === 'month' ? 'bg-[var(--france-blue)] text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}>
                MOIS
              </button>
              <button onClick={() => setViewScope('year')}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${viewScope === 'year' ? 'bg-[var(--france-blue)] text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}>
                ANNÉE
              </button>
            </div>
            <button onClick={() => setIsDark(!isDark)}
              className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-card)] shadow-sm hover:scale-105 transition-transform"
              aria-label="Basculer le thème">
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* ── NAVIGATION DATE & SEARCH ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-sm">
            <button
              onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - (viewScope === 'month' ? 1 : 12)); setCurrentDate(d); }}
              className="w-9 h-9 flex items-center justify-center hover:bg-[var(--bg-input)] rounded-full transition-colors font-bold"
              aria-label="Période précédente">❮</button>
            <span className="flex-1 text-center font-black uppercase tracking-tighter text-sm">
              {viewScope === 'month'
                ? currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                : `Année ${currentDate.getFullYear()}`}
            </span>
            <button
              onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + (viewScope === 'month' ? 1 : 12)); setCurrentDate(d); }}
              className="w-9 h-9 flex items-center justify-center hover:bg-[var(--bg-input)] rounded-full transition-colors font-bold"
              aria-label="Période suivante">❯</button>
          </div>
          <div className="bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] flex items-center px-6 shadow-sm">
            <span className="mr-4 opacity-30 text-lg" aria-hidden="true">🔍</span>
            <label htmlFor="search-input" className="sr-only">Filtrer par nom</label>
            <input id="search-input"
              className="bg-transparent w-full outline-none font-bold text-sm placeholder:opacity-30"
              placeholder="Filtrer par désignation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="opacity-30 hover:opacity-70 ml-2 text-sm font-bold transition-opacity"
                aria-label="Effacer la recherche">✕</button>
            )}
          </div>
        </div>

        {/* ── FILTRE PAR ENFANT (exposé visuellement — state existait, UI manquait) ── */}
        {profiles.length >= 1 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[10px] font-black uppercase opacity-40 mr-1 tracking-wider select-none">Enfant :</span>
            <button
              onClick={() => setFilterChild('all')}
              className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all ${
                filterChild === 'all'
                  ? 'bg-[var(--france-blue)] text-white border-[var(--france-blue)] shadow-md'
                  : 'bg-[var(--bg-card)] border-[var(--border)] opacity-50 hover:opacity-100 hover:border-[var(--france-blue)]'
              }`}>
              Tous
            </button>
            {profiles.map(p => (
              <button key={p.id}
                onClick={() => setFilterChild(filterChild === p.name ? 'all' : p.name)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all flex items-center gap-1.5 ${
                  filterChild === p.name
                    ? 'bg-[var(--france-blue)] text-white border-[var(--france-blue)] shadow-md'
                    : 'bg-[var(--bg-card)] border-[var(--border)] opacity-50 hover:opacity-100 hover:border-[var(--france-blue)]'
                }`}>
                <span>👶</span>{p.name}
              </button>
            ))}
          </div>
        )}

        {/* ── BUDGET & PROJECTION ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  Budget {viewScope === 'month' ? 'Mensuel' : 'Annuel'}
                </h3>
                {isEditingBudget ? (
                  <div className="flex gap-2 items-center">
                    <label htmlFor="budget-input" className="sr-only">Modifier le budget</label>
                    <input id="budget-input" type="number"
                      className="bg-[var(--bg-input)] border-2 border-[var(--france-blue)] rounded-xl px-3 py-2 text-xl font-black w-28 outline-none"
                      value={tempBudget} autoFocus
                      onChange={(e) => setTempBudget(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateBudget()} />
                    <button onClick={updateBudget}
                      className="bg-[var(--france-blue)] text-white px-4 py-2 rounded-xl text-xs font-black hover:brightness-110 transition-all">
                      OK
                    </button>
                    <button onClick={() => setIsEditingBudget(false)}
                      className="opacity-30 hover:opacity-70 text-xs font-bold px-2 transition-opacity">✕</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black">
                      {budgetIsDefined
                        ? formatEuro(currentEffectiveBudget)
                        : <span className="text-base opacity-30">Budget non défini</span>}
                    </span>
                    <button
                      onClick={() => { setTempBudget(monthlyBudget.toString()); setIsEditingBudget(true); }}
                      className="text-[10px] opacity-25 hover:opacity-100 uppercase font-black border border-[var(--border)] px-2 py-1 rounded-lg transition-opacity">
                      ✏️ Modifier
                    </button>
                  </div>
                )}
              </div>
              <div className="text-right">
                {budgetIsDefined ? (
                  <span className={`text-xl font-black ${remaining < 0 ? 'text-[var(--france-red)]' : 'text-[var(--france-blue)]'}`}>
                    {remaining < 0 ? `−${formatEuro(Math.abs(remaining))} dépassé` : `${formatEuro(remaining)} restants`}
                  </span>
                ) : (
                  <span className="text-sm font-bold opacity-30">{formatEuro(totalAmount)} dépensés</span>
                )}
              </div>
            </div>
            <div className="h-3 bg-[var(--bg-input)] rounded-full overflow-hidden border border-[var(--border)]">
              {budgetIsDefined ? (
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${percentUsed >= 90 ? 'bg-[var(--france-red)]' : 'bg-[var(--france-blue)]'}`}
                  style={{ width: `${percentUsed}%` }} />
              ) : (
                <div className="h-full w-1/3 bg-[var(--france-blue)] opacity-20 animate-pulse rounded-full" />
              )}
            </div>
            {budgetIsDefined && (
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold opacity-30">{formatEuro(totalAmount)} dépensés</span>
                <span className="text-[10px] font-bold opacity-30">{Math.round(percentUsed)}%</span>
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-sm flex flex-col justify-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              {viewScope === 'month' ? 'Projection fin de mois' : 'Total annuel'}
            </h3>
            <div className="text-2xl font-black mb-2">{formatEuro(projection)}</div>
            {budgetIsDefined && (
              <div className={`text-[10px] font-black uppercase tracking-wider ${projection > currentEffectiveBudget ? 'text-[var(--france-red)]' : 'text-emerald-500'}`}>
                {projection > currentEffectiveBudget ? '⚠️ Dépassement prévu' : '✅ Dans les clous'}
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                {filteredExpenses.length} opération{filteredExpenses.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ── GRAPHIQUES & FORMULAIRE ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Graphiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-card)] p-6 rounded-[32px] border border-[var(--border)] shadow-sm" style={{ height: 280 }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  📈 Évolution
                </h3>
                <div className="relative" style={{ height: 200 }}>
                  {filteredExpenses.length === 0 && <EmptyChartOverlay label="Aucune dépense" />}
                  <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="bg-[var(--bg-card)] p-6 rounded-[32px] border border-[var(--border)] shadow-sm" style={{ height: 280 }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  🍰 Répartition
                </h3>
                <div className="relative" style={{ height: 200 }}>
                  {doughnutData.isEmpty && <EmptyChartOverlay label="Aucune catégorie" />}
                  <Doughnut data={doughnutData.data} options={{
                    responsive: true, maintainAspectRatio: false, cutout: '75%',
                    plugins: { legend: { display: false }, tooltip: { enabled: !doughnutData.isEmpty } }
                  }} />
                </div>
              </div>
            </div>

            {/* ── FORMULAIRE D'AJOUT ── */}
            <div className="bg-[var(--bg-card)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
              <h3 className="text-base font-black mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--france-red)] flex items-center justify-center text-white text-xs font-black">+</span>
                Nouvelle dépense
              </h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="select-child" className="text-[10px] font-black uppercase opacity-40 px-1 tracking-wider">Enfant</label>
                  <select id="select-child" name="child"
                    className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-[var(--france-blue)] transition-colors" required>
                    <option value="">Choisir un enfant</option>
                    {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="select-category" className="text-[10px] font-black uppercase opacity-40 px-1 tracking-wider">Catégorie</label>
                  <select id="select-category" name="category"
                    className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-[var(--france-blue)] transition-colors" required>
                    {Object.keys(categoryIcons).map(cat => (
                      <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-label" className="text-[10px] font-black uppercase opacity-40 px-1 tracking-wider">Désignation</label>
                  <input id="input-label" name="label" required
                    className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-[var(--france-blue)] transition-colors"
                    placeholder="Ex : Pampers taille 3" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-amount" className="text-[10px] font-black uppercase opacity-40 px-1 tracking-wider">Montant (€)</label>
                  <input id="input-amount" name="amount" type="number" step="0.01" min="0.01" required
                    className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-[var(--france-blue)] transition-colors"
                    placeholder="0,00" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="input-date" className="text-[10px] font-black uppercase opacity-40 px-1 tracking-wider">Date</label>
                  <input id="input-date" name="date" type="date" required defaultValue={getTodayISO()}
                    className="bg-[var(--bg-input)] p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-[var(--france-blue)] transition-colors" />
                </div>
                <div className="flex items-center gap-3 px-2 pt-3">
                  <input type="checkbox" name="recurring" id="rec" className="w-5 h-5 accent-[var(--france-blue)]" />
                  <label htmlFor="rec" className="text-sm font-bold opacity-40">Récurrente 🔁</label>
                </div>
                <button type="submit" disabled={isLoading || profiles.length === 0}
                  className="md:col-span-2 bg-[var(--france-red)] text-white font-black py-5 rounded-2xl hover:brightness-110 shadow-lg transition-all active:scale-95 disabled:opacity-40 text-sm tracking-wider uppercase">
                  {isLoading
                    ? '⏳ Synchronisation...'
                    : profiles.length === 0
                      ? 'Ajoutez un enfant d\'abord'
                      : '☁️ Ajouter au cloud'}
                </button>
              </form>
            </div>
          </div>

          {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Ma Famille */}
            <div className="bg-[var(--bg-card)] p-6 rounded-[32px] border border-[var(--border)] shadow-sm">
              <h3 className="text-base font-black mb-5">👶 Ma Famille</h3>
              <div className="space-y-2 mb-5">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 bg-[var(--bg-input)] rounded-2xl group">
                    <span className="font-bold text-sm">{p.name}</span>
                    <button onClick={() => deleteProfile(p.id, p.name)}
                      className="text-[10px] opacity-0 group-hover:opacity-30 hover:!opacity-100 hover:text-red-500 font-black uppercase transition-all">
                      Retirer
                    </button>
                  </div>
                ))}
                {profiles.length === 0 && (
                  <p className="text-center text-xs py-4 font-bold" style={{ color: 'var(--text-muted)' }}>
                    Aucun enfant ajouté
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <label htmlFor="new-profile-input" className="sr-only">Prénom de l'enfant</label>
                <input id="new-profile-input"
                  className="bg-[var(--bg-input)] p-3 rounded-xl text-sm w-full outline-none border border-[var(--border)] font-bold focus:border-[var(--france-blue)] transition-colors"
                  placeholder="Prénom..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addProfile()} />
                <button onClick={addProfile} disabled={!newProfileName.trim()}
                  className="bg-[var(--france-blue)] text-white px-5 rounded-xl font-black disabled:opacity-40 transition-all hover:brightness-110"
                  aria-label="Ajouter cet enfant">
                  +
                </button>
              </div>
            </div>

            {/* Historique */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-base font-black">Historique</h3>
                <span className="text-sm font-black text-[var(--france-blue)]">{formatEuro(totalAmount)}</span>
              </div>

              <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                {reversedFilteredExpenses.map(exp => (
                  // ── CARTE DÉPENSE avec actions édition / duplication / suppression ──
                  <div key={exp.id}
                    className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] group transition-all duration-200 hover:border-[var(--france-blue)] hover:shadow-sm ${lastAddedId === exp.id ? 'highlight-new' : ''}`}>

                    {/* Ligne principale */}
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0" aria-hidden="true">
                          {categoryIcons[exp.category] || "📦"}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-sm leading-none mb-1 flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{exp.label}</span>
                            {exp.is_recurring && (
                              <span className="text-[9px] font-black opacity-40 bg-[var(--bg-input)] px-1.5 py-0.5 rounded-full flex-shrink-0">
                                🔁
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] uppercase font-black" style={{ color: 'var(--text-muted)' }}>
                            {exp.child_name} · {parseDateLocal(exp.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-sm text-[var(--france-blue)] flex-shrink-0 ml-2">
                        {formatEuro(exp.amount)}
                      </div>
                    </div>

                    {/* Actions au hover — Modifier / Dupliquer / Supprimer */}
                    <div className="overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-200 ease-out">
                      <div className="flex border-t border-[var(--border)] divide-x divide-[var(--border)]">
                        {/* NOUVEAU : Édition */}
                        <button
                          onClick={() => setEditingExpense(exp)}
                          className="flex-1 py-2.5 text-[10px] font-black uppercase opacity-30 hover:opacity-100 hover:text-[var(--france-blue)] transition-all flex items-center justify-center gap-1"
                          aria-label={`Modifier ${exp.label}`}>
                          ✏️ Modifier
                        </button>
                        {/* NOUVEAU : Duplication (rapide pour récurrentes) */}
                        <button
                          onClick={() => handleDuplicateExpense(exp)}
                          className="flex-1 py-2.5 text-[10px] font-black uppercase opacity-30 hover:opacity-100 hover:text-emerald-500 transition-all flex items-center justify-center gap-1"
                          aria-label={`Dupliquer ${exp.label}`}>
                          📋 Dupliquer
                        </button>
                        {/* Suppression */}
                        <button
                          onClick={() => deleteExpense(exp.id, exp.label)}
                          className="flex-1 py-2.5 text-[10px] font-black uppercase opacity-30 hover:opacity-100 hover:text-[var(--france-red)] transition-all flex items-center justify-center gap-1"
                          aria-label={`Supprimer ${exp.label}`}>
                          🗑 Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredExpenses.length === 0 && (
                  <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                    <div className="text-5xl mb-3 opacity-50">📭</div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-50">Aucune dépense</div>
                    <div className="text-[10px] opacity-30 mt-1 font-bold">sur cette période</div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── MODALE DE CONFIRMATION ─────────────────────────────────────────── */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* ── MODALE D'ÉDITION ──────────────────────────────────────────────── */}
      {editingExpense && (
        <EditModal
          expense={editingExpense}
          profiles={profiles}
          onSave={handleEditExpense}
          onCancel={() => setEditingExpense(null)}
        />
      )}

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl font-black text-sm text-white ${toast.type === 'error' ? 'bg-[var(--france-red)]' : 'bg-[var(--france-blue)]'}`}
          style={{ animation: 'slideToast 0.25s ease-out' }}>
          {toast.msg}
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .highlight-new { animation: pulseSuccess 2s ease-out; }
        @keyframes pulseSuccess {
          0%   { background-color: rgba(92, 124, 250, 0.18); transform: scale(1.02); }
          100% { background-color: transparent; transform: scale(1); }
        }

        @keyframes fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadein { animation: fadein 0.15s ease-out; }

        @keyframes slideup {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideup { animation: slideup 0.2s ease-out; }

        @keyframes slideToast {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}