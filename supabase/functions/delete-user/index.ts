// Replacement for the existing delete-user Edge Function.
// Delete the account only after all child data deletions succeeded.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json; charset=utf-8',
};
function response(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers });
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);

  const url = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !publicKey || !serviceKey) return response({ error: 'Server configuration missing' }, 503);

  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return response({ error: 'Non autorisé' }, 401);

  try {
    const userClient = createClient(url, publicKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (!user || authError) return response({ error: 'Session invalide' }, 401);

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    // Explicitly handle errors. Never delete the account leaving private rows behind.
    for (const table of ['expenses', 'profiles', 'settings', 'categories'] as const) {
      const { error } = await admin.from(table).delete().eq('user_id', user.id);
      if (error) {
        console.error('Account deletion failed for a table:', table, error.code);
        return response({ error: 'Suppression incomplète. Contactez le support.' }, 500);
      }
    }
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('Account deletion failed at auth:', error.message);
      return response({ error: 'Suppression incomplète. Contactez le support.' }, 500);
    }
    return response({ success: true }, 200);
  } catch (error) {
    console.error('Account deletion failed:', error instanceof Error ? error.message : 'unknown');
    return response({ error: 'Échec de la suppression. Veuillez réessayer.' }, 500);
  }
});
