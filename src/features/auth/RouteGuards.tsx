import { useLanguage } from '../../i18n/language';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getPostAuthDestination } from './authRedirect';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

function AuthLoading() {
  const { t } = useLanguage();
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc] text-sm text-slate-500"><div className="fixed right-4 top-4 z-40"><LanguageSwitcher /></div><p role="status">{t("Loading account…")}</p></div>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc] px-6 text-center text-sm text-rose-700"><div className="fixed right-4 top-4 z-40"><LanguageSwitcher /></div><p role="alert">{t(error)}</p></div>;
  return user ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  return user ? <Navigate to={getPostAuthDestination(location.state)} replace /> : <>{children}</>;
}
