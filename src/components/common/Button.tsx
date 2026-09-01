import type { ButtonHTMLAttributes, ReactNode } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}) {
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'text-indigo-700 hover:bg-indigo-50',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-[10px] font-bold',
    md: 'px-3 py-2 text-[11px] font-semibold',
  };

  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center rounded-lg transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-100',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
