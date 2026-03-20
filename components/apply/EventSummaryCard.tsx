"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

type EventSummaryCardProps = {
  lang: "en" | "hr";
  role: "lady" | "gent" | null;
  event: any;
};

export default function EventSummaryCard({ lang, role, event }: EventSummaryCardProps) {
  const t = getDictionary(lang);

  if (!event) {
    return (
      <aside className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur-[16px] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-white/35">{t.apply.eventSummaryTitle}</p>
          <h3 className="font-serif text-2xl text-white">{t.apply.emptyEvent.title}</h3>
          <p className="text-sm leading-6 text-white/55">{t.apply.emptyEvent.description}</p>
        </div>
      </aside>
    );
  }

  const title = lang === "hr" ? event?.translations?.hr?.title || event?.title : event?.translations?.en?.title || event?.title;
  const location =
    lang === "hr"
      ? event?.translations?.hr?.location || event?.location
      : event?.translations?.en?.location || event?.location;
  const price = role === "lady" ? event?.priceFemale : event?.priceMale;
  const eventDate = event?.date ? new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US") : "";

  return (
    <aside className="rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(213,173,91,0.18),_rgba(255,255,255,0.03)_38%,_rgba(0,0,0,0.55)_100%)] p-5 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
      <div className="overflow-hidden rounded-2xl">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={title}
            width={640}
            height={420}
            className="h-48 w-full object-cover"
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"
            alt="Event Placeholder"
            width={640}
            height={420}
            className="h-48 w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/35">{t.apply.eventSummaryTitle}</p>
          <h3 className="mt-2 font-serif text-2xl text-white">{title}</h3>
        </div>

        <div className="space-y-3 rounded-2xl bg-black/25 p-4">
          <div className="flex items-start gap-3 text-sm text-white/72">
            <CalendarDays className="mt-0.5 h-4 w-4 text-[#d5ad5b]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{t.apply.eventDateLabel}</p>
              <p>{eventDate} {event?.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm text-white/72">
            <MapPin className="mt-0.5 h-4 w-4 text-[#d5ad5b]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{t.apply.eventLocationLabel}</p>
              <p>{location}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm text-white/72">
            <Ticket className="mt-0.5 h-4 w-4 text-[#d5ad5b]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">{t.apply.eventPriceLabel}</p>
              <p>{price} EUR</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
