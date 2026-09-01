import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './layout/Header';
import { PageContainer } from './layout/PageContainer';
import { Sidebar } from './layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { label: 'API Docs', path: '/docs' },
    { label: 'Sandbox', path: '/sandbox' },
    { label: 'Production', path: '/production' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Wallet', path: '/wallet' },
    { label: 'Webhook', path: '/webhook' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      <Sidebar
        items={menuItems}
        activePath={location.pathname}
        footer={
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-500">
            Workspace: <span className="font-semibold text-slate-700">Production</span>
          </div>
        }
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title="API Console"
          subtitle="Manage access, monitor live traffic, and work with your API resources from one place."
          badge={<span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">Live</span>}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
};