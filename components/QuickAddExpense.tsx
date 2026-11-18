'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Clock3, Plus, X } from 'lucide-react';

type Category = { name: string; icon: string };
type Previous = { label: string; category: string; amount: number; child_name: string };
export type QuickExpensePayload = {
  child_name: string; category: string; label: string;
  amount: number; date: string; is_recurring: boolean; recurring_day: number | null;
};
type Props = {
  open: boolean; onClose: () => void; onSaved: (expense: QuickExpensePayload) => Promise<void>;
  profiles: { id: string; name: string }[];
  categories: Category[];
  recent: Previous[];
};
const todayLocal = () => {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};

export default function QuickAddExpense({ open, onClose, onSaved, profiles, categories, recent }: Props) {
  const formId = useId();
  const amountRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('');
  const [child, setChild] = useState('');
  const [date, setDate] = useState(todayLocal);
  const [recurring, setRecurring] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    return [...recent].reverse().filter(item => {
      const key = item.label.trim().toLocaleLowerCase('fr-FR');
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
  }, [recent]);

  useEffect(() => {
    if (!open) return;
    setError('');
    setDate(todayLocal());
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focus = window.setTimeout(() => amountRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(focus);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const available = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]'
      ));
      if (!available.length) return;
      const first = available[0], last = available[available.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, busy]);

  if (!open) return null;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0 || value > 1000000) { setError('Saisissez un montant valide.'); return; }
    if (!label.trim() || label.trim().length > 120 || !child || !category || !date) {
      setError('Complétez la désignation, l’enfant, la catégorie et la date.'); return;
    }
    setBusy(true); setError('');
    try {
      await onSaved({
        child_name: child, category, label: label.trim(), amount: Math.round(value * 100) / 100, date,
        is_recurring: recurring, recurring_day: recurring ? Math.min(28, Math.max(1, Number(date.slice(-2)))) : null,
      });
      setAmount(''); setLabel(''); setRecurring(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’enregistrer la dépense.');
    } finally { setBusy(false); }
  }

  return (
    <div className="bb-quick-overlay" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <section ref={dialogRef} className="bb-quick-dialog" role="dialog" aria-modal="true" aria-labelledby={formId + '-title'}>
        <div className="bb-quick-header">
          <div><span className="bb-kicker">SAISIE EXPRESS</span>
            <h2 id={formId + '-title'}>Ajouter une dépense</h2>
            <p>Quelques secondes suffisent.</p>
          </div>
          <button type="button" className="bb-quick-dismiss" onClick={onClose} disabled={busy} aria-label="Fermer la saisie rapide"><X size={22}/></button>
        </div>
        {suggestions.length > 0 && (
          <div className="bb-quick-suggestions" aria-label="Dépenses récemment utilisées">
            <span><Clock3 size={14}/> Reprendre un achat</span>
            <div>
              {suggestions.map((item, index) => (
                <button type="button" key={item.label + index} onClick={() => {
                  setLabel(item.label); setAmount(String(item.amount));
                  setCategory(item.category); setChild(item.child_name);
                }}>{item.label}</button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={save} className="bb-quick-form">
          <label className="bb-quick-amount-label" htmlFor={formId + '-amount'}>Montant de l'achat</label>
          <div className="bb-quick-amount">
            <input ref={amountRef} id={formId + '-amount'} name="amount" inputMode="decimal" placeholder="0,00"
              value={amount} onChange={event => setAmount(event.target.value)} required autoComplete="off"/>
            <span>€</span>
          </div>
          <label htmlFor={formId + '-label'}>Désignation</label>
          <input id={formId + '-label'} placeholder="Ex. Couches, vêtements, garde…" maxLength={120}
            value={label} onChange={event => setLabel(event.target.value)} required/>
          <div className="bb-quick-fields">
            <div><label htmlFor={formId + '-child'}>Enfant</label>
              <select id={formId + '-child'} value={child} onChange={event => setChild(event.target.value)} required>
                <option value="">Choisir</option>
                {profiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div><label htmlFor={formId + '-category'}>Catégorie</label>
              <select id={formId + '-category'} value={category} onChange={event => setCategory(event.target.value)} required>
                <option value="">Choisir</option>
                {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <label htmlFor={formId + '-date'}>Date de la dépense</label>
          <input id={formId + '-date'} type="date" value={date} onChange={event => setDate(event.target.value)} required/>
          <label className="bb-quick-check" htmlFor={formId + '-recurring'}>
            <input id={formId + '-recurring'} type="checkbox" checked={recurring} onChange={event => setRecurring(event.target.checked)}/>
            <span>À prévoir chaque mois <small>(confirmation manuelle, sans duplication automatique)</small></span>
          </label>
          {error && <p className="bb-quick-error" role="alert">{error}</p>}
          <button className="bb-quick-submit" type="submit" disabled={busy || profiles.length === 0}>
            {busy ? 'Enregistrement…' : <><Check size={18}/> Enregistrer la dépense</>}
          </button>
          {profiles.length === 0 && <p className="bb-quick-note">Ajoutez d'abord un profil enfant depuis le tableau de bord.</p>}
        </form>
      </section>
    </div>
  );
}
