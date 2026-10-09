import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../src/features/auth/useAuth';
import { useAdminAccess } from '../src/features/contact/useAdminAccess';
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../src/features/auth/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('../src/config/supabase', () => ({ getSupabase: () => ({ rpc }) }));
afterEach(cleanup);
test('only server-confirmed MyAPI admins may read leads; user metadata cannot grant access', async () => {
  for (const allowed of [false, true]) {
    rpc.mockResolvedValue({ data: allowed, error: null });
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user', user_metadata: { admin: true } }, loading: false } as never);
    const hook = renderHook(() => useAdminAccess());
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.allowed).toBe(allowed);
    hook.unmount();
  }
});
test('a late admin response cannot grant access to a newly switched account', async () => {
  let resolve!: (value: unknown) => void;
  rpc.mockImplementationOnce(() => new Promise(done => { resolve = done; })).mockResolvedValue({ data: false, error: null });
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'admin' }, loading: false } as never);
  const hook = renderHook(() => useAdminAccess());
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'member' }, loading: false } as never);
  hook.rerender();
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  await act(async () => resolve({ data: true, error: null }));
  expect(hook.result.current.allowed).toBe(false);
  expect(hook.result.current.user?.id).toBe('member');
});

test('same-account session refresh retains access while rechecking, then applies revocation', async () => {
  rpc.mockResolvedValueOnce({ data: true, error: null });
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'admin' }, loading: false } as never);
  const hook = renderHook(() => useAdminAccess());
  await waitFor(() => expect(hook.result.current.allowed).toBe(true));
  let resolve!: (value: unknown) => void;
  rpc.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'admin' }, loading: false } as never);
  hook.rerender();
  expect(hook.result.current.loading).toBe(false);
  expect(hook.result.current.allowed).toBe(true);
  await act(async () => resolve({ data: false, error: null }));
  expect(hook.result.current.allowed).toBe(false);
});
