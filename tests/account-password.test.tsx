import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { render } from './render';
import { AccountPassword } from '../src/features/settings/AccountPassword';
const { updateUser, getUser } = vi.hoisted(() => ({ updateUser: vi.fn(), getUser: vi.fn() }));
vi.mock('../src/config/supabase', () => ({ getSupabase: () => ({ auth: { updateUser, getUser } }) }));
vi.mock('../src/features/auth/useAuth', () => ({ useAuth: () => ({ user: { id: 'google-user', email: 'user@example.com' } }) }));
afterEach(cleanup);
function fill(confirm = 'password123') {
  render(<AccountPassword />);
  fireEvent.change(screen.getByLabelText('รหัสผ่านใหม่'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('ยืนยันรหัสผ่านใหม่'), { target: { value: confirm } });
  fireEvent.submit(screen.getByRole('button', { name: 'บันทึกรหัสผ่าน' }).closest('form')!);
}
test('does not update when confirmation differs', () => {
  fill('different');
  expect(screen.getByRole('alert').textContent).toContain('ไม่ตรงกัน');
  expect(updateUser).not.toHaveBeenCalled();
});
test('sets password on authenticated account and clears inputs after success', async () => {
  getUser.mockResolvedValue({ data: { user: { id: 'google-user' } }, error: null });
  updateUser.mockResolvedValue({ data: { user: { id: 'google-user' } }, error: null });
  fill();
  await screen.findByRole('status');
  expect(updateUser).toHaveBeenCalledWith({ password: 'password123' });
  expect((screen.getByLabelText('รหัสผ่านใหม่') as HTMLInputElement).value).toBe('');
});
test('does not report success if server rejects password update', async () => {
  getUser.mockResolvedValue({ data: { user: { id: 'google-user' } }, error: null });
  updateUser.mockResolvedValue({ data: {}, error: { code: 'reauthentication_needed' } });
  fill();
  expect((await screen.findByRole('alert')).textContent).toContain('เข้าสู่ระบบใหม่');
  expect(screen.queryByRole('status')).toBeNull();
});

test('does not set a password if the authenticated account has changed', async () => {
  getUser.mockResolvedValue({ data: { user: { id: 'other-user' } }, error: null });
  fill();
  expect((await screen.findByRole('alert')).textContent).toContain('เข้าสู่ระบบใหม่');
  expect(updateUser).not.toHaveBeenCalled();
});
