import { supabase } from '../supabaseClient';

const PAGE_SIZE = 500;
const MAX_ROWS = 100000;
type Options = { select?: string; ascending?: boolean; fromDate?: string; beforeDate?: string };

export async function loadAllExpenses<T>(userId: string, options: Options = {}): Promise<T[]> {
  if (!userId) throw new Error('Utilisateur non authentifié.');
  const all: T[] = [];
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    let query = supabase.from('expenses')
      .select(options.select ?? '*')
      .eq('user_id', userId)
      .order('date', { ascending: options.ascending ?? false })
      .order('id', { ascending: true });
    if (options.fromDate) query = query.gte('date', options.fromDate);
    if (options.beforeDate) query = query.lt('date', options.beforeDate);
    const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as T[];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) return all;
  }
  throw new Error('Le volume de données dépasse 100 000 dépenses. Contactez le support.');
}
