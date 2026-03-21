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
    <aside className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-500">
      {/* Event Header Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {event?.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={eventTitle || "Event"}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            {eventTitle || (loading ? "..." : "Event")}
          </h2>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4 text-white/90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">{t.apply.eventDateLabel}</p>
            <p className="text-sm font-medium">{eventDateStr || "..."} {event?.time ? `${event.time}h` : ""}</p>
          </div>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">
            {lang === "hr" ? `Cijena za ${role === "gent" ? "gospodu" : "dame"}` : `Price for ${role === "gent" ? "gentlemen" : "ladies"}`}
          </span>
          <div className="text-right">
            {discount > 0 && (
              <p className="text-xs line-through text-white/30 mb-1">{basePrice} EUR</p>
            )}
            <span className={cn("text-xl font-bold", discount > 0 ? "text-[#f2ca50]" : "text-white")}>
              {finalPrice} EUR
            </span>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="flex gap-3 pt-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder={lang === "hr" ? "Unesite kod kupona" : "Enter coupon code"}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-white/20"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="rounded-xl border border-white/20 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black active:scale-95"
          >
            {lang === "hr" ? "Prihvati" : "Apply"}
          </button>
        </div>
      </div>
    </aside>
  );
}
