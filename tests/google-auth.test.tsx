import { afterEach, expect, test, vi } from 'vitest';
import { signInWithGoogle } from '../src/features/auth/services/supabaseAuth';
import { getSupabase } from '../src/config/supabase';

vi.mock('../src/config/supabase', () => ({
  getSupabaseConfig: () => ({ url: 'https://project.supabase.co', key: 'public-key' }),
  getSupabase: () => ({ auth: { signInWithOAuth: oauth } }),
}));
const oauth = vi.fn().mockResolvedValue({ error: null });
afterEach(() => vi.unstubAllGlobals());
test('disabled Google provider stays on the app with a useful error instead of redirecting to an error page', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ external: { google: false } }) }));
  await expect(signInWithGoogle('/billing')).rejects.toThrow(/provider.*not enabled/i);
  expect(getSupabase().auth.signInWithOAuth).not.toHaveBeenCalled();
});
test('Google returns to the callback with a safe destination and preserves query state', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ external: { google: true } }) }));
  await signInWithGoogle('/billing?invoice=123#history');
  const options = oauth.mock.calls[0][0];
  expect(options.provider).toBe('google');
  const redirect = new URL(options.options.redirectTo);
  expect(redirect.origin).toBe(window.location.origin);
  expect(redirect.pathname).toBe('/auth/callback');
  expect(redirect.searchParams.get('next')).toBe('/billing?invoice=123#history');
});
