import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import App from '../src/App';
import { LanguageProvider } from '../src/i18n/LanguageProvider';
import { AdminRoute } from '../src/features/admin/AdminRoute';
import { useAdminAccess } from '../src/features/contact/useAdminAccess';
import { makeCsv } from '../src/features/admin/companyData';
import logo from '../src/assets/logoDark.png';

vi.mock('../src/features/contact/leadClient', () => ({
  countNewLeads: async () => 1,
  listLeads: async () => ({ leads: [{ id: 'home-request', fullName: 'ลูกค้าจากหน้า Home', company: 'บริษัททดสอบ', phone: '0812345678', email: 'customer@example.com', website: '', courier: '', status: 'new', note: '', notificationStatus: 'sent', createdAt: '2026-10-16T00:00:00Z', updatedAt: '2026-10-16T00:00:00Z' }], hasMore: false }),
  updateLead: vi.fn(),
}));

vi.mock('../src/features/contact/useAdminAccess', () => ({ useAdminAccess: vi.fn() }));
vi.mock('../src/features/auth/useAuth', () => ({ useAuth: () => ({ user: { id: 'admin' }, logout: vi.fn() }) }));
vi.mock('../src/features/auth/AuthProvider', () => ({ AuthProvider: ({ children }: { children: ReactNode }) => children }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); localStorage.clear(); });

function open(path: string, access = { allowed: true, loading: false, error: false }) {
  vi.mocked(useAdminAccess).mockReturnValue({ user: { id: 'admin' }, ...access } as never);
  return render(<LanguageProvider><MemoryRouter initialEntries={[path]}><Routes>
    {['/dashboard', '/billing', '/settings', '/docs', '/admin/leads', '/sandbox', '/production', '/webhook', '/activity', '/'].map(route =>
      <Route key={route} path={route} element={<AdminRoute><p>Customer page</p></AdminRoute>} />)}
  </Routes></MemoryRouter></LanguageProvider>);
}

test.each(['/settings', '/docs', '/sandbox', '/production', '/webhook', '/activity', '/'])('admin opening %s is sent to the dashboard', async path => {
  open(path);
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy());
  expect(screen.queryByText('Customer page')).toBeNull();
  expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/admin/leads', '/dashboard', '/billing']);
});

test('customers retain existing pages; pending or failed role checks never expose them', () => {
  const view = open('/settings', { allowed: false, loading: false, error: false });
  expect(screen.getByText('Customer page')).toBeTruthy();
  view.unmount();
  const pending = open('/settings', { allowed: false, loading: true, error: false });
  expect(screen.queryByText('Customer page')).toBeNull();
  pending.unmount();
  open('/settings', { allowed: false, loading: false, error: true });
  expect(screen.queryByText('Customer page')).toBeNull();
  expect(screen.getByRole('alert')).toBeTruthy();
});

test('search selects company data, persists across pages, and clears stale results', async () => {
  open('/dashboard');
  const search = screen.getByRole('searchbox');
  expect((screen.getByRole('button', { name: /CSV/ }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(search, { target: { value: '  สยาม  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'บริษัท สยาม เทรดดิ้ง (ตัวอย่าง)' }));
  expect(screen.getByText('12,450')).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Billing' }));
  await waitFor(() => expect(screen.getByText('DEMO-SIAM-001')).toBeTruthy());
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ไม่มีบริษัทนี้' } });
  expect(screen.queryByText('DEMO-SIAM-001')).toBeNull();
  expect((screen.getByRole('button', { name: /CSV/ }) as HTMLButtonElement).disabled).toBe(true);
});

test('CSV preserves Thai, commas and quotes while neutralizing spreadsheet formulas', () => {
  expect(makeCsv([['บริษัท', 'ยอด'], ['ไทย, "ทดสอบ"', 42], ['=HYPERLINK("bad")', '@SUM(1)']]))
    .toBe('\uFEFF"บริษัท","ยอด"\r\n"ไทย, ""ทดสอบ""","42"\r\n"\'=HYPERLINK(""bad"")","\'@SUM(1)"');
});

test('billing export downloads only the selected company with matching invoice amounts', async () => {
  let downloaded: Blob | undefined;
  let filename = '';
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL(blob: Blob) { downloaded = blob; return 'blob:export-test'; }
    static revokeObjectURL() {}
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { filename = this.download; });
  open('/billing?company=demo-north');
  expect(screen.getByText('DEMO-NORTH-001')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /CSV/ }));
  expect(filename).toBe('demo-north-billing.csv');
  const csv = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(downloaded!);
  });
  expect(csv).toContain('DEMO-NORTH-001');
  expect(csv).toContain('"900","paid"');
  expect(csv).not.toContain('SIAM');
});

test('empty companies and invalid company URLs never fall back to another company', () => {
  const view = open('/billing?company=demo-new');
  expect(screen.getByText('ยังไม่มีรายการสำหรับบริษัทนี้')).toBeTruthy();
  expect(screen.queryByText('DEMO-SIAM-001')).toBeNull();
  view.unmount();
  open('/billing?company=unknown');
  expect((screen.getByRole('button', { name: /CSV/ }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.queryByRole('table')).toBeNull();
});

test('the actual App blocks admin access to customer routes and unknown URLs', async () => {
  vi.mocked(useAdminAccess).mockReturnValue({ user: { id: 'admin' }, allowed: true, loading: false, error: false } as never);
  for (const path of ['/production', '/not-a-page']) {
    const view = render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy());
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/admin/leads', '/dashboard', '/billing']);
    view.unmount();
  }
});

test('admin sees the real logo and can open Home contact requests from the menu and direct URL', async () => {
  vi.mocked(useAdminAccess).mockReturnValue({ user: { id: 'admin' }, allowed: true, loading: false, error: false } as never);
  const view = render(<MemoryRouter initialEntries={['/dashboard']}><App /></MemoryRouter>);
  expect(screen.getByRole('img', { name: 'MyAPI' }).getAttribute('src')).toBe(logo);
  fireEvent.click(screen.getByRole('link', { name: /คำขอติดต่อ/ }));
  fireEvent.click(await screen.findByText('ลูกค้าจากหน้า Home'));
  expect(screen.getByText('customer@example.com')).toBeTruthy();
  view.unmount();
  render(<MemoryRouter initialEntries={['/admin/leads']}><App /></MemoryRouter>);
  expect(await screen.findByText('ลูกค้าจากหน้า Home')).toBeTruthy();
});

