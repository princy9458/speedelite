"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";
import { CheckCircle2, Calendar, MapPin, Ticket, ShieldCheck, Clock, Globe, Video, Home, User, Percent, Loader2 } from "lucide-react";
import Image from "next/image";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/lib/stores/bookingStore";

function ConfirmationContent() {
  const router = useRouter();
  const { eventId, role, confirmation, interview, paymentData, reset } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const t = useTranslations('apply');
  const locale = useLocale();

  const isLady = role === "lady";

  useEffect(() => {
    if (!eventId || !confirmation) {
      router.push("/apply/select-event");
      return;
    }
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [eventId, confirmation, router]);

  const eventTitle = locale === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const eventDateStr = event?.date ? new Date(event.date).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-US") : "";
  const eventLocation = locale === "hr" ? event?.translations?.hr?.location || event?.location : event?.translations?.en?.location || event?.location;

  const basePrice = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;
  const finalPrice = confirmation ? basePrice : basePrice; 

  const handleFinish = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
      <ProgressSteps steps={t.raw('steps')} currentStep={5} />

      <div className="mx-auto max-w-[1000px] space-y-10 text-left">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.34em] text-[#d5ad5b]/75">{t('stepLabel')} 5</p>
          <h1 className="text-[28px] font-bold text-white tracking-tight">{t('confirmationSuccessTitle')}</h1>
          <p className="text-[15.5px] leading-relaxed text-[#BFBFBF] max-w-3xl">{t('confirmationSuccessDesc')}</p>
        </div>

        {isLady && (
          <div className="rounded-[24px] border border-white/10 bg-[#16130D]/60 p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group transition-all hover:border-white/15">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E7C873]/5 blur-[100px] -z-10" />
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-shrink-0 bg-[#E7C873]/10 p-8 rounded-[32px] border border-[#E7C873]/20 shadow-lg transform transition-transform group-hover:scale-105">
                <Percent className="h-16 w-16 text-[#E7C873] stroke-[1.5px]" />
              </div>
              <div className="flex-1 space-y-6">
                 <div className="space-y-3">
                   <h2 className="text-[32px] font-bold text-[#E7C873] tracking-tight">{t('discountCouponTitle')}</h2>
                   <p className="text-[#BFBFBF] text-[15px] leading-relaxed max-w-xl">{t('discountCouponDesc')}</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="rounded-[16px] bg-black/40 border border-white/5 px-6 py-4 flex items-center gap-4 group/box transition-all hover:bg-black/60 shadow-inner">
                       <span className="text-[#E7C873]/60 font-medium text-[15px]">{t('codeLabel')}</span>
                       <span className="text-[20px] font-bold text-[#E7C873] tracking-wider select-all group-hover/box:scale-105 transition-transform">jZ9pnSd</span>
                    </div>
                    <p className="text-[#888888] text-[13px] leading-relaxed max-w-[240px]">{t('couponRewardDesc')}</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="rounded-[20px] border border-white/10 bg-[#16130D]/60 p-6 backdrop-blur-xl space-y-8">
             <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl group">
                {event?.featuredImage ? (
                  <Image src={event.featuredImage} alt={eventTitle} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-neutral-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{eventTitle}</h2>
                </div>
             </div>
             <div className="space-y-6">
                <div className="grid gap-4">
                   <div className="flex items-center gap-3 text-white/80">
                      <Calendar className="h-5 w-5 text-[#E7C873]" />
                      <span className="text-[15px] font-medium">{eventDateStr} {event?.time}h</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/80">
                      <MapPin className="h-5 w-5 text-[#E7C873]" />
                      <span className="text-[15px] font-medium">{eventLocation}</span>
                   </div>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="space-y-4 text-[14px]">
                   <div className="flex justify-between items-center text-white/60">
                      <span className="font-medium">{t('discountCodeLabel')}</span>
                      <span>—</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[#E7C873]">
                         <Ticket className="h-4 w-4" />
                         <span className="font-medium">0% {t('discountLabel')}</span>
                      </div>
                      <span className="text-[#E7C873]">-0.00 EUR</span>
                   </div>
                   <div className="h-px w-full bg-white/5" />
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-white/80 font-bold">{t('paymentTotal')}</span>
                      <span className="text-lg font-bold text-white">{finalPrice} EUR</span>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-white/60 font-medium">{t('statusLabel')}</span>
                      <span className="text-[#4caf50] font-bold">{t('statusSucceeded')}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-[#16130D]/60 p-8 backdrop-blur-xl space-y-6">
             <div className="flex items-center gap-4 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7C873]/10 text-[#E7C873]"><ShieldCheck className="h-6 w-6" /></div>
                <h3 className="text-xl font-bold tracking-tight">{t('interviewDataTitle')}</h3>
             </div>
             <div className="rounded-[16px] border border-white/5 bg-white/5 p-6 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center border border-white/10 text-white/40"><User className="h-5 w-5" /></div>
                   <span className="text-[17px] font-medium text-white/90">dev User</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-white/60">
                      <Clock className="h-5 w-5 text-white/20" />
                      <span className="text-[15px]">{interview?.time}, {interview?.date ? new Date(interview.date).toLocaleDateString(locale === 'hr' ? 'hr-HR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/60">
                      <Globe className="h-5 w-5 text-white/20" />
                      <span className="text-[15px]">{interview?.timezone}</span>
                   </div>
                   <div className="flex items-start gap-3 text-white/60">
                      <Video className="h-5 w-5 shrink-0 text-white/20 mt-0.5" />
                      <span className="text-[15px]">{t('conferenceDetailsFollow')}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex justify-start pt-10">
           <button onClick={handleFinish} className="bg-[linear-gradient(135deg,#E7C873,#D4AF37)] rounded-[10px] px-8 py-3 text-[14px] font-bold text-black shadow-lg transition-all hover:brightness-105 active:scale-[0.98]">
             {t('backToHome')}
           </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-[#D4AF37]" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
