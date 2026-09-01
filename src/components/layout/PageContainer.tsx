import type { ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('min-h-screen bg-[#f8fafc] text-slate-800', className)}>
      <div className="mx-auto max-w-[1440px] px-6 py-7 lg:px-10">{children}</div>
    </div>
  );
}
