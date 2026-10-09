import { getSupabase, getSupabaseConfig } from '../../../config/supabase';
import { getPostAuthDestination } from '../authRedirect';

export async function signInWithGoogle(destination = '/dashboard') {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: key }, signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error('Unable to load authentication settings');
  const settings = await response.json();
  if (settings.external?.google !== true) throw new Error('Google provider is not enabled');
  const path = getPostAuthDestination({ from: destination });
  const redirect = new URL('/auth/callback', window.location.origin);
  redirect.searchParams.set('next', path);
  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google', options: { redirectTo: redirect.href },
  });
  if (error) throw error;
}

export function googleSignInError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (/provider.*(disabled|not enabled)|unsupported provider/i.test(message)) {
    return 'ยังไม่ได้เปิดใช้งาน Google login กรุณาติดต่อผู้ดูแลระบบ';
  }
  if (/Supabase is not configured/.test(message)) return 'ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase';
  return 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง';
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
