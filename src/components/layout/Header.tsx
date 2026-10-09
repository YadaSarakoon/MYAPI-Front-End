import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLanguage } from '../../i18n/language';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Header({
  title,
  subtitle,
  badge,
  actions,
  userName = 'My Company',
  userMeta = 'Production Account',
  className = '',
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  userName?: string;
  userMeta?: string;
  className?: string;
  language?: 'th' | 'en';
  setLanguage?: (language: 'th' | 'en') => void;
}) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const accountName = user?.user_metadata?.full_name || user?.email || userName;

  return (
    <header className={cx('border-b border-slate-200 bg-white', className)}>
      <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-6 px-6 py-6 lg:px-10">
        
        {/* Left Content */}
        <div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {t(title)}
            </h1>

            {badge}
          </div>

          {subtitle && (
            <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-500">
              {t(subtitle)}
            </p>
          )}
        </div>

        {/* Right Content */}
        <div className="flex shrink-0 items-center gap-4">
          
          {/* Profile Account */}
          <Link
            to="/settings"
            aria-label={t("Open account settings")}
            title={t("Open account settings")}
            className="group flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 transition group-hover:bg-indigo-100">
              {accountName.charAt(0).toUpperCase()}
            </div>

            {/* User Information */}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">
                {accountName}
              </p>

              <p className="text-[10px] text-slate-400">
                {user?.email || t(userMeta)}
              </p>
            </div>

          </Link>
          <div className="h-6 w-px bg-slate-200" />
          {actions ?? <LanguageSwitcher />}
        </div>
      </div>
    </header>
  );
}
