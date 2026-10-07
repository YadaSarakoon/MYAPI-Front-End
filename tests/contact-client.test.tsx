import { afterEach, expect, test, vi } from 'vitest';
import { submitContact } from '../src/features/contact/contactClient';
vi.mock('../src/config/supabase', () => ({ getSupabaseConfig: () => ({ url: 'https://example.supabase.co', key: 'public-anon-key' }) }));
afterEach(() => vi.unstubAllGlobals());
const input = { submissionId: '68a28df3-1e11-488a-8e0a-871fe1faf1a7', fullName: 'Customer', phone: '0812345678', email: 'person@example.com', company: '', website: '', courier: '', trap: '' };
test('only durable accepted responses confirm the submission', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ accepted: true }), { status: 200 })));
  await expect(submitContact(input)).resolves.toEqual({ accepted: true });
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ accepted: false }), { status: 200 })));
  await expect(submitContact(input)).rejects.toThrow();
});
test('rate limits have a usable form error and network failures never become success', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 429 })));
  await expect(submitContact(input)).rejects.toMatchObject({ code: 'resource-exhausted' });
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
  await expect(submitContact(input)).rejects.toThrow('offline');
});
