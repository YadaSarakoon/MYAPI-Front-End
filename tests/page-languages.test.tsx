import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { appRoutes } from '../src/config/routes';
import { LanguageProvider } from '../src/i18n/LanguageProvider';
import { ENDPOINTS } from '../src/features/docs/data';

vi.mock('../src/features/auth/useAuth', () => ({ useAuth: () => ({ user: { id: 'test-user', email: 'test@example.com' }, loading: false, error: null, logout: vi.fn() }) }));
vi.mock('../src/features/contact/useAdminAccess', () => ({ useAdminAccess: () => ({ allowed: true, loading: false, error: false, user: { id: 'test-user' } }) }));
vi.mock('../src/features/contact/leadClient', () => ({ countNewLeads: async () => 0, listLeads: async () => ({ leads: [], hasMore: false }), updateLead: vi.fn() }));
beforeEach(() => localStorage.setItem('myapi-language', 'en'));
afterEach(() => { cleanup(); localStorage.clear(); });

for (const route of appRoutes.filter(route => route.path !== '/auth/callback')) {
  test(`${route.path} supports persisted English and switching back to Thai`, async () => {
    const view = render(<MemoryRouter initialEntries={[route.path]}><LanguageProvider>{route.element}</LanguageProvider></MemoryRouter>);
    await waitFor(() => expect(view.container.querySelector('h1')).not.toBeNull());
    await waitFor(() => {
      const content = view.container.cloneNode(true) as HTMLElement;
      content.querySelectorAll('code, pre, script, style').forEach(node => node.remove());
      // Thai button labels are intentionally displayed in the native language.
      content.querySelectorAll('button').forEach(node => { if (/^(ไทย|ภาษาไทย|TH)$/.test(node.textContent ?? '')) node.remove(); });
      expect(content.textContent?.match(/[ก-๙][ก-๙\sฯๆ.]+/g) ?? []).toEqual([]);
    });
    const thai = screen.queryAllByRole('button', { name: 'ภาษาไทย' })[0] || screen.getAllByRole('button', { name: 'TH' })[0];
    fireEvent.click(thai);
    expect(document.documentElement.lang).toBe('th');
    expect(localStorage.getItem('myapi-language')).toBe('th');
  });
}

test.each(['/docs', '/sandbox'])('%s translates every endpoint description without changing the API examples', async (path) => {
  const route = appRoutes.find(route => route.path === path)!;
  const view = render(<MemoryRouter><LanguageProvider>{route.element}</LanguageProvider></MemoryRouter>);
  for (const endpoint of ENDPOINTS) {
    const buttons = [...view.container.querySelectorAll<HTMLButtonElement>('aside button')];
    const select = buttons.find(button => button.textContent?.replace(/\s+/g, ' ').trim() === `${endpoint.method}${endpoint.name}` || button.textContent?.replace(/\s+/g, ' ').trim() === `${endpoint.method} ${endpoint.name}`);
    expect(select, endpoint.name).toBeTruthy();
    fireEvent.click(select!);
    const content = view.container.cloneNode(true) as HTMLElement;
    content.querySelectorAll('code, pre, textarea, script, style').forEach(node => node.remove());
    content.querySelectorAll('button').forEach(node => { if (/^(ไทย|ภาษาไทย|TH)$/.test(node.textContent ?? '')) node.remove(); });
    expect(content.textContent?.match(/[ก-๙][ก-๙\sฯๆ.]+/g) ?? [], endpoint.name).toEqual([]);
  }
}, 15000);

test('webhook result notices change language while preserving their event and URL', async () => {
  localStorage.setItem('myapi-language', 'th');
  const route = appRoutes.find(route => route.path === '/webhook')!;
  render(<MemoryRouter><LanguageProvider>{route.element}</LanguageProvider></MemoryRouter>);
  fireEvent.click((await screen.findAllByRole('button', { name: 'ทดสอบ' }))[0]);
  fireEvent.click(screen.getByRole('button', { name: 'แสดงผลจำลอง' }));
  const notice = screen.getAllByRole('status').find(node => node.textContent?.includes('ไม่มีการส่ง request'))!;
  expect(notice).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'EN' }));
  expect(notice.textContent).not.toMatch(/[ก-๙]/);
  expect(notice.textContent).toContain('parcel.');
  expect(notice.textContent).toContain('https://');
});

test.each(['/docs', '/sandbox'])('%s finds endpoints by the Thai name displayed to the user', (path) => {
  localStorage.setItem('myapi-language', 'th');
  const route = appRoutes.find(route => route.path === path)!;
  render(<MemoryRouter><LanguageProvider>{route.element}</LanguageProvider></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('ค้นหา Endpoint...'), { target: { value: 'สร้างพัสดุ' } });
  expect(screen.getByRole('button', { name: /สร้างพัสดุ — COD/ })).toBeTruthy();
});
