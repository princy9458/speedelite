import ApplyHeader from "@/components/apply/ApplyHeader";

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#E5E2E1] selection:bg-[#C9A646]/30">
      {/* Obsidian Gala Metallic Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,166,70,0.15),transparent_70%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(201,166,70,0.08),transparent_60%)]" />
      <ApplyHeader />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-all duration-700">{children}</main>
    </div>
  );
}
