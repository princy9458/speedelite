"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProgressSteps from "@/components/apply/ProgressSteps";
import EventSummaryCard from "@/components/apply/EventSummaryCard";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { bookingFormSchema, bookingPaymentSchema } from "@/lib/validators/booking";

export default function PaymentPage() {
  const router = useRouter();
  const {
    eventId,
    role,
    lang,
    formData,
    uploads,
    paymentData,
    updatePayment,
    reset,
    setConfirmation,
  } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const amountPaid = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;

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

    const formCheck = bookingFormSchema.safeParse(formData);
    const paymentCheck = bookingPaymentSchema.safeParse(paymentData);

    const hasFacePhoto = !!uploads.facePhoto?.url || !!uploads.facePhoto?.file;
    const hasBodyPhoto = !!uploads.bodyPhoto?.url || !!uploads.bodyPhoto?.file;

    if (!formCheck.success || !paymentCheck.success || !hasFacePhoto || !hasBodyPhoto) {
      toast.error(t.apply.paymentValidationError);
      if (!hasFacePhoto || !hasBodyPhoto) {
        router.push("/apply/form");
      }
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
          amountPaid,
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

      reset();
      setConfirmation({
        bookingId: data.bookingId,
        bookingNumber: data.bookingNumber,
        message: data.message || t.apply.submitSuccessBody,
      });
      router.push("/apply/verification");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <ProgressSteps steps={t.apply.steps} currentStep={3} />
      
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-8 space-y-8 border-t border-white/[0.05] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 3</p>
            <h1 className="mt-2 text-4xl font-serif text-white">{t.apply.steps[2]}</h1>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              value={paymentData.cardNumber}
              onChange={(e) => updatePayment({ cardNumber: e.target.value })}
              placeholder={t.apply.paymentCardNumber}
              className="rounded-xl border-none bg-white/[0.03] p-4 text-sm text-[#E5E2E1] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20"
              required
            />
            <input
              value={paymentData.expiry}
              onChange={(e) => updatePayment({ expiry: e.target.value })}
              placeholder={t.apply.paymentExpiry}
              className="rounded-xl border-none bg-white/[0.03] p-4 text-sm text-[#E5E2E1] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20"
              required
            />
            <input
              value={paymentData.cvc}
              onChange={(e) => updatePayment({ cvc: e.target.value })}
              placeholder={t.apply.paymentCvc}
              className="rounded-xl border-none bg-white/[0.03] p-4 text-sm text-[#E5E2E1] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20"
              required
            />
            <input
              value={paymentData.discountCode}
              onChange={(e) => updatePayment({ discountCode: e.target.value })}
              placeholder={t.apply.paymentDiscount}
              className="rounded-xl border-none bg-white/[0.03] p-4 text-sm text-[#E5E2E1] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all placeholder:text-white/20"
            />
            <div className="md:col-span-2 flex items-center justify-between border-t border-white/[0.06] pt-6">
              <span className="text-[#E5E2E1]/40 text-xs uppercase tracking-widest font-bold font-sans">{t.apply.paymentTotal}</span>
              <span className="text-2xl font-serif text-[#F2CA50] drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">EUR {amountPaid}</span>
            </div>
            <div className="md:col-span-2 flex items-center justify-between gap-6 mt-4">
              <button
                type="button"
                onClick={() => router.push("/apply/form")}
                className="rounded-[14px] border border-white/12 px-6 py-3.5 text-[11px] uppercase tracking-[0.25em] text-[#E5E2E1]/60 transition-all duration-300 hover:border-[#D4AF37]/40 hover:text-[#F2CA50] hover:bg-white/5"
              >
                {t.common.back}
              </button>
              <button
                disabled={isSubmitting}
                className="rounded-[14px] bg-[linear-gradient(180deg,#D4AF37_0%,#F2CA50_100%)] px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black shadow-[0_16px_32px_rgba(212,175,55,0.2)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.apply.paymentSubmitting}
                  </>
                ) : (
                  t.apply.paymentSubmit
                )}
              </button>
            </div>
          </form>
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
