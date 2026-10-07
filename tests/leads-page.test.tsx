import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeadsPage } from '../src/features/contact/LeadsPage';
import { listLeads, updateLead } from '../src/features/contact/leadClient';
import { useAdminAccess } from '../src/features/contact/useAdminAccess';

vi.mock('../src/features/auth/RouteGuards', () => ({ RequireAuth: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('../src/features/contact/useAdminAccess', () => ({ useAdminAccess: vi.fn() }));
vi.mock('../src/features/contact/leadClient', () => ({ listLeads: vi.fn(), updateLead: vi.fn(), countNewLeads: vi.fn().mockResolvedValue(0) }));
afterEach(cleanup);
const renderPage = () => render(<MemoryRouter><LeadsPage /></MemoryRouter>);
const timestamp = '2026-10-06T00:00:00Z';
const lead = { id: 'lead-1', fullName: 'ลูกค้าทดสอบ', company: 'บริษัททดสอบ', phone: '0812345678', email: 'test@example.com', website: '', courier: '', status: 'new', note: '', notificationStatus: 'failed', createdAt: timestamp, updatedAt: timestamp };
beforeEach(() => {
  vi.mocked(useAdminAccess).mockReturnValue({ allowed: true, loading: false, error: false, user: { id: 'staff' } } as never);
  vi.mocked(listLeads).mockResolvedValue({ leads: [lead], cursor: undefined, hasMore: false } as never);
});
test('unauthorized accounts never request customer records', () => {
  vi.mocked(useAdminAccess).mockReturnValue({ allowed: false, loading: false, error: false, user: { id: 'member' } } as never);
  renderPage();
  expect(screen.getByRole('alert').textContent).toContain('ไม่มีสิทธิ์');
  expect(listLeads).not.toHaveBeenCalled();
});
test('loaded customer data disappears as soon as admin access is lost', async () => {
  const view = renderPage();
  await screen.findByText('ลูกค้าทดสอบ');
  vi.mocked(useAdminAccess).mockReturnValue({ allowed: false, loading: true, error: false, user: { id: 'other' } } as never);
  view.rerender(<MemoryRouter><LeadsPage /></MemoryRouter>);
  expect(screen.queryByText('ลูกค้าทดสอบ')).toBeNull();
});
test('failed updates keep the draft; success refreshes records', async () => {
  vi.mocked(updateLead).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
  renderPage();
  fireEvent.click(await screen.findByText('ลูกค้าทดสอบ'));
  expect(screen.getByText('แจ้งเตือนไม่สำเร็จ')).toBeTruthy();
  fireEvent.change(screen.getByLabelText('บันทึกของทีม'), { target: { value: 'โทรพรุ่งนี้' } });
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกการติดตาม' }));
  await screen.findByRole('alert');
  expect((screen.getByLabelText('บันทึกของทีม') as HTMLTextAreaElement).value).toBe('โทรพรุ่งนี้');
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกการติดตาม' }));
  await screen.findByText('บันทึกการติดตามแล้ว');
  await waitFor(() => expect(listLeads).toHaveBeenCalledTimes(2));
});

test('refresh cannot discard a dirty note; explicit discard restores navigation', async () => {
  renderPage();
  fireEvent.click(await screen.findByText('ลูกค้าทดสอบ'));
  fireEvent.change(screen.getByLabelText('บันทึกของทีม'), { target: { value: 'Do not lose this draft' } });
  expect((screen.getByRole('button', { name: 'โหลดใหม่' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }));
  expect((screen.getByLabelText('บันทึกของทีม') as HTMLTextAreaElement).value).toBe('Do not lose this draft');
  fireEvent.click(screen.getByRole('button', { name: 'ยกเลิกการแก้ไข' }));
  expect((screen.getByLabelText('บันทึกของทีม') as HTMLTextAreaElement).value).toBe('');
  expect((screen.getByRole('button', { name: 'โหลดใหม่' }) as HTMLButtonElement).disabled).toBe(false);
});

test('pagination failure preserves records and any draft started during the request', async () => {
  vi.mocked(listLeads).mockResolvedValueOnce({ leads: [lead], cursor: undefined, hasMore: true } as never);
  renderPage();
  fireEvent.click(await screen.findByText('ลูกค้าทดสอบ'));
  let reject!: (error: Error) => void;
  vi.mocked(listLeads).mockImplementationOnce(() => new Promise((_done, fail) => { reject = fail; }));
  fireEvent.click(screen.getByRole('button', { name: 'โหลดเพิ่ม 25 รายการ' }));
  fireEvent.change(screen.getByLabelText('บันทึกของทีม'), { target: { value: 'Keep pagination draft' } });
  reject(new Error('offline'));
  await screen.findByRole('alert');
  expect((screen.getByLabelText('บันทึกของทีม') as HTMLTextAreaElement).value).toBe('Keep pagination draft');
  expect(screen.getByRole('button', { name: 'ยกเลิกการแก้ไข' })).toBeTruthy();
});
test('full refresh hides stale editor and prevents selecting records until refreshed', async () => {
  renderPage();
  fireEvent.click(await screen.findByText('ลูกค้าทดสอบ'));
  vi.mocked(listLeads).mockImplementationOnce(() => new Promise(() => {}));
  fireEvent.click(screen.getByRole('button', { name: 'โหลดใหม่' }));
  expect(screen.queryByLabelText('บันทึกของทีม')).toBeNull();
  expect((screen.getByText('ลูกค้าทดสอบ').closest('button') as HTMLButtonElement).disabled).toBe(true);
});
