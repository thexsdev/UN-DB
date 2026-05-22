import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
            {
              'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/10': variant === 'primary',
              'bg-slate-100 text-slate-800 hover:bg-slate-200': variant === 'secondary',
              'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100': variant === 'danger',
              'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300': variant === 'outline',
              
              // Tamanhos
              'px-3 py-1.5 text-xs rounded-lg': size === 'sm',
              'px-4 py-2.5 text-sm': size === 'md',
              'px-6 py-3 text-base': size === 'lg',
            },
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
