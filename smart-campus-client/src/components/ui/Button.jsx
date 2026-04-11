import { cn } from '../../lib/cn';

const VARIANT = {
  primary:
    'bg-primary text-white shadow-sm hover:brightness-110 active:brightness-105',
  secondary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-700',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100',
  ghost: 'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-700',
};

const SIZE = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export default function Button({
  as: Comp = 'button',
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-slate-50',
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

