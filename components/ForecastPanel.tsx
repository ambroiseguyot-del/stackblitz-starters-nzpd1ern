'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarRange, Info, TrendingUp } from 'lucide-react';
import { buildForecast, formatMoney, type ForecastExpense } from '../lib/forecast';

export default function ForecastPanel({ expenses, budget, compact = false }: {
  expenses: ForecastExpense[]; budget?: number; compact?: boolean;
}) {
  const [duration, setDuration] = useState<6 | 12 | 24>(12);
  const result = useMemo(() => buildForecast(expenses, duration), [expenses, duration]);
  const max = Math.max(1, ...result.map(m => m.high));
  const known = expenses.length > 0;
  const yearly = result.slice(0, 12).reduce((sum, month) => sum + month.total, 0);
  return (
    <section className="bb-forecast" aria-label="Prévision des dépenses">
      <div className="bb-forecast-heading">
        <div>
          <span className="bb-kicker"><CalendarRange size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/> ANTICIPER</span>
          <h2>Vos dépenses à venir</h2>
          <p>Estimation construite à partir de vos dépenses enregistrées et modèles récurrents.</p>
        </div>
        {!compact && <div className="bb-forecast-period" role="group" aria-label="Horizon de prévision">
          {([6, 12, 24] as const).map(n => <button type="button" key={n}
            className={duration === n ? 'is-active' : ''} aria-pressed={duration === n}
            onClick={() => setDuration(n)}>{n} mois</button>)}
        </div>}
      </div>
      {!known ? (
        <div className="bb-forecast-empty">
          <TrendingUp size={26}/>
          <strong>Votre prévision prendra forme avec vos premières dépenses.</strong>
          <p>Nous évitons d'inventer des montants lorsque l'historique est vide.</p>
          <Link href="/app#nouvelle-depense">Enregistrer une dépense <ArrowRight size={15}/></Link>
        </div>
      ) : <>
        <div className="bb-forecast-metrics">
          <div><span>Coût mensuel estimé</span><strong>{formatMoney(result[0]?.total || 0)}</strong></div>
          <div><span>Prévision sur 12 mois</span><strong>{formatMoney(yearly)}</strong></div>
          <div><span>Récurrences identifiées</span><strong>{formatMoney(result[0]?.regular || 0)}/mois</strong></div>
        </div>
        <div className="bb-forecast-chart" role="img" aria-label="Histogramme des dépenses mensuelles prévisionnelles avec fourchette basse et haute">
          {result.map(month => (
            <div className="bb-forecast-column" key={month.key}
              title={month.label + ' : ' + formatMoney(month.total) + ' (de ' + formatMoney(month.low) + ' à ' + formatMoney(month.high) + ')'}>
              <div className="bb-forecast-track">
                <div className="bb-forecast-range" style={{ height: ((month.high / max) * 100) + '%' }}/>
                <div className="bb-forecast-bar" style={{ height: ((month.total / max) * 100) + '%' }}/>
              </div>
              <small>{month.label}</small>
            </div>
          ))}
        </div>
        <p className="bb-forecast-caution"><Info size={15}/>
          Scénarios illustratifs : variable ±20 à 25 %, récurrences inchangées. Les dépenses exceptionnelles,
          nouveaux frais de garde, inflation, aides ou changements d'âge ne sont pas anticipés automatiquement.
        </p>
        {budget && budget > 0 && result[0].total > budget && (
          <p className="bb-forecast-warning" role="status">La projection mensuelle dépasse votre objectif de {formatMoney(budget)}.</p>
        )}
      </>}
      {compact && <Link href="/previsions" className="bb-forecast-more">Explorer la prévision sur 24 mois <ArrowRight size={16}/></Link>}
    </section>
  );
}
