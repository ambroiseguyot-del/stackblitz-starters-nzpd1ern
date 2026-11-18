'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarClock, Check, PauseCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { formatMoney } from '../../lib/forecast';

type Entry = {
  id: string; user_id: string; child_name: string; category: string;
  label: string; amount: number; date: string; is_recurring: boolean;
  recurring_day: number | null;
};
type Rule = { key: string; latest: Entry; exists: boolean; amount: number; dueDate: string };
const monthKey = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0')].join('-');
const safeKey = (e: Entry) => JSON.stringify([e.child_name, e.category, e.label.trim().toLocaleLowerCase('fr-FR')]);
const cleanDay = (value: number | null, date: string) =>
  Math.max(1, Math.min(28, value || Number(date.slice(-2)) || 1));

export default function RecurrencesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [amountOverrides, setAmountOverrides] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) throw new Error('Votre connexion a expiré.');
      const { data, error: queryError } = await supabase.from('expenses')
        .select('id,user_id,child_name,category,label,amount,date,is_recurring,recurring_day')
        .eq('user_id', user.id).order('date', { ascending: false });
      if (queryError) throw queryError;
      setEntries((data ?? []) as Entry[]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Chargement impossible.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const rules = useMemo<Rule[]>(() => {
    const latestByKey = new Map<string, Entry>();
    const selected = monthKey(selectedDate);
    for (const e of [...entries].sort((a, b) =>
      (b.date || '').localeCompare(a.date || ''))) {
      const key = safeKey(e);
      if (!latestByKey.has(key)) latestByKey.set(key, e);
    }
    return Array.from(latestByKey.entries()).filter(([, e]) => e.is_recurring).map(([key, e]) => {
      const exists = entries.some(other =>
        safeKey(other) === key && other.date.slice(0, 7) === selected);
      const day = cleanDay(e.recurring_day, e.date);
      return {
        key, latest: e, exists, amount: Number(e.amount),
        dueDate: selected + '-' + String(day).padStart(2, '0'),
      };
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [entries, selectedDate]);

  const pending = rules.filter(r => !r.exists);
  const total = pending.reduce((sum, r) => {
    const value = Number(amountOverrides[r.key] ?? r.amount);
    return sum + (Number.isFinite(value) && value > 0 ? value : 0);
  }, 0);

  async function register(rule: Rule) {
    setBusy(rule.key); setError(''); setNotice('');
    try {
      const confirmedAmount = Number(amountOverrides[rule.key] ?? rule.amount);
      if (!Number.isFinite(confirmedAmount) || confirmedAmount <= 0 || confirmedAmount > 1000000) {
        throw new Error('Saisissez un montant strictement positif et inférieur à 1 000 000 €.');
      }
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) throw new Error('Votre connexion a expiré.');
      const dateStart = monthKey(selectedDate) + '-01';
      const dateEnd = monthKey(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)) + '-01';
      const existing = await supabase.from('expenses').select('id')
        .eq('user_id', user.id)
        .eq('child_name', rule.latest.child_name)
        .eq('category', rule.latest.category)
        .eq('label', rule.latest.label)
        .gte('date', dateStart).lt('date', dateEnd).limit(1);
      if (existing.error) throw existing.error;
      if (existing.data?.length) {
        setNotice('Cette dépense est déjà enregistrée sur le mois sélectionné.');
        await load();
        return;
      }
      const result = await supabase.from('expenses').insert([{
        user_id: user.id,
        child_name: rule.latest.child_name,
        category: rule.latest.category,
        label: rule.latest.label,
        amount: Math.round(confirmedAmount * 100) / 100,
        date: rule.dueDate,
        is_recurring: true,
        recurring_day: cleanDay(rule.latest.recurring_day, rule.latest.date),
      }]);
      if (result.error) throw result.error;
      setNotice('Échéance enregistrée. Le montant a été repris de la dernière dépense.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Enregistrement impossible.');
    } finally { setBusy(''); }
  }

  async function stop(rule: Rule) {
    setBusy(rule.key); setNotice(''); setError('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) throw new Error('Votre connexion a expiré.');
      const { error: updateError } = await supabase.from('expenses')
        .update({ is_recurring: false, recurring_day: null })
        .eq('id', rule.latest.id).eq('user_id', user.id);
      if (updateError) throw updateError;
      setNotice('Récurrence désactivée. Les dépenses déjà enregistrées sont conservées.');
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Impossible de désactiver cette récurrence.'); }
    finally { setBusy(''); }
  }
  function changeMonth(offset: number) {
    setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() + offset, 1));
    setNotice('');
  }
  return (
    <main className="bb-page-shell bb-recurrences-page">
      <nav className="bb-breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/app">Tableau de bord</Link><span>/</span><span>Récurrences</span>
      </nav>
      <div className="bb-prediction-intro">
        <span className="bb-kicker">UNE FAMILLE BIEN ORGANISÉE</span>
        <h1>Les dépenses qui reviennent.</h1>
        <p>Retrouvez vos habitudes mensuelles et vérifiez les échéances déjà enregistrées avant d'en confirmer une manquante. Un traitement automatique peut également être actif côté serveur.</p>
      </div>
      <section className="bb-recurring-shell">
        <div className="bb-recurring-header">
          <div><span className="bb-kicker">ÉCHÉANCES DU MOIS</span><h2>{selectedDate.toLocaleDateString('fr-FR', {month:'long',year:'numeric'})}</h2></div>
          <div className="bb-recurring-switcher">
            <button onClick={() => changeMonth(-1)} aria-label="Mois précédent"><ArrowLeft size={19}/></button>
            <button onClick={() => changeMonth(1)} aria-label="Mois suivant"><ArrowRight size={19}/></button>
          </div>
        </div>
        {loading ? <p role="status">Chargement des échéances…</p> :
          error ? <p role="alert" className="bb-forecast-warning">{error}</p> :
          <div className="bb-recurring-content">
            <div className="bb-recurring-summary">
              <div><small>En attente de confirmation</small><strong>{formatMoney(total)}</strong></div>
              <div><small>Dépenses identifiées</small><strong>{rules.length}</strong></div>
              <div><small>Déjà enregistrées</small><strong>{rules.length - pending.length}</strong></div>
            </div>
            {notice && <p role="status" className="bb-recurring-notice"><Check size={15}/>{notice}</p>}
            {rules.length === 0 ? <div className="bb-forecast-empty">
              <CalendarClock size={30}/>
              <strong>Aucune dépense récurrente identifiée.</strong>
              <p>Lors de l'ajout d'une dépense, cochez « Dépense à renouveler » pour la retrouver ici.</p>
              <Link href="/app">Ajouter une dépense <ArrowRight size={15}/></Link>
            </div> :
              <div className="bb-recurring-list">
                {rules.map((rule, index) => (
                  <article className="bb-recurring-row" key={rule.key}>
                    <div className="bb-recurring-icon"><RefreshCw size={20}/></div>
                    <div className="bb-recurring-details">
                      <strong>{rule.latest.label}</strong>
                      <span>{rule.latest.child_name} · {rule.latest.category} · le {rule.dueDate.slice(-2)} du mois</span>
                    </div>
                    <div className="bb-recurring-amount">
                      {rule.exists ? <strong>{formatMoney(rule.amount)}</strong> : <>
                        <label htmlFor={'rec-amount-' + index}>Montant €</label>
                        <input id={'rec-amount-' + index} type="number" step="0.01" min="0.01" max="1000000"
                          value={amountOverrides[rule.key] ?? String(rule.amount)}
                          onChange={event => setAmountOverrides(prev => ({ ...prev, [rule.key]: event.target.value }))}
                          disabled={Boolean(busy)} />
                      </>}
                    </div>
                    <div className="bb-recurring-actions">
                      {rule.exists ? <span className="bb-recurring-done"><Check size={16}/> Enregistrée</span> :
                        <button type="button" onClick={() => void register(rule)} disabled={Boolean(busy)}>
                          {busy === rule.key ? 'Enregistrement…' : 'Confirmer'}
                        </button>}
                      <button type="button" className="bb-recurring-stop" onClick={() => void stop(rule)} disabled={Boolean(busy)}
                        aria-label={'Arrêter la récurrence ' + rule.latest.label}><PauseCircle size={18}/></button>
                    </div>
                  </article>
                ))}
              </div>}
          </div>}
        <div className="bb-recurring-foot"><p>Le montant d'une échéance peut varier. Vérifiez-le avant confirmation, puis modifiez la dépense depuis votre historique si nécessaire.</p></div>
      </section>
      <div className="bb-prediction-foot"><Link href="/previsions">Voir mes prévisions →</Link><Link href="/app">Retour au tableau de bord →</Link></div>
    </main>
  );
}
