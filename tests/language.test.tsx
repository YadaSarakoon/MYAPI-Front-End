import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingLanguageProvider } from '../src/features/landing/LandingLanguage';
import { Login } from '../src/pages/Login';
import { SignUp } from '../src/pages/SignUp';

vi.mock('../src/features/auth/useAuth', () => ({ useAuth: () => ({ error: null }) }));
afterEach(() => { cleanup(); localStorage.clear(); });

test('switching language on login persists across navigation and reload', () => {
  const view = render(<MemoryRouter><LandingLanguageProvider><Login /></LandingLanguageProvider></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  expect(document.documentElement.lang).toBe('en');
  expect(screen.getByRole('button', { name: /Sign in with Google/ })).toBeTruthy();
  view.rerender(<MemoryRouter><LandingLanguageProvider><SignUp /></LandingLanguageProvider></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Create an account' })).toBeTruthy();
  view.unmount();
  render(<MemoryRouter><LandingLanguageProvider><Login /></LandingLanguageProvider></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Sign in with Google/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'ภาษาไทย' }));
  expect(document.documentElement.lang).toBe('th');
  expect(screen.getByRole('button', { name: /เข้าสู่ระบบด้วย Google/ })).toBeTruthy();
});
