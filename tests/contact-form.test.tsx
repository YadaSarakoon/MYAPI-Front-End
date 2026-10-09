import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactRequestForm } from '../src/features/contact/ContactRequestForm';
import { submitContact } from '../src/features/contact/contactClient';

vi.mock('../src/features/contact/contactClient', () => ({ submitContact: vi.fn() }));
afterEach(cleanup);
const setup = () => {
  render(<ContactRequestForm language="th" t={text => text} />);
  fireEvent.change(screen.getByLabelText('ชื่อ - นามสกุล'), { target: { value: 'สมชาย ใจดี' } });
  fireEvent.change(screen.getByLabelText('เบอร์โทรติดต่อ'), { target: { value: '0812345678' } });
  fireEvent.change(screen.getByLabelText('อีเมล'), { target: { value: 'person@example.com' } });
};
test('does not show success while pending and prevents duplicate submissions', async () => {
  let resolve!: (value: { accepted: true }) => void;
  vi.mocked(submitContact).mockImplementation(() => new Promise(done => { resolve = done; }));
  setup();
  fireEvent.submit(screen.getByRole('button', { name: 'ให้ทีมงานติดต่อกลับ' }).closest('form')!);
  fireEvent.submit(screen.getByRole('button', { name: 'กำลังส่ง…' }).closest('form')!);
  expect(submitContact).toHaveBeenCalledTimes(1);
  expect((screen.getByRole('button', { name: 'กำลังส่ง…' }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.queryByText(/ส่งข้อมูลเรียบร้อย/)).toBeNull();
  resolve({ accepted: true });
  await screen.findByText(/ส่งข้อมูลเรียบร้อย/);
  expect((screen.getByLabelText('อีเมล') as HTMLInputElement).value).toBe('');
});
test('failure retains input and retry ID; changed input gets a new ID', async () => {
  vi.mocked(submitContact).mockRejectedValue(new Error('offline'));
  setup();
  const submit = () => fireEvent.submit(screen.getByRole('button', { name: 'ให้ทีมงานติดต่อกลับ' }).closest('form')!);
  submit();
  await screen.findByRole('alert');
  expect((screen.getByLabelText('อีเมล') as HTMLInputElement).value).toBe('person@example.com');
  const first = vi.mocked(submitContact).mock.calls[0][0].submissionId;
  submit();
  await waitFor(() => expect(submitContact).toHaveBeenCalledTimes(2));
  await screen.findByRole('alert');
  expect(vi.mocked(submitContact).mock.calls[1][0].submissionId).toBe(first);
  fireEvent.change(screen.getByLabelText('อีเมล'), { target: { value: 'changed@example.com' } });
  submit();
  await waitFor(() => expect(submitContact).toHaveBeenCalledTimes(3));
  expect(vi.mocked(submitContact).mock.calls[2][0].submissionId).not.toBe(first);
});
test('malformed success response never clears customer data', async () => {
  vi.mocked(submitContact).mockResolvedValue({ accepted: false } as never);
  setup();
  fireEvent.submit(screen.getByRole('button', { name: 'ให้ทีมงานติดต่อกลับ' }).closest('form')!);
  await screen.findByRole('alert');
  expect((screen.getByLabelText('อีเมล') as HTMLInputElement).value).toBe('person@example.com');
});
