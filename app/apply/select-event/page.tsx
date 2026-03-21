"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Clock } from "lucide-react";
import ProgressSteps from "@/components/apply/ProgressSteps";
import { getDictionary } from "@/lib/i18n";
import { useBookingStore } from "@/lib/stores/bookingStore";

function SelectEventContent() {
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
    <div className="space-y-12">
      <ProgressSteps steps={t.apply.steps} currentStep={1} />
      
      <div className="rounded-[32px] bg-[#1a1a1a]/40 backdrop-blur-3xl p-8 space-y-8 border-t border-white/[0.05] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 1</p>
          <h1 className="mt-2 text-4xl font-serif text-white">{t.apply.steps[0]}</h1>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => {
                setEventId(event._id);
                router.push("/apply/form");
              }}
              className="group text-left rounded-[28px] bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)] flex flex-col h-full border-t border-white/[0.02] relative"
            >
              <div className="h-44 w-full relative overflow-hidden">
                <Image
                  src={event.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop"}
                  alt={getEventTitle(event)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={events.indexOf(event) < 3}
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-5">
                   <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">Upcoming Event</div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl font-serif text-[#E5E2E1] group-hover:text-[#F2CA50] transition-colors leading-tight">{getEventTitle(event)}</h3>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <Calendar className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="tracking-wide">{new Date(event.date).toLocaleDateString(lang === "hr" ? "hr-HR" : "en-US")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <Clock className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="tracking-wide">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#E5E2E1]/50">
                      <MapPin className="h-3.5 w-3.5 text-[#D4AF37]/70" />
                      <span className="truncate tracking-wide">{getEventLocation(event)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                   <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-extrabold transition-all group-hover:gap-3">
                     Select Event
                     <div className="h-px w-6 bg-[#D4AF37]/30 transition-all group-hover:w-10 group-hover:bg-[#D4AF37]" />
                   </div>
                </div>
              </div>
            </button>
          ))}
          {events.length === 0 ? (
            <div className="rounded-[28px] bg-white/[0.03] p-8 text-[#E5E2E1]/40 text-sm italic font-serif">
              {t.apply.emptyEvent.description}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function SelectEventPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
    }>
      <SelectEventContent />
    </Suspense>
  );
}
