import { afterEach, expect, test, vi } from 'vitest';
import { getSupabaseConfig } from '../src/config/supabase';

afterEach(() => vi.unstubAllEnvs());
test('uses the publishable key for the configured project instead of a leftover legacy key', () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://new-project.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_new');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'legacy-old-key');
  expect(getSupabaseConfig()).toEqual({ url: 'https://new-project.supabase.co', key: 'sb_publishable_new' });
});
test('supports installations still using a legacy anon key', () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://legacy-project.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'legacy-key');
  expect(getSupabaseConfig().key).toBe('legacy-key');
});
