import ApplyHeader from "@/components/apply/ApplyHeader";

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#131313] text-[#E5E2E1] selection:bg-[#D4AF37]/30">
      {/* Obsidian Gala Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.18),transparent_60%)]" />
      <ApplyHeader />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700">{children}</main>
    </div>
  );
}
