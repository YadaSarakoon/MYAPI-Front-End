import type { ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cx('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className={cx(padded ? 'p-5' : '')}>{children}</div>
    </div>
  );
}
