import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useLanguage } from '../../i18n/language';
import { useAuth } from './useAuth';
import { getPostAuthDestination } from './authRedirect';

export function AuthCallback() {
  const { t } = useLanguage();
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Capture the result before the Auth SDK removes the token fragment.
  const [result] = useState(() => {
    const query = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.slice(1));
    return { error: query.get('error') || hash.get('error'), next: getPostAuthDestination({ from: query.get('next') }) };
  });
  const succeeded = !loading && !error && !result.error && Boolean(user);
  useEffect(() => {
    // Successful navigation already replaces the callback. Clean failed returns
    // through the router too, keeping its location in sync with browser history.
    if (!loading && !succeeded && (location.hash || new URLSearchParams(location.search).has('error'))) {
      navigate(`/auth/callback?${new URLSearchParams({ next: result.next })}`, { replace: true });
    }
  }, [loading, succeeded, location.hash, location.search, navigate, result.next]);
  if (succeeded) return <Navigate to={result.next} replace />;
  const failed = !loading || Boolean(result.error);
  return <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center">
    <div className="fixed right-4 top-4 z-40"><LanguageSwitcher /></div>
    <h1 className="text-xl font-bold">{t(failed ? 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่' : 'กำลังดำเนินการเข้าสู่ระบบ…')}</h1>
    {failed && <>
      <p role="alert">{t(result.error === 'access_denied' ? 'คุณยกเลิกการเข้าสู่ระบบด้วย Google สามารถลองใหม่ได้' : error || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่')}</p>
      <Link to="/login" state={{ from: result.next }} replace className="rounded-lg bg-blue-600 px-4 py-3 text-white">{t('กลับไปเข้าสู่ระบบ')}</Link>
    </>}
  </main>;
}
