import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-10 text-center text-slate-400">
      {icon && <span className="text-lg">{icon}</span>}
      <div className="text-[11px] font-medium text-slate-500">{title}</div>
      {description && <div className="max-w-sm text-[11px] leading-5 text-slate-400">{description}</div>}
      {action}
    </div>
  );
}
