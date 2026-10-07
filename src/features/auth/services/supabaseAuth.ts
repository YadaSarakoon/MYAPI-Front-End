import { getSupabase } from '../../../config/supabase';
import { getPostAuthDestination } from '../authRedirect';

export async function signInWithGoogle(destination = '/dashboard') {
  const path = getPostAuthDestination({ from: destination });
  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: new URL(path, window.location.origin).href },
  });
  if (error) throw error;
}
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function signUpWithEmail(name: string, email: string, password: string) {
  const { data, error } = await getSupabase().auth.signUp({
    email, password, options: { data: { full_name: name }, emailRedirectTo: new URL('/dashboard', window.location.origin).href },
  });
  if (error) throw error;
  return data;
}
