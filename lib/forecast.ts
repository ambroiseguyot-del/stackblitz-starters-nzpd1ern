export type ForecastExpense = {
  date: string; amount: number; category: string; label: string; child_name: string;
  is_recurring?: boolean; recurring_day?: number | null;
};
export type ForecastMonth = {
  key: string; label: string; regular: number; variable: number; total: number;
  low: number; high: number;
};
export const formatMoney = (value: number) => new Intl.NumberFormat('fr-FR', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
}).format(value);

export function buildForecast(expenses: ForecastExpense[], months = 12, referenceDate = new Date()): ForecastMonth[] {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const previousMonths = [-1, -2, -3].map(offset => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  });
  const recent = expenses.filter(e =>
    previousMonths.includes(e.date.slice(0, 7)) && Number.isFinite(e.amount) && e.amount > 0);
  // A recurring amount appears once each month in the model, not once per past occurrence.
  const byRule = new Map<string, ForecastExpense>();
  for (const e of [...expenses].sort((a, b) => a.date.localeCompare(b.date))) {
    if (e.amount > 0 && Number.isFinite(e.amount)) {
      const key = [e.child_name, e.category, e.label.toLowerCase().trim()].join('|');
      if (e.is_recurring) byRule.set(key, e);
      else byRule.delete(key);
    }
  }
  const regular = Array.from(byRule.values()).reduce((sum, e) => sum + e.amount, 0);
  const recurringKeys = new Set(byRule.keys());
  const variableMonths = previousMonths.map(key => recent
    .filter(e => e.date.slice(0, 7) === key
      && !recurringKeys.has([e.child_name, e.category, e.label.toLowerCase().trim()].join('|')))
    .reduce((sum, e) => sum + e.amount, 0));
  // Missing months are unknown, not zero-cost observations: use only months with recorded expenses.
  const observedMonths = previousMonths.filter(key => recent.some(e => e.date.slice(0, 7) === key)).length;
  const variable = observedMonths
    ? variableMonths.reduce((sum, amount) => sum + amount, 0) / observedMonths
    : 0;
  return Array.from({ length: months }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const total = regular + variable;
    return {
      key: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'),
      label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      regular, variable, total,
      low: Math.max(0, regular + variable * 0.8),
      high: regular + variable * 1.25,
    };
  });
}
