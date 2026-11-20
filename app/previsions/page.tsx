'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ForecastPanel from '../../components/ForecastPanel';
import { supabase } from '../../supabaseClient';
import { loadAllExpenses } from '../../lib/expenses';
import type { ForecastExpense } from '../../lib/forecast';

export default function PrevisionsPage() {
  const [expenses, setExpenses] = useState<ForecastExpense[]>([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Connectez-vous pour consulter vos prévisions.');
        const [records, pref] = await Promise.all([
          loadAllExpenses<ForecastExpense>(user.id, {
            select: 'date,amount,category,label,child_name,is_recurring,recurring_day,recurrence_id',
          }),
          supabase.from('settings').select('value').eq('user_id', user.id).eq('key', 'monthly_budget').maybeSingle(),
        ]);
        if (pref.error) throw pref.error;
        if (!active) return;
        setExpenses(records);
        setBudget(Math.max(0, Number(pref.data?.value) || 0));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Impossible de charger les prévisions.');
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <main className="bb-page-shell bb-prediction-page">
      <nav aria-label="Fil d'Ariane" className="bb-breadcrumb"><Link href="/app">Tableau de bord</Link><span>/</span><span>Prévisions</span></nav>
      <div className="bb-prediction-intro"><span className="bb-kicker">VOTRE AVENIR FINANCIER</span>
        <h1>Anticipez les prochains mois.</h1>
        <p>Une estimation transparente, construite sur vos propres dépenses. Aucun modèle opaque ni donnée inventée.</p>
      </div>
      {loading ? <p role="status">Chargement de vos prévisions…</p>
        : error ? <div role="alert" className="bb-forecast-warning">{error} <Link href="/login">Se connecter</Link></div>
        : <ForecastPanel expenses={expenses} budget={budget}/>}
      <div className="bb-prediction-foot"><Link href="/analyse">Explorer mes analyses <span>→</span></Link>
      <Link href="/app">Revenir aux dépenses <span>→</span></Link></div>
    </main>
  );
}
