import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render } from './render';
import { AuthCallback } from '../src/features/auth/AuthCallback';
import { useAuth } from '../src/features/auth/useAuth';
vi.mock('../src/features/auth/useAuth', () => ({ useAuth: vi.fn() }));
afterEach(() => { cleanup(); localStorage.clear(); });
function Destination() { const location = useLocation(); return <p>{location.pathname + location.search + location.hash}</p>; }
function setup(url: string, auth: object) {
  localStorage.setItem('myapi-language', 'en');
  vi.mocked(useAuth).mockReturnValue({ error: null, loading: false, user: null, ...auth } as never);
  return render(<MemoryRouter initialEntries={[url]}><Routes><Route path="/auth/callback" element={<AuthCallback />} /><Route path="*" element={<Destination />} /></Routes></MemoryRouter>);
}
test('successful Google callback restores the originally requested page with its query and anchor', async () => {
  setup('/auth/callback?next=%2Fbilling%3Finvoice%3D123%23history', { user: { id: 'signed-in' } });
  expect(await screen.findByText('/billing?invoice=123#history')).toBeTruthy();
});
test('cancellation is visible even with an existing session and does not expose provider descriptions', () => {
  setup('/auth/callback?next=%2Fbilling#error=access_denied&error_description=private-provider-description', { user: { id: 'old-session' } });
  expect(screen.getByRole('alert').textContent).toContain('cancelled');
  expect(screen.queryByText(/private-provider-description/)).toBeNull();
  expect(screen.getByRole('link', { name: 'Back to sign in' }).getAttribute('href')).toBe('/login');
});
test('callback waits for session resolution before deciding it failed', () => {
  setup('/auth/callback', { loading: true });
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('heading').textContent).toBe('Completing sign-in…');
});
test('callback without a session allows retry and never grants account access', () => {
  setup('/auth/callback?next=https://evil.example', {});
  expect(screen.getByRole('alert').textContent).toContain('failed');
  expect(screen.getByRole('link', { name: 'Back to sign in' })).toBeTruthy();
});

test('successful callback keeps the browser URL and rendered destination in sync', async () => {
  window.history.replaceState({}, '', '/auth/callback?next=%2Fbilling%3Finvoice%3D123%23history#access_token=test-token');
  vi.mocked(useAuth).mockReturnValue({ loading: false, error: null, user: { id: 'signed-in' } } as never);
  render(<BrowserRouter><Routes><Route path="/auth/callback" element={<AuthCallback />} /><Route path="*" element={<Destination />} /></Routes></BrowserRouter>);
  await screen.findByText('/billing?invoice=123#history');
  expect(window.location.pathname + window.location.search + window.location.hash).toBe('/billing?invoice=123#history');
});
