import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[BaFitD] Missing Supabase environment variables. Check your .env file.');
  console.error('[BaFitD] Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default supabase;
