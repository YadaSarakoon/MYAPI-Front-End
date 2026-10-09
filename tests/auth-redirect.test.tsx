import { expect, test } from 'vitest';
import { getPostAuthDestination } from '../src/features/auth/authRedirect';

test.each(['//evil.example', '/\\evil.example', '/%5cevil.example', '/login?next=/billing', '/signup#x', '/auth/callback', 'https://evil.example'])('rejects unsafe or looping destination %s', (from) => {
  expect(getPostAuthDestination({ from })).toBe('/dashboard');
});

test('preserves the protected page search and hash', () => {
  expect(getPostAuthDestination({ from: { pathname: '/billing', search: '?invoice=123', hash: '#history' } })).toBe('/billing?invoice=123#history');
});
