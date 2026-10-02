import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoDashboardService } from './services/dashboardService';
import type { DashboardData, UsageRange } from './types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Header } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar } from '../../components/layout/Sidebar';
import { SidebarLogoutButton } from '../../components/layout/SidebarLogoutButton';
import { useAuth } from '../auth/useAuth';

const ranges: UsageRange[] = ['7', '30', '90'];
const mainLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'API Docs', path: '/docs' },
  { label: 'Sandbox', path: '/sandbox' },
  { label: 'Production', path: '/production' },
  { label: 'Webhook', path: '/webhook' },
  { label: 'Billing', path: '/billing' },
];
const COPY = {
  EN: {
    welcome: 'Welcome', subtitle: 'Your API activity and account overview.', developer: 'Developer Account', overview: 'Overview',
    snapshot: 'A snapshot of your developer account.', demo: 'Demo data', total: 'Total API Requests', month: 'Requests This Month', wallet: 'Wallet Balance',
    sample: 'Illustrative sample', walletDetail: 'Not available in current client data', api: 'API Status', apiDetail: 'Example status only; verify with service', active: 'Demo active',
    loadError: 'Could not load dashboard data.', retry: 'Retry', empty: 'No dashboard data is available.', noActivity: 'No API activity yet.', noUsage: 'No usage data for this period.', noChecklist: 'No setup steps are available.',
    usage: 'API Usage', volume: 'Request volume · sample values', daysAgo: '7 days ago', last: 'Last', today: 'Today', activity: 'Recent API Activity',
    rows: 'Example activity rows', view: 'View details →', time: 'Time', method: 'Method', endpoint: 'Endpoint', status: 'Status', response: 'Response', success: 'Success', failed: 'Failed',
    actions: 'Quick Actions', actionsHint: 'Continue setting up your account', docs: 'Read API documentation', sandbox: 'Try the Sandbox', keys: 'View Production keys', billing: 'Open Billing',
    gettingStarted: 'Getting Started', checklist: 'Example checklist', complete: 'Complete', next: 'Next', logout: 'Log out', logoutError: 'Could not log out. Please try again.',
  },
  TH: {
    welcome: 'ยินดีต้อนรับ', subtitle: 'ภาพรวมบัญชีและการใช้งาน API ของคุณ', developer: 'บัญชีนักพัฒนา', overview: 'ภาพรวม',
    snapshot: 'สรุปข้อมูลบัญชีนักพัฒนาของคุณ', demo: 'ข้อมูลตัวอย่าง', total: 'คำขอ API ทั้งหมด', month: 'คำขอในเดือนนี้', wallet: 'ยอดเงินในกระเป๋า',
    sample: 'ข้อมูลจำลอง', walletDetail: 'ยังไม่มีข้อมูลในฝั่ง Client', api: 'สถานะ API', apiDetail: 'ตัวอย่างเท่านั้น กรุณาตรวจสอบกับบริการจริง', active: 'เปิดใช้งาน (ตัวอย่าง)',
    loadError: 'โหลดข้อมูล Dashboard ไม่สำเร็จ', retry: 'ลองอีกครั้ง', empty: 'ไม่มีข้อมูล Dashboard', noActivity: 'ยังไม่มีกิจกรรม API', noUsage: 'ไม่มีข้อมูลการใช้งานในช่วงนี้', noChecklist: 'ไม่มีขั้นตอนการตั้งค่า',
    usage: 'การใช้งาน API', volume: 'ปริมาณคำขอ · ข้อมูลตัวอย่าง', daysAgo: '7 วันที่แล้ว', last: 'ย้อนหลัง', today: 'วันนี้', activity: 'กิจกรรม API ล่าสุด',
    rows: 'รายการกิจกรรมตัวอย่าง', view: 'ดูรายละเอียด →', time: 'เวลา', method: 'Method', endpoint: 'Endpoint', status: 'สถานะ', response: 'เวลาตอบกลับ', success: 'สำเร็จ', failed: 'ไม่สำเร็จ',
    actions: 'ทางลัด', actionsHint: 'เริ่มตั้งค่าบัญชีของคุณ', docs: 'อ่านเอกสาร API', sandbox: 'ทดลองใช้ Sandbox', keys: 'ดู Production keys', billing: 'เปิดหน้าการเรียกเก็บเงิน',
    gettingStarted: 'เริ่มต้นใช้งาน', checklist: 'รายการตัวอย่าง', complete: 'เสร็จแล้ว', next: 'ถัดไป', logout: 'ออกจากระบบ', logoutError: 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง',
  },
} as const;

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <Card><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-[10px] text-slate-400">{detail}</p></Card>;
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [range, setRange] = useState<UsageRange>('7');
  const [lang, setLang] = useState<'TH' | 'EN'>('EN');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const copy = COPY[lang];
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '';
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setDashboardData(await demoDashboardService.getDashboard());
    } catch {
      setDashboardData(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let mounted = true;
    demoDashboardService.getDashboard().then((data) => {
      if (mounted) setDashboardData(data);
    }).catch(() => {
      if (mounted) {
        setDashboardData(null);
        setLoadError(true);
      }
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const usage = dashboardData?.usage[range] ?? [];
  const points = usage.map((value, index) => `${index * 100},${100 - value}`).join(' ');
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      window.alert(copy.logoutError);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm text-slate-500">Loading dashboard…</div>;
  }

  if (loadError || !dashboardData) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6"><div className="max-w-md text-center"><p role="alert" className="text-sm text-rose-600">{loadError ? copy.loadError : copy.empty}</p>{loadError && <button type="button" onClick={() => void loadDashboard()} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">{copy.retry}</button>}</div></div>;
  }

  return <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
    <Sidebar items={mainLinks} activePath="/dashboard" footer={<SidebarLogoutButton label={copy.logout} onClick={() => void handleLogout()} />} />
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <Header
        title={`${copy.welcome}${firstName ? `, ${firstName}` : ''}`}
        subtitle={copy.subtitle}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
              {(['TH', 'EN'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                    lang === code
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        }
        userName={user?.displayName || user?.email || 'My Company'}
        userMeta={copy.developer}
      />
      <PageContainer className="!px-6 !py-7 lg:!px-10">
        <div className="mx-auto max-w-[1440px] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-950">{copy.overview}</h2><p className="mt-1 text-xs text-slate-500">{copy.snapshot}</p></div><Badge tone="amber">{copy.demo}</Badge></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label={copy.total} value={dashboardData.totalRequests} detail={copy.sample} />
            <Metric label={copy.month} value={dashboardData.monthRequests} detail={copy.sample} />
            <Metric label={copy.wallet} value={dashboardData.walletBalance} detail={copy.walletDetail} />
            <Metric label={copy.api} value={copy.active} detail={copy.apiDetail} />
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-5">
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold text-slate-950">{copy.usage}</h2><p className="mt-1 text-xs text-slate-500">{copy.volume}</p></div><div className="flex rounded-lg bg-slate-100 p-0.5">{ranges.map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-md px-3 py-1.5 text-[10px] font-bold ${range === item ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>{item} {lang === 'TH' ? 'วัน' : 'days'}</button>)}</div></div>
                <div className="mt-5 h-48 rounded-xl bg-slate-50 p-4">{usage.length ? <><svg viewBox="0 0 600 100" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${copy.usage} ${range} ${lang === 'TH' ? 'วัน' : 'days'}`}><path d="M0 80 H600 M0 50 H600 M0 20 H600" stroke="#e2e8f0" strokeDasharray="4 5"/><polyline points={points} transform="scale(1,1)" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg><div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>{range === '7' ? copy.daysAgo : `${copy.last} ${range} ${lang === 'TH' ? 'วัน' : 'days'}`}</span><span>{copy.today}</span></div></> : <div className="flex h-full items-center justify-center text-xs text-slate-400">{copy.noUsage}</div>}</div>
              </Card>
              <Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-bold text-slate-950">{copy.activity}</h2><p className="mt-1 text-xs text-slate-500">{copy.rows}</p></div><Link to="/production" className="text-xs font-semibold text-indigo-600">{copy.view}</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="bg-slate-50/60 text-left">{[copy.time, copy.method, copy.endpoint, copy.status, copy.response].map((label) => <th key={label} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</th>)}</tr></thead><tbody>{dashboardData.activity.length ? dashboardData.activity.map((row) => <tr key={`${row.time}-${row.endpoint}`} className="border-t border-slate-100"><td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">{row.time}</td><td className="px-5 py-3"><span className="font-mono text-[10px] font-bold text-indigo-700">{row.method}</span></td><td className="px-5 py-3"><code className="text-xs text-slate-700">{row.endpoint}</code></td><td className="px-5 py-3"><span className={row.status === 'Success' ? 'text-xs font-semibold text-emerald-600' : 'text-xs font-semibold text-rose-600'}>{row.status === 'Success' ? copy.success : copy.failed} · {row.code}</span></td><td className="px-5 py-3 text-xs text-slate-500">{row.response}</td></tr>) : <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">{copy.noActivity}</td></tr>}</tbody></table></div></Card>
            </div>

            <aside className="space-y-5"><Card><h2 className="text-sm font-bold text-slate-950">{copy.actions}</h2><p className="mt-1 text-xs text-slate-500">{copy.actionsHint}</p><div className="mt-4 space-y-2">{[{ label: copy.docs, href: '/docs' }, { label: copy.sandbox, href: '/sandbox' }, { label: copy.keys, href: '/production' }, { label: copy.billing, href: '/billing' }].map((item) => <Link key={item.href} to={item.href} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:bg-slate-50">{item.label}<span className="text-slate-300">→</span></Link>)}</div></Card>
              <Card><h2 className="text-sm font-bold text-slate-950">{copy.gettingStarted}</h2><p className="mt-1 text-xs text-slate-500">{copy.checklist}</p><div className="mt-4 space-y-3">{dashboardData.checklist.length ? dashboardData.checklist.map((item) => <Link key={item.href} to={item.href} className="flex items-center gap-3"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${item.done ? 'bg-emerald-100 text-emerald-700' : 'border border-slate-300 text-slate-400'}`}>{item.done ? '✓' : '·'}</span><span className="text-xs text-slate-600">{lang === 'TH' ? ({ 'Review API documentation': 'อ่านเอกสาร API', 'Try a request in Sandbox': 'ทดลองเรียก API ใน Sandbox', 'Request Production access': 'ขอเปิดใช้งาน Production', 'Configure billing details': 'ตั้งค่าการเรียกเก็บเงิน' } as const)[item.label] : item.label}</span><span className={`ml-auto text-[9px] font-semibold ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>{item.done ? copy.complete : copy.next}</span></Link>) : <p className="text-xs text-slate-400">{copy.noChecklist}</p>}</div></Card>
            </aside>
          </div>
        </div>
      </PageContainer>
    </main>
  </div>;
}
