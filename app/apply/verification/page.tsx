"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CheckCircle } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import EventSummaryCard from "@/components/apply/EventSummaryCard";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { motion } from "motion/react";

export default function VerificationPage() {
  const router = useRouter();
  const { lang, eventId, role, confirmation } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [status, setStatus] = useState<"verifying" | "success">("verifying");
  const t = getDictionary(lang);

  useEffect(() => {
    if (!eventId) {
      router.push("/apply/select-event");
      return;
    }

    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent);

    // Simulate verification process
    const timer = setTimeout(() => {
      setStatus("success");
      const redirectTimer = setTimeout(() => {
        router.push("/apply/confirmation");
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }, 3500);

    return () => clearTimeout(timer);
  }, [eventId, router]);

  return (
    <div className="space-y-10">
      <ProgressSteps steps={t.apply.steps} currentStep={4} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-12 space-y-12 text-center flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden border-t border-white/[0.05] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
          {/* Ambient Glow */}
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 4</p>
            <h1 className="text-4xl font-serif text-white">{t.apply.steps[3]}</h1>
          </div>

          <div className="relative flex flex-col items-center max-w-sm mx-auto">
            {status === "verifying" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[#d5ad5b]/20" />
                  <div className="relative h-20 w-20 rounded-full border border-white/10 bg-black/40 flex items-center justify-center shadow-[0_0_40px_rgba(213,173,91,0.15)]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#d5ad5b]" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-medium text-white/90">Curating your experience</h2>
                  <p className="text-sm text-white/50 leading-relaxed">
                    We are verifying your booking details and securing your spot in this exclusive event.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                className="flex flex-col items-center space-y-8"
              >
                <div className="h-20 w-20 rounded-full bg-[#d5ad5b] flex items-center justify-center shadow-[0_0_50px_rgba(213,173,91,0.4)]">
                  <CheckCircle className="h-10 w-10 text-black stroke-[2.5px]" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold gold-text">Verification Successful</h2>
                  <p className="text-sm text-white/60">
                    Your spot is secure. Redirecting to your confirmation...
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Secure Verification System
            </div>
          </div>
        </div>

        <div className="lg:pt-4">
          <div className="lg:sticky lg:top-[100px]">
            <EventSummaryCard lang={lang} role={role} event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
