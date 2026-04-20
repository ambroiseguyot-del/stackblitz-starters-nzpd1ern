import { createClient } from '@supabase/supabase-js';

// Next.js App Router — les variables NEXT_PUBLIC_* sont bien exposées côté client
// mais uniquement si elles sont lues au moment du bundle (pas dynamiquement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[supabaseClient] ❌ Variables manquantes :',
    { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey }
  );
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseKey ?? '',
  {
    auth: {
      // Désactive la persistance de session pour éviter les erreurs
      // si l'utilisateur n'est pas authentifié
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);