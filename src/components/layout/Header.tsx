import type { ReactNode } from 'react';

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
}) {
  return (
    <header className={cx('border-b border-slate-200 bg-white', className)}>
      <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-6 px-6 py-6 lg:px-10">
        <div>
          {badge && <div className="flex flex-wrap items-center gap-2">{badge}</div>}
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {actions}

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{userName}</p>
              <p className="text-[10px] text-slate-400">{userMeta}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
