import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useAuth } from '../auth/useAuth';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar } from '../../components/layout/Sidebar';

const links = [
  { label: 'Dashboard', path: '/dashboard' }, { label: 'API Docs', path: '/docs' },
  { label: 'Sandbox', path: '/sandbox' }, { label: 'Production', path: '/production' }, { label: 'Billing', path: '/billing' },
];
const COPY = {
  EN: {
    title: 'Settings', subtitle: 'Manage your profile and account preferences.', developer: 'Developer Account',
    profile: 'Profile Information', profileHint: 'Details provided by your sign-in provider.', displayName: 'Display name',
    email: 'Email address', provider: 'Sign-in provider', notProvided: 'Not provided', notAvailable: 'Not available',
    preferences: 'Account Preferences', preferencesHint: 'Preferences are stored only for this page session.',
    notifications: 'Product update notifications', notificationHint: 'Local demo preference; no notification service is connected.', logout: 'Log out',
  },
  TH: {
    title: 'ตั้งค่า', subtitle: 'จัดการข้อมูลโปรไฟล์และการตั้งค่าบัญชี', developer: 'บัญชีนักพัฒนา',
    profile: 'ข้อมูลโปรไฟล์', profileHint: 'ข้อมูลจากผู้ให้บริการที่ใช้เข้าสู่ระบบ', displayName: 'ชื่อที่แสดง',
    email: 'อีเมล', provider: 'ผู้ให้บริการเข้าสู่ระบบ', notProvided: 'ไม่มีข้อมูล', notAvailable: 'ไม่พร้อมใช้งาน',
    preferences: 'การตั้งค่าบัญชี', preferencesHint: 'การตั้งค่านี้จะอยู่เฉพาะใน session ของหน้านี้',
    notifications: 'การแจ้งเตือนอัปเดตผลิตภัณฑ์', notificationHint: 'ตัวเลือกตัวอย่างในเครื่อง ยังไม่ได้เชื่อมต่อบริการแจ้งเตือน', logout: 'ออกจากระบบ',
  },
} as const;

export function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [lang, setLang] = useState<'TH' | 'EN'>('EN');
  const copy = COPY[lang];
  const provider = user?.providerData.map(({ providerId }) => providerId).join(', ') || 'Unknown';
  const logout = async () => { await signOut(auth); navigate('/', { replace: true }); };

  return <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
    <Sidebar items={links} activePath="/settings" footer={<button type="button" onClick={() => void logout()} aria-label={copy.logout} className="w-full rounded-lg border border-slate-200 px-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 md:px-3"><span className="md:hidden">↪</span><span className="hidden md:inline">{copy.logout}</span></button>} />
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <Header
        title={copy.title}
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
      <PageContainer className="!px-6 !py-7 lg:!px-10"><div className="mx-auto max-w-3xl space-y-5">
        <Card><div><h2 className="text-sm font-bold text-slate-950">{copy.profile}</h2><p className="mt-1 text-xs text-slate-500">{copy.profileHint}</p></div><div className="mt-5 divide-y divide-slate-100">{[{ label: copy.displayName, value: user?.displayName || copy.notProvided }, { label: copy.email, value: user?.email || copy.notAvailable }, { label: copy.provider, value: provider }].map((field) => <div key={field.label} className="flex flex-wrap justify-between gap-2 py-3 first:pt-0"><span className="text-xs text-slate-500">{field.label}</span><span className="text-xs font-semibold text-slate-800">{field.value}</span></div>)}</div></Card>
        <Card><h2 className="text-sm font-bold text-slate-950">{copy.preferences}</h2><p className="mt-1 text-xs text-slate-500">{copy.preferencesHint}</p><label className="mt-5 flex items-center justify-between gap-4"><span><span className="block text-xs font-semibold text-slate-800">{copy.notifications}</span><span className="mt-1 block text-[10px] text-slate-400">{copy.notificationHint}</span></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} className="h-4 w-4 accent-indigo-600" /></label></Card>
      </div></PageContainer>
    </main>
  </div>;
}
