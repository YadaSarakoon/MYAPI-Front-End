import type { ReactNode } from 'react';
import { LoginPage, SignUpPage } from '../features/auth';
import { AuthCallback } from '../features/auth/AuthCallback';
import Billing from '../features/billing/Billing';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ApiDocs } from '../features/docs/ApiDocs';
import { LandingPage } from '../features/landing';
import { ActivityPage } from '../features/production/ActivityPage';
import { Production } from '../features/production/Production';
import { Sandbox } from '../features/sandbox/Sandbox';
import { SettingsPage } from '../features/settings/SettingsPage';
import { WebhookPage } from '../features/webhook/WebhookPage';
import { LeadsPage } from '../features/contact/LeadsPage';

export type AppRoute = {
  path: string;
  element: ReactNode;
};

export const appRoutes: AppRoute[] = [
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/admin/leads', element: <LeadsPage /> },
  { path: '/', element: <LandingPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/docs', element: <ApiDocs /> },
  { path: '/sandbox', element: <Sandbox /> },
  { path: '/production', element: <Production /> },
  { path: '/billing', element: <Billing /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/webhook', element: <WebhookPage /> },
  { path: '/activity', element: <ActivityPage /> },
];
