import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoDark.png';

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
  return (
    <aside
      className={cx(
        'flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white',
        className,
      )}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex h-[68px] shrink-0 items-center border-b border-slate-100 px-4 transition-opacity hover:opacity-80"
      >
        <img
          src={logo}
          alt="MyAPI"
          className="h-8 w-auto object-contain"
        />
      </Link>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Console
        </div>

        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive = activePath
              ? activePath === item.path
              : false;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cx(
                  'flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all',
                  isActive
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <span>{item.label}</span>

                {item.badge && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-slate-100 p-3">
          {footer}
        </div>
      )}
    </aside>
  );
}