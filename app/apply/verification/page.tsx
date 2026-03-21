"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Clock, Globe, Video, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

      {/* Premium Booking Modal */}
      <AnimatePresence>
        {showCalendar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80" 
              onClick={() => setShowCalendar(false)} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-[900px] overflow-hidden rounded-[20px] bg-[#121212] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/[0.08] flex"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute right-6 top-6 z-20 rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-[300px_1fr] w-full">
                {/* Left Side: Premium Info Panel */}
                <div className="bg-[#0B0B0B] p-12 space-y-10 border-r border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C9A646,#F6E27A)] p-0.5 shadow-[0_0_20px_rgba(201,166,70,0.3)]">
                       <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                          <span className="font-serif text-xl font-bold text-white tracking-widest">SE</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-3xl font-serif text-white leading-tight">
                      {lang === "hr" ? "Online video selekcija" : "Online video selection"}
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 text-white/70">
                        <Clock className="h-5 w-5 text-[#C9A646]" />
                        <span className="text-sm font-medium tracking-wide">
                          {lang === "hr" ? "trajanje 3 min" : "3 min duration"}
                        </span>
                      </div>
                      <div className="flex items-start gap-4 text-white/50">
                        <Video className="mt-1 h-5 w-5 shrink-0 text-[#C9A646]/60" />
                        <span className="text-[13px] leading-relaxed">
                          {lang === "hr" 
                            ? "Detalji web konferencije bit će dostavljeni nakon potvrde termina." 
                            : "Web conferencing details provided upon confirmation."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Luxury Calendar Panel */}
                <div className="p-12 bg-[#121212]/50 backdrop-blur-md relative overflow-hidden">
                  {/* Background Subtle Glow */}
                  <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A646]/5 rounded-full blur-[100px]" />
                  
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-serif text-white">
                        {lang === "hr" ? "Odaberite datum:" : "Select a Date:"}
                      </h4>
                      <div className="flex items-center gap-6">
                         <button className="text-white/40 hover:text-[#C9A646] transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                         <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">
                           {lang === "hr" ? "Ožujak 2026" : "March 2026"}
                         </span>
                         <button className="text-white/40 hover:text-[#C9A646] transition-colors"><ChevronRight className="h-5 w-5" /></button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5 pb-4">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d}>{d}</div>)}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 31 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = day === 26;
                          const isToday = day === 20;
                          const isDisabled = day < 20;
                          
                          return (
                            <button
                              key={i}
                              disabled={isDisabled}
                              onClick={() => handleSelectSlot(`2026-03-${day.toString().padStart(2, '0')}`, "17:00")}
                              className={cn(
                                "aspect-square rounded-full flex items-center justify-center text-[13px] font-medium transition-all duration-300 relative group",
                                isDisabled ? "text-white/10 cursor-not-allowed" : 
                                isSelected ? "bg-[linear-gradient(135deg,#C9A646,#F6E27A)] text-black font-bold scale-110 shadow-[0_0_20px_rgba(201,166,70,0.4)]" :
                                isToday ? "text-[#C9A646] font-bold bg-[#C9A646]/10 ring-1 ring-[#C9A646]/20" :
                                "text-white/60 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {day}
                              {!isDisabled && !isSelected && (
                                <div className="absolute inset-0 rounded-full bg-[#C9A646]/0 group-hover:bg-[#C9A646]/5 transition-all duration-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => handleSelectSlot("2026-03-26", "17:00")}
                        className="bg-[linear-gradient(135deg,#C9A646,#F6E27A)] rounded-full px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black shadow-[0_12px_32px_rgba(201,166,70,0.3)] transition hover:brightness-110 hover:shadow-[0_12px_40px_rgba(201,166,70,0.4)] active:scale-[0.98]"
                      >
                        {lang === "hr" ? "Potvrdi termin" : "Confirm Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
