"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";

export default function SelectEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, setLang, setEventId, lang } = useBookingStore();
  const [events, setEvents] = useState<any[]>([]);
  const t = getDictionary(lang);

  useEffect(() => {
    const role = searchParams.get("role") === "gent" ? "gent" : "lady";
    const language = searchParams.get("lang") === "hr" ? "hr" : "en";
    setRole(role);
    setLang(language);

    fetch("/api/events?limit=100&status=published")
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []));
  }, [searchParams, setRole, setLang]);

  const getEventTitle = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.title || event?.title
      : event?.translations?.en?.title || event?.title;

  const getEventLocation = (event: any) =>
    lang === "hr"
      ? event?.translations?.hr?.location || event?.location
      : event?.translations?.en?.location || event?.location;

  return (
    <div className="space-y-10">
      <ProgressSteps steps={t.apply.steps} currentStep={1} />
      <div className="glass-card rounded-3xl border border-white/10 p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Step 1</p>
          <h1 className="text-3xl font-serif">{t.apply.steps[0]}</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => {
                setEventId(event._id);
                router.push("/apply/form");
              }}
              className="group text-left rounded-3xl border border-white/10 bg-black/40 overflow-hidden hover:border-[#d5ad5b]/50 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col h-full"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <Image
                  src={event.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"}
                  alt={getEventTitle(event)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4">
                   <div className="text-[10px] uppercase tracking-[0.2em] text-[#d5ad5b] font-bold">Upcoming Event</div>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif text-white group-hover:text-[#f0ca7d] transition-colors">{getEventTitle(event)}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <MapPin className="h-3.5 w-3.5 text-[#d5ad5b]" />
                      <span className="truncate">{getEventLocation(event)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                   <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#d5ad5b] font-bold border-b border-[#d5ad5b]/30 pb-1 group-hover:border-[#d5ad5b] transition-all">
                     Select Event
                   </div>
                </div>
              </div>
            </button>
          ))}
          {events.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
              {t.apply.emptyEvent.description}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
