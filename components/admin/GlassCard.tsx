import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn('glass-card border border-white/10 rounded-2xl', className)}>
      {children}
    </div>
  );
}
