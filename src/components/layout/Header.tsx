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
  language = 'th',
  setLanguage,
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
  return (
    <header className={cx('border-b border-slate-200 bg-white', className)}>
      <div className="mx-auto flex max-w-[1440px] items-start justify-between gap-6 px-6 py-6 lg:px-10">
        
        {/* Left Content */}
        <div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {title}
            </h1>

            {badge}
          </div>

          {subtitle && (
            <p className="mt-1 max-w-2xl text-xs leading-6 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Content */}
        <div className="flex shrink-0 items-center gap-4">
          
          {/* Actions */}
          {actions}

          {/* Language */}
          {setLanguage && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  language === 'th'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                ไทย
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  language === 'en'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                EN
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Profile Account */}
          <div className="flex items-center gap-2">
            
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* User Information */}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-[10px] text-slate-400">
                {userMeta}
              </p>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}