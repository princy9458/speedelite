"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/apply/ProgressSteps";
import EventSummaryCard from "@/components/apply/EventSummaryCard";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { useState } from "react";

export default function ConfirmationPage() {
  const router = useRouter();
  const { lang, confirmation, eventId, role } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const t = getDictionary(lang);

  useEffect(() => {
    if (!confirmation) {
      router.replace("/apply/select-event");
      return;
    }

    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then((res) => res.json())
        .then(setEvent);
    }
  }, [confirmation, eventId, router]);

  return (
    <div className="space-y-10">
      <ProgressSteps steps={t.apply.steps} currentStep={5} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-12 space-y-12 text-center flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden border-t border-white/[0.05] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
          
          <div className="relative space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 5</p>
            <h1 className="text-4xl font-serif gold-text">{t.apply.steps[4]}</h1>
          </div>
          
          <div className="space-y-6 max-w-md">
            <p className="text-white/70 leading-relaxed text-lg">
              {confirmation?.message || t.apply.confirmationMessage}
            </p>
            
            {confirmation?.bookingNumber ? (
              <div className="mx-auto rounded-[20px] border border-[#d5ad5b]/20 bg-[#d5ad5b]/5 px-8 py-5 shadow-[0_0_40px_rgba(213,173,91,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">{t.apply.confirmationNumber}</p>
                <p className="text-3xl font-serif gold-text tracking-wider">{confirmation.bookingNumber}</p>
              </div>
            ) : null}
          </div>

          <Link href="/" className="gold-gradient text-black font-bold px-10 py-4 rounded-xl text-sm uppercase tracking-widest inline-block shadow-[0_12px_32px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform mt-4">
            {t.apply.confirmationCta}
          </Link>
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
