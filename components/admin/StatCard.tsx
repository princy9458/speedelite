import GlassCard from './GlassCard';

type StatCardProps = {
  label: string;
  value: string | number;
  trend?: string;
};

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <GlassCard className="p-6 space-y-3">
      <p className="text-xs uppercase tracking-[0.25em] text-white/50">{label}</p>
      <div className="flex items-end justify-between gap-4">
        <p className="text-4xl font-serif">{value}</p>
        {trend ? <span className="text-xs text-emerald-300">{trend}</span> : null}
      </div>
    </GlassCard>
  );
}
