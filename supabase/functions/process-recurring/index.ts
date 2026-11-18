// Replacement for the existing process-recurring Edge Function.
// DO NOT deploy until the existing Cron authorization is confirmed and tested.
// This endpoint deliberately refuses user JWTs: only the scheduled service-role request can call it.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const json = (payload: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
type Expense = {
  id: string; user_id: string; child_name: string; label: string; category: string;
  date: string; amount: number; recurring_day: number | null; is_recurring: boolean;
};
const keyOf = (e: Expense) => JSON.stringify([e.user_id, e.child_name, e.category, e.label]);

Deno.serve(async request => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const url = Deno.env.get('SUPABASE_URL');
  if (!serviceKey || !url) return json({ error: 'Missing server configuration' }, 503);

  // Supabase's public anon key and any user's access JWT must never trigger a service-role batch.
  const authorization = request.headers.get('authorization');
  if (authorization !== 'Bearer ' + serviceKey) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const today = new Date().toISOString().slice(0, 10); // Cron runs at 00:00 UTC.
  const yearMonth = today.slice(0, 7);
  const day = Number(today.slice(8, 10));
  const monthStart = yearMonth + '-01';
  const next = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)), 1))
    .toISOString().slice(0, 10);
  let processed = 0, created = 0, skipped = 0, failed = 0;
  const seen = new Set<string>();
  const candidates: Expense[] = [];

  try {
    // PostgREST pages at a safe limit. Daily runs only need occurrences due today.
    for (let offset = 0; offset < 10000; offset += 500) {
      const { data, error } = await supabase.from('expenses')
        .select('id,user_id,child_name,label,category,date,amount,recurring_day,is_recurring')
        .eq('is_recurring', true).eq('recurring_day', day)
        .order('date', { ascending: false }).range(offset, offset + 499);
      if (error) throw error;
      const batch = (data ?? []) as Expense[];
      candidates.push(...batch);
      if (batch.length < 500) break;
      if (offset >= 9500) throw new Error('Too many recurring candidates for one day.');
    }

    for (const candidate of candidates) {
      if (!candidate.user_id || !candidate.label || !Number.isFinite(Number(candidate.amount))) {
        skipped++; continue;
      }
      const group = keyOf(candidate);
      if (seen.has(group)) continue;
      seen.add(group);
      processed++;

      try {
        // Read the latest transaction, including entries whose recurrence was stopped.
        const latest = await supabase.from('expenses')
          .select('id,date,is_recurring,recurring_day,amount,child_name,category,label,user_id')
          .eq('user_id', candidate.user_id)
          .eq('child_name', candidate.child_name)
          .eq('category', candidate.category)
          .eq('label', candidate.label)
          .order('date', { ascending: false })
          .order('id', { ascending: false })
          .limit(1).maybeSingle();
        if (latest.error) throw latest.error;
        const template = latest.data as Expense | null;
        if (!template || !template.is_recurring || template.recurring_day !== day) {
          skipped++; continue;
        }
        // Include original entries in the check. Never create a second expense in the same month.
        const existing = await supabase.from('expenses').select('id')
          .eq('user_id', template.user_id)
          .eq('child_name', template.child_name)
          .eq('category', template.category)
          .eq('label', template.label)
          .gte('date', monthStart).lt('date', next).limit(1);
        if (existing.error) throw existing.error;
        if (existing.data?.length) { skipped++; continue; }

        const inserted = await supabase.from('expenses').insert({
          user_id: template.user_id, child_name: template.child_name,
          label: template.label, category: template.category,
          amount: template.amount, date: today,
          is_recurring: true, recurring_day: day,
        });
        if (inserted.error) throw inserted.error;
        created++;
      } catch (error) {
        // No personal financial data in platform logs.
        console.error('Failed to process one recurrence:', error instanceof Error ? error.message : 'unknown');
        failed++;
      }
    }
    return json({ success: failed === 0, day: today, processed, created, skipped, failed }, failed ? 500 : 200);
  } catch (error) {
    console.error('Recurring job failed:', error instanceof Error ? error.message : 'unknown');
    return json({ error: 'Recurring job failed', day: today, processed, created, skipped, failed }, 500);
  }
});
