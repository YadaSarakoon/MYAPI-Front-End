import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import LanguageSwitcher, {
  type Language,
} from '../../components/common/LanguageSwitcher';
import { Header } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar } from '../../components/layout/Sidebar';
import { SidebarLogoutButton } from '../../components/layout/SidebarLogoutButton';

import { useAuth } from '../auth/useAuth';
import type { AccountPreferences } from './types';

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'API Docs', path: '/docs' },
  { label: 'Sandbox', path: '/sandbox' },
  { label: 'Production', path: '/production' },
  { label: 'Webhook', path: '/webhook' },
  { label: 'Billing', path: '/billing' },
];

const COPY = {
  EN: {
    title: 'Settings',
    subtitle: 'Manage your profile and account preferences.',
    developer: 'Developer Account',
    profile: 'Profile Information',
    profileHint: 'Details provided by your sign-in provider.',
    displayName: 'Display name',
    email: 'Email address',
    provider: 'Sign-in provider',
    notProvided: 'Not provided',
    notAvailable: 'Not available',
    preferences: 'Account Preferences',
    preferencesHint:
      'Preferences are stored only for this page session.',
    notifications: 'Product update notifications',
    notificationHint:
      'Local demo preference; no notification service is connected.',
    logout: 'Log out',
    logoutError: 'Could not log out. Please try again.',
  },

  TH: {
    title: 'ตั้งค่า',
    subtitle: 'จัดการข้อมูลโปรไฟล์และการตั้งค่าบัญชี',
    developer: 'บัญชีนักพัฒนา',
    profile: 'ข้อมูลโปรไฟล์',
    profileHint: 'ข้อมูลจากผู้ให้บริการที่ใช้เข้าสู่ระบบ',
    displayName: 'ชื่อที่แสดง',
    email: 'อีเมล',
    provider: 'ผู้ให้บริการเข้าสู่ระบบ',
    notProvided: 'ไม่มีข้อมูล',
    notAvailable: 'ไม่พร้อมใช้งาน',
    preferences: 'การตั้งค่าบัญชี',
    preferencesHint:
      'การตั้งค่านี้จะอยู่เฉพาะใน session ของหน้านี้',
    notifications: 'การแจ้งเตือนอัปเดตผลิตภัณฑ์',
    notificationHint:
      'ตัวเลือกตัวอย่างในเครื่อง ยังไม่ได้เชื่อมต่อบริการแจ้งเตือน',
    logout: 'ออกจากระบบ',
    logoutError:
      'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง',
  },
} as const;

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] =
    useState<AccountPreferences>({
      productUpdateNotifications: false,
    });

  const [lang, setLang] = useState<Language>('TH');

  const copy = COPY[lang];

  const provider =
    user?.identities
      ?.map(({ provider }) => provider)
      .join(', ') || 'Unknown';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch {
      window.alert(copy.logoutError);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
      <Sidebar
        items={links}
        activePath="/settings"
        footer={
          <SidebarLogoutButton
            label={copy.logout}
            onClick={() => void handleLogout()}
          />
        }
      />

      <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
        <Header
          title={copy.title}
          subtitle={copy.subtitle}
          actions={
            <LanguageSwitcher
              lang={lang}
              onChange={setLang}
            />
          }
          userName={
            user?.user_metadata?.full_name ||
            user?.email ||
            'My Company'
          }
          userMeta={copy.developer}
        />

        <PageContainer className="!px-6 !py-7 lg:!px-10">
          <div className="mx-auto max-w-3xl space-y-5">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-950">
                    {copy.profile}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {copy.profileHint}
                  </p>
                </div>

                <Badge tone="emerald">
                  Supabase Auth
                </Badge>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {[
                  {
                    label: copy.displayName,
                    value:
                      user?.user_metadata?.full_name ||
                      copy.notProvided,
                  },
                  {
                    label: copy.email,
                    value:
                      user?.email ||
                      copy.notAvailable,
                  },
                  {
                    label: copy.provider,
                    value: provider,
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex flex-wrap justify-between gap-2 py-3 first:pt-0"
                  >
                    <span className="text-xs text-slate-500">
                      {field.label}
                    </span>

                    <span className="text-xs font-semibold text-slate-800">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-950">
                  {copy.preferences}
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {copy.preferencesHint}
              </p>

              <label className="mt-5 flex items-center justify-between gap-4">
                <span>
                  <span className="block text-xs font-semibold text-slate-800">
                    {copy.notifications}
                  </span>

                  <span className="mt-1 block text-xs text-slate-400">
                    {copy.notificationHint}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={
                    preferences.productUpdateNotifications
                  }
                  onChange={(event) =>
                    setPreferences({
                      productUpdateNotifications:
                        event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-indigo-600"
                />
              </label>
            </Card>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
