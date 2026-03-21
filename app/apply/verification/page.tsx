"use client";

<<<<<<< HEAD
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
=======
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Clock, Globe, Video, ChevronLeft, ChevronRight, X } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

export default function VerificationPage() {
  const router = useRouter();
  const { lang, interview, setInterview } = useBookingStore();
  const t = getDictionary(lang);
  const [showCalendar, setShowCalendar] = useState(false);

  // Simulated slot selection
  const handleSelectSlot = (date: string, time: string) => {
    setInterview({
      date,
      time,
      timezone: "Europe/Zagreb",
    });
    setShowCalendar(false);
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
      <ProgressSteps steps={t.apply.steps} currentStep={4} />

      <div className="mx-auto max-w-[800px] space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-white">
            {lang === "hr" ? "Rezervacija video intervjua" : "Video Interview Booking"}
          </h1>
          <p className="text-lg leading-relaxed text-white/60">
            {lang === "hr"
              ? "Kako bismo osigurali ozbiljnost prijavnog procesa i kvalitetniju selekciju kandidata, nakon prijave slijedi i kratki video intervju (u trajanju do 3 minute). Cilj je potvrditi identitet prijavljenih te steći bolji uvid u njihove osobine, interese i motivaciju."
              : "To ensure the integrity of the application process and better selection of candidates, a short video interview (up to 3 minutes) follows the application. The goal is to confirm the identity of the applicants and gain better insight into their characteristics, interests, and motivation."
            }
          </p>
        </div>

        {!interview ? (
          <div className="pt-4">
            <button
              onClick={() => setShowCalendar(true)}
              className="gold-gradient rounded-xl px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[0_12px_32px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.98]"
            >
              {lang === "hr" ? "Rezerviraj termin" : "Book a slot"}
            </button>
          </div>
        ) : (
          <div className="space-y-8 pt-4">
            <button
              onClick={() => setShowCalendar(true)}
              className="gold-gradient rounded-xl px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black shadow-[0_8px_24px_rgba(212,175,55,0.15)] transition hover:brightness-110 active:scale-[0.98]"
            >
              {lang === "hr" ? "Promjeni termin" : "Change slot"}
            </button>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-white/90">
                    <ShieldCheck className="h-6 w-6 text-[#d4af37]" />
                    <span className="text-xl font-medium">dev User</span>
                 </div>

                 <div className="grid gap-4 text-white/60">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-white/30" />
                      <span>{interview.time}, {new Date(interview.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-white/30" />
                      <span>{interview.timezone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-white/30" />
                      <span>{lang === "hr" ? "Detalji o web konferenciji slijede." : "Web conference details to follow."}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
          <button
            onClick={() => router.push("/apply/payment")}
            className="rounded-xl border border-white/20 px-10 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/5"
          >
            {t.common.back}
          </button>

          <button
            disabled={!interview}
            onClick={() => router.push("/apply/confirmation")}
            className={cn(
              "rounded-xl px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] transition active:scale-[0.98] shadow-2xl",
              interview
                ? "gold-gradient text-black shadow-[0_12px_32px_rgba(212,175,55,0.2)]"
                : "bg-white/10 text-white/20 cursor-not-allowed border border-white/5"
            )}
          >
            {lang === "hr" ? "Završetak" : "Finish"}
          </button>
        </div>
      </div>

      {/* Calendar Selection Overlay (Simulated) */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCalendar(false)} />

          <div className="relative w-full max-w-[900px] overflow-hidden rounded-[32px] bg-white text-black shadow-2xl">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-black/20 hover:bg-black/5 hover:text-black transition"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid md:grid-cols-[320px_1fr]">
              {/* Left Side: Info */}
              <div className="border-r border-black/5 bg-[#fafafa] p-10 space-y-8">
                <div className="flex items-center gap-3 text-black">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                     <span className="font-serif text-xl font-bold text-white">YY</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold leading-tight">Online video selekcija</h3>
                  <div className="space-y-4 text-black/60">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">trajanje 3 min</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Video className="mt-1 h-5 w-5 shrink-0" />
                      <span className="text-sm">Detalji web konferencije bit će dostavljeni nakon potvrde termina.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Calendar Component */}
              <div className="p-12">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold">Odaberite datum:</h4>
                    <div className="flex items-center gap-2">
                       <button className="rounded-full p-2 hover:bg-black/5"><ChevronLeft className="h-5 w-5" /></button>
                       <span className="font-medium">March 2026</span>
                       <button className="rounded-full p-2 hover:bg-black/5"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-black/40">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} className="py-2">{d}</div>)}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = day === 26;
                      const isToday = day === 20;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectSlot(`2026-03-${day.toString().padStart(2, '0')}`, "5:00 PM")}
                          className={cn(
                            "aspect-square rounded-full flex items-center justify-center transition-all",
                            isSelected ? "bg-[#d4af37] text-white font-bold scale-110 shadow-lg" :
                            isToday ? "bg-black/5 text-black font-bold ring-1 ring-black/10" :
                            "hover:bg-black/5 text-black/80"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> 31490afb0a8ab539e02129142ec0b15d0a9b92fe
    </div>
  );
}
