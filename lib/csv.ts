export type CsvExpense = {
  date: string; child_name: string; category: string; label: string;
  amount: number; is_recurring: boolean;
};
export function escapeCsvCell(value: unknown): string {
  const raw = String(value ?? '');
  const safe = /^[\u0000-\u0020]*[=+\-@]/.test(raw) ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export function formatExpenseCSV(expenses: CsvExpense[]): string {
  const columns = ['Date', 'Enfant', 'Catégorie', 'Désignation', 'Montant (€)', 'Récurrente'];
  const rows = expenses.map(e => [
    e.date, e.child_name, e.category, e.label,
    Number(e.amount).toFixed(2).replace('.', ','),
    e.is_recurring ? 'Oui' : 'Non',
  ].map(escapeCsvCell).join(';'));
  return [columns.map(escapeCsvCell).join(';'), ...rows].join('\r\n');
}
