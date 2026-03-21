"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Calendar, MapPin, Ticket, ShieldCheck, Clock, Globe, Video, Home } from "lucide-react";
import Image from "next/image";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";

export default function ConfirmationPage() {
  const router = useRouter();
  const { eventId, lang, role, confirmation, interview, paymentData, reset } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const t = getDictionary(lang);

  useEffect(() => {
    if (!eventId || !confirmation) {
      router.push("/apply/select-event");
      return;
    }
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [eventId, confirmation, router]);

  const eventTitle = lang === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const eventDateStr = event?.date ? new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US") : "";
  const eventLocation = lang === "hr" ? event?.translations?.hr?.location || event?.location : event?.translations?.en?.location || event?.location;

  const basePrice = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;
  // Note: Simplified discount calculation for summary consistency
  const finalPrice = confirmation ? basePrice : basePrice; 

  const handleFinish = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
      <ProgressSteps steps={t.apply.steps} currentStep={5} />

      <div className="mx-auto max-w-[1000px] space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-white">
            {lang === "hr" ? "Prijava uspješno zaprimljena!" : "Application Successfully Received!"}
          </h1>
          <p className="text-lg leading-relaxed text-white/60">
            {lang === "hr" 
              ? "Hvala vam na prijavi za SpeedElite Dating! Vaša prijava je uspješno zaprimljena i trenutno je u obradi. Obavijestit ćemo vas putem emaila, a ako budete odabrani, kontaktirat ćemo vas radi video verifikacije identiteta i kratkog intervjua (do 3 minute)."
              : "Thank you for applying to SpeedElite Dating! Your application has been successfully received and is currently being processed. We will notify you via email, and if you are selected, we will contact you for a video identity verification and a short interview (up to 3 minutes)."
            }
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            {/* Left Column: Event & Payment Summary */}
            <div className="border-r border-white/10 p-10 space-y-8">
               <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                  {event?.featuredImage && (
                    <Image src={event.featuredImage} alt={eventTitle} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-6 left-6">
                    <h2 className="font-serif text-3xl font-bold text-white mb-2">{eventTitle}</h2>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="grid gap-4">
                     <div className="flex items-center gap-3 text-white/60">
                        <Calendar className="h-5 w-5 text-[#d4af37]" />
                        <span>{eventDateStr} {event?.time}h</span>
                     </div>
                     <div className="flex items-center gap-3 text-white/60">
                        <MapPin className="h-5 w-5 text-[#d4af37]" />
                        <span>{eventLocation}</span>
                     </div>
                  </div>

                  <div className="h-px w-full bg-white/5" />

                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-center text-white/40">
                        <span className="uppercase tracking-widest">{lang === "hr" ? "Kod za popust" : "Coupon Code"}</span>
                        <span>{paymentData.discountCode || "-"}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[#d4af37]">
                           <Ticket className="h-4 w-4" />
                           <span className="uppercase tracking-widest font-medium">0 % popust</span>
                        </div>
                        <span className="text-[#d4af37]">-1.00 EUR</span>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-white/80 font-medium">{lang === "hr" ? "Ukupno" : "Total"}</span>
                        <span className="text-xl font-bold text-white">{basePrice} EUR</span>
                     </div>
                     <div className="flex justify-between items-center text-white/40">
                        <span className="uppercase tracking-widest">{lang === "hr" ? "Plaćanje" : "Payment"}</span>
                        <span className="text-[#4caf50] uppercase font-bold tracking-tighter">{lang === "hr" ? "Uspješno" : "Success"}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Interview Summary */}
            <div className="bg-white/[0.02] p-10 space-y-8">
               <div className="flex items-center gap-4 text-white/90">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif text-white">{lang === "hr" ? "Podaci o intervjuu" : "Interview Details"}</h3>
               </div>

               <div className="rounded-2xl border border-white/5 bg-white/5 p-6 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center border border-white/10">
                        <Home className="h-5 w-5 text-white/40" />
                     </div>
                     <span className="text-lg font-medium text-white/90">dev User</span>
                  </div>

                  <div className="space-y-4 text-white/60">
                     <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-white/30" />
                        <span>{interview?.time || "N/A"}, {interview?.date ? new Date(interview.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-white/30" />
                        <span>{interview?.timezone || "Europe/Zagreb"}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-white/30" />
                        <span>{lang === "hr" ? "Detalji o web konferenciji slijede." : "Web conference details to follow."}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
           <button
             onClick={handleFinish}
             className="gold-gradient rounded-xl px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[0_12px_32px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.98]"
           >
             {lang === "hr" ? "Natrag na naslovnu" : "Back to Home"}
           </button>
        </div>
      </div>
    </div>
  );
}
