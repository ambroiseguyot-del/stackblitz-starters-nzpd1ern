// Requires migration with ON DELETE CASCADE for all four auth.users foreign keys.
// One auth deletion triggers atomic PostgreSQL cascading deletion of owned rows.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};
function respond(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), { status, headers });
}
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !publicKey || !serviceKey) return respond({ error: 'Server configuration missing' }, 503);
  const bearer = req.headers.get('Authorization');
  if (!bearer?.startsWith('Bearer ')) return respond({ error: 'Non autorisé' }, 401);
  try {
    const userClient = createClient(url, publicKey, {
      global: { headers: { Authorization: bearer } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return respond({ error: 'Session invalide' }, 401);

    // Always delete the owner verified by Auth, never a caller-provided user ID.
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('Account deletion failed:', error.message);
      return respond({ error: 'Suppression impossible. Veuillez contacter le support.' }, 500);
    }
    return respond({ success: true }, 200);
  } catch (err) {
    console.error('Account deletion failed:', err instanceof Error ? err.message : 'unknown');
    return respond({ error: 'Échec de la suppression. Veuillez réessayer.' }, 500);
  }
});
