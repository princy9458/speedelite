import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
};

export default function Card({ children, className, title, description, headerAction }: CardProps) {
  return (
    <div className={cn('bg-[#121212] border border-white/5 rounded-2xl overflow-hidden', className)}>
      {(title || description || headerAction) && (
        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-semibold text-white/90">{title}</h3>}
            {description && <p className="text-xs text-white/40 mt-1">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
