"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Info, Calendar, MapPin, Ticket, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import ProgressSteps from "@/components/apply/ProgressSteps";
import ApplySidebar from "@/components/apply/ApplySidebar";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { bookingFormSchema, bookingPaymentSchema } from "@/lib/validators/booking";
import { cn } from "@/lib/utils";
import { z } from "zod";

export default function PaymentPage() {
  const router = useRouter();
  const imagePathSchema = z
  .string()
  .min(1, "Image is required");
  const {
    eventId,
    role,
    lang,
    formData,
    uploads,
    paymentData,
    updatePayment,
    setConfirmation,
  } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"input" | "success">("input");
  const [couponCode, setCouponCode] = useState(paymentData.discountCode || "");
  const [discount, setDiscount] = useState(0);
  const t = getDictionary(lang);

  useEffect(() => {
    if (!eventId) {
      router.push("/apply/select-event");
      return;
    }
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [eventId, router]);

  const basePrice = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;
  const finalPrice = Math.max(0, basePrice * (1 - discount));
  const eventTitle = lang === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const eventDateStr = event?.date ? new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US") : "";

  const handleAutoFill = () => {
    updatePayment({
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/26",
      cvc: "123",
    });
    toast.success("Payment details auto-filled");
  };

  const uploadBookingImage = async (file: File) => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "bookings");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: payload,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      throw new Error(data?.error || t.apply.imageUploadError);
    }

    return data.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !event || !role) return;

    const paymentCheck = bookingPaymentSchema.safeParse(paymentData);
    if (!paymentCheck.success) {
      toast.error(t.apply.paymentValidationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const [facePhoto, bodyPhoto] = await Promise.all([
        uploads.facePhoto?.url ? Promise.resolve(uploads.facePhoto.url) : uploadBookingImage(uploads.facePhoto!.file!),
        uploads.bodyPhoto?.url ? Promise.resolve(uploads.bodyPhoto.url) : uploadBookingImage(uploads.bodyPhoto!.file!),
      ]);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          role,
          lang,
          amountPaid: finalPrice,
          paymentStatus: "paid",
          currency: "EUR",
          couponCode: paymentData.discountCode,
          paymentSummary: {
            last4: paymentData.cardNumber.slice(-4),
            expiry: paymentData.expiry,
          },
          form: formData,
          images: {
            facePhoto,
            bodyPhoto,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error?.formErrors?.[0] || data?.message || "Unable to complete booking");
        return;
      }

      setConfirmation({
        bookingId: data.bookingId,
        bookingNumber: data.bookingNumber,
        message: data.message || t.apply.submitSuccessBody,
      });
      setView("success");
      toast.success("Payment Successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === "success") {
    return (
      <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
        <ProgressSteps steps={t.apply.steps} currentStep={3} />
        
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <Check className="h-10 w-10 stroke-[3px]" />
          </div>
          <h1 className="text-4xl font-serif text-white">{lang === "hr" ? "Plaćanje uspješno" : "Payment Successful"}</h1>
          <p className="text-white/60">
            {lang === "hr" ? "Uplata je uspješno izvršena. Još jedan korak do završetka prijave." : "Payment has been processed successfully. One more step to complete your application."}
          </p>
        </div>

        <div className="mx-auto max-w-[900px]">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="grid md:grid-cols-[1fr_1.2fr]">
              {/* Left Side: Event Block */}
              <div className="relative aspect-square md:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                {event?.featuredImage && (
                  <Image
                    src={event.featuredImage}
                    alt={eventTitle}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-8 left-8 z-20">
                  <h2 className="font-serif text-4xl font-bold text-white mb-4">{eventTitle}</h2>
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg font-medium">{eventDateStr} {event?.time}h</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Details Block */}
              <div className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-white/50">
                    <span className="text-sm uppercase tracking-widest">{lang === "hr" ? "Kod za popust" : "Coupon Code"}</span>
                    <span className="text-sm">{paymentData.discountCode || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90">
                      <Ticket className="h-5 w-5 text-[#d4af37]" />
                      <span className="text-sm font-medium uppercase tracking-widest text-[#d4af37]">{lang === "hr" ? "Popust" : "Discount"}</span>
                    </div>
                    <span className="text-xl font-bold text-[#d4af37]">-{basePrice - finalPrice} EUR</span>
                  </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold text-white">Total</span>
                    <span className="text-2xl font-serif font-bold text-white">{finalPrice} EUR</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-white/50">
                    <span className="text-sm uppercase tracking-widest">{lang === "hr" ? "Plaćanje" : "Payment"}</span>
                    <span className="text-sm">Simulated *{paymentData.cardNumber.slice(-4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
             <button
                onClick={() => router.push("/apply/verification")}
                className="gold-gradient rounded-full px-16 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[0_16px_36px_rgba(212,175,55,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
             >
                {lang === "hr" ? "Sljedeći korak" : "Next Step"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] space-y-12 pb-20">
      <ProgressSteps steps={t.apply.steps} currentStep={3} />
      
      <div className="flex justify-end">
        <button
          onClick={handleAutoFill}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/40 transition hover:border-[#d5ad5b]/30 hover:bg-white/10 hover:text-[#f0ca7d]"
        >
          <Sparkles className="h-3 w-3 group-hover:animate-pulse" />
          Auto-fill (Testing)
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Payment Form */}
        <div className="space-y-14">
          <h1 className="text-6xl font-serif text-white tracking-tight">{lang === "hr" ? "Plaćanje" : "Payment"}</h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              {/* Card Number */}
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-[0.35em] font-bold text-white/30">{t.apply.paymentCardNumber}</label>
                <input
                  value={paymentData.cardNumber}
                  onChange={(e) => updatePayment({ cardNumber: e.target.value })}
                  placeholder="1234 1234 1234 1234"
                  className="w-full h-[52px] rounded-[12px] border border-white/5 bg-white/[0.05] px-6 text-base text-white focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#C9A646]/30 transition-all placeholder:text-white/10"
                  required
                />
                <div className="flex gap-2.5 pt-2.5">
                  <div className="h-6 w-10 bg-white rounded-[6px] flex items-center justify-center p-1 shadow-sm border border-white/10">
                     <img src="/icons/visa.svg" alt="Visa" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-6 w-10 bg-white rounded-[6px] flex items-center justify-center p-1 shadow-sm border border-white/10">
                     <img src="/icons/mastercard.svg" alt="Mastercard" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-6 w-10 bg-white rounded-[6px] flex items-center justify-center p-1 shadow-sm border border-white/10">
                     <img src="/icons/amex.svg" alt="Amex" className="h-full w-full object-contain" />
                  </div>
                  <div className="h-6 w-10 bg-white rounded-[6px] flex items-center justify-center p-1 shadow-sm border border-white/10">
                     <img src="/icons/maestro.svg" alt="Maestro" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid gap-10 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="text-[11px] uppercase tracking-[0.35em] font-bold text-white/30">{t.apply.paymentExpiry} (MM/YY)</label>
                  <input
                    value={paymentData.expiry}
                    onChange={(e) => updatePayment({ expiry: e.target.value })}
                    placeholder="MM / YY"
                    className="w-full h-[52px] rounded-[12px] border border-white/5 bg-white/[0.05] px-6 text-base text-white focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#C9A646]/30 transition-all placeholder:text-white/10"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] uppercase tracking-[0.35em] font-bold text-white/30">{t.apply.paymentCvc}</label>
                  <input
                    value={paymentData.cvc}
                    onChange={(e) => updatePayment({ cvc: e.target.value })}
                    placeholder="CVC"
                    className="w-full h-[52px] rounded-[12px] border border-white/5 bg-white/[0.05] px-6 text-base text-white focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#C9A646]/30 transition-all placeholder:text-white/10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Info Box (Refund) */}
            <div className="flex gap-5 rounded-[12px] bg-white/[0.04] p-6 backdrop-blur-md border border-white/5 items-center">
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40">
                 <Info className="h-5 w-5" />
               </div>
               <p className="text-[11px] leading-[1.6] text-white/50 max-w-[500px]">
                 {t.apply.paymentDescription}
               </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-12">
              <button
                type="button"
                onClick={() => router.push("/apply/form")}
                className="rounded-lg border border-white/10 bg-black/40 px-12 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/5 active:scale-[0.98]"
              >
                {lang === "hr" ? "Povratak" : "Back"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[linear-gradient(135deg,#C9A646,#F6E27A)] flex items-center justify-center rounded-full px-7 py-3 text-[12px] font-bold uppercase tracking-[0.25em] text-black shadow-[0_0_25px_rgba(201,166,70,0.5)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50 min-w-[200px]"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  lang === "hr" ? "Potvrdi plaćanje" : "Go to payment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Summary */}
        <aside className="sticky top-[120px] self-start">
           <ApplySidebar />
        </aside>
      </div>
    </div>
  );
}
