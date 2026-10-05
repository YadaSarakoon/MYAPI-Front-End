import { Card } from '../../components/common/Card';
import { Header } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../auth/useAuth';

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'API Docs', path: '/docs' },
  { label: 'Sandbox', path: '/sandbox' },
  { label: 'Production', path: '/production' },
  { label: 'Webhook', path: '/webhook' },
  { label: 'Billing', path: '/billing' },
];

export function ActivityPage() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
      <Sidebar items={links} activePath="/activity" />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
        <Header
          title="API Activity"
          subtitle="Review requests made by your account."
          userName={user?.displayName || user?.email || 'My Company'}
          userMeta="Developer Account"
        />
        <PageContainer className="!px-6 !py-7 lg:!px-10">
          <div className="mx-auto max-w-3xl">
            <Card>
              <h2 className="text-sm font-bold text-slate-950">Activity data is not connected</h2>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Request history, status codes, and response times require a confirmed account-scoped Backend API. No live activity is available yet.
              </p>
            </Card>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
