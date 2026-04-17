'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

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

const categoryIcons: { [key: string]: string } = {
  "Couches": "🧷", "Lait": "🍼", "Santé": "🩺", "Soins": "🧼", "Vêtements": "👕", "Autre": "📦"
};

const categoryColors = ['#002395', '#ED2939', '#5C7CFA', '#FF6B6B', '#F1F5F9', '#2D364D'];

const formatEuro = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const getTodayISO = () => new Date().toISOString().split('T')[0];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut', delay }
  })
};

export default function UltimateBabyBudget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
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
      const [{ data: exp, error: errExp }, { data: prof, error: errProf }] = await Promise.all([
        supabase.from('expenses').select('*').order('date', { ascending: true }),
        supabase.from('profiles').select('*').order('name', { ascending: true }),
      ]);
      if (errExp || errProf) throw new Error("Erreur de synchronisation");
      setExpenses((exp as Expense[]) || []);
      setProfiles((prof as Profile[]) || []);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

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

  const daysInMonth = useMemo(() =>
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
    [currentDate]);

  const avgPerDay = useMemo(() =>
    totalAmount / daysInMonth, [totalAmount, daysInMonth]);

  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    filteredExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [filteredExpenses]);

  const dailyTotals = useMemo(() => {
    const map: Record<number, number> = {};
    filteredExpenses.forEach(e => {
      const day = new Date(e.date).getDate();
      map[day] = (map[day] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([day, amount]) => ({ day: Number(day), amount }))
      .sort((a, b) => a.day - b.day);
  }, [filteredExpenses]);

  const donutData = useMemo(() => ({
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: categoryColors,
      borderWidth: 0,
      hoverOffset: 15
    }]
  }), [categoryTotals]);

  const lineData = useMemo(() => ({
    labels: dailyTotals.map(d => d.day),
    datasets: [{
      label: 'Dépenses (€)',
      data: dailyTotals.map(d => d.amount),
      fill: true,
      borderColor: isDark ? '#5C7CFA' : '#002395',
      backgroundColor: isDark ? 'rgba(92, 124, 250, 0.1)' : 'rgba(0, 35, 149, 0.05)',
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointHitRadius: 30,
    }]
  }), [dailyTotals, isDark]);

  const lineOptions = useMemo(() => ({
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
      y: {
        ticks: { color: isDark ? '#94A3B8' : '#64748B' },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
      },
      x: {
        ticks: { color: isDark ? '#94A3B8' : '#64748B' },
        grid: { display: false }
      }
    }
  }), [isDark]);

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
        amount,
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
      const dateInput = form.querySelector<HTMLInputElement>('input[name="date"]');
      if (dateInput) dateInput.value = getTodayISO();

      fetchData();
      showToast("Dépense synchronisée !");
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setPendingDeleteId(null);
      fetchData();
      showToast("Dépense supprimée");
    } catch (err: any) {
      showToast(err.message, 'error');
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
      showToast(err.message, 'error');
    }
  };

  const theme = isDark ? 'dark' : 'light';

  return (
    <div
      data-theme={theme}
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B0E14] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}
      style={{
        '--france-blue': isDark ? '#5C7CFA' : '#002395',
        '--france-red': isDark ? '#FF6B6B' : '#ED2939',
        '--bg-card': isDark ? '#161B26' : '#FFFFFF',
        '--bg-input': isDark ? '#1F2633' : '#F1F5F9',
        '--border': isDark ? '#2D364D' : '#E2E8F0',
        '--text-muted': isDark ? '#94A3B8' : '#64748B',
      } as React.CSSProperties}
    >
      <style jsx global>{`
        .highlight-new { animation: pulseSuccess 2s ease-out; }
        @keyframes pulseSuccess {
          0% { background-color: rgba(92, 124, 250, 0.2); transform: scale(1.02); }
          100% { background-color: transparent; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-8 left-1/2 z-[2000] px-8 py-4 rounded-2xl shadow-2xl font-bold ${toast.type === 'error' ? 'bg-red-500' : 'bg-[var(--france-blue)]'} text-white`}
            style={{ translateX: '-50%' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-20 bg-[var(--bg-card)] border-b-2 border-[var(--france-blue)] flex items-center sticky top-0 z-50"
      >
        <div className="container mx-auto px-5 flex justify-between items-center w-full">
          <h1 className="text-2xl font-semibold italic">BabyBudget <span className="text-[var(--france-red)]">Executive</span></h1>
          <motion.button
            onClick={() => setIsDark(!isDark)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ duration: 0.15 }}
            className="p-3 border border-[var(--border)] rounded-2xl bg-[var(--bg-input)] shadow-sm"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </motion.button>
        </div>
      </motion.header>

      <main className="container mx-auto px-5 py-8">

        {/* NAV MOIS + RECHERCHE */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.05}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <div className="flex items-center gap-4 bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--border)] shadow-lg">
            <motion.button
              onClick={goToPrevMonth}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="p-2 hover:bg-[var(--bg-input)] rounded-full transition-colors"
            >❮</motion.button>
            <span className="flex-1 text-center font-black uppercase tracking-tighter">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <motion.button
              onClick={goToNextMonth}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="p-2 hover:bg-[var(--bg-input)] rounded-full transition-colors"
            >❯</motion.button>
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
        </motion.div>

        {/* FILTRE PAR ENFANT */}
        {profiles.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="flex gap-2 overflow-x-auto mb-6 pb-1 scrollbar-hide"
          >
            {['all', ...profiles.map(p => p.name)].map((name, i) => (
              <motion.button
                key={name}
                onClick={() => setFilterChild(name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filterChild === name ? 'bg-[var(--france-blue)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border)]'}`}
              >
                {name === 'all' ? 'Tous les enfants' : name}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total du mois', value: formatEuro(totalAmount), color: 'var(--france-blue)', delay: 0.12 },
            { label: 'Dépenses', value: filteredExpenses.length, color: undefined, delay: 0.18 },
            { label: 'Moy. / jour', value: formatEuro(avgPerDay), color: 'var(--france-red)', delay: 0.24 },
          ].map(({ label, value, color, delay }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={delay}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm"
            >
              <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-black" style={color ? { color } : undefined}>{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* GRAPHIQUES */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg mb-6 tracking-tight opacity-70">📈 Évolution du mois</h3>
                <div style={{ height: '220px' }}>
                  <Line data={lineData} options={lineOptions} />
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg mb-6 tracking-tight opacity-70">🍰 Répartition</h3>
                <div style={{ height: '220px' }}>
                  <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                </div>
              </motion.div>
            </motion.div>

            {/* FORMULAIRE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
              className="bg-[var(--bg-card)] p-10 rounded-[40px] border border-[var(--border)] shadow-2xl"
            >
              <h3 className="text-xl mb-8 flex items-center gap-3">✨ Nouvelle Entrée</h3>
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select name="child" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors">
                  {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select name="category" className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors">
                  {Object.keys(categoryIcons).map(cat => (
                    <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
                  ))}
                </select>
                <input name="label" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" placeholder="Désignation" />
                <input name="amount" type="number" step="0.01" required className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" placeholder="Montant (€)" />
                <input name="date" type="date" required defaultValue={getTodayISO()} className="bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border)] outline-none focus:border-[var(--france-blue)] transition-colors" />
                <div className="flex items-center gap-3 px-2">
                  <input type="checkbox" name="recurring" id="rec" className="w-5 h-5 accent-[var(--france-blue)] cursor-pointer" />
                  <label htmlFor="rec" className="text-sm font-bold opacity-50 cursor-pointer">Dépense récurrente</label>
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading || profiles.length === 0}
                  whileHover={isLoading || profiles.length === 0 ? {} : { scale: 1.02 }}
                  whileTap={isLoading || profiles.length === 0 ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={`md:col-span-2 text-white font-black py-5 rounded-2xl shadow-xl transition-all ${isLoading || profiles.length === 0 ? 'bg-gray-400 grayscale' : 'bg-[var(--france-red)] hover:brightness-110'}`}
                >
                  {isLoading ? 'SYNCHRONISATION...' : profiles.length === 0 ? "AJOUTEZ UN ENFANT D'ABORD" : 'AJOUTER AU CLOUD'}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">

            {/* FAMILLE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="bg-[var(--bg-card)] p-8 rounded-[32px] border border-[var(--border)] shadow-lg"
            >
              <h3 className="text-xl mb-6">👶 Ma Famille</h3>
              <div className="space-y-3 mb-6">
                {profiles.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-[var(--border)] rounded-2xl text-center">
                    <p className="text-xs font-bold opacity-40">Aucun enfant enregistré</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {profiles.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className="flex justify-between items-center p-4 bg-[var(--bg-input)] rounded-2xl border border-transparent hover:border-[var(--france-blue)] transition-all font-bold"
                      >
                        {p.name}
                        <span className="text-[9px] bg-[var(--france-blue)] text-white px-2 py-1 rounded-full uppercase tracking-widest">Actif</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                <motion.button
                  onClick={addProfile}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="bg-[var(--france-blue)] text-white px-5 rounded-xl font-bold hover:brightness-110"
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* HISTORIQUE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="space-y-4"
            >
              <h3 className="text-lg px-2 flex justify-between items-center">
                Historique
                <span className="text-xs bg-[var(--bg-input)] px-2 py-1 rounded-lg opacity-50">{filteredExpenses.length}</span>
              </h3>

              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                {filteredExpenses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="bg-[var(--bg-card)] p-12 rounded-[32px] border border-[var(--border)] text-center opacity-40"
                  >
                    <div className="text-4xl mb-4">💤</div>
                    <p className="text-xs font-black uppercase">Aucune dépense trouvée</p>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {filteredExpenses.slice().reverse().map((exp, i) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                        className={`flex justify-between items-center p-5 bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] shadow-sm hover:border-[var(--france-blue)] transition-colors group ${lastAddedId === exp.id ? 'highlight-new' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
                            className="text-2xl bg-[var(--bg-input)] w-12 h-12 flex items-center justify-center rounded-xl shadow-inner"
                          >
                            {categoryIcons[exp.category] || "📦"}
                          </motion.div>
                          <div>
                            <div className="font-bold text-sm leading-tight">{exp.label}</div>
                            <div className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">
                              {exp.child_name} • {new Date(exp.date).getDate()} {currentDate.toLocaleDateString('fr-FR', { month: 'short' })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="font-bold text-[var(--france-blue)]">{formatEuro(exp.amount)}</div>

                          <AnimatePresence mode="wait">
                            {pendingDeleteId === exp.id ? (
                              <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.15 }}
                                className="flex gap-1"
                              >
                                <motion.button
                                  onClick={() => deleteExpense(exp.id)}
                                  whileTap={{ scale: 0.92 }}
                                  className="text-[10px] text-white bg-[var(--france-red)] px-2 py-1 rounded-lg font-bold"
                                >
                                  Oui
                                </motion.button>
                                <motion.button
                                  onClick={() => setPendingDeleteId(null)}
                                  whileTap={{ scale: 0.92 }}
                                  className="text-[10px] px-2 py-1 rounded-lg border border-[var(--border)] font-bold"
                                >
                                  Non
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.button
                                key="delete"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="group-hover:opacity-100 opacity-0 text-[var(--france-red)] font-bold transition-all p-2 hover:bg-red-500/10 rounded-lg"
                                onClick={() => setPendingDeleteId(exp.id)}
                              >
                                ✕
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}