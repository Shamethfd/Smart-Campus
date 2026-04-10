import { cn } from '../../lib/cn';

export default function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('border-b border-slate-200 px-6 py-4', className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

