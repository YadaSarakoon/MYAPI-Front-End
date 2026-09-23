import type { ReactNode } from 'react';
import { LandingPage } from '../features/landing';
import { LoginPage, SignUpPage } from '../features/auth';
import { ApiDocsPage } from '../features/docs';
import { SandboxPage } from '../features/sandbox';

export type AppRoute = {
  path: string;
  element: ReactNode;
};

export const appRoutes: AppRoute[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/docs', element: <ApiDocsPage /> },
  { path: '/sandbox', element: <SandboxPage /> },
];
