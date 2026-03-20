"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@speedelite.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6">
      <div className="glass-card border border-white/10 rounded-2xl p-8 w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Admin</p>
          <h1 className="text-3xl font-serif gold-text">Sign In</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-white/50">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#F4D693]/60 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-white/50">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#F4D693]/60 focus:outline-none"
            />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gold-gradient text-black font-bold py-3 rounded-xl text-sm uppercase tracking-widest disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
