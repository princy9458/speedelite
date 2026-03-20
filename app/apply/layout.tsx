import ApplyHeader from "@/components/apply/ApplyHeader";

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0907] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(213,173,91,0.12),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(213,173,91,0.08),_transparent_28%)]" />
      <ApplyHeader />
      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
