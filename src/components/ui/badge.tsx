import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'neutral', children, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border',
          {
            'bg-emerald-50 text-emerald-700 border-emerald-200': variant === 'success',
            'bg-amber-50 text-amber-700 border-amber-200': variant === 'warning',
            'bg-rose-50 text-rose-700 border-rose-200': variant === 'danger',
            'bg-sky-50 text-sky-700 border-sky-200': variant === 'info',
            'bg-purple-50 text-purple-700 border-purple-200': variant === 'purple',
            'bg-slate-50 text-slate-600 border-slate-200': variant === 'neutral',
          },
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
