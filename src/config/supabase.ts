import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;
export function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
    || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error('Supabase is not configured');
  return { url, key };
}
export function getSupabase() {
  if (!client) {
    const { url, key } = getSupabaseConfig();
    client = createClient(url, key);
  }
  return client;
}
