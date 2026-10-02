import type { ReactNode } from 'react';
import { LandingPage } from '../features/landing';
import { LoginPage, SignUpPage } from '../features/auth';
import { ApiDocsPage } from '../features/docs';
import { SandboxPage } from '../features/sandbox';
import { Production } from '../pages/Production';
import Billing from '../pages/Billing';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { WebhookPage } from '../features/webhook/WebhookPage';
import { ActivityPage } from '../features/production/ActivityPage';

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
  { path: '/production', element: <Production /> },
  { path: '/billing', element: <Billing /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/webhook', element: <WebhookPage /> },
  { path: '/activity', element: <ActivityPage /> },
];
