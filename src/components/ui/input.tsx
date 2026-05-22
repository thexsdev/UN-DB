import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- LABEL ---
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, children, ...props }) => (
  <label className={twMerge('block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2', className)} {...props}>
    {children}
  </label>
);

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={twMerge(
          clsx(
            'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
          ),
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// --- TEXTAREA ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={twMerge(
          clsx(
            'flex min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 resize-y'
          ),
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// --- SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={twMerge(
          clsx(
            'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-500/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 appearance-none'
          ),
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
export default Input;
