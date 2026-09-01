import type { ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Badge({
  children,
  tone = 'slate',
  className = '',
}: {
  children: ReactNode;
  tone?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
  className?: string;
}) {
  const tones = {
    slate: 'border border-slate-200 bg-slate-50 text-slate-600',
    indigo: 'border border-indigo-200 bg-indigo-50 text-indigo-700',
    emerald: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border border-amber-200 bg-amber-50 text-amber-700',
    rose: 'border border-rose-200 bg-rose-50 text-rose-700',
  };

  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', tones[tone], className)}>
      {children}
    </span>
  );
}
