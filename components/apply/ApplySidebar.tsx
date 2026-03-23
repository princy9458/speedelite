"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";
import { cn } from "@/lib/utils";

export default function ApplySidebar() {
  const { eventId, role, lang, paymentData, updatePayment } = useBookingStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState(paymentData.discountCode || "");
  const [discount, setDiscount] = useState(0);
  const t = getDictionary(lang);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [eventId]);

  const basePrice = event ? (role === "lady" ? event.priceFemale : event.priceMale) : 0;
  
  // Dummy Coupon Logic
  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "OFF50") {
      setDiscount(0.5);
      updatePayment({ discountCode: "OFF50" });
      toast.success("50% discount applied!");
    } else if (couponInput.toUpperCase() === "FREE" && eventId) {
      setDiscount(1);
      updatePayment({ discountCode: "FREE" });
      toast.success("100% discount applied!");
    } else if (couponInput) {
      toast.error("Invalid coupon code");
      setDiscount(0);
    }
  };

  const finalPrice = Math.max(0, basePrice * (1 - discount));
  const eventTitle = lang === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const eventDateStr = event?.date ? new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US") : "";

  if (!eventId) {
    return (
      <aside className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <Ticket className="h-8 w-8 text-white/20" />
        </div>
        <h3 className="font-serif text-xl text-white/40">{t.apply.emptyEvent.title}</h3>
        <p className="mt-2 text-sm text-white/20">{t.apply.emptyEvent.description}</p>
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
              {eventTitle || "Event 11 English"}
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
             12/09/2026 19:00h
           </span>
        </div>

        {/* Row 2: Price Details */}
        <div className="flex items-center justify-between pt-2">
           <span className="text-[14px] text-white/70">
             Price for gentlemen
           </span>
           <span className="text-[16px] font-bold text-[#F6E27A] [text-shadow:0_0_10px_rgba(201,166,70,0.3)]">
             2 EUR
           </span>
        </div>

        {/* Coupon Section (Refined Style) */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-11 flex items-center rounded-[10px] bg-white/[0.05] px-4 border border-white/10 backdrop-blur-md">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter coupon code"
              className="w-full bg-transparent text-[13px] font-medium text-white/70 focus:outline-none placeholder:text-white/20"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="h-11 rounded-[10px] border border-white/20 bg-transparent px-6 text-[14px] font-medium text-white transition-all hover:bg-white/5 hover:border-white/40 active:scale-95 whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
