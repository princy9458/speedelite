import { cn } from '@/lib/utils';

type TabOption = {
  label: string;
  value: string;
};

type TabsProps = {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function Tabs({ options, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all',
            value === option.value
              ? 'bg-white/10 text-white shadow-sm shadow-black/50'
              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
