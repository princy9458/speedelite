import { cn } from '@/lib/utils';

type BadgeProps = {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
};

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  info: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  neutral: 'bg-white/10 text-white/60 border-white/15',
};

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-widest',
        variants[variant]
      )}
    >
      {label}
    </span>
  );
}
