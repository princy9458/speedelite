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
      <div className="mx-auto max-w-[1240px] px-6 pb-20 space-y-12">
        <ProgressSteps steps={t.apply.steps} currentStep={3} />
        
        {/* Header Section (Left Aligned) */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-bold text-white tracking-tight">{lang === "hr" ? "Plaćanje uspješno" : "Payment successful"}</h1>
          <p className="text-[15px] text-white/70 max-w-2xl leading-relaxed">
            {lang === "hr" ? "Uplata je uspješno izvršena. Još jedan korak do završetka prijave." : "Payment has been successfully made. One more step to complete your registration."}
          </p>
        </div>

        <div className="max-w-[840px]">
          {/* Main Success Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#16130D]/60 backdrop-blur-xl shadow-2xl p-6">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              {/* LEFT side: Event Card */}
              <div className="w-full md:w-[340px] space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] shadow-lg">
                  {event?.featuredImage && (
                    <Image
                      src={event.featuredImage}
                      alt={eventTitle}
                      fill
                      className="object-cover"
                    />
                  )}
                  {/* Image Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h2 className="text-[20px] font-bold text-white">Event 11</h2>
                  </div>
                </div>
                {/* Date under image */}
                <div className="flex items-center gap-2.5 text-white/60">
                  <Calendar className="h-4 w-4 text-[#E7C873]" />
                  <span className="text-[14px] font-medium">12/09/2026 19:00</span>
                </div>
              </div>

              {/* RIGHT side: Payment Details */}
              <div className="flex-1 flex flex-col justify-center space-y-5">
                {/* Date Row */}
                <div className="flex items-center gap-2.5 text-white/90">
                  <Calendar className="h-4 w-4 text-[#E7C873]" />
                  <span className="text-[14px] font-medium">12/09/2026 19:00h</span>
                </div>

                {/* Rows Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white/50">{lang === "hr" ? "Kod za popust:" : "Discount code:"}</span>
                    <span className="text-[14px] font-semibold text-white uppercase tracking-wider">ON</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Ticket className="h-4 w-4 text-[#E7C873]" />
                       <span className="text-[13px] font-medium text-white/50">{lang === "hr" ? "Popust" : "Discount"}</span>
                    </div>
                    <span className="text-[14px] font-bold text-[#E7C873]">--1.00 EUR</span>
                  </div>

                  <div className="h-[1px] w-full bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-bold text-white">Total</span>
                    <span className="text-[16px] font-bold text-white">2.00 EUR</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-white/40">{lang === "hr" ? "Plaćanje" : "Payment"}</span>
                    <span className="text-[13px] text-white/40 italic">Simulated *{paymentData.cardNumber.slice(-4) || "4242"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Button */}
          <div className="mt-8 flex justify-end">
             <button
                onClick={() => router.push("/apply/verification")}
                className="bg-[linear-gradient(135deg,#E7C873,#F6E27A)] rounded-full px-8 py-3 text-[14px] font-bold text-black shadow-[0_12px_24px_rgba(231,200,115,0.25)] transition-all hover:brightness-105 active:scale-[0.98]"
             >
                {lang === "hr" ? "Sljedeći korak" : "Next step"}
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
