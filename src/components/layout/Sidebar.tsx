import { useLanguage } from '../../i18n/language';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoDark.png';
import { useAdminAccess } from '../../features/contact/useAdminAccess';
import { LeadNotification } from '../../features/contact/LeadNotification';

export type SidebarItem = {
  label: string;
  path: string;
  badge?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Sidebar({
  items,
  activePath,
  footer,
  className = '',
}: {
  items: SidebarItem[];
  activePath?: string;
  title?: string;
  footer?: ReactNode;
  className?: string;
}) {
  const { t } = useLanguage();
  const { allowed: isAdmin, user } = useAdminAccess();
  return (
    <aside
      className={cx(
        'flex h-full w-16 shrink-0 flex-col border-r border-slate-200 bg-white md:w-[272px]',
        className,
      )}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex h-[68px] shrink-0 items-center justify-center border-b border-slate-100 px-2 transition-opacity hover:opacity-80 md:justify-start md:px-4"
      >
        <img
          src={logo}
          alt="MyAPI"
          className="hidden h-8 w-auto object-contain md:block"
        />
        <span className="text-sm font-black text-indigo-700 md:hidden">M</span>
      </Link>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <LeadNotification key={user?.id} enabled={isAdmin} />
        <div className="hidden px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 md:block">
          {t("Console")}</div>

        <div className="space-y-0.5">
          {(items.some((item) => item.path === '/dashboard') ? items : [{ label: 'Dashboard', path: '/dashboard' }, ...items]).map((item) => {
            const isActive = activePath
              ? activePath === item.path
              : false;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                aria-label={item.label}
                className={cx(
                  'flex w-full items-center justify-center gap-2.5 rounded-lg px-1 py-2 text-left text-xs transition-all md:justify-between md:px-2.5',
                  isActive
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <span className="font-bold md:hidden">{item.label.charAt(0)}</span>
                <span className="hidden md:inline">{t(item.label)}</span>

                {item.badge && (
                  <span className="hidden rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 md:inline">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="hidden px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 md:block">{t("Account")}</div>
          <Link to="/settings" title={t("Settings")} aria-label={t("Settings")} className={cx('flex w-full items-center justify-center rounded-lg px-1 py-2 text-left text-xs transition-all md:justify-start md:px-2.5', activePath === '/settings' ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}><span className="font-bold md:hidden">S</span><span className="hidden md:inline">{t("Settings")}</span></Link>
        </div>
      </nav>

      {/* Footer */}
      {footer && (
        <div className="overflow-hidden border-t border-slate-100 p-1 md:p-3">
          {footer}
        </div>
      )}
    </aside>
  );
}
