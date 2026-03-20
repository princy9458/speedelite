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
      router.push("/apply/confirmation");
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
        <div className="glass-card rounded-3xl border border-white/10 p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Step 3</p>
            <h1 className="text-3xl font-serif">{t.apply.paymentTitle}</h1>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              value={paymentData.cardNumber}
              onChange={(e) => updatePayment({ cardNumber: e.target.value })}
              placeholder={t.apply.paymentCardNumber}
              className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#d5ad5b] focus:outline-none transition-colors"
              required
            />
            <input
              value={paymentData.expiry}
              onChange={(e) => updatePayment({ expiry: e.target.value })}
              placeholder={t.apply.paymentExpiry}
              className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#d5ad5b] focus:outline-none transition-colors"
              required
            />
            <input
              value={paymentData.cvc}
              onChange={(e) => updatePayment({ cvc: e.target.value })}
              placeholder={t.apply.paymentCvc}
              className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#d5ad5b] focus:outline-none transition-colors"
              required
            />
            <input
              value={paymentData.discountCode}
              onChange={(e) => updatePayment({ discountCode: e.target.value })}
              placeholder={t.apply.paymentDiscount}
              className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm focus:border-[#d5ad5b] focus:outline-none transition-colors"
            />
            <div className="md:col-span-2 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-white/60 text-sm">{t.apply.paymentTotal}</span>
              <span className="text-xl font-bold text-[#F4D693]">EUR {amountPaid}</span>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                disabled={isSubmitting}
                className="gold-gradient flex items-center gap-2 rounded-xl px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-70 shadow-[0_12px_32px_rgba(212,175,55,0.15)] hover:scale-[1.02] transition-transform"
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
