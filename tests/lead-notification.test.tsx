import { render } from './render';
import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeadNotification } from '../src/features/contact/LeadNotification';
import { countNewLeads } from '../src/features/contact/leadClient';
vi.mock('../src/features/contact/leadClient', () => ({ countNewLeads: vi.fn() }));
afterEach(() => { cleanup(); vi.useRealTimers(); });
test('non-admins never fetch notification counts', () => {
  render(<MemoryRouter><LeadNotification enabled={false} /></MemoryRouter>);
  expect(countNewLeads).not.toHaveBeenCalled();
  expect(screen.queryByRole('link')).toBeNull();
});
test('new requests update the admin notification without losing page drafts', async () => {
  vi.useFakeTimers();
  vi.mocked(countNewLeads).mockResolvedValueOnce(0).mockResolvedValueOnce(2);
  await act(async () => { render(<MemoryRouter><LeadNotification enabled /></MemoryRouter>); });
  await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
  expect(screen.getByRole('status').textContent).toContain('2');
  expect(screen.getByRole('link').getAttribute('href')).toBe('/admin/leads');
});
