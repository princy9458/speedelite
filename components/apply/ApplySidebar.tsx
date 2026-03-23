"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/lib/stores/bookingStore";

export default function ApplySidebar() {
  const { eventId, role, paymentData, updatePayment } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(paymentData.discountCode || "");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applied, setApplied] = useState(!!paymentData.discountCode);

  const t = useTranslations('apply');
  const locale = useLocale();

  const coupons: Record<string, number> = {
    "SAVE5": 5,
    "DISC10": 10,
    "WELCOME": 15
  };

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        const base = role === "lady" ? data.priceFemale : data.priceMale;
        // If already applied (e.g. from previous steps or restore), calculate initial price
        if (applied && paymentData.discountCode) {
          const discountVal = coupons[paymentData.discountCode.toUpperCase()] || 0;
          setDiscount(discountVal);
          setPrice(base - discountVal);
        } else {
          setPrice(base);
        }
      })
      .finally(() => setLoading(false));
  }, [eventId, role, applied, paymentData.discountCode]);

  const basePrice = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;
  
  const handleApplyCoupon = () => {
    if (applied) return;

    const code = coupon.trim().toUpperCase();

    if (coupons[code]) {
      const discountValue = coupons[code];
      setDiscount(discountValue);
      setPrice(basePrice - discountValue);

      setSuccess("Coupon applied successfully");
      setError("");
      setApplied(true);
      updatePayment({ discountCode: code });
    } else {
      setError("Invalid coupon code");
      setSuccess("");
    }
  };

  const eventTitle = locale === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const eventDateStr = event?.date ? new Date(event.date).toLocaleDateString(locale === "hr" ? "hr-HR" : "en-US") : "";

  if (!eventId) {
    return (
      <aside className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <Ticket className="h-8 w-8 text-white/20" />
        </div>
        <h3 className="font-serif text-xl text-white/40">{t('emptyEvent.title')}</h3>
        <p className="mt-2 text-sm text-white/20">{t('emptyEvent.description')}</p>
      </aside>
    );
  }

  return (
    <aside className="sticky top-[120px] self-start overflow-hidden rounded-[20px] bg-white/[0.03] backdrop-blur-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/[0.08] transition-all duration-700">
      {/* Event Header Image */}
      <div className="p-3">
        <div className="relative h-[180px] w-full overflow-hidden rounded-[16px]">
          {event?.featuredImage ? (
            <Image
              src={event.featuredImage}
              alt={eventTitle || "Event"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/5" />
            </div>
          )}
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-5 left-5">
            <h2 className="font-sans text-[18px] font-semibold text-white tracking-tight drop-shadow-lg">
              {eventTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5 space-y-6">
        {/* Row 1: Date & Final Price */}
        <div className="flex items-center gap-2.5 text-white/80">
           <Calendar className="h-4 w-4 text-[#D4AF37]" />
           <span className="text-[14px] font-medium text-white/90">
             {eventDateStr} {event?.time}h
           </span>
        </div>

        {/* Row 2: Price Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between pt-2">
             <span className="text-[14px] text-white/70">
               {role === 'lady' ? t('sidebar.priceLady') : t('sidebar.priceGent')}
             </span>
             <span className="text-[20px] font-bold text-[#F6E27A] [text-shadow:0_0_10px_rgba(201,166,70,0.3)]">
               {price} EUR
             </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-end text-sm text-green-400 font-medium">
              Discount: -{discount} EUR
            </div>
          )}
        </div>

        {/* Coupon Section (Refined Style) */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-11 flex items-center rounded-[10px] bg-white/[0.05] px-4 border border-white/10 backdrop-blur-md">
              <input
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setError("");
                }}
                disabled={applied}
                placeholder={t('sidebar.couponPlaceholder')}
                className="w-full bg-transparent text-[13px] font-medium text-white/70 focus:outline-none placeholder:text-white/20 disabled:opacity-50"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={applied || !coupon}
              className="h-11 rounded-[10px] border border-white/20 bg-transparent px-6 text-[14px] font-medium text-white transition-all hover:bg-white/5 hover:border-white/40 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:active:scale-100"
            >
              {applied ? "Applied" : t('sidebar.couponBtn')}
            </button>
          </div>

          {error && (
            <div className="rounded-lg px-4 py-2 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg px-4 py-2 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              {success}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
