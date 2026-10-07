import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from '../src/pages/SignUp';
import { signUpWithEmail } from '../src/features/auth/services/supabaseAuth';
vi.mock('../src/features/auth/useAuth', () => ({ useAuth: () => ({ error: null }) }));
vi.mock('../src/features/auth/services/supabaseAuth', () => ({ signUpWithEmail: vi.fn(), signInWithGoogle: vi.fn() }));
afterEach(cleanup);
function setup() {
  render(<MemoryRouter><SignUp /></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Customer' } });
  fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'customer@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('อย่างน้อย 8 ตัวอักษร'), { target: { value: 'password123' } });
}
function submit() { fireEvent.submit(screen.getByRole('button', { name: 'ลงทะเบียนใช้งานฟรี' }).closest('form')!); }
test('mismatched passwords block signup and correction allows the original password through', async () => {
  setup();
  const confirm = screen.getByLabelText('ยืนยันรหัสผ่าน (Confirm Password)');
  fireEvent.change(confirm, { target: { value: 'different123' } });
  submit();
  expect(screen.getByRole('alert').textContent).toContain('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
  expect(signUpWithEmail).not.toHaveBeenCalled();
  vi.mocked(signUpWithEmail).mockResolvedValue({ session: null } as never);
  fireEvent.change(confirm, { target: { value: 'password123' } });
  expect(screen.queryByRole('alert')).toBeNull();
  submit();
  await screen.findByText('กรุณาตรวจสอบอีเมลและกดยืนยันบัญชีก่อนเข้าสู่ระบบ');
  expect(signUpWithEmail).toHaveBeenCalledWith('Customer', 'customer@example.com', 'password123');
});
test('an empty confirmation cannot submit an account', () => {
  setup(); submit();
  expect(signUpWithEmail).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain('กรุณายืนยันรหัสผ่าน');
});
test('changing the original password after confirmation checks the new pair again', () => {
  setup();
  fireEvent.change(screen.getByLabelText('ยืนยันรหัสผ่าน (Confirm Password)'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByPlaceholderText('อย่างน้อย 8 ตัวอักษร'), { target: { value: 'changed123' } });
  submit();
  expect(signUpWithEmail).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
});
