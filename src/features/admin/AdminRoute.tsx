import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAccess } from '../contact/useAdminAccess';
import { useLanguage } from '../../i18n/language';
import { AdminCompanyPage } from './AdminCompanyPage';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, allowed, loading, error } = useAdminAccess();
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const th = language === 'th';
  // The callback must be able to finish establishing the session.
  if (pathname === '/auth/callback') return <>{children}</>;
  if (loading) return <p role="status" className="p-8">{th ? 'กำลังตรวจสอบสิทธิ์…' : 'Checking access…'}</p>;
  if (!user) return <>{children}</>;
  if (error) return <div className="p-8"><p role="alert">{th ? 'ตรวจสอบสิทธิ์ไม่สำเร็จ กรุณาลองอีกครั้ง' : 'Could not verify access. Please retry.'}</p><button className="mt-4 rounded-lg border px-4 py-2" onClick={() => window.location.reload()}>{th ? 'ลองอีกครั้ง' : 'Retry'}</button></div>;
  if (!allowed) return <>{children}</>;
  if (pathname === '/admin/leads') return <>{children}</>;
  if (pathname !== '/dashboard' && pathname !== '/billing') return <Navigate to="/dashboard" replace />;
  return <AdminCompanyPage key={user.id} page={pathname === '/billing' ? 'billing' : 'dashboard'} />;
}
