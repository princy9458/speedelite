"use client";

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
    </div>
  );
}
